import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ─── Helper: Generate JWT ─────────────────────────────────────────────────────
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

// ─── Helper: Safe user object (no password) ───────────────────────────────────
// Includes role so the frontend can conditionally render admin UI
const safeUser = (user) => ({
  id:      user.id,
  name:    user.name,
  email:   user.email,
  phone:   user.phone,
  address: user.address,
  role:    user.role,
});

// ─── Register ─────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // ── Validate required fields ───────────────────────────────────────────
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    const trimmedName  = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    // ── Validate email format ──────────────────────────────────────────────
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    // ── Validate password minimum length ──────────────────────────────────
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters.",
      });
    }

    // ── Check for duplicate email ──────────────────────────────────────────
    const existingUser = await User.findOne({ where: { email: trimmedEmail } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists. Please login or use a different email.",
      });
    }

    // ── Hash password ──────────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 10);

    // ── Create user ───────────────────────────────────────────────────────
    const user = await User.create({
      name:     trimmedName,
      email:    trimmedEmail,
      password: hashedPassword,
      phone:    phone?.trim() || null,
      address:  address?.trim() || null,
    });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      token,
      user: safeUser(user),
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ success: false, message: "Email already exists." });
    }
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({ success: false, message: error.errors[0].message });
    }
    console.error("Register error:", error.message);
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ where: { email: trimmedEmail } });

    // Generic message — never reveal whether the email exists
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: safeUser(user),
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

// ─── Get Profile ──────────────────────────────────────────────────────────────

/**
 * GET /api/auth/profile  (protected)
 */
export const getProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: safeUser(req.user),
    });
  } catch (error) {
    console.error("Get profile error:", error.message);
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};
