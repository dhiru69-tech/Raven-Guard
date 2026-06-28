import express from "express";
import { scanLimiter } from "../middleware/rateLimiter.middleware.js";
import {
  scanMessage,
  scanUrl,
  scanEmail,
  scanScreenshot,
  getScanResult,
} from "../controllers/scan.controller.js";
import {
  validateMessage,
  validateUrl,
  validateEmail,
  validateScreenshot,
} from "../middleware/validation.middleware.js";
import { uploadMiddleware } from "../middleware/upload.middleware.js";

const router = express.Router();

// POST /api/scan/message
router.post("/message", scanLimiter, validateMessage, scanMessage);

// POST /api/scan/url
router.post("/url", scanLimiter, validateUrl, scanUrl);

// POST /api/scan/email
router.post("/email", scanLimiter, validateEmail, scanEmail);

// POST /api/scan/screenshot
router.post(
  "/screenshot",
  scanLimiter,
  uploadMiddleware.single("image"),
  validateScreenshot,
  scanScreenshot
);

// GET /api/scan/:id
router.get("/:id", getScanResult);

export default router;
