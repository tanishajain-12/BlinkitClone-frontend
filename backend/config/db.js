// dotenv is loaded via "import dotenv/config" in server.js — first import in the app.
// By the time this module is evaluated, all env vars are already populated.
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host:    process.env.DB_HOST || "localhost",
    port:    Number(process.env.DB_PORT) || 3306,
    dialect: "mysql",
    logging: false,
    pool: {
      max:     10,
      min:     0,
      acquire: 30000,
      idle:    10000,
    },
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL Database connected successfully.");
  } catch (error) {
    // Print the full error so the exact cause is always visible in the terminal
    console.error("❌ Unable to connect to the database:", error.message);
    console.error(error);
    process.exit(1);
  }
};

export default sequelize;
