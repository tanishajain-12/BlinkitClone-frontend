import { Router } from "express";
import { placeOrder, getOrders, getOrderById } from "../controllers/orderController.js";
import protect from "../middleware/auth.js";

const router = Router();

// All order routes require authentication
router.use(protect);

// POST /api/orders       — checkout (cart → order)
// GET  /api/orders       — list all orders for the logged-in user
// GET  /api/orders/:id   — get a single order (owner only)
router.post("/",    placeOrder);
router.get("/",     getOrders);
router.get("/:id",  getOrderById);

export default router;
