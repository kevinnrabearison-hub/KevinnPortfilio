# Déploiement du portfolio

## Objectif

Déployer :
- Backend Express sur Render
- Frontend React sur Vercel
- Base PostgreSQL sur Neon

## Architecture

GitHub repository
  - `/backend` — service Express
  - `/frontend` — application React

## Étapes

### 1. Préparer le repo

1. Ajouter `backend/.env.example` et `frontend/.env.example`.
2. Vérifier que `.gitignore` exclut :
   - `backend/.env`
   - `frontend/.env`
   - `backend/data.json`
   - `node_modules/`
   - `frontend/dist/`

### 2. Créer une base PostgreSQL Neon

1. Ouvre https://neon.tech et connecte-toi.
2. Crée un nouveau projet/postgrest.
3. Crée une nouvelle base de données.
4. Copie l’URL `DATABASE_URL` de Neon.

### 3. Déployer le backend sur Render

1. Ouvre https://dashboard.render.com.
2. Crée un nouveau service `Web Service`.
3. Sélectionne ton dépôt GitHub.
4. Configure :
   - `Name`: portfolio-backend
   - `Root Directory`: `backend`
   - `Branch`: `main`
   - `Environment`: `Node`
   - `Build Command`: `npm install`
   - `Start Command`: `npm start`
5. Dans `Environment` / `Environment Variables`, ajoute :
   - `DATABASE_URL` = URL Neon
   - `JWT_SECRET` = une clé secrète forte
   - `ADMIN_PASSWORD` ou `ADMIN_PASSWORD_HASH`
   - `FRONTEND_URL` = URL du frontend Vercel
   - `EMAIL_USER` et `EMAIL_PASS` si nécessaire
    - `VAPID_SUBJECT` = `mailto:ton-email@example.com`
    - `VAPID_PUBLIC_KEY` et `VAPID_PRIVATE_KEY` générées avec :
       `npx web-push generate-vapid-keys`

      `DATABASE_URL` est obligatoire en production. Si Neon est indisponible,
      le backend s'arrête au démarrage au lieu d'utiliser un stockage mémoire local.

      Le backend purge quotidiennement les messages de plus de 90 jours, les
      visiteurs inactifs depuis plus de 180 jours et les abonnements push anciens
      ou orphelins.

### 4. Déployer le frontend sur Vercel

1. Ouvre https://vercel.com.
2. Connecte ton compte GitHub.
3. Ajoute un nouveau projet depuis le dépôt.
4. Configure :
   - `Root Directory`: `frontend`
   - `Framework Preset`: `Vite` / `React`
   - `Build Command`: `npm install && npm run build`
   - `Output Directory`: `dist`
5. Dans `Environment Variables`, ajoute :
   - `VITE_BACKEND_URL` = URL du backend Render

### 5. Vérifier le CORS

- Dans `backend/server.js`, `FRONTEND_URL` doit être bien utilisé par CORS.
- L’API doit autoriser le frontend Vercel.

### 6. Test final

1. Va sur l’URL Vercel.
2. Ouvre le chat visiteur.
3. Ouvre l’URL Render/admin.
4. Connecte-toi en admin.
5. Vérifie que les messages apparaissent et restent.

6. Depuis un navigateur HTTPS, clique sur `Activer` dans l’alerte de notifications, puis vérifie qu’une réponse admin déclenche une notification après fermeture du portfolio.

## Conseils

- Utilise `ADMIN_PASSWORD_HASH` pour plus de sécurité.
- Si tu as déjà un token Neon, copie-le dans Render.
- Si tu as besoin du hash bcrypt, tu peux exécuter :
  `node -e "import('bcryptjs').then(b => b.default.hash('TonMotDePasse', 12).then(console.log))"`
