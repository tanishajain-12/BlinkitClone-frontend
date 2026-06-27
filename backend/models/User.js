import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define(
  "User",
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
        notEmpty: { msg: "Name cannot be empty" },
        len: { args: [2, 100], msg: "Name must be between 2 and 100 characters" },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: "Email already exists" },
      validate: {
        isEmail: { msg: "Please provide a valid email address" },
        notEmpty: { msg: "Email cannot be empty" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Password cannot be empty" },
        len: { args: [8, 255], msg: "Password must be at least 8 characters" },
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
      validate: {
        is: {
          args: /^[0-9+\-\s()]*$/,
          msg: "Please provide a valid phone number",
        },
      },
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },

    // Role-based access control
    // alter:true in syncModels will add this column to existing users tables,
    // and the defaultValue ensures all pre-existing rows get role = 'customer'.
    role: {
      type: DataTypes.ENUM("customer", "admin"),
      allowNull: false,
      defaultValue: "customer",
    },
  },
  {
    tableName: "users",   // Explicit table name (avoids Sequelize pluralization surprises)
    timestamps: true,     // Adds createdAt and updatedAt columns
  }
);

// Sync is handled centrally in models/index.js
export default User;
