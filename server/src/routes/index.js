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
router.use("/dashboard", dashboardRoutes);

// Client portal is public (token-in-URL is the credential). It MUST be
// mounted before any router that's mounted at "/" below — those apply
// requireAuth unconditionally to every request that reaches them, so if
// portal were mounted after them, it would get rejected as
// unauthenticated before ever reaching its own routes.
router.use("/portal", portalRoutes);

router.use("/", updateRoutes);
router.use("/", documentRoutes);
router.use("/", paymentRoutes);
router.use("/", notificationRoutes);

export default router;
