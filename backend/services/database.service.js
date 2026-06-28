/**
 * Database Service
 * Wraps Supabase queries with graceful fallback to in-memory store.
 * All external code should import from here — never call Supabase directly.
 */
import { getClient } from "../utils/supabaseClient.js";
import * as mem from "../utils/memoryStore.js";

const USE_SUPABASE = !!process.env.SUPABASE_URL;

// ─── Scans ────────────────────────────────────────────────────────────────────

export async function createScan(scanData) {
  if (!USE_SUPABASE) return mem.insertScan(scanData);

  const db = getClient(true);
  const { data, error } = await db
    .from("scans")
    .insert(scanData)
    .select()
    .single();

  if (error) throw new Error(`DB insert error: ${error.message}`);
  return data;
}

export async function listScans({ userId, scanType, limit = 50, offset = 0 } = {}) {
  if (!USE_SUPABASE) return mem.getScans({ userId, type: scanType, limit, offset });

  const db = getClient();
  let query = db
    .from("scans")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (userId) query = query.eq("user_id", userId);
  if (scanType) query = query.eq("scan_type", scanType);

  const { data, error, count } = await query;
  if (error) throw new Error(`DB fetch error: ${error.message}`);
  return { data, count };
}

export async function getScan(id) {
  if (!USE_SUPABASE) return mem.getScanById(id);

  const db = getClient();
  const { data, error } = await db.from("scans").select("*").eq("id", id).single();
  if (error) return null;
  return data;
}

export async function removeScan(id) {
  if (!USE_SUPABASE) return mem.deleteScan(id);

  const db = getClient(true);
  const { error } = await db.from("scans").delete().eq("id", id);
  if (error) throw new Error(`DB delete error: ${error.message}`);
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export async function getAnalyticsSummary(userId) {
  if (!USE_SUPABASE) return mem.getAnalyticsSummary();

  const db = getClient();
  let query = db.from("scans").select("scan_type, risk_level, created_at");
  if (userId) query = query.eq("user_id", userId);

  const { data, error } = await query;
  if (error) throw new Error(`DB analytics error: ${error.message}`);

  const total = data.length;
  const threats = data.filter((s) => s.risk_level === "high").length;
  const suspicious = data.filter((s) => s.risk_level === "medium").length;
  const safe = data.filter((s) => s.risk_level === "low").length;

  const byType = {};
  for (const s of data) {
    byType[s.scan_type] = (byType[s.scan_type] || 0) + 1;
  }

  // Weekly trend: last 7 days
  const trend = buildWeeklyTrend(data);

  return { total, threats, suspicious, safe, byType, trend };
}

function buildWeeklyTrend(scans) {
  const days = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    days[key] = { date: key, total: 0, threats: 0 };
  }
  for (const s of scans) {
    const key = s.created_at?.split("T")[0];
    if (days[key]) {
      days[key].total++;
      if (s.risk_level === "high") days[key].threats++;
    }
  }
  return Object.values(days);
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export async function getUserSettings(userId = "local") {
  if (!USE_SUPABASE) return mem.getSettings(userId);

  const db = getClient();
  const { data, error } = await db
    .from("user_settings")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data) return mem.getSettings(userId); // fallback to defaults
  return data;
}

export async function saveUserSettings(userId = "local", settings) {
  if (!USE_SUPABASE) return mem.upsertSettings(userId, settings);

  const db = getClient(true);
  const { data, error } = await db
    .from("user_settings")
    .upsert({ user_id: userId, ...settings, updated_at: new Date().toISOString() })
    .select()
    .single();

  if (error) throw new Error(`DB settings error: ${error.message}`);
  return data;
}

// ─── Threat Intelligence ─────────────────────────────────────────────────────

export async function getThreatIntelligence() {
  if (!USE_SUPABASE) return getDefaultThreatIntel();

  const db = getClient();
  const { data, error } = await db
    .from("threat_intelligence")
    .select("*")
    .order("severity", { ascending: false });

  if (error || !data?.length) return getDefaultThreatIntel();
  return data;
}

function getDefaultThreatIntel() {
  return {
    keywords: [
      { text: "OTP", risk: "high" },
      { text: "KYC update required", risk: "high" },
      { text: "Account blocked", risk: "high" },
      { text: "Claim prize", risk: "high" },
      { text: "Lottery winner", risk: "high" },
      { text: "Verify Aadhaar", risk: "high" },
      { text: "Refund approved", risk: "high" },
      { text: "Click immediately", risk: "high" },
      { text: "Urgent action", risk: "high" },
      { text: "Limited offer", risk: "medium" },
      { text: "Congratulations", risk: "medium" },
      { text: "Free gift", risk: "medium" },
    ],
    suspicious_domains: [
      { domain: "*.xyz with bank names", risk: "high" },
      { domain: "bit.ly / tinyurl.com", risk: "medium" },
      { domain: "sbi-kyc-update.com", risk: "high" },
      { domain: "hdfc-refund.net", risk: "high" },
    ],
    safe_patterns: [
      { pattern: "Official .gov.in domains", note: "Verified government" },
      { pattern: "HTTPS with valid cert", note: "Encrypted connection" },
      { pattern: "Known bank SMS headers (VM-HDFCBK)", note: "Verified sender" },
    ],
    common_scam_types: [
      "KYC/Aadhaar update scam",
      "OTP phishing",
      "Fake lottery / reward",
      "Bank impersonation",
      "Job offer fraud",
      "Investment scam (doubling money)",
      "Tech support scam",
      "UPI fraud",
    ],
  };
}
