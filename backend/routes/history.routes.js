import express from "express";
import { getHistory, deleteHistoryItem } from "../controllers/history.controller.js";

const router = express.Router();

// GET /api/history?type=message&limit=50&offset=0
router.get("/", getHistory);

// DELETE /api/history/:id
router.delete("/:id", deleteHistoryItem);

export default router;
