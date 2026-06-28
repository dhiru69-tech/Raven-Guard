import { useState, useEffect } from "react";
import { Loader2, Save, CheckCircle } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { api } from "../services/api";

const DEFAULTS = {
  ai_analysis: true, url_safety_check: true, save_history: true, generate_reports: true,
  high_risk_alerts: true, suspicious_url_alerts: true, weekly_summary: false, report_reminder: false,
};

function Settings() {
  const [settings, setSettings] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getSettings()
      .then((r) => setSettings({ ...DEFAULTS, ...r.data }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggle = (key) => setSettings((s) => ({ ...s, [key]: !s[key] }));

  const save = async () => {
    setSaving(true); setSaved(false);
    try {
      await api.updateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {}
    finally { setSaving(false); }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="mt-2 text-slate-400">Manage CyberShield AI preferences for scanning, reports, and alerts.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-slate-400"><Loader2 size={22} className="animate-spin" /> Loading settings...</div>
        ) : (
          <>
            <div className="grid gap-6 xl:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
                <h2 className="text-xl font-semibold text-white">Scan Preferences</h2>
                <div className="mt-5 space-y-4">
                  <SettingItem title="Enable AI Analysis" description="Use Claude AI for deep threat analysis" value={settings.ai_analysis} onToggle={() => toggle("ai_analysis")} />
                  <SettingItem title="Enable URL Safety Check" description="Automatically validate URLs" value={settings.url_safety_check} onToggle={() => toggle("url_safety_check")} />
                  <SettingItem title="Save Scan History" description="Store scan results for later review" value={settings.save_history} onToggle={() => toggle("save_history")} />
                  <SettingItem title="Generate PDF Reports" description="Auto-generate reports after each scan" value={settings.generate_reports} onToggle={() => toggle("generate_reports")} />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
                <h2 className="text-xl font-semibold text-white">Alert Preferences</h2>
                <div className="mt-5 space-y-4">
                  <SettingItem title="High Risk Alerts" description="Get notified when high-risk content is found" value={settings.high_risk_alerts} onToggle={() => toggle("high_risk_alerts")} />
                  <SettingItem title="Suspicious URL Alerts" description="Alert when suspicious URLs are detected" value={settings.suspicious_url_alerts} onToggle={() => toggle("suspicious_url_alerts")} />
                  <SettingItem title="Weekly Safety Summary" description="Receive a weekly threat summary" value={settings.weekly_summary} onToggle={() => toggle("weekly_summary")} />
                  <SettingItem title="Report Download Reminder" description="Remind to download pending reports" value={settings.report_reminder} onToggle={() => toggle("report_reminder")} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button onClick={save} disabled={saving} className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60 transition">
                {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Settings</>}
              </button>
              {saved && (
                <div className="flex items-center gap-2 text-sm text-green-400">
                  <CheckCircle size={16} /> Settings saved successfully
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}

function SettingItem({ title, description, value, onToggle }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <div>
        <span className="text-slate-300 font-medium">{title}</span>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={onToggle}
        className={`relative h-6 w-11 rounded-full p-0.5 transition-colors duration-200 ${value ? "bg-blue-600" : "bg-slate-700"}`}
      >
        <span className={`block h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${value ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  );
}

export default Settings;
