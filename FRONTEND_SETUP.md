# Frontend Setup / Admin Dashboard

## Requirements
Install Node.js 20+ and npm. This dashboard runs locally and defaults to loopback-only development/preview servers.

## Configure the backend
```bash
cp .env.example .env
```
Set `VITE_API_URL` to the FastAPI service and `VITE_WS_URL` to its `/ws` endpoint. For local development use `http://localhost:8000` and `ws://localhost:8000/ws`; set `VITE_SIMULATED=false` to use live API calls. Runtime overrides are stored in browser local storage (`hla.api`, `hla.ws`).

## Run
```bash
npm install
npm start
npm run build
npm run serve
```
Validate with `npm run typecheck` and `npm run build`.

## PM2 auto-start
```bash
npm install -g pm2
npm run build
npm run pm2:start
pm2 save
pm2 startup
```
PM2 serves `dist/` on `127.0.0.1:8090`.

## Optional Electron desktop app
```bash
npm install
npm run build
npm run electron
```
Electron loads only the local `dist/` bundle with context isolation and disabled Node integration.

## Backend contract
The dashboard uses FastAPI endpoints under `` plus `/health`, and real-time traffic at `/ws`. See the backend `API_REFERENCE.md`.