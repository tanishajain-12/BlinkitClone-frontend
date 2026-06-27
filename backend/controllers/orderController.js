import sequelize from "../config/db.js";
import { Cart, CartItem, Product, Order, OrderItem } from "../models/index.js";

// ─── POST /api/orders ─────────────────────────────────────────────────────────

/**
 * Checkout — converts the user's cart into an order.
 *
 * All steps run inside a single transaction:
 *  1. Load cart (cart items only — no product data yet)
 *  2. Validate cart is not empty
 *  3. Re-fetch each product INSIDE the transaction with a row lock
 *     → prevents race conditions where two users buy the last item simultaneously
 *  4. Validate availability and stock for every item
 *  5. Calculate total
 *  6. Create Order
 *  7. Create OrderItems (price snapshot)
 *  8. Decrement stock atomically
 *  9. Clear the cart
 * 10. Commit
 */
export const placeOrder = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    // ── 1. Load cart items (no product join here — we re-fetch below) ──────
    const cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [{ model: CartItem }],
      transaction: t,
    });

    // ── 2. Validate cart ───────────────────────────────────────────────────
    if (!cart || !cart.CartItems.length) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Your cart is empty. Add products before placing an order.",
      });
    }

    // ── 3. Re-fetch each product INSIDE the transaction ───────────────────
    // Using LOCK.UPDATE prevents concurrent checkouts from reading stale stock
    const productIds      = cart.CartItems.map((i) => i.productId);
    const freshProducts   = await Product.findAll({
      where: { id: productIds },
      lock:  t.LOCK.UPDATE,
      transaction: t,
    });

    // Index by ID for O(1) lookup
    const productMap = Object.fromEntries(freshProducts.map((p) => [p.id, p]));

    // ── 4. Validate every item against fresh stock ─────────────────────────
    for (const item of cart.CartItems) {
      const product = productMap[item.productId];

      if (!product) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.productId} no longer exists.`,
        });
      }
      if (!product.isAvailable) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: `"${product.name}" is currently unavailable.`,
        });
      }
      if (item.quantity > product.stock) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}.`,
        });
      }
    }

    // ── 5. Calculate total ─────────────────────────────────────────────────
    const totalAmount = cart.CartItems.reduce(
      (sum, item) => sum + parseFloat(productMap[item.productId].price) * item.quantity,
      0
    );

    // ── 6. Create Order ────────────────────────────────────────────────────
    const order = await Order.create(
      {
        userId:      req.user.id,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        status:      "Pending",
      },
      { transaction: t }
    );

    // ── 7. Create OrderItems with price snapshot ───────────────────────────
    const orderItemsData = cart.CartItems.map((item) => ({
      orderId:   order.id,
      productId: item.productId,
      quantity:  item.quantity,
      price:     parseFloat(productMap[item.productId].price),
    }));

    await OrderItem.bulkCreate(orderItemsData, { transaction: t });

    // ── 8. Decrement stock atomically ─────────────────────────────────────
    for (const item of cart.CartItems) {
      await Product.decrement(
        { stock: item.quantity },
        { where: { id: item.productId }, transaction: t }
      );
    }

    // ── 9. Clear the cart ──────────────────────────────────────────────────
    await CartItem.destroy({ where: { cartId: cart.id }, transaction: t });

    // ── 10. Commit ─────────────────────────────────────────────────────────
    await t.commit();

    // Return the full order after commit (outside transaction is fine here)
    const fullOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ["id", "name", "image", "category"] }],
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      data: fullOrder,
    });
  } catch (error) {
    await t.rollback();
    console.error("Place order error:", error.message);
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

// ─── GET /api/orders ──────────────────────────────────────────────────────────

/**
 * Returns all orders for the logged-in user, newest first.
 */
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ["id", "name", "image", "category"] }],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    console.error("Get orders error:", error.message);
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

// ─── GET /api/orders/:id ──────────────────────────────────────────────────────

/**
 * Returns a single order. Only the owner may access it.
 */
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({ success: false, message: "Invalid order ID." });
    }

    const order = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ["id", "name", "image", "category"] }],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    if (order.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You do not have permission to view this order.",
      });
    }

    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error("Get order by ID error:", error.message);
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};
