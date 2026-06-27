import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const OrderItem = sequelize.define(
  "OrderItem",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Quantity must be a whole number" },
        min: { args: [1], msg: "Quantity must be at least 1" },
      },
    },
    // Price snapshot — captures the product price at the moment of purchase
    // Stored independently so future price changes don't alter order history
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: { args: [0.01], msg: "Price must be greater than 0" },
      },
    },
  },
  {
    tableName: "order_items",
    timestamps: true,
  }
);

export default OrderItem;
