import {
  analyzeMessage,
  analyzeUrl,
  analyzeEmail,
  analyzeScreenshot,
} from "../services/aiAnalysis.service.js";
import { createScan } from "../services/database.service.js";
import { fileToBase64, cleanupFile } from "../middleware/upload.middleware.js";
import path from "path";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildScanRecord(scanType, inputPreview, result) {
  return {
    scan_type: scanType,
    input_preview: inputPreview.slice(0, 200),
    risk_score: result.risk_score,
    risk_level: result.risk_level,
    verdict: result.verdict,
    confidence: result.confidence,
    analysis_time_ms: result.analysis_time_ms,
    result_json: result,
    user_id: null, // Will be replaced by auth middleware when auth is added
  };
}

// ─── Message Analyzer ─────────────────────────────────────────────────────────

export async function scanMessage(req, res, next) {
  try {
    const { text } = req.body;
    const start = Date.now();

    const result = await analyzeMessage(text);
    result.analysis_time_ms = Date.now() - start;

    const record = await createScan(buildScanRecord("message", text, result));

    res.json({ success: true, scan_id: record.id, result });
  } catch (err) {
    next(err);
  }
}

// ─── URL Scanner ──────────────────────────────────────────────────────────────

export async function scanUrl(req, res, next) {
  try {
    const { url } = req.body;
    const start = Date.now();

    const result = await analyzeUrl(url);
    result.analysis_time_ms = Date.now() - start;

    const record = await createScan(buildScanRecord("url", url, result));

    res.json({ success: true, scan_id: record.id, result });
  } catch (err) {
    next(err);
  }
}

// ─── Email Scanner ────────────────────────────────────────────────────────────

export async function scanEmail(req, res, next) {
  try {
    const { content } = req.body;
    const start = Date.now();

    const result = await analyzeEmail(content);
    result.analysis_time_ms = Date.now() - start;

    const record = await createScan(buildScanRecord("email", content, result));

    res.json({ success: true, scan_id: record.id, result });
  } catch (err) {
    next(err);
  }
}

// ─── Screenshot Scanner ───────────────────────────────────────────────────────

export async function scanScreenshot(req, res, next) {
  const filePath = req.file?.path;
  try {
    const start = Date.now();
    const mimeType = req.file.mimetype;
    const imageBase64 = fileToBase64(filePath);

    const result = await analyzeScreenshot(imageBase64, mimeType);
    result.analysis_time_ms = Date.now() - start;

    const record = await createScan(
      buildScanRecord("screenshot", req.file.originalname, result)
    );

    // Clean up temp file after analysis
    cleanupFile(filePath);

    res.json({ success: true, scan_id: record.id, result });
  } catch (err) {
    cleanupFile(filePath);
    next(err);
  }
}

// ─── Get single scan result ───────────────────────────────────────────────────

export async function getScanResult(req, res, next) {
  try {
    const { id } = req.params;
    const { getScan } = await import("../services/database.service.js");
    const scan = await getScan(id);

    if (!scan) {
      return res.status(404).json({ success: false, error: "Scan not found" });
    }

    res.json({ success: true, scan });
  } catch (err) {
    next(err);
  }
}
