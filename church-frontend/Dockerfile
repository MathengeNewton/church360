# Use Node.js 20 LTS (full image, not Alpine for better compatibility)
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

    # Copy package files and install dependencies
    COPY package*.json ./
    # Configure npm registry and increase timeout, then install with retries
    RUN npm config set registry https://registry.npmjs.org/ && \
        npm config set fetch-timeout 300000 && \
        npm config set fetch-retries 5 && \
        npm config set fetch-retry-mintimeout 20000 && \
        npm config set fetch-retry-maxtimeout 120000 && \
        npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Copy the rest of the project files
COPY . .

# Set production environment for build
ENV NODE_ENV=production

# Set API URL for build (can be overridden at runtime via env var)
ARG NEXT_PUBLIC_API_URL=https://api-church360.jerdyl.co.ke/api
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Build the Next.js app (static export)
RUN npm run build

# Production stage - use nginx to serve static files
FROM nginx:alpine

# Copy the built static files to nginx html directory
COPY --from=builder /app/out /usr/share/nginx/html

# Create custom nginx config for Next.js static export
RUN echo 'server {' > /etc/nginx/conf.d/default.conf && \
    echo '    listen 3000;' >> /etc/nginx/conf.d/default.conf && \
    echo '    server_name _;' >> /etc/nginx/conf.d/default.conf && \
    echo '    root /usr/share/nginx/html;' >> /etc/nginx/conf.d/default.conf && \
    echo '    index index.html;' >> /etc/nginx/conf.d/default.conf && \
    echo '    ' >> /etc/nginx/conf.d/default.conf && \
    echo '    # Handle Next.js static files' >> /etc/nginx/conf.d/default.conf && \
    echo '    location /_next/static {' >> /etc/nginx/conf.d/default.conf && \
    echo '        alias /usr/share/nginx/html/_next/static;' >> /etc/nginx/conf.d/default.conf && \
    echo '        expires 1y;' >> /etc/nginx/conf.d/default.conf && \
    echo '        add_header Cache-Control "public, immutable";' >> /etc/nginx/conf.d/default.conf && \
    echo '    }' >> /etc/nginx/conf.d/default.conf && \
    echo '    ' >> /etc/nginx/conf.d/default.conf && \
    echo '    # Handle trailing slashes and SPA routing' >> /etc/nginx/conf.d/default.conf && \
    echo '    location / {' >> /etc/nginx/conf.d/default.conf && \
    echo '        try_files $uri $uri.html $uri/ /index.html;' >> /etc/nginx/conf.d/default.conf && \
    echo '    }' >> /etc/nginx/conf.d/default.conf && \
    echo '}' >> /etc/nginx/conf.d/default.conf

# Expose port 3000
EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
