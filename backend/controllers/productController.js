import { Op } from "sequelize";
import Product from "../models/Product.js";
import { deleteUploadedFile } from "../config/multer.js";

// ─── Helper: parse positive float from query string ───────────────────────────
const toPositiveFloat = (value) => {
  const n = parseFloat(value);
  return !isNaN(n) && n > 0 ? n : null;
};

// ─── Helper: validate integer ID from req.params ─────────────────────────────
const isValidId = (id) => Number.isInteger(Number(id)) && Number(id) > 0;

// ─── GET /api/products ────────────────────────────────────────────────────────

/**
 * Public. Returns available products with optional filters and pagination.
 *
 * Query params:
 *   category, search, minPrice, maxPrice
 *   sort = price_asc | price_desc  (default: newest first)
 *   page = 1, limit = 20
 */
export const getAllProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort } = req.query;

    // ── Pagination ─────────────────────────────────────────────────────────
    const page  = Math.max(1, parseInt(req.query.page,  10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const offset = (page - 1) * limit;

    // ── WHERE clause — always filter to available products publicly ────────
    const where = { isAvailable: true };

    if (category?.trim()) {
      where.category = { [Op.like]: `%${category.trim()}%` };
    }

    if (search?.trim()) {
      where[Op.or] = [
        { name:        { [Op.like]: `%${search.trim()}%` } },
        { description: { [Op.like]: `%${search.trim()}%` } },
      ];
    }

    const min = toPositiveFloat(minPrice);
    const max = toPositiveFloat(maxPrice);

    if (min !== null && max !== null) {
      if (min > max) {
        return res.status(400).json({
          success: false,
          message: "minPrice cannot be greater than maxPrice.",
        });
      }
      where.price = { [Op.between]: [min, max] };
    } else if (min !== null) {
      where.price = { [Op.gte]: min };
    } else if (max !== null) {
      where.price = { [Op.lte]: max };
    }

    // ── ORDER clause ───────────────────────────────────────────────────────
    const order =
      sort === "price_asc"  ? [["price", "ASC"]]  :
      sort === "price_desc" ? [["price", "DESC"]] :
      [["createdAt", "DESC"]];

    // ── Query with count for pagination metadata ───────────────────────────
    const { count: totalProducts, rows: products } = await Product.findAndCountAll({
      where,
      order,
      limit,
      offset,
    });

    const totalPages = Math.ceil(totalProducts / limit);

    return res.status(200).json({
      success:       true,
      page,
      limit,
      totalPages,
      totalProducts,
      data:          products,
    });
  } catch (error) {
    console.error("Get all products error:", error.message);
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

// ─── GET /api/products/:id ────────────────────────────────────────────────────

/**
 * Public. Returns a single available product.
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID." });
    }

    const product = await Product.findOne({
      where: { id, isAvailable: true },
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("Get product by ID error:", error.message);
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

// ─── POST /api/products ───────────────────────────────────────────────────────

/**
 * Admin only. Creates a product. Accepts optional multipart image upload.
 */
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, isAvailable } = req.body;

    // ── Validate required fields ───────────────────────────────────────────
    if (!name?.trim() || !description?.trim() || price === undefined || stock === undefined || !category?.trim()) {
      return res.status(400).json({
        success: false,
        message: "name, description, price, stock, and category are required.",
      });
    }

    if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      return res.status(400).json({ success: false, message: "Price must be a number greater than 0." });
    }

    if (!Number.isInteger(Number(stock)) || Number(stock) < 0) {
      return res.status(400).json({ success: false, message: "Stock must be a non-negative whole number." });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : (req.body.image || null);

    const product = await Product.create({
      name:        name.trim(),
      description: description.trim(),
      price:       parseFloat(price),
      stock:       parseInt(stock, 10),
      category:    category.trim(),
      image:       imagePath,
      isAvailable: isAvailable !== undefined ? isAvailable === "true" || isAvailable === true : true,
    });

    return res.status(201).json({ success: true, message: "Product created successfully.", data: product });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({ success: false, message: error.errors[0].message });
    }
    console.error("Create product error:", error.message);
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

// ─── PUT /api/products/:id ────────────────────────────────────────────────────

/**
 * Admin only. Updates a product.
 * If a new image is uploaded, the old image file is deleted from disk.
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID." });
    }

    // Find by PK regardless of isAvailable — admin can edit unavailable products
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    const { name, description, price, stock, category, isAvailable } = req.body;

    // ── Field-level validation ─────────────────────────────────────────────
    if (name !== undefined && !name.trim()) {
      return res.status(400).json({ success: false, message: "Product name cannot be empty." });
    }
    if (category !== undefined && !category.trim()) {
      return res.status(400).json({ success: false, message: "Category cannot be empty." });
    }
    if (price !== undefined && (isNaN(parseFloat(price)) || parseFloat(price) <= 0)) {
      return res.status(400).json({ success: false, message: "Price must be a number greater than 0." });
    }
    if (stock !== undefined && (!Number.isInteger(Number(stock)) || Number(stock) < 0)) {
      return res.status(400).json({ success: false, message: "Stock must be a non-negative whole number." });
    }

    // ── Build partial update ───────────────────────────────────────────────
    const updates = {};
    if (name        !== undefined) updates.name        = name.trim();
    if (description !== undefined) updates.description = description.trim();
    if (price       !== undefined) updates.price       = parseFloat(price);
    if (stock       !== undefined) updates.stock       = parseInt(stock, 10);
    if (category    !== undefined) updates.category    = category.trim();
    if (isAvailable !== undefined) updates.isAvailable = isAvailable === "true" || isAvailable === true;

    // ── Handle image replacement ───────────────────────────────────────────
    if (req.file) {
      // Delete the old image file from disk before saving the new path
      deleteUploadedFile(product.image);
      updates.image = `/uploads/${req.file.filename}`;
    } else if (req.body.image !== undefined) {
      updates.image = req.body.image || null;
    }

    await product.update(updates);

    return res.status(200).json({ success: true, message: "Product updated successfully.", data: product });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({ success: false, message: error.errors[0].message });
    }
    console.error("Update product error:", error.message);
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

// ─── DELETE /api/products/:id ─────────────────────────────────────────────────

/**
 * Admin only.
 * Soft-delete: sets isAvailable = false instead of removing the database row.
 * Also deletes the associated image file from disk.
 * Preserves order history integrity — OrderItems still reference this product.
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID." });
    }

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    // Delete image file from disk if one exists
    deleteUploadedFile(product.image);

    // Soft delete — mark unavailable, keep the row for order history
    await product.update({ isAvailable: false });

    return res.status(200).json({ success: true, message: "Product deleted successfully." });
  } catch (error) {
    console.error("Delete product error:", error.message);
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};
