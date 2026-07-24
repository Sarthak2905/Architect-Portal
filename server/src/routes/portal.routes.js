import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  getPortalOverview,
  getPortalTimeline,
  getPortalDocuments,
  getPortalPhotos,
  getPortalPayments,
} from "../controllers/portal.controller.js";
import { resolvePortalProject } from "../middleware/portalAuth.middleware.js";

const router = Router();

// Portal routes have no login, so they're the most guessable-token-attack
// surface in the whole app — rate limit harder than the auth login route.
const portalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, try again later" },
});

router.use("/:token", portalLimiter, resolvePortalProject);

router.get("/:token/overview", getPortalOverview);
router.get("/:token/timeline", getPortalTimeline);
router.get("/:token/documents", getPortalDocuments);
router.get("/:token/photos", getPortalPhotos);
router.get("/:token/payments", getPortalPayments);

export default router;
