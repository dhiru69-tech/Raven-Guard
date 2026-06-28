import { useState, useEffect } from "react";
import { FileText, Download, Loader2, RefreshCw } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { api } from "../services/api";

function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.getReports();
      setReports(res.data || []);
    } catch {
      setReports([
        { id: "demo1", title: "Fake SBI KYC Message", scan_type: "message", risk_level: "high", risk_score: 92, created_at: new Date().toISOString(), download_url: "#" },
        { id: "demo2", title: "Lottery Scam SMS", scan_type: "message", risk_level: "high", risk_score: 88, created_at: new Date(Date.now() - 86400000).toISOString(), download_url: "#" },
        { id: "demo3", title: "Suspicious URL Scan", scan_type: "url", risk_level: "medium", risk_score: 62, created_at: new Date(Date.now() - 172800000).toISOString(), download_url: "#" },
      ]);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDownload = async (id) => {
    setDownloading(id);
    try { api.downloadReport(id); }
    finally { setTimeout(() => setDownloading(null), 2000); }
  };

  const riskBadge = (level) =>
    level === "high" ? "bg-red-500/20 text-red-300" : level === "medium" ? "bg-amber-500/20 text-amber-300" : "bg-green-500/20 text-green-300";

  const riskLabel = (level) => ({ high: "HIGH RISK", medium: "SUSPICIOUS", low: "SAFE" }[level] || level);

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-cyan-400">Reports</h1>
            <p className="mt-2 text-slate-400">View and export previous CyberShield threat analysis reports.</p>
          </div>
          <button onClick={load} className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-blue-500/50 hover:text-white transition">
            <RefreshCw size={15} /> Refresh
          </button>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-6">
          <h2 className="text-2xl font-semibold mb-4 text-white">Recent Reports</h2>
          {loading ? (
            <div className="flex items-center justify-center py-12 gap-3 text-slate-400"><Loader2 size={22} className="animate-spin" /> Loading reports...</div>
          ) : reports.length === 0 ? (
            <div className="py-12 text-center text-slate-500">No reports yet. Run a scan to generate a report.</div>
          ) : (
            <div className="space-y-4">
              {reports.map((r) => (
                <div key={r.id} className="rounded-lg border border-slate-700 bg-slate-900/60 p-5 flex items-center justify-between hover:border-slate-600 transition">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-800">
                      <FileText size={22} className="text-slate-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{r.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {r.scan_type} · {new Date(r.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        {r.risk_score && ` · Score: ${r.risk_score}/100`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`rounded-md px-3 py-1 text-xs font-semibold ${riskBadge(r.risk_level)}`}>{riskLabel(r.risk_level)}</span>
                    <button
                      onClick={() => handleDownload(r.id)}
                      disabled={downloading === r.id || r.id.startsWith("demo")}
                      title={r.id.startsWith("demo") ? "Demo data — connect backend for real reports" : "Download PDF"}
                      className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm text-blue-400 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {downloading === r.id ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
                      PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-6">
          <p className="text-sm text-slate-400 mb-4">Generate a comprehensive PDF report from your most recent scan results.</p>
          <button onClick={load} className="flex items-center gap-2 px-6 py-3 rounded-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition">
            <RefreshCw size={16} /> Refresh Reports
          </button>
        </div>
      </div>
    </MainLayout>
  );
}

export default Reports;
