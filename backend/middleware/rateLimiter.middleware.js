import rateLimit from "express-rate-limit";

// Scan-specific rate limiter (stricter than global)
export const scanLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 30,
  message: { error: "Scan rate limit exceeded. Wait a moment." },
});
