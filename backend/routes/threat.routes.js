import express from "express";
import { getThreatIntel } from "../controllers/threat.controller.js";
const router = express.Router();
router.get("/", getThreatIntel);
export default router;
