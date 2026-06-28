import { listScans, removeScan } from "../services/database.service.js";

export async function getHistory(req, res, next) {
  try {
    const { type, limit = "50", offset = "0" } = req.query;
    const userId = req.user?.id || null;

    const { data, count } = await listScans({
      userId,
      scanType: type || undefined,
      limit: Math.min(parseInt(limit), 200),
      offset: parseInt(offset),
    });

    res.json({ success: true, data, total: count });
  } catch (err) {
    next(err);
  }
}

export async function deleteHistoryItem(req, res, next) {
  try {
    const { id } = req.params;
    await removeScan(id);
    res.json({ success: true, message: "Scan deleted" });
  } catch (err) {
    next(err);
  }
}
