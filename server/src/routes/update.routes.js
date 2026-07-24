import { Router } from "express";
import {
  createUpdate,
  getProjectUpdates,
  editUpdate,
  deleteUpdate,
} from "../controllers/update.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();
router.use(requireAuth);

// Nested under a project for creation/listing...
router.post("/projects/:projectId/updates", createUpdate);
router.get("/projects/:projectId/updates", getProjectUpdates);

// ...but edit/delete act on the update directly by its own id.
router.patch("/updates/:id", editUpdate);
router.delete("/updates/:id", deleteUpdate);

export default router;
