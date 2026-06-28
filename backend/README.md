# 🛡️ Raven Guard — Backend API

Full-featured Express.js backend for the Raven Guard cybersecurity threat detection platform. Powered by **Anthropic Claude AI** with **Supabase** for persistence.

---

## ✨ Features

| Feature | Details |
|---|---|
| **AI Analysis** | Claude Sonnet via Anthropic API — message, URL, email, image |
| **Scan endpoints** | `/api/scan/message`, `/url`, `/email`, `/screenshot` |
| **History** | Full scan history with filtering & pagination |
| **Analytics** | Threat trends, weekly stats, safety score |
| **PDF Reports** | Auto-generated styled reports per scan |
| **Threat Intel** | Curated keyword/domain threat database |
| **Settings** | Per-user preferences persisted in Supabase |
| **Fallback** | Works fully offline (in-memory store, heuristic AI) |

---

## 🚀 Quick Start (Local)

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your keys (see Configuration section below)
```

### 3. Start the server
```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

The API will be live at **http://localhost:5000**

---

## ⚙️ Configuration

Edit `.env`:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173

# Required for AI analysis
ANTHROPIC_API_KEY=sk-ant-...

# Required for data persistence (optional — falls back to memory)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

> **Note:** The server works without any API keys using heuristic analysis and in-memory storage. Configure `ANTHROPIC_API_KEY` for full AI features.

---

## 🗄️ Supabase Setup

### Option A — Automatic
```bash
npm run db:setup
```

### Option B — Manual (recommended)
1. Open [Supabase Dashboard](https://app.supabase.com) → your project
2. Go to **SQL Editor** → **New Query**
3. Paste the contents of `scripts/schema.sql`
4. Click **Run**

### Storage Bucket (for screenshots)
1. Supabase Dashboard → **Storage** → **New bucket**
2. Name: `raven-guard-uploads`
3. Public: **No**
4. Max file size: `10MB`
5. Allowed MIME types: `image/jpeg, image/png, image/webp, image/gif`

---

## 📡 API Reference

### Health
```
GET /api/health
```

### Scan Endpoints
```
POST /api/scan/message       { text: "..." }
POST /api/scan/url           { url: "https://..." }
POST /api/scan/email         { content: "..." }
POST /api/scan/screenshot    multipart/form-data  field: image
GET  /api/scan/:id
```

**Response format (all scan endpoints):**
```json
{
  "success": true,
  "scan_id": "uuid",
  "result": {
    "risk_score": 87,
    "risk_level": "high",
    "verdict": "High-Risk Phishing Attempt",
    "confidence": 96,
    "analysis_time_ms": 1240,
    "summary": "...",
    "red_flags": [{ "title": "OTP Request", "score": 95, "description": "..." }],
    "safe_signals": [],
    "recommended_actions": ["Do not click links", "Block sender"],
    "categories": ["phishing", "impersonation"],
    "report_to_cybercrime": true
  }
}
```

### History
```
GET    /api/history?type=message&limit=50&offset=0
DELETE /api/history/:id
```

### Analytics
```
GET /api/analytics
```

### Reports
```
GET /api/reports
GET /api/reports/:id/download   → returns PDF file
```

### Threat Intelligence
```
GET /api/threats
```

### Settings
```
GET   /api/settings
PATCH /api/settings   { ai_analysis: true, url_safety_check: false, ... }
```

---

## 🔗 Frontend Integration

In your Vite frontend, create `src/services/api.js`:

```js
const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = {
  // Scan a message
  scanMessage: (text) =>
    fetch(`${BASE}/api/scan/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    }).then((r) => r.json()),

  // Scan a URL
  scanUrl: (url) =>
    fetch(`${BASE}/api/scan/url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    }).then((r) => r.json()),

  // Scan email content
  scanEmail: (content) =>
    fetch(`${BASE}/api/scan/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    }).then((r) => r.json()),

  // Upload screenshot
  scanScreenshot: (file) => {
    const form = new FormData();
    form.append("image", file);
    return fetch(`${BASE}/api/scan/screenshot`, {
      method: "POST",
      body: form,
    }).then((r) => r.json());
  },

  // Get history
  getHistory: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetch(`${BASE}/api/history?${qs}`).then((r) => r.json());
  },

  // Get analytics
  getAnalytics: () =>
    fetch(`${BASE}/api/analytics`).then((r) => r.json()),

  // Get reports
  getReports: () =>
    fetch(`${BASE}/api/reports`).then((r) => r.json()),

  // Download PDF
  downloadReport: (id) =>
    window.open(`${BASE}/api/reports/${id}/download`, "_blank"),

  // Get threat intel
  getThreats: () =>
    fetch(`${BASE}/api/threats`).then((r) => r.json()),

  // Settings
  getSettings: () =>
    fetch(`${BASE}/api/settings`).then((r) => r.json()),
  updateSettings: (data) =>
    fetch(`${BASE}/api/settings`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),
};
```

Add to your frontend `.env`:
```env
VITE_API_URL=http://localhost:5000
```

---

## 🏗️ Project Structure

```
raven-guard-backend/
├── server.js                    # Entry point, Express app
├── package.json
├── .env.example
│
├── routes/                      # Route definitions
│   ├── scan.routes.js
│   ├── history.routes.js
│   ├── analytics.routes.js
│   ├── report.routes.js
│   ├── threat.routes.js
│   ├── settings.routes.js
│   └── health.routes.js
│
├── controllers/                 # Request/response handlers
│   ├── scan.controller.js
│   ├── history.controller.js
│   ├── analytics.controller.js
│   ├── report.controller.js
│   ├── threat.controller.js
│   └── settings.controller.js
│
├── services/                    # Business logic
│   ├── aiAnalysis.service.js    # Claude AI integration
│   ├── database.service.js      # Supabase + memory fallback
│   └── report.service.js        # PDF generation
│
├── middleware/
│   ├── upload.middleware.js     # Multer file handling
│   └── validation.middleware.js # Input validation
│
├── utils/
│   ├── supabaseClient.js        # Supabase singleton
│   └── memoryStore.js           # In-memory fallback store
│
├── scripts/
│   ├── schema.sql               # Full Supabase schema + RLS + seed
│   └── setupDatabase.js         # Auto-apply schema script
│
├── uploads/                     # Temp screenshot storage
└── reports/                     # Generated PDF reports
```

---

## 🚢 Production Deployment

### Environment variables for production:
```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend.vercel.app
ANTHROPIC_API_KEY=sk-ant-...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### Deploy to Railway / Render / Fly.io:
1. Push code to GitHub
2. Connect repo to Railway/Render
3. Set all environment variables
4. Set start command: `npm start`
5. Done ✅

### Deploy to VPS (Ubuntu):
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start server.js --name "raven-guard-api"
pm2 save
pm2 startup
```

---

## 🔒 Security

- **Helmet.js** — HTTP security headers
- **CORS** — Restricted to configured frontend origin
- **Rate limiting** — 200 req/15min global, 30 req/min for scan endpoints
- **Input validation** — All scan inputs validated before AI processing
- **File type filtering** — Only image types accepted for screenshots
- **RLS** — Supabase Row Level Security on all tables
- **Service role isolation** — Admin client only for server-side inserts
