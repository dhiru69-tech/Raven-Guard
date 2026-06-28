import { getThreatIntelligence } from "../services/database.service.js";

export async function getThreatIntel(req, res, next) {
  try {
    const data = await getThreatIntelligence();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
