# Use an optimized Node.js image
FROM node:20.9.0-alpine

# Set working directory
WORKDIR /app

# Copy package files for efficient layer caching
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally and install dependencies
RUN npm install -g pnpm \
    && pnpm install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["pnpm", "dev"]
