# Multi-stage build
FROM node:20-bookworm-slim AS base

RUN apt-get update -y \
    && apt-get install -y openssl \
    && rm -rf /var/lib/apt/lists/*

# Build stage
FROM base AS builder
WORKDIR /app

# Copy root-level package.json and package-lock.json
COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

# Copy the current service's configuration
COPY apps/recommendation-service/ ./apps/recommendation-service/
COPY packages/ ./packages/

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy Prisma schema
COPY prisma/ ./prisma/

# Generate Prisma client
ARG DATABASE_URL
RUN npx prisma generate

# Build the application
RUN npx nx build recommendation-service

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy build artifacts
COPY --from=builder /app/dist/apps/recommendation-service ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

USER nodejs

EXPOSE 6007

ENV PORT=6007

CMD ["node", "dist/main.js"]