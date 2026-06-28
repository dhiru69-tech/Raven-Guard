import validator from "validator";

/**
 * Validates scan request body fields.
 * Returns 400 with a descriptive error if validation fails.
 */

export function validateMessage(req, res, next) {
  const { text } = req.body;

  if (!text || typeof text !== "string") {
    return res.status(400).json({ success: false, error: "Field 'text' is required." });
  }
  if (text.trim().length < 5) {
    return res.status(400).json({ success: false, error: "Message is too short to analyze." });
  }
  if (text.length > 10000) {
    return res.status(400).json({ success: false, error: "Message exceeds 10,000 character limit." });
  }

  req.body.text = text.trim();
  next();
}

export function validateUrl(req, res, next) {
  const { url } = req.body;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ success: false, error: "Field 'url' is required." });
  }

  const cleaned = url.trim();

  // Auto-prepend https:// if missing
  const toValidate = cleaned.startsWith("http") ? cleaned : `https://${cleaned}`;

  if (!validator.isURL(toValidate, { require_protocol: true, allow_underscores: true })) {
    return res.status(400).json({ success: false, error: "Invalid URL format." });
  }

  req.body.url = toValidate;
  next();
}

export function validateEmail(req, res, next) {
  const { content } = req.body;

  if (!content || typeof content !== "string") {
    return res.status(400).json({ success: false, error: "Field 'content' is required." });
  }
  if (content.trim().length < 10) {
    return res.status(400).json({ success: false, error: "Email content is too short." });
  }
  if (content.length > 50000) {
    return res.status(400).json({ success: false, error: "Email content exceeds 50,000 character limit." });
  }

  req.body.content = content.trim();
  next();
}

export function validateScreenshot(req, res, next) {
  if (!req.file) {
    return res.status(400).json({ success: false, error: "Image file is required." });
  }
  next();
}
