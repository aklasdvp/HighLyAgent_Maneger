# HighLyAgent Manager — Admin Dashboard

<div align="center">

**🤖 AI Middleware Control Center**

A powerful React + Vite admin dashboard for managing HighLyAgent — the universal AI middleware platform. Create projects, manage API keys, monitor system health, and configure AI providers in real-time.

[🌐 Live Demo](#) • [📖 Documentation](./FRONTEND_SETUP.md) • [🐛 Report Issue](#) • [💬 Discussions](#)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Local Development](#local-development)
- [VS Code Setup](#vs-code-setup)
- [Git Workflow](#git-workflow)
- [API Key Integration](#api-key-integration)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

**HighLyAgent Manager** is the **official admin dashboard** for [HighLyAgent](https://github.com/aklasdvp/HighLyAgent) — a universal AI middleware platform.

### What It Does:
- 🔐 **Project Management** — Create & manage client applications (Web, Mobile, Desktop, IoT)
- 🔑 **API Key Management** — Issue, copy, and regenerate project-specific API keys
- 📊 **System Monitoring** — Real-time dashboards for requests, cache hits, AI calls
- 🧠 **AI Providers** — Configure & manage provider chains (OpenAI, Claude, Gemini, DeepSeek)
- 💾 **Knowledge Base** — Train custom responses via semantic search
- 🛠️ **Tools & Workflows** — Register custom tools and automation workflows
- 👥 **User Management** — Track usage, enforce quotas, manage subscriptions
- 📋 **Audit Logs** — Full compliance audit trail (JWT, API Key rotation, access denied)

### How It Works:

```
Admin Dashboard (React)
        ↓
    [Login via JWT]
        ↓
[Browse Projects] → [API Key Management] → [Health Dashboard]
        ↓                    ↓                        ↓
  HighLyAgent Backend (FastAPI)
        ↓
  PostgreSQL + pgvector + Redis
```

---

## ✨ Features

| Feature | Status | Details |
|---------|--------|---------|
| **Project CRUD** | ✅ | Create, read, update, delete client projects |
| **API Key Management** | ✅ | Issue, copy, and regenerate keys with dual-factor auth |
| **Real-time Dashboard** | ✅ | Monitor requests, cache hits, AI calls, latency |
| **AI Provider Config** | ✅ | Manage provider chain & fallback strategy |
| **Knowledge Base UI** | ✅ | Add, edit, delete training data (semantic search) |
| **Audit Logs** | ✅ | Full JWT rotation & access denied tracking |
| **System Health** | ✅ | Database, Redis, provider status checks |
| **Dark/Light Mode** | ✅ | Theme toggle with system preference detection |
| **Desktop App** | ✅ | Optional Electron packaging (PM2 auto-start) |
| **WebSocket Real-time** | 🔄 | Progress streaming via `/ws` gateway |

---

## 🛠️ Technology Stack

### Frontend Framework
- **React 18.2** — UI component library
- **TypeScript 5.7** — Type-safe JavaScript
- **Vite 6.3** — Next-gen build tool (fast HMR)

### Styling & UI
- **Tailwind CSS 4.1** — Utility-first CSS framework
- **Framer Motion 11** — Smooth animations & transitions
- **Lucide React** — 300+ beautiful SVG icons

### State Management & Data
- **React Context API** — Global app state (auth, theme, system config)
- **localStorage** — Persistent state (user preferences, API Key override)
- **Recharts 2.10** — Beautiful charts & graphs

### HTTP & WebSocket
- **Fetch API** — Native HTTP client (no axios needed)
- **WebSocket** — Real-time bidirectional communication
- **Error Handling** — Custom `ApiError` class with retry logic

### Routing & Navigation
- **React Router 6.8** — Client-side routing
- **Dynamic imports** — Code splitting for lazy loading

### Development & Tooling
- **Node.js 20+** — JavaScript runtime
- **npm 10** — Package manager (or yarn/pnpm)
- **ESLint** — Code linting
- **TypeScript** — Strict type checking

### Optional: Desktop
- **Electron 35** — Desktop app wrapper
- **PM2** — Process manager (auto-start on reboot)

---

## 📦 Prerequisites

Before you start, make sure you have:

| Tool | Version | Purpose |
|------|---------|---------|
| **Node.js** | `20.x` or higher | JavaScript runtime |
| **npm** | `10.x` or higher | Package manager |
| **Git** | Latest | Version control |
| **VS Code** | Latest | Code editor (recommended) |

### Verify Installation:
```bash
node --version      # v20.x.x
npm --version       # 10.x.x
git --version       # git version 2.x.x
```

---

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Clone repository
git clone https://github.com/aklasdvp/HighLyAgent_Maneger.git
cd HighLyAgent_Maneger

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env
# Edit .env: set VITE_API_KEY, VITE_API_URL

# 4. Start dev server
npm run dev

# 5. Open in browser
# Dashboard: http://localhost:5173
```

That's it! You're ready to go. 🎉

---

## 📖 Local Development

### Step-by-Step Setup

#### Step 1: Clone the Repository
```bash
# Using HTTPS (recommended for beginners)
git clone https://github.com/aklasdvp/HighLyAgent_Maneger.git
cd HighLyAgent_Maneger

# OR using SSH (if you have SSH keys configured)
git clone git@github.com:aklasdvp/HighLyAgent_Maneger.git
cd HighLyAgent_Maneger
```

#### Step 2: Open in VS Code
```bash
# Open current directory in VS Code
code .

# OR: Open VS Code, then File → Open Folder → select this directory
```

#### Step 3: Install Dependencies
```bash
# Install all npm packages
npm install

# Verify installation (check package-lock.json was created)
ls -la node_modules/@react
```

**⏱️ First install takes 1-2 minutes depending on internet speed.**

#### Step 4: Create Environment File

```bash
# Copy example env
cp .env.example .env

# Edit .env with your settings
nano .env  # or use VS Code to open .env
```

**`.env` file template:**
```env
# Backend Configuration
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws

# Admin API Key (from backend)
VITE_API_KEY=sk_live_your_key_here

# Dev Mode: true=demo data, false=real backend
VITE_SIMULATED=false
```

#### Step 5: Start Development Server
```bash
# Start Vite dev server
npm run dev

# Output will show:
# Local:   http://localhost:5173/
# Press 'q' to quit
```

#### Step 6: Connect Backend

Make sure **HighLyAgent Backend** is running:
```bash
# In another terminal, start the backend
cd ../HighLyAgent
python3 main.py
# Backend runs at http://localhost:8000
```

**Test connection:**
```bash
# In browser console (F12 → Console)
fetch('http://localhost:8000/health').then(r => r.json()).then(console.log)
# Should show: { status: 'ok', version: '2.4.1', ... }
```

---

## 🎨 VS Code Setup

### Recommended Extensions

Install these extensions for the best development experience:

| Extension | ID | Purpose |
|-----------|----|-----------| 
| **ES7+ React/Redux/React-Native snippets** | `dsznajder.es7-react-js-snippets` | React code snippets |
| **Tailwind CSS IntelliSense** | `bradlc.vscode-tailwindcss` | CSS utility autocomplete |
| **TypeScript Vue Plugin** | `Vue.volar` | Vue/TypeScript support (if using Vue) |
| **Thunder Client** | `rangav.vscode-thunder-client` | REST API testing |
| **Error Lens** | `usernamehw.errorlens` | Inline error messages |
| **Git Graph** | `mhutchie.git-graph` | Visual git history |

**Install All at Once:**
```bash
# Copy-paste into VS Code terminal (Ctrl+`)
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension bradlc.vscode-tailwindcss
code --install-extension usernamehw.errorlens
code --install-extension mhutchie.git-graph
```

### Workspace Settings

Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.exclude": {
    "node_modules": true,
    "dist": true,
    ".venv": true
  },
  "search.exclude": {
    "node_modules": true,
    "dist": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### Debug Configuration

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Chrome",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}",
      "preLaunchTask": "npm: dev"
    }
  ]
}
```

---

## 📚 Git Workflow

### Core Commands

#### 1. Update Local Code from GitHub

```bash
# Before you start working, always pull latest changes
git pull origin main

# Shows what changed
# You now have latest code from everyone
```

#### 2. Check Status

```bash
# See what files you've changed
git status

# Output:
# On branch main
# Changes not staged for commit:
#   modified:   src/views/Projects.tsx
#   modified:   src/lib/api.ts
# Untracked files:
#   .env
```

#### 3. Stage Changes

```bash
# Stage one file
git add src/views/Projects.tsx

# Stage all changes
git add .

# IMPORTANT: Add .env to .gitignore (never commit secrets!)
echo ".env" >> .gitignore
```

#### 4. Commit Changes

```bash
# Commit with message
git commit -m "Phase 3: Add API Key rotation UI"

# Good commit message format:
# [Feature/Fix/Docs]: Brief description (50 chars max)
# - Detailed explanation
# - What changed
# - Why it changed
```

**Good commit messages:**
```bash
git commit -m "Feature: Add API Key copy button"
git commit -m "Fix: Handle 401 auth errors properly"
git commit -m "Docs: Update setup guide"
```

#### 5. Push to GitHub

```bash
# Push your commits
git push origin main

# Verify on GitHub: https://github.com/aklasdvp/HighLyAgent_Maneger
```

#### 6. Create Pull Request (for collaboration)

```bash
# 1. Create a feature branch
git checkout -b feature/api-key-management

# 2. Make changes & commit
git add .
git commit -m "Add API key rotation"

# 3. Push to GitHub
git push origin feature/api-key-management

# 4. Go to GitHub → Click "Compare & pull request"
# 5. Add description & wait for review
```

### Complete Workflow Example

```bash
# Start of day: get latest
git pull origin main

# Work on feature
echo "const newFeature = true;" >> src/lib/newFeature.ts
git add src/lib/newFeature.ts
git commit -m "Feature: Add new feature"

# Check what's going out
git log -1
git diff --staged

# Push to GitHub
git push origin main

# Verify: https://github.com/aklasdvp/HighLyAgent_Maneger/commits/main
```

### Common Git Issues

**Issue: Merge Conflict**
```bash
# If someone else pushed to main while you were working:
git pull origin main
# Fix conflicts in editor (look for <<<<<<< and >>>>>>>)
git add .
git commit -m "Merge main into local"
git push origin main
```

**Issue: Accidental Commit**
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Or: Undo last commit (discard changes)
git reset --hard HEAD~1
```

**Issue: Wrong Branch**
```bash
# See all branches
git branch -a

# Switch to main
git checkout main

# Delete local branch
git branch -d feature/old-feature
```

---

## 🔑 API Key Integration

### How It Works

1. **Backend generates API Key** when you create a project
   ```
   Backend: sk_live_1234567890abcdef1234567890ab
   ```

2. **Admin Dashboard shows masked key**
   ```
   Display: sk_live_••••••••••••••••••••••••••••
   Full key visible only once: copy to clipboard
   ```

3. **All API calls include key**
   ```typescript
   fetch('http://localhost:8000/projects', {
     headers: {
       'X-API-Key': 'sk_live_...',
       'Authorization': 'Bearer <jwt>'
     }
   })
   ```

4. **Key rotation** (regenerate)
   ```
   Old key: IMMEDIATELY REVOKED → clients get 401
   New key: ISSUED → old clients must update config
   ```

### Setup .env

```bash
# Copy template
cp .env.example .env

# Edit with your key
VITE_API_KEY=sk_live_your_key_from_backend
VITE_API_URL=http://localhost:8000
VITE_SIMULATED=false
```

### Test API Key

```bash
# In browser console (F12)
const headers = new Headers({
  'X-API-Key': 'sk_live_...',
  'Authorization': 'Bearer <your-jwt>'
});

fetch('http://localhost:8000/projects', { headers })
  .then(r => r.json())
  .then(console.log)  // See projects
  .catch(e => console.error(e))  // See errors
```

### Error Responses

| Code | Message | Fix |
|------|---------|-----|
| **401** | `INVALID_KEY` | Check API Key in .env |
| **403** | `ACCESS_DENIED` | Key doesn't belong to project |
| **4XX** | `HTTP_xxx` | Network/server error |

---

## 🧪 Testing Locally

### Test Mode: Demo Data

```bash
# .env
VITE_SIMULATED=true  # Uses fake data (no backend needed)
npm run dev
```

**Demo features:**
- Pre-populated projects
- Fake metrics that update
- No API calls (offline-first)

### Test Mode: Real Backend

```bash
# .env
VITE_SIMULATED=false
VITE_API_KEY=sk_live_...
VITE_API_URL=http://localhost:8000

npm run dev
```

**Verify connection:**
1. Open http://localhost:5173
2. Login (username/email + password)
3. Go to Projects → see real data from backend
4. Open F12 → Network tab → check requests have `X-API-Key` header

---

## 📦 Available Scripts

```bash
npm run dev          # Start dev server (hot reload)
npm run build        # Build for production
npm run typecheck    # Check TypeScript errors
npm run serve        # Serve production build locally
npm run electron     # Launch Electron app (desktop)
npm run pm2:start    # Start with PM2 (auto-restart)
npm run pm2:stop     # Stop PM2 process
```

---

## 📂 Project Structure

```
HighLyAgent_Maneger/
├── src/
│   ├── App.tsx                 # Main app shell
│   ├── main.tsx                # Vite entry point
│   ├── index.css               # Global styles
│   ├── components/
│   │   ├── ui.tsx              # UI components (Badge, Button, etc)
│   │   ├── toast.tsx           # Toast notifications
│   ├── lib/
│   │   ├── api.ts              # API client + WebSocket
│   │   ├── store.tsx           # Context store (auth, state)
│   │   ├── data.ts             # Types & demo data
│   ├── views/
│   │   ├── Login.tsx           # Admin login
│   │   ├── Overview.tsx        # Dashboard
│   │   ├── Projects.tsx        # Project management ⭐ API Key stuff
│   │   ├── ProjectDetail.tsx   # Project details
│   │   ├── ApiKeys.tsx         # API Key management
│   │   ├── ToolsProviders.tsx  # AI provider config
│   │   ├── Knowledge.tsx       # Knowledge base
│   │   ├── SystemSettings.tsx  # System config
│   │   ├── LogsSecurity.tsx    # Audit logs
│   │   └── Backend.tsx         # Backend status
├── .env.example                # Environment template
├── package.json                # Dependencies
├── vite.config.ts              # Vite config
├── tsconfig.json               # TypeScript config
├── index.html                  # HTML entry point
└── README.md                   # This file
```

---

## 🐛 Troubleshooting

### Issue: npm install fails

**Solution:**
```bash
# Clear cache
npm cache clean --force

# Delete lock file
rm package-lock.json

# Reinstall
npm install
```

### Issue: Port 5173 already in use

**Solution:**
```bash
# Kill process on port 5173
# Linux/Mac:
kill -9 $(lsof -t -i:5173)

# Windows (PowerShell):
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process -Force

# Or use different port:
npm run dev -- --port 3000
```

### Issue: Backend connection fails

**Checklist:**
- [ ] Backend is running (`python3 main.py` on port 8000)
- [ ] `VITE_API_URL=http://localhost:8000` in .env
- [ ] No firewall blocking port 8000
- [ ] Check browser console (F12) for errors

### Issue: API Key errors (401/403)

**Checklist:**
- [ ] `VITE_API_KEY` is set in .env
- [ ] Key matches backend project
- [ ] JWT token hasn't expired
- [ ] Check Network tab for `X-API-Key` header

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m "Add amazing feature"`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📄 License

This project is part of HighLyAgent ecosystem.

---

## 📞 Support

- 📧 **Issues:** GitHub Issues tab
- 💬 **Discussions:** GitHub Discussions
- 📖 **Docs:** [FRONTEND_SETUP.md](./FRONTEND_SETUP.md)
- 🔑 **API Keys:** [API_KEY_INTEGRATION_REPORT.md](./API_KEY_INTEGRATION_REPORT.md)

---

## 🚀 Deployment

See [FRONTEND_SETUP.md](./FRONTEND_SETUP.md) for deployment instructions (Docker, Vercel, Netlify, etc).

---

<div align="center">

**Made with ❤️ for the AI community**

[⬆ Back to top](#highlyagent-manager--admin-dashboard)

</div>
