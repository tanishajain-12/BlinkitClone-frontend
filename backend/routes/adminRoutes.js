import { Router } from "express";
import {
  getAllOrders,
  updateOrderStatus,
  getDashboard,
} from "../controllers/adminController.js";
import protect from "../middleware/auth.js";
import isAdmin from "../middleware/admin.js";

const router = Router();

// All admin routes require: valid JWT AND role = admin
// protect → isAdmin → handler
router.use(protect, isAdmin);

// GET  /api/admin/dashboard           — business metrics
// GET  /api/admin/orders              — all orders with customer + product details
// PUT  /api/admin/orders/:id/status   — update order status
router.get("/dashboard",             getDashboard);
router.get("/orders",                getAllOrders);
router.put("/orders/:id/status",     updateOrderStatus);

export default router;
