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
RUN npm ci --legacy-peer-deps

# Copy the rest of the project files
COPY . .

# Build the Next.js app (static export)
RUN npm run build

# Production stage - use nginx to serve static files
FROM nginx:alpine

# Copy the built static files to nginx html directory
COPY --from=builder /app/out /usr/share/nginx/html

# Expose port 3000
EXPOSE 3000

# Update nginx to listen on port 3000
RUN sed -i 's/listen       80;/listen       3000;/' /etc/nginx/conf.d/default.conf

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
