import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

// Allowed order status values
export const ORDER_STATUS = {
  PENDING:   "Pending",
  CONFIRMED: "Confirmed",
  SHIPPED:   "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // Total calculated at checkout time — stored as snapshot
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: { args: [0], msg: "Total amount cannot be negative" },
      },
    },
    status: {
      type: DataTypes.ENUM(
        ORDER_STATUS.PENDING,
        ORDER_STATUS.CONFIRMED,
        ORDER_STATUS.SHIPPED,
        ORDER_STATUS.DELIVERED,
        ORDER_STATUS.CANCELLED
      ),
      allowNull: false,
      defaultValue: ORDER_STATUS.PENDING,
    },
  },
  {
    tableName: "orders",
    timestamps: true,
  }
);

export default Order;
