import { useState } from "react";
import { TriangleAlert, CheckCircle2, ArrowRight, Loader2, Link2 } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { api } from "../services/api";

function UrlScanner() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const scan = async () => {
    if (!url.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await api.scanUrl(url);
      setResult(res.result);
    } catch (e) {
      setError(e.message || "Scan failed. Is the backend running?");
    } finally { setLoading(false); }
  };

  const riskColor = result?.risk_level === "high" ? "text-red-500" : result?.risk_level === "medium" ? "text-amber-400" : "text-green-400";

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-cyan-400">URL Scanner</h1>
          <p className="mt-2 text-slate-400">Check suspicious links for phishing, fraud, and malicious activity.</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-6">
          <label className="block mb-3 text-lg font-medium text-white">Enter URL</label>
          <div className="flex gap-3">
            <div className="flex flex-1 items-center gap-3 rounded-lg bg-slate-900 border border-slate-700 px-4 focus-within:border-blue-500 transition">
              <Link2 size={18} className="text-slate-500 shrink-0" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && scan()}
                placeholder="https://example.com or paste any suspicious link"
                className="flex-1 bg-transparent py-4 text-white placeholder:text-slate-500 outline-none"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <button onClick={scan} disabled={loading || !url.trim()} className="flex items-center gap-2 px-6 py-3 rounded-lg bg-cyan-500 text-black font-semibold disabled:opacity-50 hover:bg-cyan-400 transition">
              {loading ? <><Loader2 size={18} className="animate-spin" /> Scanning...</> : "Scan URL"}
            </button>
            {url && <button onClick={() => { setUrl(""); setResult(null); setError(""); }} className="text-sm text-slate-400 hover:text-white">Clear</button>}
          </div>
          {error && <p className="mt-3 text-sm text-red-400">⚠ {error}</p>}
        </div>

        {result && (
          <>
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-6">
              <h2 className="text-2xl font-semibold mb-4 text-white">Scan Result</h2>
              <div className={`text-5xl font-bold ${riskColor}`}>{result.risk_score} / 100</div>
              <p className={`mt-2 font-semibold ${riskColor}`}>{result.verdict || result.risk_level?.toUpperCase()}</p>
              <p className="mt-2 text-sm text-slate-400">{result.summary}</p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-slate-800 bg-slate-900 p-3"><p className="text-xs text-slate-500">Confidence</p><p className="mt-1 text-sm font-semibold text-blue-400">{result.confidence}%</p></div>
                <div className="rounded-lg border border-slate-800 bg-slate-900 p-3"><p className="text-xs text-slate-500">Analysis Time</p><p className="mt-1 text-sm font-semibold text-blue-400">{(result.analysis_time_ms / 1000).toFixed(1)}s</p></div>
                <div className="rounded-lg border border-slate-800 bg-slate-900 p-3"><p className="text-xs text-slate-500">Category</p><p className="mt-1 text-sm font-semibold text-blue-400 capitalize">{result.categories?.[0] || "—"}</p></div>
              </div>
            </div>

            {result.red_flags?.length > 0 && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-white">Detected Issues</h2>
                  <span className="rounded-lg bg-red-500/20 px-2 py-1 text-xs text-red-300">{result.red_flags.length}</span>
                </div>
                <ul className="space-y-3">
                  {result.red_flags.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                      <TriangleAlert size={18} className="text-red-400 mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-red-400">{f.title}</p>
                          <span className="rounded bg-red-500/15 px-2 py-0.5 text-xs text-red-300">{f.score}%</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-400">{f.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.safe_signals?.length > 0 && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-6">
                <h2 className="text-2xl font-semibold mb-4 text-white">Safe Signals</h2>
                <ul className="space-y-3">
                  {result.safe_signals.map((s, i) => (
                    <li key={i} className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                      <CheckCircle2 size={18} className="text-green-400 mt-0.5 shrink-0" />
                      <div><p className="text-sm font-semibold text-green-400">{s.title}</p><p className="mt-1 text-xs text-slate-400">{s.description}</p></div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-6">
              <h2 className="text-2xl font-semibold mb-4 text-white">Recommended Action</h2>
              <ul className="space-y-2 text-sm text-slate-300">
                {result.recommended_actions?.map((a, i) => <li key={i} className="flex items-start gap-2"><ArrowRight size={14} className="text-blue-400 mt-0.5 shrink-0" />{a}</li>)}
              </ul>
              {result.report_to_cybercrime && (
                <button onClick={() => window.open("https://cybercrime.gov.in/", "_blank")} className="mt-5 w-full rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500">
                  🚨 Report to Cybercrime Portal
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}

export default UrlScanner;
