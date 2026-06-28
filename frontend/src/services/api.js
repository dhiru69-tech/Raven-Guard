const BASE = import.meta.env.VITE_API_URL || "";

async function req(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export const api = {
  health: () => req("/api/health"),
  scanMessage: (text) => req("/api/scan/message", { method: "POST", body: JSON.stringify({ text }) }),
  scanUrl: (url) => req("/api/scan/url", { method: "POST", body: JSON.stringify({ url }) }),
  scanEmail: (content) => req("/api/scan/email", { method: "POST", body: JSON.stringify({ content }) }),
  scanScreenshot: (file) => {
    const form = new FormData();
    form.append("image", file);
    return fetch(`${BASE}/api/scan/screenshot`, { method: "POST", body: form }).then((r) => r.json());
  },
  getHistory: ({ type, limit = 50, offset = 0 } = {}) => {
    const p = new URLSearchParams({ limit, offset });
    if (type) p.set("type", type);
    return req(`/api/history?${p}`);
  },
  deleteHistory: (id) => req(`/api/history/${id}`, { method: "DELETE" }),
  getAnalytics: () => req("/api/analytics"),
  getReports: () => req("/api/reports"),
  downloadReport: (id) => window.open(`${BASE}/api/reports/${id}/download`, "_blank"),
  getThreats: () => req("/api/threats"),
  getSettings: () => req("/api/settings"),
  updateSettings: (data) => req("/api/settings", { method: "PATCH", body: JSON.stringify(data) }),
};
