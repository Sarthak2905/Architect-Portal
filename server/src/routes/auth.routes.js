import { Router } from "express";
import {
  login,
  logout,
  refresh,
  getMe,
  updateCredentials,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", requireAuth, logout);
router.get("/me", requireAuth, getMe);
router.patch("/credentials", requireAuth, updateCredentials);

export default router;
