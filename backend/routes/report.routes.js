import express from "express";
import { getReportsList, downloadReport } from "../controllers/report.controller.js";
const router = express.Router();
router.get("/", getReportsList);
router.get("/:id/download", downloadReport);
export default router;
