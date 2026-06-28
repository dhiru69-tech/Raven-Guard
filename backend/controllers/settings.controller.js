import { getUserSettings, saveUserSettings } from "../services/database.service.js";

export async function getSettings(req, res, next) {
  try {
    const userId = req.user?.id || "local";
    const settings = await getUserSettings(userId);
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
}

export async function updateSettings(req, res, next) {
  try {
    const userId = req.user?.id || "local";
    const allowed = [
      "ai_analysis",
      "url_safety_check",
      "save_history",
      "generate_reports",
      "high_risk_alerts",
      "suspicious_url_alerts",
      "weekly_summary",
      "report_reminder",
    ];

    // Only allow whitelisted fields
    const updates = {};
    for (const key of allowed) {
      if (key in req.body) updates[key] = Boolean(req.body[key]);
    }

    const updated = await saveUserSettings(userId, updates);
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}
