# === STAGE 1: Build the Next.js App ===
# Use the correct Node.js version
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies for build)
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Build the production-ready app
# This will create a .next folder
RUN npm run build

# === STAGE 2: Serve the App ===
# Use a slim Node.js image for production
FROM node:20-alpine

WORKDIR /app

# Set the environment to production
ENV NODE_ENV=production

# Copy only the necessary files from the 'builder' stage
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

# Install *only* production dependencies
RUN npm install --production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

# Next.js runs on port 3000 by default
EXPOSE 3000

# The command to start the Next.js server
CMD ["npm", "run", "start"]
