import { useState } from "react";
import { TriangleAlert, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { api } from "../services/api";

function EmailScanner() {
  const [content, setContent] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const scan = async () => {
    if (!content.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await api.scanEmail(content);
      setResult(res.result);
    } catch (e) {
      setError(e.message || "Scan failed. Is the backend running?");
    } finally { setLoading(false); }
  };

  const riskColor = result?.risk_level === "high" ? "text-red-400" : result?.risk_level === "medium" ? "text-amber-400" : "text-green-400";
  const riskBg = result?.risk_level === "high" ? "border-red-500/30 bg-red-500/10" : result?.risk_level === "medium" ? "border-amber-500/30 bg-amber-500/10" : "border-green-500/30 bg-green-500/10";

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Email Scanner</h1>
          <p className="mt-2 text-slate-400">Analyze suspicious emails for phishing, fake sender identity, malicious links, and fraud intent.</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
            <label className="text-sm font-semibold text-slate-300">Email Content</label>
            <textarea
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste suspicious email content here including subject, sender, and body..."
              className="mt-3 w-full rounded-xl border border-slate-800 bg-slate-900 p-4 text-sm text-white placeholder:text-slate-500 outline-none focus:border-blue-500 transition"
            />
            <div className="mt-4 flex items-center gap-3">
              <button onClick={scan} disabled={loading || !content.trim()} className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50 transition">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Scanning...</> : "Scan Email"}
              </button>
              {content && <button onClick={() => { setContent(""); setResult(null); setError(""); }} className="text-sm text-slate-400 hover:text-white">Clear</button>}
            </div>
            {error && <p className="mt-3 text-sm text-red-400">⚠ {error}</p>}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
            <h2 className="text-xl font-semibold text-white">Email Risk Preview</h2>
            {result ? (
              <>
                <div className={`mt-6 rounded-xl border p-5 ${riskBg}`}>
                  <p className={`text-4xl font-bold ${riskColor}`}>{result.risk_score} / 100</p>
                  <p className={`mt-2 font-semibold ${riskColor}`}>{result.verdict}</p>
                  <p className="mt-2 text-xs text-slate-400">{result.summary}</p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-slate-800 bg-slate-900 p-3"><p className="text-xs text-slate-500">Confidence</p><p className="mt-1 text-sm font-semibold text-blue-400">{result.confidence}%</p></div>
                  <div className="rounded-lg border border-slate-800 bg-slate-900 p-3"><p className="text-xs text-slate-500">Category</p><p className="mt-1 text-sm font-semibold text-blue-400 capitalize">{result.categories?.[0] || "—"}</p></div>
                </div>
                {result.red_flags?.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-slate-300 mb-2">Red Flags ({result.red_flags.length})</p>
                    <ul className="space-y-2">
                      {result.red_flags.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-red-400">
                          <TriangleAlert size={13} />{f.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.recommended_actions?.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-slate-300 mb-2">Actions</p>
                    <ul className="space-y-1">
                      {result.recommended_actions.map((a, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-400"><ArrowRight size={12} className="mt-0.5 shrink-0 text-blue-400" />{a}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.report_to_cybercrime && (
                  <button onClick={() => window.open("https://cybercrime.gov.in/", "_blank")} className="mt-4 w-full rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-500 transition">
                    🚨 Report to Cybercrime Portal
                  </button>
                )}
              </>
            ) : (
              <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-5">
                <p className="text-4xl font-bold text-red-400">— / 100</p>
                <p className="mt-2 font-semibold text-red-300">Awaiting Analysis</p>
                <p className="mt-2 text-xs text-slate-400">Paste email content and click Scan Email</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default EmailScanner;
