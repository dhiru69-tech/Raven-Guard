import { getScan, listScans } from "../services/database.service.js";
import { generateReport } from "../services/report.service.js";
import path from "path";
import fs from "fs";

// Generate and download a PDF report for a specific scan
export async function downloadReport(req, res, next) {
  try {
    const { id } = req.params;
    const scan = await getScan(id);

    if (!scan) {
      return res.status(404).json({ success: false, error: "Scan not found" });
    }

    const result = scan.result_json || scan;
    const filepath = await generateReport(scan, result);

    const filename = path.basename(filepath);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    const stream = fs.createReadStream(filepath);
    stream.pipe(res);

    // Clean up after sending
    stream.on("end", () => {
      try { fs.unlinkSync(filepath); } catch { /* non-fatal */ }
    });
  } catch (err) {
    next(err);
  }
}

// List recent scan summaries for the Reports page
export async function getReportsList(req, res, next) {
  try {
    const { limit = "20", offset = "0" } = req.query;
    const userId = req.user?.id || null;

    const { data, count } = await listScans({
      userId,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    // Map to report-friendly format
    const reports = data.map((scan) => ({
      id: scan.id,
      title: buildReportTitle(scan),
      scan_type: scan.scan_type,
      risk_level: scan.risk_level,
      risk_score: scan.risk_score,
      verdict: scan.verdict,
      created_at: scan.created_at,
      download_url: `/api/reports/${scan.id}/download`,
    }));

    res.json({ success: true, data: reports, total: count });
  } catch (err) {
    next(err);
  }
}

function buildReportTitle(scan) {
  const preview = scan.input_preview || "";
  const typeLabel = {
    message: "Message Scan",
    url: "URL Scan",
    email: "Email Scan",
    screenshot: "Image Scan",
  }[scan.scan_type] || "Scan";

  return preview
    ? `${typeLabel} — ${preview.slice(0, 40)}${preview.length > 40 ? "…" : ""}`
    : `${typeLabel} — ${new Date(scan.created_at).toLocaleDateString("en-IN")}`;
}
