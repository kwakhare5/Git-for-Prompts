# Multi-stage Dockerfile for Git for Prompts Next.js application
FROM node:20-alpine AS base

# Step 1: Install dependencies
FROM base AS deps
RUN apk add --no-network-timeout --no-cache libc6-compat
WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package manifests and workspace lockfiles
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/core/package.json ./packages/core/
COPY packages/cli/package.json ./packages/cli/

RUN pnpm install --frozen-lockfile

# Step 2: Build the source code
FROM base AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/core/node_modules ./packages/core/node_modules
COPY --from=deps /app/packages/cli/node_modules ./packages/cli/node_modules

COPY . .

# Set environment variables for build time (disable telemetry, dummy DB URL for static generation if needed)
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN pnpm --filter @gfp/core build && pnpm build

# Step 3: Production runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set correct permissions for Next.js standalone server
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
