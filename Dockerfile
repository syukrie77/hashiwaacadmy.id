# ============================================
# Hashiwa Academy - Astro App Dockerfile
# ============================================

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files first (better cache)
COPY package.json package-lock.json ./

# Install ALL dependencies (including dev for build)
RUN npm ci

# Copy source code
COPY . .

# Build the Astro app
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

# Copy built output from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
# Copy node_modules from builder (includes all needed runtime deps like piccolore)
COPY --from=builder /app/node_modules ./node_modules

# Expose the port
EXPOSE 4321

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:4321/ || exit 1

# Start the app
CMD ["node", "dist/server/entry.mjs"]