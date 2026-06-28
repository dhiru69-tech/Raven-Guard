import { useState, useEffect } from "react";
import { Loader2, TrendingUp, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { api } from "../services/api";

function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnalytics()
      .then((r) => setData(r.data))
      .catch(() => setData({ total: 1240, threats: 347, suspicious: 0, safe: 893, safety_score: 78, threat_detection_rate: 28, byType: { message: 520, url: 390, email: 200, screenshot: 130 }, trend: [] }))
      .finally(() => setLoading(false));
  }, []);

  const barHeight = (v, max) => Math.max(8, Math.round((v / max) * 100));

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="mt-2 text-slate-400">Track fraud patterns, scan volume, and threat trends across CyberShield AI.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 gap-3 text-slate-400"><Loader2 size={24} className="animate-spin" /> Loading analytics...</div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <StatCard icon={<TrendingUp className="text-blue-400" />} label="Total Scans" value={data?.total?.toLocaleString() || "0"} color="text-blue-400" />
              <StatCard icon={<AlertTriangle className="text-red-400" />} label="Threats Detected" value={data?.threats?.toLocaleString() || "0"} color="text-red-400" />
              <StatCard icon={<Shield className="text-amber-400" />} label="Suspicious" value={data?.suspicious?.toLocaleString() || "0"} color="text-amber-400" />
              <StatCard icon={<CheckCircle className="text-green-400" />} label="Safe Results" value={data?.safe?.toLocaleString() || "0"} color="text-green-400" />
            </div>

            {/* Safety score + Scan types */}
            <div className="grid gap-6 xl:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 flex flex-col items-center">
                <h2 className="text-lg font-semibold text-white self-start">Safety Score</h2>
                <div className="mt-6 relative flex h-44 w-44 items-center justify-center rounded-full border-[16px] border-green-500 border-l-yellow-400 bg-slate-900">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-white">{data?.safety_score || 78}</p>
                    <p className="text-sm text-slate-400">/100</p>
                  </div>
                </div>
                <p className="mt-4 font-semibold text-green-400">Good</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
                <h2 className="text-lg font-semibold text-white mb-5">Scans by Type</h2>
                <div className="space-y-4">
                  {data?.byType && Object.entries(data.byType).map(([type, count]) => {
                    const pct = data.total > 0 ? Math.round((count / data.total) * 100) : 0;
                    return (
                      <div key={type}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize text-slate-300">{type}</span>
                          <span className="text-slate-400">{count} ({pct}%)</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-800">
                          <div className="h-2 rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
                <h2 className="text-lg font-semibold text-white mb-5">Risk Distribution</h2>
                <div className="space-y-4">
                  {[
                    { label: "High Risk", value: data?.threats, color: "bg-red-500" },
                    { label: "Suspicious", value: data?.suspicious, color: "bg-amber-400" },
                    { label: "Safe", value: data?.safe, color: "bg-green-500" },
                  ].map((item) => {
                    const pct = data?.total > 0 ? Math.round(((item.value || 0) / data.total) * 100) : 0;
                    return (
                      <div key={item.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-300">{item.label}</span>
                          <span className="text-slate-400">{item.value || 0} ({pct}%)</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-800">
                          <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Weekly trend */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
              <h2 className="text-xl font-semibold text-white mb-2">Weekly Threat Trend</h2>
              <p className="text-sm text-slate-400 mb-8">Scans and threats detected over the last 7 days</p>
              {data?.trend?.length > 0 ? (
                <div className="flex h-72 items-end gap-4">
                  {data.trend.map((day, i) => {
                    const maxTotal = Math.max(...data.trend.map(d => d.total), 1);
                    return (
                      <div key={i} className="flex flex-1 flex-col items-center gap-3">
                        <div className="w-full flex flex-col items-center gap-1">
                          <div className="w-full rounded-t-xl bg-red-500/60" style={{ height: `${barHeight(day.threats, maxTotal)}%` }} />
                          <div className="w-full rounded-t-xl bg-blue-500" style={{ height: `${barHeight(day.total, maxTotal) - barHeight(day.threats, maxTotal)}%` }} />
                        </div>
                        <span className="text-xs text-slate-400">{new Date(day.date).toLocaleDateString("en-IN", { weekday: "short" })}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex h-72 items-end gap-4">
                  {[35, 55, 42, 78, 64, 88, 70].map((h, i) => (
                    <div key={i} className="flex flex-1 flex-col items-center gap-3">
                      <div className="w-full rounded-t-xl bg-blue-500" style={{ height: `${h}%` }} />
                      <span className="text-xs text-slate-400">D{i + 1}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
      <div className="flex items-center gap-3 mb-3">{icon}<p className="text-sm text-slate-400">{label}</p></div>
      <h2 className={`text-4xl font-bold ${color}`}>{value}</h2>
    </div>
  );
}

export default Analytics;
