# 1. Update to Node 20 to fix engine warnings
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

# Build the Next.js app (optional for the worker, but good for caching)
RUN npm run build

EXPOSE 3001

# 2. Add '--esm' here so ts-node can read .ts files
CMD ["npx", "ts-node", "--esm", "external-services/socket-server.ts"]