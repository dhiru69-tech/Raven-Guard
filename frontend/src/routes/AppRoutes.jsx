import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import MessageAnalyzer from "../pages/MessageAnalyzer";
import UrlScanner from "../pages/UrlScanner";
import EmailScanner from "../pages/EmailScanner";
import ScreenshotScanner from "../pages/ScreenshotScanner";
import ThreatIntelligence from "../pages/ThreatIntelligence";
import Reports from "../pages/Reports";
import History from "../pages/History";
import Analytics from "../pages/Analytics";
import Settings from "../pages/Settings";
import NotFound from "../pages/NotFound";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/message-analyzer" element={<MessageAnalyzer />} />
        <Route path="/url-scanner" element={<UrlScanner />} />
        <Route path="/email-scanner" element={<EmailScanner />} />
        <Route path="/screenshot-scanner" element={<ScreenshotScanner />} />
        <Route path="/threat-intelligence" element={<ThreatIntelligence />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/history" element={<History />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
export default AppRoutes;
