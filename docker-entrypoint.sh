#!/bin/sh

cd /usr/share/nginx/html
sh injectEnv.sh

[ -z "$@" ] && nginx -g 'daemon off;' || "$@"