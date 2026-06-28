/**
 * In-memory fallback store for local development without Supabase.
 * Data is lost on server restart — configure Supabase for persistence.
 */
import { v4 as uuidv4 } from "uuid";

const store = {
  scans: [],
  settings: new Map(), // userId → settings object
};

// ─── Scans ───────────────────────────────────────────────────────────────────

export function insertScan(scan) {
  const record = {
    id: uuidv4(),
    created_at: new Date().toISOString(),
    ...scan,
  };
  store.scans.unshift(record);
  return record;
}

export function getScans({ userId, type, limit = 50, offset = 0 } = {}) {
  let results = store.scans;
  if (userId) results = results.filter((s) => s.user_id === userId);
  if (type) results = results.filter((s) => s.scan_type === type);
  return {
    data: results.slice(offset, offset + limit),
    count: results.length,
  };
}

export function getScanById(id) {
  return store.scans.find((s) => s.id === id) || null;
}

export function deleteScan(id) {
  const idx = store.scans.findIndex((s) => s.id === id);
  if (idx !== -1) store.scans.splice(idx, 1);
}

// ─── Analytics helpers ────────────────────────────────────────────────────────

export function getAnalyticsSummary() {
  const total = store.scans.length;
  const threats = store.scans.filter((s) => s.risk_level === "high").length;
  const suspicious = store.scans.filter((s) => s.risk_level === "medium").length;
  const safe = store.scans.filter((s) => s.risk_level === "low").length;

  const byType = {};
  for (const s of store.scans) {
    byType[s.scan_type] = (byType[s.scan_type] || 0) + 1;
  }

  return { total, threats, suspicious, safe, byType };
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export function getSettings(userId = "local") {
  return (
    store.settings.get(userId) || {
      ai_analysis: true,
      url_safety_check: true,
      save_history: true,
      generate_reports: true,
      high_risk_alerts: true,
      suspicious_url_alerts: true,
      weekly_summary: false,
      report_reminder: false,
    }
  );
}

export function upsertSettings(userId = "local", data) {
  const existing = getSettings(userId);
  const updated = { ...existing, ...data, updated_at: new Date().toISOString() };
  store.settings.set(userId, updated);
  return updated;
}
