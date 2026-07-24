import { Router } from "express";
import {
  createPayment,
  getProjectPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
} from "../controllers/payment.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();
router.use(requireAuth);

router.post("/projects/:projectId/payments", createPayment);
router.get("/projects/:projectId/payments", getProjectPayments);
router.get("/payments/:id", getPaymentById);
router.patch("/payments/:id", updatePayment);
router.delete("/payments/:id", deletePayment);

export default router;
