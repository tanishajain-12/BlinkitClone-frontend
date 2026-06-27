import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Product name cannot be empty" },
        len: { args: [2, 200], msg: "Product name must be between 2 and 200 characters" },
      },
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Product description cannot be empty" },
      },
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: { msg: "Price must be a valid number" },
        min: { args: [0.01], msg: "Price must be greater than 0" },
      },
    },

    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isInt: { msg: "Stock must be a whole number" },
        min: { args: [0], msg: "Stock cannot be negative" },
      },
    },

    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Category cannot be empty" },
      },
    },

    // Stores an image URL or relative file path (e.g. "/uploads/img.jpg")
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },

    isAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "products",  // Explicit table name
    timestamps: true,       // Adds createdAt and updatedAt
  }
);

// Sync is handled centrally in models/index.js
export default Product;
