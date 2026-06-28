import express from "express";
import { getClient } from "../utils/supabaseClient.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  const db = getClient();
  let supabaseStatus = "not configured";

  if (db) {
    try {
      const { error } = await db.from("scans").select("id").limit(1);
      supabaseStatus = error ? `error: ${error.message}` : "connected";
    } catch {
      supabaseStatus = "unreachable";
    }
  }

  res.json({
    status: "ok",
    service: "Raven Guard API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    ai_configured: !!process.env.ANTHROPIC_API_KEY,
    supabase: supabaseStatus,
  });
});

export default router;
