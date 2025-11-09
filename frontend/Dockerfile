# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files and lock file
COPY package*.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY src/ ./src
COPY public/ ./public
COPY index.html .
COPY postcss.config.js .
COPY tailwind.config.ts .
COPY tsconfig.json .
COPY tsconfig.node.json .
COPY vite.config.ts .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Create a directory for the environment file
RUN mkdir -p /usr/share/nginx/html/env

# Create a simple entrypoint script
RUN echo '#!/bin/sh\n\n# Set environment variables\necho "window.env = {\n  VITE_API_URL: \"'$VITE_API_URL'\",\n  VITE_OLLAMA_URL: \"'$VITE_OLLAMA_URL'\",\n  VITE_DEFAULT_MODEL: \"'$VITE_DEFAULT_MODEL'\"\n}" > /usr/share/nginx/html/env-config.js\n\n# Start Nginx\nexec "$@"' > /docker-entrypoint.sh \
    && chmod +x /docker-entrypoint.sh

# Create a health check endpoint
RUN echo '{"status":"healthy"}' > /usr/share/nginx/html/healthz

# Set environment variables with defaults
ENV VITE_API_URL=${VITE_API_URL:-http://localhost:8000}
ENV VITE_OLLAMA_URL=${VITE_OLLAMA_URL:-http://localhost:11434}
ENV VITE_DEFAULT_MODEL=${VITE_DEFAULT_MODEL:-gpt-oss:20b}

# Expose port 80
EXPOSE 80

# Use the entrypoint script to handle environment variables
ENTRYPOINT ["/docker-entrypoint.sh"]

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
