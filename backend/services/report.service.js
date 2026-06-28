/**
 * PDF Report Service
 * Generates styled threat analysis reports using PDFKit.
 */
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

const REPORTS_DIR = process.env.REPORTS_DIR || "./reports";

// Ensure reports directory exists
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

// ─── Color palette ────────────────────────────────────────────────────────────
const COLORS = {
  bg: "#0f172a",
  card: "#1e293b",
  blue: "#3b82f6",
  red: "#ef4444",
  amber: "#f59e0b",
  green: "#22c55e",
  textPrimary: "#f8fafc",
  textMuted: "#94a3b8",
};

function riskColor(level) {
  if (level === "high") return COLORS.red;
  if (level === "medium") return COLORS.amber;
  return COLORS.green;
}

/**
 * Generate a PDF report for a scan result.
 * @param {Object} scan - The scan record from DB
 * @param {Object} result - The AI analysis result
 * @returns {string} Absolute path to the generated PDF
 */
export async function generateReport(scan, result) {
  const reportId = uuidv4();
  const filename = `RavenGuard_Report_${reportId}.pdf`;
  const filepath = path.join(REPORTS_DIR, filename);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
      info: {
        Title: `Raven Guard Threat Report — ${scan.scan_type}`,
        Author: "Raven Guard AI",
        Subject: "Cybersecurity Threat Analysis",
      },
    });

    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);

    // ── Header ──────────────────────────────────────────────────────────────
    doc
      .rect(0, 0, doc.page.width, 90)
      .fill("#0f172a");

    doc
      .fillColor(COLORS.blue)
      .fontSize(26)
      .font("Helvetica-Bold")
      .text("🛡️  RAVEN GUARD", 50, 28);

    doc
      .fillColor(COLORS.textMuted)
      .fontSize(10)
      .font("Helvetica")
      .text("AI-Powered Cybersecurity Threat Report", 50, 60);

    doc
      .fillColor(COLORS.textMuted)
      .fontSize(9)
      .text(`Generated: ${new Date().toLocaleString("en-IN")}`, 350, 45, { align: "right" })
      .text(`Report ID: ${reportId.slice(0, 8).toUpperCase()}`, 350, 58, { align: "right" });

    doc.y = 110;

    // ── Risk Score Badge ──────────────────────────────────────────────────────
    const scoreColor = riskColor(result.risk_level);
    doc
      .fillColor(scoreColor)
      .fontSize(48)
      .font("Helvetica-Bold")
      .text(`${result.risk_score}/100`, 50, 115);

    doc
      .fillColor(scoreColor)
      .fontSize(16)
      .text(result.verdict || result.risk_level.toUpperCase(), 50, 170);

    doc
      .fillColor(COLORS.textMuted)
      .fontSize(10)
      .font("Helvetica")
      .text(`Confidence: ${result.confidence}%  |  Analysis: ${result.analysis_time_ms}ms  |  Type: ${scan.scan_type}`, 50, 195);

    // ── Divider ───────────────────────────────────────────────────────────────
    doc.y = 220;
    doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).strokeColor(COLORS.card).stroke();
    doc.y += 15;

    // ── Threat Summary ────────────────────────────────────────────────────────
    sectionHeader(doc, "Threat Summary");
    doc
      .fillColor(COLORS.textPrimary)
      .fontSize(11)
      .font("Helvetica")
      .text(result.summary || "No summary available.", 50, doc.y, {
        width: doc.page.width - 100,
        lineGap: 4,
      });
    doc.y += 20;

    // ── Red Flags ─────────────────────────────────────────────────────────────
    if (result.red_flags?.length) {
      sectionHeader(doc, `Red Flags Detected (${result.red_flags.length})`);
      for (const flag of result.red_flags) {
        if (doc.y > 720) doc.addPage();
        doc
          .fillColor(COLORS.red)
          .fontSize(11)
          .font("Helvetica-Bold")
          .text(`⚠  ${flag.title}  [${flag.score}%]`, 55, doc.y);
        doc
          .fillColor(COLORS.textMuted)
          .fontSize(10)
          .font("Helvetica")
          .text(flag.description || "", 65, doc.y, { width: doc.page.width - 120 });
        doc.y += 8;
      }
      doc.y += 10;
    }

    // ── Safe Signals ──────────────────────────────────────────────────────────
    if (result.safe_signals?.length) {
      sectionHeader(doc, "Safe Signals");
      for (const sig of result.safe_signals) {
        if (doc.y > 720) doc.addPage();
        doc
          .fillColor(COLORS.green)
          .fontSize(11)
          .font("Helvetica-Bold")
          .text(`✓  ${sig.title}`, 55, doc.y);
        doc
          .fillColor(COLORS.textMuted)
          .fontSize(10)
          .font("Helvetica")
          .text(sig.description || "", 65, doc.y);
        doc.y += 8;
      }
      doc.y += 10;
    }

    // ── Recommended Actions ───────────────────────────────────────────────────
    if (result.recommended_actions?.length) {
      if (doc.y > 650) doc.addPage();
      sectionHeader(doc, "Recommended Actions");
      for (const action of result.recommended_actions) {
        doc
          .fillColor(COLORS.textPrimary)
          .fontSize(11)
          .font("Helvetica")
          .text(`→  ${action}`, 55, doc.y, { width: doc.page.width - 110 });
        doc.y += 5;
      }
      doc.y += 10;
    }

    // ── Cybercrime Notice ─────────────────────────────────────────────────────
    if (result.report_to_cybercrime) {
      if (doc.y > 680) doc.addPage();
      doc
        .rect(50, doc.y, doc.page.width - 100, 55)
        .fill("#1a0505");
      doc
        .fillColor(COLORS.red)
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("⚡ REPORT THIS INCIDENT", 60, doc.y + 10);
      doc
        .fillColor(COLORS.textMuted)
        .fontSize(10)
        .font("Helvetica")
        .text(
          "Visit https://cybercrime.gov.in or call 1930 (National Cyber Crime Helpline) immediately.",
          60,
          doc.y + 28,
          { width: doc.page.width - 120 }
        );
      doc.y += 70;
    }

    // ── Scan Metadata ─────────────────────────────────────────────────────────
    if (doc.y > 680) doc.addPage();
    sectionHeader(doc, "Scan Metadata");
    metaRow(doc, "Scan ID", scan.id || "N/A");
    metaRow(doc, "Scan Type", scan.scan_type);
    metaRow(doc, "Risk Level", result.risk_level.toUpperCase());
    metaRow(doc, "Categories", (result.categories || []).join(", ") || "—");
    metaRow(doc, "Date", new Date(scan.created_at || Date.now()).toLocaleString("en-IN"));

    // ── Footer ────────────────────────────────────────────────────────────────
    doc
      .rect(0, doc.page.height - 40, doc.page.width, 40)
      .fill("#0f172a");
    doc
      .fillColor(COLORS.textMuted)
      .fontSize(8)
      .text(
        "Raven Guard AI • This report is AI-generated. Verify threats through official channels before taking action.",
        50,
        doc.page.height - 25,
        { align: "center", width: doc.page.width - 100 }
      );

    doc.end();

    stream.on("finish", () => resolve(filepath));
    stream.on("error", reject);
  });
}

function sectionHeader(doc, title) {
  doc
    .fillColor(COLORS.blue)
    .fontSize(13)
    .font("Helvetica-Bold")
    .text(title, 50, doc.y);
  doc.y += 14;
  doc
    .moveTo(50, doc.y)
    .lineTo(doc.page.width - 50, doc.y)
    .strokeColor("#1e3a5f")
    .stroke();
  doc.y += 10;
}

function metaRow(doc, label, value) {
  doc
    .fillColor(COLORS.textMuted)
    .fontSize(10)
    .font("Helvetica-Bold")
    .text(`${label}:`, 55, doc.y, { continued: true, width: 120 })
    .font("Helvetica")
    .fillColor(COLORS.textPrimary)
    .text(` ${value}`, { width: 350 });
  doc.y += 5;
}
