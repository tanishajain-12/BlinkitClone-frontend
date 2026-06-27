import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartController.js";
import protect from "../middleware/auth.js";

const router = Router();

// All cart routes require authentication
router.use(protect);

// GET    /api/cart                  — view cart with product details
// POST   /api/cart/add              — add item (or increase quantity)
// PUT    /api/cart/update/:itemId   — set quantity for a specific cart item
// DELETE /api/cart/remove/:itemId   — remove a single item
// DELETE /api/cart/clear            — empty the entire cart
router.get("/",                 getCart);
router.post("/add",             addToCart);
router.put("/update/:itemId",   updateCartItem);
router.delete("/remove/:itemId", removeCartItem);
router.delete("/clear",         clearCart);

export default router;
