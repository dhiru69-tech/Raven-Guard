/**
 * AI Analysis Service
 * Uses Anthropic Claude as primary engine with structured JSON output.
 * Falls back to Gemini if configured, then to rule-based heuristics.
 */
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
dotenv.config();

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

// ─── Shared prompt builder ────────────────────────────────────────────────────

function buildSystemPrompt() {
  return `You are Raven Guard, an expert AI cybersecurity analyst specializing in detecting scams, phishing, and digital fraud targeting Indian internet users.

Analyze the input and respond ONLY with a valid JSON object in this exact structure:
{
  "risk_score": <0-100 integer>,
  "risk_level": <"low"|"medium"|"high">,
  "verdict": <short verdict string, e.g. "High-Risk Phishing Attempt">,
  "confidence": <0-100 integer>,
  "analysis_time_ms": <estimated ms integer>,
  "summary": <2-3 sentence threat summary>,
  "red_flags": [
    { "title": <string>, "score": <0-100>, "description": <string> }
  ],
  "safe_signals": [
    { "title": <string>, "description": <string> }
  ],
  "recommended_actions": [<string>, ...],
  "categories": [<"phishing"|"scam"|"malware"|"impersonation"|"fraud"|"safe"|"suspicious"|string>, ...],
  "report_to_cybercrime": <boolean>
}

Scoring guide:
- 0-30: Low risk / Safe
- 31-60: Medium / Suspicious
- 61-100: High risk / Scam or Phishing

Be precise. Focus on: urgency language, OTP/credential requests, impersonation of banks/govt, suspicious domains, grammar errors, reward/lottery scams.`;
}

// ─── Message / Text analysis ──────────────────────────────────────────────────

export async function analyzeMessage(text) {
  if (!anthropic) return heuristicAnalysis("message", text);

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: buildSystemPrompt(),
    messages: [
      {
        role: "user",
        content: `Analyze this suspicious message for fraud/scam indicators:\n\n"""${text}"""`,
      },
    ],
  });

  return parseAIResponse(response.content[0].text);
}

// ─── URL analysis ─────────────────────────────────────────────────────────────

export async function analyzeUrl(url) {
  if (!anthropic) return heuristicAnalysis("url", url);

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: buildSystemPrompt(),
    messages: [
      {
        role: "user",
        content: `Analyze this URL for phishing, malware, or fraud signals:\n\nURL: ${url}\n\nConsider: domain age indicators, brand impersonation, suspicious TLDs, URL shorteners, misleading subdomains, typosquatting.`,
      },
    ],
  });

  return parseAIResponse(response.content[0].text);
}

// ─── Email analysis ───────────────────────────────────────────────────────────

export async function analyzeEmail(content) {
  if (!anthropic) return heuristicAnalysis("email", content);

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: buildSystemPrompt(),
    messages: [
      {
        role: "user",
        content: `Analyze this email content for phishing, impersonation, and fraud:\n\n"""${content}"""`,
      },
    ],
  });

  return parseAIResponse(response.content[0].text);
}

// ─── Screenshot / Image analysis ──────────────────────────────────────────────

export async function analyzeScreenshot(imageBase64, mimeType = "image/jpeg") {
  if (!anthropic) {
    return {
      ...heuristicAnalysis("screenshot", "image"),
      note: "Image analysis requires ANTHROPIC_API_KEY. Configure it in .env",
    };
  }

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: buildSystemPrompt(),
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mimeType,
              data: imageBase64,
            },
          },
          {
            type: "text",
            text: "This is a screenshot from a user's device. Analyze it for scam, phishing, or fraud indicators. Look for: fake bank notices, OTP requests, suspicious payment alerts, fake customer support, lottery/reward scams.",
          },
        ],
      },
    ],
  });

  return parseAIResponse(response.content[0].text);
}

// ─── JSON parser ──────────────────────────────────────────────────────────────

function parseAIResponse(text) {
  // Strip markdown code fences if present
  const clean = text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  try {
    const parsed = JSON.parse(clean);
    // Ensure required fields exist with sensible defaults
    return {
      risk_score: parsed.risk_score ?? 50,
      risk_level: parsed.risk_level ?? "medium",
      verdict: parsed.verdict ?? "Analysis Complete",
      confidence: parsed.confidence ?? 80,
      analysis_time_ms: parsed.analysis_time_ms ?? 1200,
      summary: parsed.summary ?? "",
      red_flags: Array.isArray(parsed.red_flags) ? parsed.red_flags : [],
      safe_signals: Array.isArray(parsed.safe_signals) ? parsed.safe_signals : [],
      recommended_actions: Array.isArray(parsed.recommended_actions)
        ? parsed.recommended_actions
        : [],
      categories: Array.isArray(parsed.categories) ? parsed.categories : [],
      report_to_cybercrime: parsed.report_to_cybercrime ?? false,
    };
  } catch {
    // If AI returns malformed JSON, return a safe fallback
    console.error("[AI] Failed to parse JSON response:", text.slice(0, 200));
    return heuristicAnalysis("unknown", text);
  }
}

// ─── Heuristic fallback (no API key) ─────────────────────────────────────────

function heuristicAnalysis(type, content) {
  const lower = (content || "").toLowerCase();

  const highRiskKeywords = [
    "otp", "kyc", "verify account", "urgent", "blocked", "suspended",
    "claim your prize", "lottery", "winner", "aadhaar", "pan card",
    "refund", "click here", "verify now", "limited time",
  ];

  const mediumRiskKeywords = [
    "offer", "discount", "free", "congratulations", "selected",
    "reward", "cashback", "bit.ly", "tinyurl", "rebrand.ly",
  ];

  let score = 10;
  const redFlags = [];

  for (const kw of highRiskKeywords) {
    if (lower.includes(kw)) {
      score += 15;
      redFlags.push({ title: `Keyword: "${kw}"`, score: 85, description: `High-risk keyword detected: "${kw}"` });
    }
  }
  for (const kw of mediumRiskKeywords) {
    if (lower.includes(kw)) {
      score += 8;
      redFlags.push({ title: `Keyword: "${kw}"`, score: 60, description: `Suspicious keyword detected: "${kw}"` });
    }
  }

  score = Math.min(score, 100);
  const risk_level = score >= 60 ? "high" : score >= 30 ? "medium" : "low";

  return {
    risk_score: score,
    risk_level,
    verdict:
      risk_level === "high"
        ? "High-Risk Content Detected"
        : risk_level === "medium"
        ? "Suspicious Content"
        : "Appears Safe",
    confidence: 65,
    analysis_time_ms: 120,
    summary: `Heuristic analysis (no AI key). Detected ${redFlags.length} risk indicator(s). Configure ANTHROPIC_API_KEY for full AI analysis.`,
    red_flags: redFlags.slice(0, 5),
    safe_signals: score < 30 ? [{ title: "No major red flags", description: "Content appears safe based on heuristics" }] : [],
    recommended_actions:
      risk_level === "high"
        ? ["Do NOT click links", "Block the sender", "Report to cybercrime.gov.in"]
        : risk_level === "medium"
        ? ["Proceed with caution", "Verify through official channels"]
        : ["Content appears safe — remain vigilant"],
    categories: risk_level === "high" ? ["scam"] : risk_level === "medium" ? ["suspicious"] : ["safe"],
    report_to_cybercrime: risk_level === "high",
    note: "Full AI analysis disabled — configure ANTHROPIC_API_KEY in .env",
  };
}
