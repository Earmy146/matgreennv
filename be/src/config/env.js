const logger = require("../utils/logger");

const requiredEnvs = [];

if (process.env.NODE_ENV === "production") {
  requiredEnvs.push("MONGODB_URI", "JWT_SECRET");
}

const missing = requiredEnvs.filter((key) => !process.env[key]);

if (missing.length > 0) {
  logger.error({ missing }, `Thiếu các biến môi trường bắt buộc: ${missing.join(", ")}`);
  if (process.env.NODE_ENV === "production") {
    process.exit(1);
  }
}

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/matgreen",
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  JWT_SECRET: process.env.JWT_SECRET || "matgreen_dev_secret_key_1234567890",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  CORS_ORIGINS: process.env.CORS_ORIGINS || "*",
};
