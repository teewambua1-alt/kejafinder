# syntax=docker/dockerfile:1

# --- Build stage: compile the SPA and bundle server.ts ---
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- Runtime stage: only what dist/server.cjs needs to run ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

# Cloud Run sets PORT itself (defaults to 8080); server.ts reads it.
EXPOSE 8080
CMD ["node", "dist/server.cjs"]
