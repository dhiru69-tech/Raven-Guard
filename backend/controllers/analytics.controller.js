import { getAnalyticsSummary } from "../services/database.service.js";

export async function getAnalytics(req, res, next) {
  try {
    const userId = req.user?.id || null;
    const summary = await getAnalyticsSummary(userId);

    // Safety score: inverse of threat ratio
    const safetyScore =
      summary.total > 0
        ? Math.round(((summary.safe + summary.suspicious * 0.5) / summary.total) * 100)
        : 78;

    res.json({
      success: true,
      data: {
        ...summary,
        safety_score: safetyScore,
        threat_detection_rate:
          summary.total > 0 ? Math.round((summary.threats / summary.total) * 100) : 0,
      },
    });
  } catch (err) {
    next(err);
  }
}
