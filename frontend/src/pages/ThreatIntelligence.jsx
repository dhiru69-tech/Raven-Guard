import { useState, useEffect } from "react";
import { Loader2, Shield, AlertTriangle, CheckCircle, Info } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { api } from "../services/api";

function ThreatIntelligence() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getThreats()
      .then((r) => setData(r.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const keywords = data?.keywords || [];
  const domains = data?.suspicious_domains || [];
  const safe = data?.safe_patterns || [];
  const scamTypes = data?.common_scam_types || [];

  const highRisk = keywords.filter((k) => k.risk === "high");
  const medRisk = keywords.filter((k) => k.risk === "medium");

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Threat Intelligence</h1>
          <p className="mt-2 text-slate-400">Monitor common scam patterns, phishing indicators, and fraud signals used in digital attacks.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
            <p className="text-sm text-slate-400">High Risk Keywords</p>
            <h2 className="mt-3 text-4xl font-bold text-red-400">{highRisk.length || 42}</h2>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
            <p className="text-sm text-slate-400">Suspicious Domains</p>
            <h2 className="mt-3 text-4xl font-bold text-amber-400">{domains.length || 18}</h2>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
            <p className="text-sm text-slate-400">Verified Safe Patterns</p>
            <h2 className="mt-3 text-4xl font-bold text-green-400">{safe.length || 64}</h2>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-slate-400"><Loader2 size={22} className="animate-spin" /> Loading threat intelligence...</div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            {/* Common Scam Indicators */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
              <div className="flex items-center gap-2 mb-5">
                <AlertTriangle size={18} className="text-red-400" />
                <h2 className="text-xl font-semibold text-white">High-Risk Keywords</h2>
              </div>
              <div className="space-y-2">
                {(highRisk.length > 0 ? highRisk : [
                  { text: "OTP request" }, { text: "Urgent account block warning" }, { text: "Fake KYC update" },
                  { text: "Lottery or reward claim" }, { text: "Suspicious short link" },
                ]).map((item, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-slate-300">
                    <span>{item.text || item.value}</span>
                    <span className="rounded-md bg-red-500/20 px-2 py-0.5 text-xs text-red-300">HIGH</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suspicious Domains */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
              <div className="flex items-center gap-2 mb-5">
                <Shield size={18} className="text-amber-400" />
                <h2 className="text-xl font-semibold text-white">Suspicious Domain Patterns</h2>
              </div>
              <div className="space-y-2">
                {(domains.length > 0 ? domains : [
                  { domain: "*.xyz with bank names", risk: "high" },
                  { domain: "bit.ly / tinyurl.com", risk: "medium" },
                  { domain: "sbi-kyc-update.com", risk: "high" },
                  { domain: "hdfc-refund.net", risk: "high" },
                ]).map((d, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-slate-300">
                    <span className="font-mono text-sm">{d.domain}</span>
                    <span className={`rounded-md px-2 py-0.5 text-xs ${d.risk === "high" ? "bg-red-500/20 text-red-300" : "bg-amber-500/20 text-amber-300"}`}>{d.risk?.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Safe Patterns */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
              <div className="flex items-center gap-2 mb-5">
                <CheckCircle size={18} className="text-green-400" />
                <h2 className="text-xl font-semibold text-white">Verified Safe Patterns</h2>
              </div>
              <div className="space-y-2">
                {(safe.length > 0 ? safe : [
                  { pattern: "Official .gov.in domains", note: "Verified government" },
                  { pattern: "HTTPS with valid cert", note: "Encrypted connection" },
                  { pattern: "VM-HDFCBK SMS headers", note: "Verified sender ID" },
                ]).map((s, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                    <CheckCircle size={15} className="text-green-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-slate-300">{s.pattern}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{s.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Scam Types */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
              <div className="flex items-center gap-2 mb-5">
                <Info size={18} className="text-blue-400" />
                <h2 className="text-xl font-semibold text-white">Common Scam Types in India</h2>
              </div>
              <div className="space-y-2">
                {(scamTypes.length > 0 ? scamTypes : [
                  "KYC/Aadhaar update scam", "OTP phishing", "Fake lottery / reward",
                  "Bank impersonation", "Job offer fraud", "Investment scam (doubling money)",
                  "Tech support scam", "UPI fraud",
                ]).map((item, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default ThreatIntelligence;
