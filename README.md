# CesiZen

Application web de gestion d'articles sur le bien être et d'exercices de respiration. Comprend une API REST Express/TypeScript et un backoffice React, est conçu pour être utilisé par l'application mobile dédiée.

## Pr"requis

- Node.js >= 18
- PostgreSQL (ou Docker)

## Installation

```bash
# Cloner le projet
git clone <url-du-repo>
cd CesiZenWebApp

# Installer les dependances backend
npm install

# Installer les dependances frontend
cd frontend && npm install && cd ..
```

## Configuration

Creer un fichier `.env` a la racine :

```
DATABASE_URL="postgresql://user:password@localhost:5432/Cesizen?schema=public"
JWT_SECRET=une_cle_secrete_longue
JWT_EXPIRES_IN=15m
REFRESH_SECRET=une_autre_cle_secrete
REFRESH_EXPIRES_IN=7d
```

Si vous utilisez un docker PostgreSQL, ajoutez également :

```
DOCKER_DATABASE_PORT=5432
DOCKER_DATABASE_NAME=Cesizen
DOCKER_DATABASE_USERNAME=postgres
DOCKER_DATABASE_PASSWORD=votre_mdp
```

## Base de donnees

```bash
# Lancer PostgreSQL via Docker (optionnel)
docker compose up -d

# Appliquer les migrations
npx prisma migrate dev
# Creer le compte admin par defaut (admin@cesizen.fr / Admin1234!)
npx prisma db seed
```

## Lancement

### Developpement

Ouvrir deux terminaux :

```bash
# Terminal 1 - API (port 3000)
npm run dev

# Terminal 2 - Frontend (port 5173)
cd frontend && npm run dev
```

Acceder au backoffice : http://localhost:5173

### Production

```bash
# Build du frontend
cd frontend && npm run build && cd ..

# Lancer le serveur
npm run dev
```

L'API et le backoffice sont servis sur http://localhost:3000

## Endpoints API

| Prefixe | Description |
|---------|-------------|
| `/api/auth` | Authentification (register, login, refresh, logout) |
| `/api/articles` | CRUD articles + favoris |
| `/api/exercises` | CRUD exercices de respiration + favoris |
| `/api/users` | Gestion des utilisateurs (admin) |

## Authentification

L'API utilise un systeme access token / refresh token JWT :

- Access token (15min) : envoye via le header `Authorization: Bearer <token>`
- Refresh token (7 jours) : stocke en base, rotation a chaque utilisation
- Route `POST /api/auth/refresh` pour renouveler les tokens
- Route `POST /api/auth/logout` pour revoquer le refresh token
