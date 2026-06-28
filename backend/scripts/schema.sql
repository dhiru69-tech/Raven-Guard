-- =====================================================================
-- Raven Guard — Supabase Database Schema
-- Run this entire file in: Supabase Dashboard → SQL Editor → New Query
-- =====================================================================

-- ─── Enable UUID extension ────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Scans table ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS scans (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  scan_type     TEXT NOT NULL CHECK (scan_type IN ('message', 'url', 'email', 'screenshot')),
  input_preview TEXT,
  risk_score    INTEGER NOT NULL CHECK (risk_score BETWEEN 0 AND 100),
  risk_level    TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
  verdict       TEXT,
  confidence    INTEGER CHECK (confidence BETWEEN 0 AND 100),
  analysis_time_ms INTEGER,
  result_json   JSONB
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS scans_created_at_idx  ON scans (created_at DESC);
CREATE INDEX IF NOT EXISTS scans_user_id_idx     ON scans (user_id);
CREATE INDEX IF NOT EXISTS scans_scan_type_idx   ON scans (scan_type);
CREATE INDEX IF NOT EXISTS scans_risk_level_idx  ON scans (risk_level);

-- ─── User settings table ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_settings (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  ai_analysis          BOOLEAN DEFAULT TRUE,
  url_safety_check     BOOLEAN DEFAULT TRUE,
  save_history         BOOLEAN DEFAULT TRUE,
  generate_reports     BOOLEAN DEFAULT TRUE,
  high_risk_alerts     BOOLEAN DEFAULT TRUE,
  suspicious_url_alerts BOOLEAN DEFAULT TRUE,
  weekly_summary       BOOLEAN DEFAULT FALSE,
  report_reminder      BOOLEAN DEFAULT FALSE,
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Threat intelligence table ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS threat_intelligence (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type        TEXT NOT NULL CHECK (type IN ('keyword', 'domain', 'pattern', 'scam_type')),
  value       TEXT NOT NULL,
  risk        TEXT NOT NULL CHECK (risk IN ('high', 'medium', 'low')),
  description TEXT,
  severity    INTEGER DEFAULT 5 CHECK (severity BETWEEN 1 AND 10),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Seed some threat intelligence
INSERT INTO threat_intelligence (type, value, risk, description, severity) VALUES
  ('keyword', 'OTP',                        'high',   'One-time password request — classic phishing',       9),
  ('keyword', 'KYC update required',        'high',   'KYC impersonation scam',                             9),
  ('keyword', 'Account blocked',            'high',   'Urgency tactic to extract credentials',              9),
  ('keyword', 'Claim your prize',           'high',   'Lottery / reward scam',                              8),
  ('keyword', 'Lottery winner',             'high',   'Advance fee / lottery scam',                         8),
  ('keyword', 'Verify Aadhaar',             'high',   'Aadhaar phishing',                                   9),
  ('keyword', 'Refund approved',            'high',   'Fake refund scam',                                   8),
  ('keyword', 'Urgent action required',     'high',   'Pressure tactic',                                    7),
  ('keyword', 'Limited time offer',         'medium', 'Urgency manipulation',                               5),
  ('keyword', 'Congratulations',            'medium', 'Common in prize / reward scams',                     4),
  ('domain',  'bit.ly',                     'medium', 'URL shortener — masks destination',                  5),
  ('domain',  'tinyurl.com',               'medium', 'URL shortener — masks destination',                  5),
  ('pattern', 'Bank name + .xyz/.net/.org', 'high',   'Fake banking domain pattern',                        9),
  ('scam_type', 'UPI Fraud',               'high',   'Fake UPI payment request',                           9),
  ('scam_type', 'Job offer fraud',         'high',   'Advance fee job scam',                               8)
ON CONFLICT DO NOTHING;

-- ─── Row Level Security ───────────────────────────────────────────────────────

-- Scans: users can only see their own (or anonymous scans where user_id is null)
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "scans_select" ON scans
  FOR SELECT USING (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "scans_insert" ON scans
  FOR INSERT WITH CHECK (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "scans_delete" ON scans
  FOR DELETE USING (user_id IS NULL OR user_id = auth.uid());

-- User settings: users can only access their own settings
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "settings_all" ON user_settings
  FOR ALL USING (user_id = auth.uid());

-- Threat intelligence: public read, no public write
ALTER TABLE threat_intelligence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "threat_intel_read" ON threat_intelligence
  FOR SELECT USING (true);

-- ─── Storage bucket (run in Supabase Dashboard → Storage → New Bucket) ───────
-- Bucket name: raven-guard-uploads
-- Public: false
-- File size limit: 10 MB
-- Allowed MIME types: image/jpeg, image/png, image/webp, image/gif
