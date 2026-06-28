/**
 * Raven Guard — Frontend API Service
 * Drop this file into: src/services/api.js
 *
 * Usage:
 *   import { api } from "../services/api";
 *   const result = await api.scanMessage("Urgent! Your SBI KYC...");
 */

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export const api = {
  // ── Health ────────────────────────────────────────────────────────────────
  health: () => request("/api/health"),

  // ── Scans ─────────────────────────────────────────────────────────────────
  scanMessage: (text) =>
    request("/api/scan/message", {
      method: "POST",
      body: JSON.stringify({ text }),
    }),

  scanUrl: (url) =>
    request("/api/scan/url", {
      method: "POST",
      body: JSON.stringify({ url }),
    }),

  scanEmail: (content) =>
    request("/api/scan/email", {
      method: "POST",
      body: JSON.stringify({ content }),
    }),

  scanScreenshot: (file) => {
    const form = new FormData();
    form.append("image", file);
    return fetch(`${BASE}/api/scan/screenshot`, { method: "POST", body: form })
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) throw new Error(data.error);
        return data;
      });
  },

  getScan: (id) => request(`/api/scan/${id}`),

  // ── History ───────────────────────────────────────────────────────────────
  getHistory: ({ type, limit = 50, offset = 0 } = {}) => {
    const params = new URLSearchParams({ limit, offset });
    if (type) params.set("type", type);
    return request(`/api/history?${params}`);
  },

  deleteHistory: (id) =>
    request(`/api/history/${id}`, { method: "DELETE" }),

  // ── Analytics ─────────────────────────────────────────────────────────────
  getAnalytics: () => request("/api/analytics"),

  // ── Reports ───────────────────────────────────────────────────────────────
  getReports: ({ limit = 20, offset = 0 } = {}) =>
    request(`/api/reports?limit=${limit}&offset=${offset}`),

  downloadReport: (id) => {
    window.open(`${BASE}/api/reports/${id}/download`, "_blank");
  },

  // ── Threat Intelligence ───────────────────────────────────────────────────
  getThreats: () => request("/api/threats"),

  // ── Settings ──────────────────────────────────────────────────────────────
  getSettings: () => request("/api/settings"),

  updateSettings: (data) =>
    request("/api/settings", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};
