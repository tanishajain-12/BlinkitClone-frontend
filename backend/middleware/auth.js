import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Protect middleware — verifies the JWT from the Authorization header.
 * Attaches the authenticated user object to req.user on success.
 * Returns 401 for missing, invalid, or expired tokens.
 */
const protect = async (req, res, next) => {
  try {
    // ── 1. Read and validate the Authorization header ──────────────────────
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1]; // Extract token after "Bearer "

    // ── 2. Verify token signature and expiry ───────────────────────────────
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      const message =
        err.name === "TokenExpiredError"
          ? "Token has expired. Please login again."
          : "Invalid token. Please login again.";

      return res.status(401).json({ success: false, message });
    }

    // ── 3. Find user in database (confirms user still exists) ──────────────
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] }, // Never attach password to req
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists.",
      });
    }

    // ── 4. Attach user to request and proceed ──────────────────────────────
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication.",
    });
  }
};

export default protect;
