import { useEffect, useState } from "react";
import { Search, Bell, Sun, CalendarDays, ChevronDown, Command } from "lucide-react";

function Topbar() {
  const [themeOpen, setThemeOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [theme, setTheme] = useState("Dark");

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const formattedDay = today.toLocaleDateString("en-IN", { weekday: "long" });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-dark", "theme-default", "theme-light");
    root.classList.add(`theme-${theme.toLowerCase()}`);
  }, [theme]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const close = () => { setThemeOpen(false); setNotificationOpen(false); setWorkspaceOpen(false); setCalendarOpen(false); };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const stopProp = (e) => e.stopPropagation();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/70 bg-[#020817]/90 px-8 py-5 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Digital Fraud Monitoring Dashboard</h2>
          <p className="mt-1 text-sm text-slate-400">Here's what's happening with your digital safety today.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden w-96 items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-slate-400 transition-all duration-300 focus-within:border-blue-500 focus-within:shadow-lg focus-within:shadow-blue-500/20 lg:flex">
            <Search size={18} />
            <input type="text" placeholder="Search anything..." className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 outline-none" />
            <div className="flex items-center gap-1 rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-400">
              <Command size={12} /><span>K</span>
            </div>
          </div>

          {/* Notifications */}
          <div className="relative" onClick={stopProp}>
            <button onClick={() => setNotificationOpen(!notificationOpen)} className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/80 text-slate-300 transition hover:border-blue-500/50 hover:text-white hover:shadow-lg hover:shadow-blue-500/20">
              <Bell size={19} />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">3</span>
            </button>
            {notificationOpen && (
              <div className="absolute right-0 top-14 z-50 w-72 rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-2xl shadow-black/40">
                <h3 className="text-sm font-semibold text-white">Notifications</h3>
                <div className="mt-4 space-y-3">
                  <p className="rounded-xl bg-slate-900 p-3 text-sm text-slate-300">High risk SMS detected.</p>
                  <p className="rounded-xl bg-slate-900 p-3 text-sm text-slate-300">Suspicious URL scan completed.</p>
                  <p className="rounded-xl bg-slate-900 p-3 text-sm text-slate-300">New report generated.</p>
                </div>
              </div>
            )}
          </div>

          {/* Theme */}
          <div className="relative" onClick={stopProp}>
            <button onClick={() => setThemeOpen(!themeOpen)} className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/80 text-slate-300 transition hover:border-blue-500/50 hover:text-white hover:shadow-lg hover:shadow-blue-500/20">
              <Sun size={19} />
            </button>
            {themeOpen && (
              <div className="absolute right-0 top-14 z-50 w-44 rounded-2xl border border-slate-800 bg-slate-950 p-3 shadow-2xl shadow-black/40">
                {["Dark", "Default", "Light"].map((item) => (
                  <button key={item} onClick={() => { setTheme(item); setThemeOpen(false); }} className={`w-full rounded-xl px-4 py-2 text-left text-sm transition hover:bg-blue-600/20 ${theme === item ? "text-blue-400" : "text-slate-300"}`}>
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Workspace */}
          <div className="relative hidden xl:block" onClick={stopProp}>
            <button onClick={() => setWorkspaceOpen(!workspaceOpen)} className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2 transition hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">CS</div>
              <div className="text-left">
                <h3 className="text-sm font-semibold text-white">CyberShield AI</h3>
                <p className="text-xs text-slate-400">Live Prototype</p>
              </div>
              <ChevronDown size={16} className="text-slate-400" />
            </button>
            {workspaceOpen && (
              <div className="absolute right-0 top-14 z-50 w-60 rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-2xl shadow-black/40">
                <h3 className="text-sm font-semibold text-white">CyberShield Workspace</h3>
                <p className="mt-1 text-xs text-slate-400">Hackathon MVP Environment</p>
                <div className="mt-4 space-y-2">
                  <button className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-900">Project Overview</button>
                  <button className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-900">Demo Mode</button>
                  <button className="w-full rounded-xl px-3 py-2 text-left text-sm text-blue-400 hover:bg-blue-500/10">View Reports</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
        <div className="relative" onClick={stopProp}>
          <button onClick={() => setCalendarOpen(!calendarOpen)} className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2 text-sm text-slate-300 transition hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20">
            <CalendarDays size={16} className="text-slate-400" />
            <span>{formattedDate}</span>
            <span className="text-slate-500">{formattedDay}</span>
          </button>
          {calendarOpen && (
            <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-2xl shadow-black/40">
              <h3 className="text-sm font-semibold text-white">Date Overview</h3>
              <p className="mt-2 text-sm text-slate-400">Today is {formattedDay}, {formattedDate}.</p>
              <div className="mt-4 space-y-2">
                <button className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-900">Today's Scans</button>
                <button className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-900">Weekly Summary</button>
                <button className="w-full rounded-xl px-3 py-2 text-left text-sm text-blue-400 hover:bg-blue-500/10">View Activity Timeline</button>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2 text-sm">
          <span className="h-2.5 w-2.5 rounded-full bg-green-400 shadow-lg shadow-green-400/50" />
          <span className="text-slate-300">Live Threat Feed</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2 text-sm">
          <span className="h-2.5 w-2.5 rounded-full bg-green-400 shadow-lg shadow-green-400/50" />
          <span className="text-slate-300">System Status</span>
          <span className="text-green-400">All systems operational</span>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
