import { User, Product, Order, OrderItem } from "../models/index.js";
import { ORDER_STATUS } from "../models/Order.js";

// Allowed status values as an array for validation
const VALID_STATUSES = Object.values(ORDER_STATUS);

// ─── GET /api/admin/orders ────────────────────────────────────────────────────

/**
 * Returns every order in the database, newest first.
 * Includes customer info, order items, and product details.
 */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "name", "email", "phone"], // No password
        },
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ["id", "name", "image", "category", "price"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Admin get all orders error:", error.message);
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

// ─── PUT /api/admin/orders/:id/status ────────────────────────────────────────

/**
 * Updates the status of any order.
 * Validates against the enum defined in the Order model.
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // ── Validate ID ────────────────────────────────────────────────────────
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({ success: false, message: "Invalid order ID." });
    }

    // ── Validate status value ──────────────────────────────────────────────
    if (!status) {
      return res.status(400).json({ success: false, message: "status is required." });
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${VALID_STATUSES.join(", ")}.`,
      });
    }

    // ── Find and update order ──────────────────────────────────────────────
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    await order.update({ status });

    // Return updated order with items
    const updatedOrder = await Order.findByPk(id, {
      include: [
        { model: User, attributes: ["id", "name", "email"] },
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ["id", "name", "image"] }],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: `Order status updated to "${status}".`,
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Admin update order status error:", error.message);
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

// ─── GET /api/admin/dashboard ─────────────────────────────────────────────────

/**
 * Returns key business metrics in a single query-efficient response.
 * All counts and aggregates run in parallel via Promise.all.
 */
export const getDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      revenueResult,
      pendingOrders,
      deliveredOrders,
    ] = await Promise.all([
      // Count all registered users
      User.count(),

      // Count all products
      Product.count(),

      // Count all orders
      Order.count(),

      // Sum revenue from delivered orders only
      Order.findOne({
        attributes: [
          [
            Order.sequelize.fn("SUM", Order.sequelize.col("totalAmount")),
            "totalRevenue",
          ],
        ],
        where: { status: ORDER_STATUS.DELIVERED },
        raw: true,
      }),

      // Count pending orders
      Order.count({ where: { status: ORDER_STATUS.PENDING } }),

      // Count delivered orders
      Order.count({ where: { status: ORDER_STATUS.DELIVERED } }),
    ]);

    const totalRevenue = parseFloat(revenueResult?.totalRevenue || 0).toFixed(2);

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: parseFloat(totalRevenue),
        pendingOrders,
        deliveredOrders,
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error.message);
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};
