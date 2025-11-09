#!/bin/sh
set -e

# Generate runtime environment variables
echo "window.env = {
  VITE_API_URL: '${VITE_API_URL:-http://localhost:8000}',
  VITE_OLLAMA_URL: '${VITE_OLLAMA_URL:-http://host.docker.internal:11434}',
  VITE_DEFAULT_MODEL: '${VITE_DEFAULT_MODEL:-gpt-oss:20b}',
  VITE_DEBUG: '${VITE_DEBUG:-false}'
};" > /usr/share/nginx/html/env-config.js

# Execute the command passed to the container
exec "$@"
