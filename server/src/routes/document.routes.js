import { Router } from "express";
import {
  uploadDocument,
  getProjectDocuments,
  getDocumentById,
  deleteDocument,
} from "../controllers/document.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = Router();
router.use(requireAuth);

router.post(
  "/projects/:projectId/documents",
  upload.single("file"),
  uploadDocument,
);
router.get("/projects/:projectId/documents", getProjectDocuments);
router.get("/documents/:id", getDocumentById);
router.delete("/documents/:id", deleteDocument);

export default router;
