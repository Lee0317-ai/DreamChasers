FROM public.ecr.aws/docker/library/node:22.13-bookworm-slim AS deps

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ARG NPM_REGISTRY=https://registry.npmmirror.com/
ENV npm_config_registry=$NPM_REGISTRY
ENV npm_config_fetch_retries=5
ENV npm_config_fetch_retry_mintimeout=20000
ENV npm_config_fetch_retry_maxtimeout=120000
ENV npm_config_prefer_offline=true

COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json

RUN --mount=type=cache,target=/root/.npm \
  npm ci || npm ci --registry=https://registry.npmjs.org/

FROM public.ecr.aws/docker/library/node:22.13-bookworm-slim AS builder

WORKDIR /app

RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

ENV NEXT_TELEMETRY_DISABLED=1
ENV STANDALONE_BUILD=1
ENV DATABASE_URL=postgresql://placeholder:placeholder@127.0.0.1:5432/placeholder
ENV DIRECT_DATABASE_URL=postgresql://placeholder:placeholder@127.0.0.1:5432/placeholder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build:standalone -w apps/web

FROM public.ecr.aws/docker/library/node:22.13-bookworm-slim AS runner

WORKDIR /app

RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/prisma ./apps/web/prisma
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/prisma.config.ts ./apps/web/prisma.config.ts
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/src/generated/prisma ./apps/web/src/generated/prisma

USER nextjs

EXPOSE 3000

CMD ["node", "apps/web/server.js"]
