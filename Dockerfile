# Use a lightweight Node image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies for ts-node)
RUN npm install

# Copy source code
COPY . .

# Expose the port for the Socket Server
EXPOSE 3001

# Default command (we will override this in Render dashboard)
CMD ["npx", "ts-node", "external-services/socket-server.ts"]