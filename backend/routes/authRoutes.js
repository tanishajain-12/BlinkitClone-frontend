import { Router } from "express";
import { register, login, getProfile } from "../controllers/authController.js";
import protect from "../middleware/auth.js";

const router = Router();

// POST /api/auth/register — Create a new user account
router.post("/register", register);

// POST /api/auth/login — Authenticate and receive a JWT
router.post("/login", login);

// GET /api/auth/profile — Get authenticated user's profile (protected)
router.get("/profile", protect, getProfile);

export default router;
