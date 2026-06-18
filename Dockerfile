# ─── Stage 1 : build du frontend ─────────────────────────────────────────────
# Utilisé pour construire le frontend et générer les fichiers statiques.
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ─── Stage 2 : vérification des types du backend ─────────────────────────────
# Ne garde aucun artefact de build, juste pour vérifier les types TypeScript
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
# Utilisé pour exécuter l'application en production. Ne contient que les fichiers nécessaires
# pour optimiser le poids de l'image 
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

HEALTHCHECK --interval=10s --timeout=5s --start-period=60s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/api/health').then(r=>r.ok?process.exit(0):process.exit(1)).catch(()=>process.exit(1))"

CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && npx tsx src/index.ts"]
