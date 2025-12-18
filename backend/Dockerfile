# Use Node.js 20 LTS as the base image (crypto is available globally)
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the project files
COPY . .

# Copy env file for Docker
COPY .env.docker .env

# Download wait-for-it script to ensure DB is up before starting
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Build the NestJS app (if using TypeScript)
RUN npm run build

# Expose the port your app runs on (default: 3500)
EXPOSE 3500

# Command to run the app, waiting for DB
CMD ["/wait-for-it.sh", "db:5432", "--", "npm", "run", "start:prod"]