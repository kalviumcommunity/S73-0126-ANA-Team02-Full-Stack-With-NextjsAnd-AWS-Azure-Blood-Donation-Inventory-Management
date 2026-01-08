# Base builder stage: uses Node 18 on Alpine for lightweight builds
FROM node:18-alpine AS builder

# Optional: add glibc compatibility for some native modules used by Next.js
RUN apk add --no-cache libc6-compat

# Set work directory inside the container
WORKDIR /app

# Copy package manifests first for better Docker layer caching
# If a lockfile exists, npm ci will use it for deterministic installs
COPY package*.json ./

# Install all dependencies (including devDeps needed for type checks/build)
RUN npm ci || npm install

# Copy the rest of the application source
COPY . .

# Use production mode during build so Next.js optimizes output
ENV NODE_ENV=production

# Build the Next.js application (App Router + TypeScript)
# Build-time env vars like NEXT_PUBLIC_API_URL can be provided via --build-arg if needed
RUN npm run build


# Runtime stage: smaller image that contains only production deps and built assets
FROM node:18-alpine AS runner

# Minimal runtime packages (same compat note as builder)
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Ensure production runtime
ENV NODE_ENV=production

# Copy only what's necessary to run `next start`
COPY package*.json ./

# Install only production dependencies to reduce image size
RUN npm ci --omit=dev || npm install --omit=dev

# Bring in the built Next.js output and public assets from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Expose the default Next.js port
EXPOSE 3000

# Start the Next.js server (serves the already-built app)
CMD ["npm", "start"]
