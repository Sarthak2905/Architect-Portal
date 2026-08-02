import { Router } from "express";
import {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deactivateClient,
  reactivateClient,
  hardDeleteClient,
} from "../controllers/client.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();
router.use(requireAuth);

router.post("/", createClient);
router.get("/", getClients);
router.get("/:id", getClientById);
router.patch("/:id", updateClient);
router.delete("/:id", deactivateClient);
router.patch("/:id/reactivate", reactivateClient);
router.delete("/:id/permanent", hardDeleteClient);

export default router;
