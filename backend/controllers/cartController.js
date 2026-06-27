import { Cart, CartItem, Product } from "../models/index.js";

// ─── Helper: fetch cart with all items and product details ───────────────────

/**
 * Returns the full cart for a user, including CartItems and their Products.
 * Creates an empty cart automatically if the user has none yet.
 */
const getOrCreateCart = async (userId) => {
  const [cart] = await Cart.findOrCreate({
    where: { userId },
    defaults: { userId },
  });
  return cart;
};

const getCartWithItems = async (userId) => {
  const cart = await getOrCreateCart(userId);

  const fullCart = await Cart.findByPk(cart.id, {
    include: [
      {
        model: CartItem,
        include: [
          {
            model: Product,
            attributes: ["id", "name", "price", "image", "stock", "isAvailable", "category"],
          },
        ],
      },
    ],
  });

  return fullCart;
};

// ─── GET /api/cart ────────────────────────────────────────────────────────────

/**
 * Returns the logged-in user's cart with product details.
 * Creates an empty cart if none exists yet.
 */
export const getCart = async (req, res) => {
  try {
    const cart = await getCartWithItems(req.user.id);

    // Calculate cart totals
    const itemCount = cart.CartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cart.CartItems.reduce(
      (sum, item) => sum + parseFloat(item.Product.price) * item.quantity,
      0
    );

    return res.status(200).json({
      success: true,
      data: {
        id:          cart.id,
        userId:      cart.userId,
        items:       cart.CartItems,
        itemCount,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
      },
    });
  } catch (error) {
    console.error("Get cart error:", error.message);
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

// ─── POST /api/cart/add ───────────────────────────────────────────────────────

/**
 * Adds a product to the cart.
 * If the product is already in the cart, increments the quantity instead.
 */
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // ── Validate input ─────────────────────────────────────────────────────
    if (!productId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "productId and quantity are required.",
      });
    }

    const qty = parseInt(quantity, 10);
    if (!Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a whole number greater than 0.",
      });
    }

    // ── Validate product ───────────────────────────────────────────────────
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }
    if (!product.isAvailable) {
      return res.status(400).json({ success: false, message: "Product is currently unavailable." });
    }

    // ── Get or create cart ─────────────────────────────────────────────────
    const cart = await getOrCreateCart(req.user.id);

    // ── Check if item already exists in cart ──────────────────────────────
    const existingItem = await CartItem.findOne({
      where: { cartId: cart.id, productId },
    });

    const newQuantity = existingItem ? existingItem.quantity + qty : qty;

    // ── Validate against stock ─────────────────────────────────────────────
    if (newQuantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} unit(s) available in stock.`,
      });
    }

    // ── Update or create CartItem ──────────────────────────────────────────
    if (existingItem) {
      await existingItem.update({ quantity: newQuantity });
    } else {
      await CartItem.create({ cartId: cart.id, productId, quantity: qty });
    }

    // Return the updated cart
    const updatedCart = await getCartWithItems(req.user.id);
    const itemCount   = updatedCart.CartItems.reduce((s, i) => s + i.quantity, 0);
    const totalAmount = updatedCart.CartItems.reduce(
      (s, i) => s + parseFloat(i.Product.price) * i.quantity, 0
    );

    return res.status(200).json({
      success: true,
      message: existingItem ? "Cart quantity updated." : "Product added to cart.",
      data: {
        id: updatedCart.id,
        userId: updatedCart.userId,
        items: updatedCart.CartItems,
        itemCount,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
      },
    });
  } catch (error) {
    console.error("Add to cart error:", error.message);
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

// ─── PUT /api/cart/update/:itemId ─────────────────────────────────────────────

/**
 * Updates the quantity of a specific cart item.
 * Quantity must be >= 1 and <= product stock.
 */
export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({ success: false, message: "quantity is required." });
    }

    const qty = parseInt(quantity, 10);
    if (!Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a whole number greater than 0.",
      });
    }

    // ── Find the cart item and verify ownership ────────────────────────────
    const cart = await getOrCreateCart(req.user.id);
    const item = await CartItem.findOne({
      where: { id: itemId, cartId: cart.id },
      include: [{ model: Product }],
    });

    if (!item) {
      return res.status(404).json({ success: false, message: "Cart item not found." });
    }

    // ── Validate against stock ─────────────────────────────────────────────
    if (qty > item.Product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${item.Product.stock} unit(s) available in stock.`,
      });
    }

    await item.update({ quantity: qty });

    const updatedCart = await getCartWithItems(req.user.id);
    const itemCount   = updatedCart.CartItems.reduce((s, i) => s + i.quantity, 0);
    const totalAmount = updatedCart.CartItems.reduce(
      (s, i) => s + parseFloat(i.Product.price) * i.quantity, 0
    );

    return res.status(200).json({
      success: true,
      message: "Cart item updated.",
      data: {
        id: updatedCart.id,
        userId: updatedCart.userId,
        items: updatedCart.CartItems,
        itemCount,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
      },
    });
  } catch (error) {
    console.error("Update cart item error:", error.message);
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

// ─── DELETE /api/cart/remove/:itemId ─────────────────────────────────────────

/**
 * Removes a single item from the cart.
 */
export const removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await getOrCreateCart(req.user.id);
    const item = await CartItem.findOne({ where: { id: itemId, cartId: cart.id } });

    if (!item) {
      return res.status(404).json({ success: false, message: "Cart item not found." });
    }

    await item.destroy();

    const updatedCart = await getCartWithItems(req.user.id);
    const itemCount   = updatedCart.CartItems.reduce((s, i) => s + i.quantity, 0);
    const totalAmount = updatedCart.CartItems.reduce(
      (s, i) => s + parseFloat(i.Product.price) * i.quantity, 0
    );

    return res.status(200).json({
      success: true,
      message: "Item removed from cart.",
      data: {
        id: updatedCart.id,
        userId: updatedCart.userId,
        items: updatedCart.CartItems,
        itemCount,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
      },
    });
  } catch (error) {
    console.error("Remove cart item error:", error.message);
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

// ─── DELETE /api/cart/clear ───────────────────────────────────────────────────

/**
 * Removes every item from the logged-in user's cart.
 */
export const clearCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);

    await CartItem.destroy({ where: { cartId: cart.id } });

    return res.status(200).json({
      success: true,
      message: "Cart cleared.",
      data: { id: cart.id, userId: cart.userId, items: [], itemCount: 0, totalAmount: 0 },
    });
  } catch (error) {
    console.error("Clear cart error:", error.message);
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};
