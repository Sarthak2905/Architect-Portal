import { Router } from "express";
import {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deactivateClient,
  reactivateClient,
} from "../controllers/client.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// Every client route is owner-only — client portal will use separate
// routes in a later phase, not these.
router.use(requireAuth);

router.post("/", createClient);
router.get("/", getClients);
router.get("/:id", getClientById);
router.patch("/:id", updateClient);
router.delete("/:id", deactivateClient);
router.patch("/:id/reactivate", reactivateClient);

export default router;
