#!/bin/sh
set -e

# Replacing placeholder urls to runtime variables, since we're using rewrites in nextjs, this is required.
# Everything else which doesn't compile URLs at build should already be able to use runtime variables.

APP_URL="${VITE_PUBLIC_APP_URL:-${NEXT_PUBLIC_APP_URL}}"
BACKEND_URL="${VITE_PUBLIC_BACKEND_URL:-${NEXT_PUBLIC_BACKEND_URL}}"

if [ -n "$BACKEND_URL" ]; then
  /app/scripts/docker/replace-placeholder.sh "http://REPLACE-BACKEND-URL.com" "$BACKEND_URL"
else
  echo "WARN: VITE_PUBLIC_BACKEND_URL/NEXT_PUBLIC_BACKEND_URL not set; skipping runtime replacement." >&2
fi

if [ -n "$APP_URL" ]; then
  /app/scripts/docker/replace-placeholder.sh "http://REPLACE-APP-URL.com" "$APP_URL"
else
  echo "WARN: VITE_PUBLIC_APP_URL/NEXT_PUBLIC_APP_URL not set; skipping runtime replacement." >&2
fi

# Serve the built SPA (static files from build/client)
exec bun /app/scripts/docker/serve-static.ts
