const mongoose = require("mongoose");
const dns = require("dns");
const logger = require("../utils/logger");
const env = require("./env");

const dbLogger = logger.child({ component: "database" });

const mongoDnsServers = (process.env.MONGODB_DNS_SERVERS || "")
  .split(",")
  .map((server) => server.trim())
  .filter(Boolean);

if (mongoDnsServers.length > 0) {
  try {
    dns.setServers(mongoDnsServers);
  } catch (err) {
    dbLogger.warn({ err: err.message }, "Không thể cấu hình custom DNS servers:");
  }
}

async function connectDB() {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
      autoIndex: true,
    });

    dbLogger.info(`MongoDB đã kết nối thành công: ${conn.connection.host} (DB: ${conn.connection.name})`);
    return conn;
  } catch (err) {
    dbLogger.error({ err: err.message }, "Lỗi khi kết nối MongoDB:");
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
    throw err;
  }
}

module.exports = connectDB;

