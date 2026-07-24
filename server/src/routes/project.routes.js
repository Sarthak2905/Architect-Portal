import { Router } from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  updateProjectStatus,
  archiveProject,
  restoreProject,
  regeneratePortalLink,
} from "../controllers/project.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();
router.use(requireAuth);

router.post("/", createProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.patch("/:id", updateProject);
router.patch("/:id/status", updateProjectStatus);
router.delete("/:id", archiveProject);
router.patch("/:id/restore", restoreProject);
router.patch("/:id/regenerate-portal-link", regeneratePortalLink);

export default router;
