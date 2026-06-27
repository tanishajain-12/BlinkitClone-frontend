import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// ─── Resolve uploads directory (ES Module safe) ───────────────────────────────
const __filename  = fileURLToPath(import.meta.url);
const __dirname   = path.dirname(__filename);
export const UPLOADS_DIR = path.join(__dirname, "..", "uploads");

// Ensure the uploads folder exists at startup
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// ─── Constants ────────────────────────────────────────────────────────────────
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const MAX_FILE_SIZE_MB   = 5;

// ─── Helper: delete a file from disk safely ───────────────────────────────────
/**
 * Deletes an image file from the uploads directory.
 * Accepts either a full path or the server-relative path stored in the DB
 * (e.g. "/uploads/product-abc123.jpg").
 * Silently ignores missing files — never throws.
 */
export const deleteUploadedFile = (imagePath) => {
  if (!imagePath) return;

  // Strip the leading "/uploads/" prefix if present
  const filename = path.basename(imagePath);
  const fullPath = path.join(UPLOADS_DIR, filename);

  try {
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch {
    // Non-fatal — log but do not crash the request
    console.warn(`⚠️  Could not delete image: ${fullPath}`);
  }
};

// ─── Storage engine ───────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    // UUID v4 guarantees global uniqueness with no collision risk
    const ext      = path.extname(file.originalname).toLowerCase();
    const filename = `product-${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

// ─── File filter — validate MIME type AND file extension ─────────────────────
const fileFilter = (_req, file, cb) => {
  const ext         = path.extname(file.originalname).toLowerCase();
  const mimeAllowed = ALLOWED_MIME_TYPES.has(file.mimetype);
  const extAllowed  = ALLOWED_EXTENSIONS.has(ext);

  if (mimeAllowed && extAllowed) {
    cb(null, true);
  } else {
    cb(
      Object.assign(new Error("Only JPG, PNG, and WEBP images are allowed."), {
        code: "INVALID_FILE_TYPE",
      }),
      false
    );
  }
};

// ─── Multer instance ──────────────────────────────────────────────────────────
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_MB * 1024 * 1024, // 5 MB in bytes
  },
});

export default upload;
