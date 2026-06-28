import { useState, useRef } from "react";
import { Upload, Image, TriangleAlert, CheckCircle2, ArrowRight, Loader2, X } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { api } from "../services/api";

function ScreenshotScanner() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleFile = (f) => {
    if (!f || !f.type.startsWith("image/")) { setError("Please upload an image file."); return; }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null); setError("");
  };

  const scan = async () => {
    if (!file) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await api.scanScreenshot(file);
      if (!res.success) throw new Error(res.error);
      setResult(res.result);
    } catch (e) {
      setError(e.message || "Scan failed. Is the backend running?");
    } finally { setLoading(false); }
  };

  const clear = () => { setFile(null); setPreview(null); setResult(null); setError(""); };
  const riskColor = result?.risk_level === "high" ? "text-red-500" : result?.risk_level === "medium" ? "text-amber-400" : "text-green-400";

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Screenshot Scanner</h1>
          <p className="mt-2 text-slate-400">Upload a screenshot of a suspicious message, payment alert, or chat to detect fraud signals.</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-8">
          {!preview ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
              className={`flex min-h-72 flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition ${dragging ? "border-blue-500 bg-blue-500/10" : "border-blue-500/40 bg-blue-500/5"}`}
            >
              <Image size={40} className="text-blue-400 mb-4" />
              <h2 className="text-xl font-semibold text-blue-400">Upload Screenshot</h2>
              <p className="mt-2 max-w-md text-sm text-slate-400">Drag and drop an image here, or choose a screenshot from your device. Supports JPEG, PNG, WebP, GIF.</p>
              <button onClick={() => inputRef.current.click()} className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition">
                Choose File
              </button>
              <input ref={inputRef} type="file" accept="image/*" onChange={(e) => handleFile(e.target.files[0])} className="hidden" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img src={preview} alt="Preview" className="max-h-96 w-full rounded-xl object-contain border border-slate-800" />
                <button onClick={clear} className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/90 text-slate-400 hover:text-white">
                  <X size={16} />
                </button>
              </div>
              <p className="text-sm text-slate-400">{file.name} · {(file.size / 1024).toFixed(1)} KB</p>
              <div className="flex items-center gap-3">
                <button onClick={scan} disabled={loading} className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50 transition">
                  {loading ? <><Loader2 size={16} className="animate-spin" /> Analyzing...</> : <><Upload size={16} /> Scan Screenshot</>}
                </button>
                <button onClick={clear} className="text-sm text-slate-400 hover:text-white">Remove</button>
              </div>
              {error && <p className="text-sm text-red-400">⚠ {error}</p>}
            </div>
          )}
        </div>

        {result && (
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Analysis Result</h2>
              <p className={`text-5xl font-bold ${riskColor}`}>{result.risk_score} / 100</p>
              <p className={`mt-2 font-semibold ${riskColor}`}>{result.verdict}</p>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">{result.summary}</p>
              {result.note && <p className="mt-3 text-xs text-amber-400 italic">{result.note}</p>}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-slate-800 bg-slate-900 p-3"><p className="text-xs text-slate-500">Confidence</p><p className="mt-1 text-sm font-semibold text-blue-400">{result.confidence}%</p></div>
                <div className="rounded-lg border border-slate-800 bg-slate-900 p-3"><p className="text-xs text-slate-500">Category</p><p className="mt-1 text-sm font-semibold text-blue-400 capitalize">{result.categories?.[0] || "—"}</p></div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 space-y-4">
              {result.red_flags?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-white mb-3">Red Flags ({result.red_flags.length})</h3>
                  <ul className="space-y-2">
                    {result.red_flags.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-red-400"><TriangleAlert size={15} className="mt-0.5 shrink-0" /><span>{f.title}</span></li>
                    ))}
                  </ul>
                </div>
              )}
              {result.recommended_actions?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-white mb-3">Recommended Actions</h3>
                  <ul className="space-y-2">
                    {result.recommended_actions.map((a, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300"><ArrowRight size={13} className="mt-0.5 shrink-0 text-blue-400" />{a}</li>
                    ))}
                  </ul>
                </div>
              )}
              {result.report_to_cybercrime && (
                <button onClick={() => window.open("https://cybercrime.gov.in/", "_blank")} className="w-full rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-500 transition">
                  🚨 Report to Cybercrime Portal
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default ScreenshotScanner;
