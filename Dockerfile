FROM node:16-alpine AS builder
ENV \
  NODE_ENV=production \
  GENERATE_SOURCEMAP=false
# Add a work directory
WORKDIR /app
# Cache and Install dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn install --production --frozen-lockfile
# Copy app files
COPY . .
# Build the app
RUN yarn build

# Bundle static assets with nginx
FROM nginx:1.21.0-alpine AS production
ENV \
  NODE_ENV=production \
  ARPAV_BACKEND_API_BASE_URL=http://localhost:8877 \
  ARPAV_TOLGEE_BASE_URL=http://localhost:8899
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/build .
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh .
COPY injectEnv.sh .
EXPOSE 80
ENTRYPOINT [ "sh", "docker-entrypoint.sh" ]
