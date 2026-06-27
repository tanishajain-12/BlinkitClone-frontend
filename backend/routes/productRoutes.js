import { Router } from "express";
import multer from "multer";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import protect  from "../middleware/auth.js";
import isAdmin  from "../middleware/admin.js";
import upload   from "../config/multer.js";

const router = Router();

// ─── Multer error handler ─────────────────────────────────────────────────────
const handleUpload = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (!err) return next();

    if (err instanceof multer.MulterError) {
      const message =
        err.code === "LIMIT_FILE_SIZE"
          ? "Image must be smaller than 5 MB."
          : `Upload error: ${err.message}`;
      return res.status(400).json({ success: false, message });
    }

    // fileFilter rejection (wrong MIME type or extension)
    return res.status(400).json({
      success: false,
      message: err.message || "Invalid file type.",
    });
  });
};

// ── Public routes ─────────────────────────────────────────────────────────────
router.get("/",    getAllProducts);
router.get("/:id", getProductById);

// ── Admin-only routes (protect → isAdmin → upload → handler) ─────────────────
router.post(  "/",    protect, isAdmin, handleUpload, createProduct);
router.put(   "/:id", protect, isAdmin, handleUpload, updateProduct);
router.delete("/:id", protect, isAdmin, deleteProduct);

export default router;
