# 1. Update to Node 20 to fix engine warnings
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

EXPOSE 3001

# 2. Add '--esm' here so ts-node can read .ts files
CMD ["npx", "tsx", "external-services/socket-server.ts"]