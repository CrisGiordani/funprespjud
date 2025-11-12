FROM node:20-bookworm AS base

WORKDIR /app

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma ./prisma

RUN pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm exec prisma generate

COPY . .

RUN pnpm run build:icons

FROM base AS dev
ENV NODE_ENV=development
ENV CI=true
# Reinstall with scripts enabled to build native modules (postinstall is safe to run again)
RUN pnpm install --frozen-lockfile

FROM base AS builder
ENV NODE_ENV=production
ENV CI=true
# Reinstall with scripts enabled to build native modules (bcrypt, etc.)
# Note: postinstall (build:icons) already ran in base stage, so we can skip it here
RUN pnpm install --frozen-lockfile --ignore-scripts
# Rebuild native modules that require compilation (bcrypt, etc.)
RUN pnpm rebuild bcrypt
RUN pnpm build
RUN pnpm prune --prod --ignore-scripts

FROM node:20-bookworm-slim AS runner

WORKDIR /app

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV=production

RUN corepack enable

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/next.config.mjs ./next.config.mjs

EXPOSE 3000

CMD ["pnpm", "start"]

