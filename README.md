# CesiZenWebApp

Application web de bien-être mental développée dans le cadre du Bloc 3 CDA CESI. Elle permet aux utilisateurs de consulter des articles et des exercices de respiration, et aux administrateurs de gérer le contenu via un backoffice.

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Backend | Node.js · Express 5 · TypeScript |
| Frontend | React 19 · React Router 7 · TypeScript · Vite |
| Base de données | PostgreSQL 16 |
| ORM | Prisma 7 |
| Conteneurisation | Docker · Docker Compose |
| CI/CD | GitHub Actions |
| Hébergement | Azure VM · Nginx · Certbot (HTTPS) |
| Registre d'images | GitHub Container Registry (GHCR) |

## Structure du projet

```
CesiZenWebApp/
├── src/                  # Backend Express/TypeScript
│   ├── controllers/
│   ├── middleware/
│   ├── routes/           # auth, articles, exercises, users
│   ├── services/
│   ├── validators/
│   └── index.ts
├── frontend/             # React/Vite
│   ├── src/
│   ├── cypress/          # Tests E2E
│   └── cypress.config.ts
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── tests/                # Tests unitaires Vitest
├── Dockerfile            # Image multi-stage (frontend + backend)
├── compose.recette.yaml
├── compose.prod.yaml
├── prisma.config.ts
└── .github/workflows/github-actions.yml
```

## Modèle de données

- **User** — compte utilisateur (rôle, état, dernière connexion)
- **Article** — article de bien-être (titre, contenu, image, statut)
- **BreathingExercise** — exercice de respiration (durée, niveau, étapes)
- **FavoriteArticles / FavoriteExercises** — favoris par utilisateur
- **RefreshToken / ResetToken** — gestion des sessions et réinitialisation de mot de passe

## API

| Préfixe | Description |
|---------|-------------|
| `GET /api/health` | Healthcheck |
| `/api/auth/*` | Authentification (login, refresh, reset, logout) |
| `/api/articles/*` | CRUD articles + favoris |
| `/api/exercises/*` | CRUD exercices de respiration + favoris |
| `/api/users/*` | Gestion des utilisateurs (admin) |

Authentification par JWT : access token 15 min (`Authorization: Bearer`) + refresh token 7 jours avec rotation.

## Développement local

### Prérequis

- Node.js 24+
- PostgreSQL local ou Docker
- Fichier `.env` à la racine

### Variables d'environnement

```env
DATABASE_URL
JWT_SECRET
JWT_EXPIRES_IN
REFRESH_SECRET
REFRESH_EXPIRES_IN
```

### Installation et lancement

```bash
# Backend
npm install
npx prisma migrate dev
npx prisma db seed   # crée le compte administrateur par défaut
npm run dev          # port 3000

# Frontend (autre terminal)
cd frontend && npm install
npm run dev          # port 5173
```

### Tests

```bash
# Tests unitaires (Vitest)
npm test

# Tests E2E (Cypress)
cd frontend && npm run cypress:run
```

### Lint

```bash
npm run lint                  # backend
cd frontend && npm run lint   # frontend
```

## Déploiement

### Architecture

```
Internet
    │ HTTPS
    ▼
Nginx (Azure VM)
    ├── cesizenproduction.duckdns.org ──► localhost:3000 ──► production-backend-1
    └── cesizenrecette.duckdns.org    ──► localhost:3001 ──► recette-backend-1

Chaque environnement dispose de son propre réseau Docker isolé
et de son propre volume PostgreSQL.
```

### Environnements

| Environnement | Branche | URL | Port |
|---------------|---------|-----|------|
| Recette | `developp` | https://cesizenrecette.duckdns.org | 3001 |
| Production | `main` | https://cesizenproduction.duckdns.org | 3000 |

### Image Docker (multi-stage)

| Stage | Rôle |
|-------|------|
| `frontend-builder` | Build Vite → `frontend/dist/` |
| `backend-builder` | Vérification TypeScript + `prisma generate` |
| `runner` | Image finale : sert l'API et le frontend statique |

Au démarrage du conteneur :
```bash
npx prisma migrate deploy && npx prisma db seed && npx tsx src/index.ts
```

Un healthcheck sur `GET /api/health` détecte les crashs au démarrage (`docker compose up --wait`).

### Déploiement manuel (urgence)

```bash
# Recette
export BACKEND_IMAGE="ghcr.io/<owner>/cesizenwebapp:developp"
docker compose -p recette -f compose.recette.yaml down --remove-orphans
docker compose -p recette -f compose.recette.yaml up -d --wait --pull always

# Production
export BACKEND_IMAGE="ghcr.io/<owner>/cesizenwebapp:main"
docker compose -p production -f compose.prod.yaml down --remove-orphans
docker compose -p production -f compose.prod.yaml up -d --wait --pull always
```

## Pipeline CI/CD

Déclenchement : push sur toutes les branches et tags `v*`.

```
push
 │
 ├── gitleaks          scan de secrets (toutes branches)
 ├── audit             npm audit (critical backend / high frontend)
 ├── install-api       npm ci + cache node_modules
 └── build-frontend    npm ci + vite build + cache node_modules
          │
          ├── lint-api       prisma generate + tsc --noEmit + eslint
          ├── test-api       vitest (tests unitaires)
          ├── lint-frontend  eslint
          └── test-cypress   tests E2E Cypress
                    │
          [uniquement sur developp ou main]
                    │
          build-and-push-docker  → image publiée sur GHCR
                    │
          ┌─────────┴──────────┐
    deploy-recette        deploy-prod
    (branche developp)    (branche main)
    SSH → docker compose  SSH → docker compose
```

### Tags d'image publiés

| Tag | Description |
|-----|-------------|
| `latest` | Dernière image publiée |
| `developp` / `main` | Dernière image de la branche |
| `a1b2c3d` | SHA court du commit — immuable, utilisable pour un rollback |

Rollback vers un commit précis :
```bash
export BACKEND_IMAGE="ghcr.io/<owner>/cesizenwebapp:a1b2c3d"
docker compose -p production -f compose.prod.yaml up -d --wait --pull always
```

### Secrets GitHub requis

| Secret | Description |
|--------|-------------|
| `AZURE_PEM` | Clé privée SSH pour la VM Azure |
| `AZURE_IP` | IP publique de la VM Azure |
| `AZURE_ID` | Nom d'utilisateur SSH |
| `GITHUB_TOKEN` | Fourni automatiquement par GitHub Actions |

## Sécurité

- **Helmet.js** — headers HTTP de sécurité sur toutes les réponses (CSP, HSTS, X-Frame-Options…)
- **HTTPS** — certificats Let's Encrypt via Certbot (TLS 1.2/1.3 uniquement)
- **JWT** — access token (15 min) + refresh token (7 jours) avec rotation
- **Bcrypt** — hachage des mots de passe
- **Zod** — validation et sanitisation de toutes les entrées
- **Gitleaks** — scan automatique des secrets à chaque push, bloque le build si détection
- **PostgreSQL** — accessible uniquement via le réseau Docker interne (aucun port exposé sur l'hôte)
- **npm audit** — détection des vulnérabilités à chaque CI
