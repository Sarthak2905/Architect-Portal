import { Router } from "express";
import {
  getProjectNotifications,
  sendPaymentReminder,
  testWhatsAppConnection,
} from "../controllers/notification.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();
router.use(requireAuth);

router.get("/projects/:projectId/notifications", getProjectNotifications);
router.post(
  "/projects/:projectId/notifications/payment-reminder",
  sendPaymentReminder,
);
router.post("/notifications/test-whatsapp", testWhatsAppConnection);

export default router;
