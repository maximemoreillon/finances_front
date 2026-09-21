#!/bin/sh
# Runs at container start via the nginx image's /docker-entrypoint.d mechanism.
# Exposes every VITE_* environment variable to the app as window.__ENV__.

OUTPUT_FILE=/usr/share/nginx/html/env.js

echo "Generating $OUTPUT_FILE from VITE_* environment variables"
{
  echo "window.__ENV__ = {"
  env | grep '^VITE_' | while IFS='=' read -r key value; do
    echo "  \"$key\": \"$value\","
  done
  echo "};"
} > "$OUTPUT_FILE"
