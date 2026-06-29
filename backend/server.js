import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import { syncModels } from "./models/index.js";
import authRoutes    from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes    from "./routes/cartRoutes.js";
import orderRoutes   from "./routes/orderRoutes.js";
import adminRoutes   from "./routes/adminRoutes.js";

// __dirname shim for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Enable Cross-Origin Resource Sharing (allow frontend to communicate with backend)
const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

// Serve uploaded product images as static files
// Accessible at: http://localhost:5000/uploads/<filename>
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── Health Check Route ───────────────────────────────────────────────────────

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Blinkit Clone API is running!",
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────

app.use("/api/auth",     authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart",     cartRoutes);
app.use("/api/orders",   orderRoutes);
app.use("/api/admin",    adminRoutes);

// ─── Start Server ─────────────────────────────────────────────────────────────

const startServer = async () => {
  // 1. Connect to the database
  await connectDB();

  // 2. Sync all models and associations in the correct dependency order
  await syncModels();

  // 3. Start the Express server
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
};

startServer();

// ─── Global Error Guards ──────────────────────────────────────────────────────

process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Promise Rejection:", reason);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error.message);
  process.exit(1);
});
