/**
 * middleware/admin.js — Admin role guard.
 *
 * CHAIN ORDER (always use both):
 *   router.get("/route", protect, isAdmin, handler)
 *
 * protect  → verifies JWT, populates req.user
 * isAdmin  → checks req.user.role === "admin"
 *
 * This middleware intentionally does NOT re-verify the JWT.
 * Authentication (who are you?) is handled by protect.
 * This middleware only handles authorization (are you allowed?).
 */
const isAdmin = (req, res, next) => {
  // req.user is guaranteed to exist here because protect runs first
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied. Admins only.",
  });
};

export default isAdmin;
