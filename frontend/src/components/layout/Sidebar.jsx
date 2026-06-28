import { useState } from "react";
import {
  ShieldCheck, LayoutDashboard, MessageSquareText, Link2, Image, Mail,
  ShieldAlert, FileText, History, BarChart3, Settings, ChevronDown, Circle,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Analyze Message", path: "/message-analyzer", icon: MessageSquareText },
  { label: "URL Scanner", path: "/url-scanner", icon: Link2 },
  { label: "Screenshot Scanner", path: "/screenshot-scanner", icon: Image },
  { label: "Email Scanner", path: "/email-scanner", icon: Mail },
  { label: "Threat Intelligence", path: "/threat-intelligence", icon: ShieldAlert },
  { label: "Reports", path: "/reports", icon: FileText },
  { label: "History", path: "/history", icon: History },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
  { label: "Settings", path: "/settings", icon: Settings },
];

function Sidebar() {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-dvh w-72 flex-col overflow-hidden border-r border-slate-800/80 bg-[#020817] px-5 py-4 text-white shadow-2xl shadow-blue-950/20">
      <div className="shrink-0">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-500/40 bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-500/20">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">CyberShield AI</h1>
            <p className="text-xs text-slate-400">Scam & Phishing Detection</p>
          </div>
        </div>
      </div>

      <nav className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1 sidebar-scroll">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                [
                  "group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "border border-blue-500/40 bg-blue-600/20 text-white shadow-lg shadow-blue-500/10"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white",
                ].join(" ")
              }
            >
              <Icon size={19} className="shrink-0 text-blue-400 transition-transform duration-200 group-hover:scale-110" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="relative mt-4 shrink-0 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg shadow-black/20">
        {profileOpen && (
          <div className="absolute bottom-full left-0 mb-3 w-full rounded-xl border border-slate-800 bg-slate-950 p-3 shadow-2xl shadow-black/40">
            <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-800">View Profile</button>
            <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-800">Project Details</button>
            <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-blue-400 hover:bg-blue-500/10">CyberShield Workspace</button>
          </div>
        )}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-sm font-bold text-slate-950">
            TM
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-white">Deep Logic</h3>
            <p className="truncate text-xs text-slate-400">Project Lead</p>
          </div>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-950/70 text-slate-400 transition hover:border-blue-500/50 hover:text-white"
          >
            <ChevronDown size={15} />
          </button>
        </div>
        <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Circle size={8} className="fill-green-400 text-green-400" />
            <span>Online</span>
          </div>
          <span className="text-xs text-green-400">Active</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
