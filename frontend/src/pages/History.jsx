import { useState, useEffect } from "react";
import { Trash2, Loader2, RefreshCw, Filter } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { api } from "../services/api";

const TYPES = ["all", "message", "url", "email", "screenshot"];

function History() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const res = await api.getHistory({ type: filter === "all" ? undefined : filter });
      setScans(res.data || []);
    } catch (e) {
      setError("Failed to load history.");
      // Demo fallback
      setScans([
        { id: "1", input_preview: "Fake SBI KYC SMS", scan_type: "message", risk_level: "high", risk_score: 92, created_at: new Date().toISOString() },
        { id: "2", input_preview: "bit.ly/claim-prize", scan_type: "url", risk_level: "high", risk_score: 78, created_at: new Date().toISOString() },
        { id: "3", input_preview: "WhatsApp Screenshot", scan_type: "screenshot", risk_level: "high", risk_score: 85, created_at: new Date().toISOString() },
        { id: "4", input_preview: "Refund Email", scan_type: "email", risk_level: "medium", risk_score: 55, created_at: new Date().toISOString() },
        { id: "5", input_preview: "Normal Bank Alert", scan_type: "message", risk_level: "low", risk_score: 12, created_at: new Date().toISOString() },
      ]);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filter]);

  const deleteScan = async (id) => {
    try {
      await api.deleteHistory(id);
      setScans((s) => s.filter((x) => x.id !== id));
    } catch {}
  };

  const riskBadge = (level) =>
    level === "high" ? "bg-red-500/20 text-red-300" : level === "medium" ? "bg-amber-500/20 text-amber-300" : "bg-green-500/20 text-green-300";

  const riskLabel = (level) => level === "high" ? "High Risk" : level === "medium" ? "Suspicious" : "Safe";

  const typeLabel = (t) => ({ message: "Message Scan", url: "URL Scan", email: "Email Scan", screenshot: "Image Scan" }[t] || t);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Scan History</h1>
            <p className="mt-2 text-slate-400">Review previous message, URL, screenshot, and email scans.</p>
          </div>
          <button onClick={load} className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-blue-500/50 hover:text-white transition">
            <RefreshCw size={15} /> Refresh
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={16} className="text-slate-400" />
          {TYPES.map((t) => (
            <button key={t} onClick={() => setFilter(t)} className={`rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition ${filter === t ? "bg-blue-600 text-white" : "border border-slate-700 text-slate-400 hover:text-white"}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-3 text-slate-400">
              <Loader2 size={24} className="animate-spin" /> Loading history...
            </div>
          ) : scans.length === 0 ? (
            <div className="py-16 text-center text-slate-500">No scans found. Start by analyzing a message or URL.</div>
          ) : (
            <div className="space-y-3">
              {scans.map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-slate-700 transition">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{s.input_preview || s.scan_type}</h3>
                    <p className="text-sm text-slate-400">{typeLabel(s.scan_type)} · {new Date(s.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span className={`rounded-md px-2 py-1 text-xs font-semibold ${riskBadge(s.risk_level)}`}>{riskLabel(s.risk_level)}</span>
                    <span className="text-sm text-slate-400">{s.risk_score}/100</span>
                    <button onClick={() => deleteScan(s.id)} className="text-slate-600 hover:text-red-400 transition">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {error && !loading && <p className="mt-4 text-xs text-amber-400">{error} Showing demo data.</p>}
        </div>
      </div>
    </MainLayout>
  );
}

export default History;
