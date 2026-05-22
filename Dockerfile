# ─── Stage 1 : build du frontend ─────────────────────────────────────────────
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ─── Stage 2 : vérification des types du backend ─────────────────────────────
FROM node:20-alpine AS backend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY prisma/ ./prisma/
COPY prisma.config.ts ./
RUN npx prisma generate
COPY tsconfig.json ./
COPY src/ ./src/
RUN npx tsc --noEmit

# ─── Stage 3 : runner ────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma/ ./prisma/
COPY prisma.config.ts ./
RUN npx prisma generate

COPY src/ ./src/
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

RUN mkdir -p uploads

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && npx tsx src/index.ts"]
