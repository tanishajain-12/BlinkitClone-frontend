import { Sequelize } from "sequelize";

// Note: dotenv is loaded once in server.js before this module is imported.
// Initialize Sequelize with MySQL credentials from environment variables
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false, // Set to console.log to see SQL queries during development
    pool: {
      max: 10,      // Maximum number of connections in pool
      min: 0,       // Minimum number of connections in pool
      acquire: 30000, // Max time (ms) to wait for a connection before throwing error
      idle: 10000,  // Time (ms) a connection can sit idle before being released
    },
  }
);

// Test the database connection
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL Database connected successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error.message);
    process.exit(1); // Exit process if DB connection fails
  }
};

export default sequelize;
