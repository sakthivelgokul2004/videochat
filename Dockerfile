
 # Stage 1: Build the Frontend
FROM docker.io/library/node:20-slim AS build-stage
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Setup the Backend
FROM node:20-bookworm-slim
WORKDIR /app
RUN apt-get update && apt-get install -y python3 build-essential
COPY package*.json ./
RUN npm install --production
COPY . .
# Copy built frontend from Stage 1 to the backend's public folder
COPY --from=build-stage /app/client/dist ./client/dist/

EXPOSE 3000 44444/udp 44444/tcp
CMD ["node", "index.js"]
