# Etapa 1: build del frontend
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY server/package*.json ./server/
RUN npm ci

COPY . .
RUN npm run build

# Etapa 2: runtime con Express
FROM node:20-alpine AS runtime
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/server/package*.json ./server/

WORKDIR /app/server
RUN npm ci --only=production

ENV NODE_ENV=production
ENV PORT=80

EXPOSE 80
CMD ["node", "index.js"]
