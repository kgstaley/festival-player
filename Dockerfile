# Stage 1: Install dependencies
FROM node:18-alpine AS deps

# Set working directory
WORKDIR /app

# Copy package files for both root and client
COPY package.json yarn.lock ./
COPY client/package.json client/yarn.lock ./client/

# Install all dependencies with frozen lockfile
RUN yarn install --frozen-lockfile && \
    cd client && yarn install --frozen-lockfile

# Stage 2: Build application
FROM node:18-alpine AS build

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/client/node_modules ./client/node_modules

# Copy source files
COPY . .

# Build server TypeScript
RUN yarn tsc

# Build client React application
RUN cd client && yarn build

# Stage 3: Production runtime
FROM node:18-alpine AS production

# Install curl for healthcheck
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./
COPY client/package.json ./client/

# Install only production dependencies
RUN yarn install --frozen-lockfile --production && \
    chown -R nodejs:nodejs /app

# Copy built artifacts from build stage
COPY --from=build --chown=nodejs:nodejs /app/dist ./dist
COPY --from=build --chown=nodejs:nodejs /app/client/build ./client/build

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/api/health || exit 1

# Start server
CMD ["node", "dist/server.js"]
