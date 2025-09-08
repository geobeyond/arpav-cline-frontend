const processEnv = typeof process !== 'undefined' ? process.env : {};
const injectedEnv = window && window.injectedEnv ? window.injectedEnv : {};

export const env = {
  ...{ARPAV_BACKEND_API_BASE_URL: 'https://clima.arpa.veneto.it'},
  ...processEnv,
  ...injectedEnv,
};