require("dotenv").config();
const http = require("http");
const app = require("./src/app");
const connectDB = require("./src/config/db");
const { initSocket } = require("./src/socket");
const env = require("./src/config/env");
const logger = require("./src/utils/logger");

const server = http.createServer(app);

// Khởi tạo Socket.IO cho chat realtime
const allowedOrigins =
  env.CORS_ORIGINS === "*"
    ? ["*"]
    : env.CORS_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean);

initSocket(server, allowedOrigins);

async function startServer() {
  try {
    await connectDB();
    server.listen(env.PORT, () => {
      logger.info(`🚀 MatGreen Backend đang chạy trên cổng ${env.PORT} (${env.NODE_ENV})`);
      logger.info(`👉 API Health check: http://localhost:${env.PORT}/api/health`);
    });
  } catch (err) {
    logger.error({ err }, "Không thể khởi động server:");
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM nhận được. Đang đóng kết nối...");
  server.close(() => {
    logger.info("Server đã đóng an toàn.");
    process.exit(0);
  });
});

startServer();
