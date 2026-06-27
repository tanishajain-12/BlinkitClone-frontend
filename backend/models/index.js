/**
 * models/index.js — Central model registry & association definitions.
 *
 * WHY THIS FILE EXISTS:
 * Sequelize associations must be defined after all models are loaded.
 * Defining them inside individual model files causes circular import issues
 * (e.g. User.js imports Cart.js which imports User.js again).
 * This file imports every model once and then wires all relationships,
 * making the dependency graph a clean DAG with no cycles.
 *
 * USAGE:
 * Import models from this file throughout the app:
 *   import { User, Cart, CartItem, Product, Order, OrderItem } from "../models/index.js";
 */

import sequelize  from "../config/db.js";
import User       from "./User.js";
import Product    from "./Product.js";
import Cart       from "./Cart.js";
import CartItem   from "./CartItem.js";
import Order      from "./Order.js";
import OrderItem  from "./OrderItem.js";

// ─── Associations ─────────────────────────────────────────────────────────────

// User ↔ Cart  (one-to-one)
User.hasOne(Cart,   { foreignKey: "userId", onDelete: "CASCADE" });
Cart.belongsTo(User, { foreignKey: "userId" });

// Cart ↔ CartItem  (one-to-many)
Cart.hasMany(CartItem,       { foreignKey: "cartId", onDelete: "CASCADE" });
CartItem.belongsTo(Cart,     { foreignKey: "cartId" });

// Product ↔ CartItem  (one-to-many)
Product.hasMany(CartItem,    { foreignKey: "productId", onDelete: "CASCADE" });
CartItem.belongsTo(Product,  { foreignKey: "productId" });

// User ↔ Order  (one-to-many)
User.hasMany(Order,           { foreignKey: "userId", onDelete: "CASCADE" });
Order.belongsTo(User,         { foreignKey: "userId" });

// Order ↔ OrderItem  (one-to-many)
Order.hasMany(OrderItem,      { foreignKey: "orderId", onDelete: "CASCADE" });
OrderItem.belongsTo(Order,    { foreignKey: "orderId" });

// Product ↔ OrderItem  (one-to-many)
Product.hasMany(OrderItem,    { foreignKey: "productId", onDelete: "CASCADE" });
OrderItem.belongsTo(Product,  { foreignKey: "productId" });

// ─── Sync all tables in dependency order ─────────────────────────────────────
// alter:true updates columns without dropping data
const syncModels = async () => {
  await User.sync({ alter: true });
  await Product.sync({ alter: true });
  await Cart.sync({ alter: true });
  await CartItem.sync({ alter: true });
  await Order.sync({ alter: true });
  await OrderItem.sync({ alter: true });
  console.log("✅ All tables synced.");
};

export {
  sequelize,
  syncModels,
  User,
  Product,
  Cart,
  CartItem,
  Order,
  OrderItem,
};
