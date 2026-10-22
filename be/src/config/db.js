const mongoose = require("mongoose");
const logger = require("../utils/logger");
const env = require("./env");

const dbLogger = logger.child({ component: "database" });

async function connectDB() {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true,
    });

    dbLogger.info(`MongoDB đã kết nối thành công: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    dbLogger.error({ err: err.message }, "Lỗi khi kết nối MongoDB:");
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
}

module.exports = connectDB;
