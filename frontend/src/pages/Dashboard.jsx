import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ArrowRight, Image, Link2, Mail, MessageSquareText, ShieldCheck,
  TriangleAlert, FileText, Download,
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { api } from "../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    api.getAnalytics().then((r) => setAnalytics(r.data)).catch(() => {});
    api.getHistory({ limit: 5 }).then((r) => setRecentScans(r.data || [])).catch(() => {});
    api.getReports().then((r) => setReports((r.data || []).slice(0, 3))).catch(() => {});
  }, []);

  const riskColor = (level) =>
    level === "high" ? "bg-red-500/20 text-red-300" : level === "medium" ? "bg-amber-500/20 text-amber-300" : "bg-green-500/20 text-green-300";

  return (
    <MainLayout>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* Hero */}
          <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/40 p-8 shadow-2xl shadow-blue-950/20">
            <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-center">
              <div>
                <h1 className="max-w-xl text-4xl font-bold leading-tight text-white">
                  Protect yourself from <span className="text-blue-400">digital fraud.</span>
                </h1>
                <p className="mt-4 max-w-lg text-slate-400">
                  AI analyzes suspicious messages, URLs and screenshots in seconds to detect scams, phishing and fraud signals.
                </p>
                <div className="mt-7 flex flex-wrap gap-4">
                  <button onClick={() => navigate("/message-analyzer")} className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500">
                    Analyze Now <ArrowRight size={17} />
                  </button>
                  <button onClick={() => navigate("/reports")} className="rounded-xl border border-slate-700 bg-slate-950/60 px-5 py-3 text-sm font-semibold text-white transition hover:border-blue-500/60">
                    View Reports
                  </button>
                </div>
              </div>
              <div className="hidden justify-center lg:flex">
                <div className="relative flex h-64 w-64 items-center justify-center rounded-full bg-blue-500/10 shadow-[0_0_80px_rgba(59,130,246,0.35)]">
                  <div className="absolute h-72 w-72 rounded-full border border-blue-500/20" />
                  <div className="absolute h-56 w-56 rounded-full border border-cyan-400/20" />
                  <ShieldCheck size={150} className="text-blue-400" />
                </div>
              </div>
            </div>
          </section>

          {/* Feature Cards */}
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <FeatureCard icon={<MessageSquareText />} title="Analyze Message" description="Paste SMS, WhatsApp or email to check for scams" color="blue" path="/message-analyzer" />
            <FeatureCard icon={<Link2 />} title="Check URL" description="Detect phishing links and malicious websites" color="cyan" path="/url-scanner" />
            <FeatureCard icon={<Image />} title="Upload Screenshot" description="Find hidden threats in screenshots or images" color="amber" path="/screenshot-scanner" />
            <FeatureCard icon={<Mail />} title="Scan Email" description="Analyze email headers and content for threats" color="purple" path="/email-scanner" />
          </section>

          {/* Latest Analysis + Red Flags */}
          <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl shadow-black/20">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Latest Analysis Result</h2>
                <span className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-medium text-green-400">Completed</span>
              </div>
              <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
                <div className="flex flex-col items-center justify-center">
                  <div className="relative flex h-44 w-44 items-center justify-center rounded-full border-[12px] border-red-500/80 border-l-green-500 border-t-yellow-400 bg-slate-900">
                    <div className="text-center">
                      <p className="text-5xl font-bold text-red-500">85</p>
                      <p className="text-sm text-slate-400">/100</p>
                    </div>
                  </div>
                  <p className="mt-5 text-xl font-bold text-red-500">High Risk</p>
                </div>
                <div className="space-y-4">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                    <h3 className="font-semibold text-white">Threat Summary</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">This message contains multiple red flags commonly used in scams and phishing attempts.</p>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <SummaryBox title="Risk Level" value="High Risk" danger />
                      <SummaryBox title="Confidence" value="98%" success />
                      <SummaryBox title="Analysis Time" value="1.8s" />
                      <SummaryBox title="AI Model" value="Claude AI" />
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                    <h3 className="font-semibold text-white">Recommended Action</h3>
                    <ul className="mt-3 space-y-2 text-sm text-slate-300">
                      <li>❌ Do NOT click on any links</li>
                      <li>⚠️ Do NOT share OTP or personal information</li>
                      <li>🚫 Block this sender immediately</li>
                      <li>✅ Report the incident on the official cybercrime portal</li>
                    </ul>
                    <button onClick={() => window.open("https://cybercrime.gov.in/", "_blank")} className="mt-5 w-full rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/20">
                      Report to Cybercrime Portal
                    </button>
                    <p className="mt-3 text-xs text-slate-500">For financial cyber fraud, users may also call 1930 immediately.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl shadow-black/20">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-red-400">Red Flags Detected</h2>
                <span className="rounded-lg bg-red-500/20 px-2 py-1 text-xs text-red-300">5</span>
              </div>
              <div className="space-y-4">
                <RedFlag title="Urgency / Pressure" score="98%" />
                <RedFlag title="OTP / Sensitive Info" score="97%" />
                <RedFlag title="Impersonation" score="94%" />
                <RedFlag title="Suspicious Link" score="92%" />
                <RedFlag title="Grammar / Spelling" score="78%" />
              </div>
              <button onClick={() => navigate("/history")} className="mt-5 flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300">
                View Full Report <ArrowRight size={16} />
              </button>
            </div>
          </section>

          {/* Charts */}
          <section className="grid gap-6 xl:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
              <h2 className="mb-5 text-lg font-semibold text-white">Threat Trend <span className="text-sm font-normal text-slate-400">This Week</span></h2>
              <div className="flex h-44 items-end gap-3">
                {[25, 45, 38, 70, 58, 82, 50, 65, 85].map((h, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-2">
                    <div className="w-full rounded-t-md bg-blue-500/80" style={{ height: `${h}%` }} />
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
              <h2 className="mb-5 text-lg font-semibold text-white">Threat Categories</h2>
              <div className="flex items-center gap-6">
                <div className="h-32 w-32 rounded-full border-[18px] border-blue-500 border-b-yellow-400 border-l-green-400 border-r-indigo-500" />
                <div className="space-y-3 text-sm">
                  <Legend color="bg-blue-500" label="Phishing" value="42%" />
                  <Legend color="bg-yellow-400" label="Scam Messages" value="28%" />
                  <Legend color="bg-indigo-500" label="Malicious URLs" value="18%" />
                  <Legend color="bg-slate-500" label="Other Threats" value="12%" />
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
              <h2 className="mb-5 text-lg font-semibold text-white">Safe vs Scam</h2>
              <div className="flex items-center gap-6">
                <div className="h-32 w-32 rounded-full border-[18px] border-green-500 border-r-red-500" />
                <div>
                  <p className="text-green-400">Safe</p>
                  <p className="text-3xl font-bold text-white">{analytics ? `${100 - (analytics.threat_detection_rate || 38)}%` : "62%"}</p>
                  <p className="mt-4 text-red-400">Scam</p>
                  <p className="text-3xl font-bold text-red-400">{analytics ? `${analytics.threat_detection_rate || 38}%` : "38%"}</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Recent Scans</h2>
              <button onClick={() => navigate("/history")} className="text-sm text-blue-400">View All</button>
            </div>
            <div className="space-y-4">
              {recentScans.length > 0 ? recentScans.map((s) => (
                <RecentScan key={s.id} title={s.input_preview || s.scan_type} type={s.scan_type + " scan"} score={s.risk_score} level={s.risk_level} />
              )) : (
                <>
                  <RecentScan title="+91 98765 43210" type="SMS Message" score={85} level="high" />
                  <RecentScan title="bit.ly/claim-prize" type="URL Scan" score={72} level="high" />
                  <RecentScan title="Screenshot_2024..." type="Image Scan" score={45} level="medium" />
                  <RecentScan title="Refund_OTP@mail..." type="Email Scan" score={38} level="medium" />
                  <RecentScan title="+91 91234 56789" type="SMS Message" score={15} level="low" />
                </>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
            <h2 className="text-lg font-semibold text-white">Safety Score <span className="font-normal text-slate-400">Today</span></h2>
            <div className="mt-8 flex flex-col items-center">
              <div className="relative flex h-44 w-44 items-center justify-center rounded-full border-[16px] border-green-500 border-l-yellow-400 border-t-yellow-300 bg-slate-900">
                <div className="text-center">
                  <p className="text-5xl font-bold text-white">{analytics?.safety_score || 78}</p>
                  <p className="text-sm text-slate-400">/100</p>
                </div>
              </div>
              <p className="mt-4 font-semibold text-green-400">Good</p>
              <p className="mt-2 text-sm text-green-400">▲ 12% from yesterday</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
            <h2 className="mb-5 text-lg font-semibold text-white">Live Threat Map</h2>
            <div className="flex h-44 items-center justify-center rounded-xl border border-slate-800 bg-blue-950/20">
              <p className="text-sm text-slate-400">Global threat activity map</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Recent Reports</h2>
              <button onClick={() => navigate("/reports")} className="text-sm text-blue-400">View All</button>
            </div>
            <div className="space-y-4">
              {reports.length > 0 ? reports.map((r) => (
                <Report key={r.id} title={r.title} size="PDF" onDownload={() => api.downloadReport(r.id)} />
              )) : (
                <>
                  <Report title="Report_2024_05_25.pdf" size="2.4 MB" />
                  <Report title="Report_2024_05_24.pdf" size="2.1 MB" />
                  <Report title="Report_2024_05_23.pdf" size="1.8 MB" />
                </>
              )}
            </div>
          </div>
        </aside>
      </div>
    </MainLayout>
  );
}

function FeatureCard({ icon, title, description, color, path }) {
  const colors = {
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  };
  return (
    <Link to={path} className="group block rounded-2xl border border-slate-800 bg-slate-950/80 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:bg-slate-900/80 hover:shadow-xl hover:shadow-blue-500/10">
      <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl border ${colors[color]}`}>{icon}</div>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{description}</p>
      <div className="mt-5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
        <ArrowRight size={16} />
      </div>
    </Link>
  );
}

function SummaryBox({ title, value, danger, success }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
      <p className="text-xs text-slate-500">{title}</p>
      <p className={`mt-1 text-sm font-semibold ${danger ? "text-red-400" : success ? "text-green-400" : "text-blue-400"}`}>{value}</p>
    </div>
  );
}

function RedFlag({ title, score }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/15 text-red-400">
          <TriangleAlert size={16} />
        </div>
        <div>
          <p className="text-sm font-semibold text-red-400">{title}</p>
          <p className="text-xs text-slate-400">Fraud signal detected</p>
        </div>
      </div>
      <span className="rounded-md bg-red-500/15 px-2 py-1 text-xs text-red-300">{score}</span>
    </div>
  );
}

function RecentScan({ title, type, score, level }) {
  const cls = level === "high" ? "bg-red-500/20 text-red-300" : level === "medium" ? "bg-amber-500/20 text-amber-300" : "bg-green-500/20 text-green-300";
  return (
    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
      <div>
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xs text-slate-400">{type}</p>
      </div>
      <span className={`rounded-md px-2 py-1 text-xs font-semibold ${cls}`}>{score}</span>
    </div>
  );
}

function Legend({ color, label, value }) {
  return (
    <div className="flex items-center justify-between gap-8">
      <div className="flex items-center gap-2"><span className={`h-3 w-3 rounded-full ${color}`} /><span className="text-slate-300">{label}</span></div>
      <span className="text-white">{value}</span>
    </div>
  );
}

function Report({ title, size, onDownload }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <FileText size={20} className="text-slate-400" />
        <div>
          <p className="text-sm text-white">{title}</p>
          <p className="text-xs text-slate-400">{size} · PDF</p>
        </div>
      </div>
      <button onClick={onDownload} className="text-blue-400 hover:text-blue-300"><Download size={18} /></button>
    </div>
  );
}

export default Dashboard;
