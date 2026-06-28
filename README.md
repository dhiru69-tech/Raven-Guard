# 🛡️ CyberShield AI — Complete Full-Stack App

AI-powered scam & phishing detection platform. Built with React + Vite (frontend) and Express + Claude AI + Supabase (backend).

---

## 📁 Project Structure
```
cybershield/
├── frontend/    ← React + Vite + Tailwind (deploy to Vercel)
└── backend/     ← Express + Claude AI + Supabase (deploy to Railway)
```

---

## ⚡ Local Development (Quick Start)

### Step 1 — Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env — add ANTHROPIC_API_KEY at minimum
npm run dev
# Runs on http://localhost:5000
```

### Step 2 — Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Leave VITE_API_URL empty (Vite proxy handles it)
npm run dev
# Runs on http://localhost:5173
```

Open http://localhost:5173 — everything works!

---

## 🗄️ Supabase Setup (for data persistence)

1. Create project at https://supabase.com
2. SQL Editor → New Query → paste `backend/scripts/schema.sql` → Run
3. Storage → New bucket → name: `raven-guard-uploads` → private
4. Add to `backend/.env`:
   ```
   SUPABASE_URL=https://xxxx.supabase.co
   SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```

Without Supabase, the app uses in-memory storage (data resets on restart).

---

## 🚀 Production Deployment

### Backend → Railway
1. Push `backend/` folder to GitHub
2. railway.app → New Project → Deploy from GitHub
3. Add all `.env` variables in Railway dashboard
4. Copy the Railway URL (e.g. `https://cybershield-api.up.railway.app`)

### Frontend → Vercel
1. Push `frontend/` folder to GitHub
2. vercel.com → New Project → Import repo
3. Add environment variable:
   ```
   VITE_API_URL = https://cybershield-api.up.railway.app
   ```
4. Deploy → done!

### Update CORS
In Railway dashboard, update:
```
FRONTEND_URL = https://your-app.vercel.app
```

---

## 🔑 API Keys Needed

| Key | Where to get | Required? |
|-----|-------------|-----------|
| `ANTHROPIC_API_KEY` | console.anthropic.com | For AI analysis |
| `SUPABASE_URL` + keys | app.supabase.com | For data persistence |

Without keys: app still works with heuristic analysis + in-memory storage.

---

## 📡 API Endpoints

```
GET  /api/health
POST /api/scan/message      { text }
POST /api/scan/url          { url }
POST /api/scan/email        { content }
POST /api/scan/screenshot   multipart image
GET  /api/history
GET  /api/analytics
GET  /api/reports
GET  /api/reports/:id/download
GET  /api/threats
GET  /api/settings
PATCH /api/settings
```
