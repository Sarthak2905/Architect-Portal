import { Router } from "express";
import authRoutes from "./auth.routes.js";
import clientRoutes from "./client.routes.js";
import projectRoutes from "./project.routes.js";
import updateRoutes from "./update.routes.js";
import documentRoutes from "./document.routes.js";
import paymentRoutes from "./payment.routes.js";
import notificationRoutes from "./notification.routes.js";
import portalRoutes from "./portal.routes.js";
import dashboardRoutes from "./dashboard.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/clients", clientRoutes);
router.use("/projects", projectRoutes);
router.use("/", updateRoutes);
router.use("/", documentRoutes);
router.use("/", paymentRoutes);
router.use("/", notificationRoutes);
router.use("/portal", portalRoutes);
router.use("/dashboard", dashboardRoutes);

// This was the last MVP feature (item 10 in your original MVP list).
// Phase 11 is production hardening + deployment, not a new feature.

export default router;
