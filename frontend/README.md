# FieldOps UI

Modern, responsive SaaS dashboard UI for **FieldOps - Field Service Management Platform** (Vite + React + Tailwind + Framer Motion + React Router + Axios).

## Run locally

```bash
npm install
npm run dev
```

## Demo auth (mock)

Login maps email → role (password is not validated in the demo):

- `admin@fieldops.com` (Admin)
- `tech@fieldops.com` (Technician)
- `client@fieldops.com` (Client)

## API configuration

Create `.env.local` from `.env.example`:

- `VITE_API_BASE_URL` is read by `src/services/api.js` and attached as Axios `baseURL`.

The UI ships with **mock datasets** in `src/data/*` plus an API-shaped loader in `src/services/jobsService.js` so pages work without a backend.

## Project structure

- `src/components/` reusable UI primitives (layout pieces, cards, table, modal…)
- `src/layouts/` app shell (`AppLayout`)
- `src/pages/` routed screens
- `src/context/` auth, theme, jobs state
- `src/services/` axios client + API-ready modules
- `src/routes/` route guards

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```
