import { Router } from "express";
import {
  getDashboardSummary,
  getPendingPayments,
  getRecentActivity,
} from "../controllers/dashboard.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();
router.use(requireAuth); // dashboard is owner-only, same as everything except /portal

router.get("/summary", getDashboardSummary);
router.get("/pending-payments", getPendingPayments);
router.get("/recent-activity", getRecentActivity);

export default router;
