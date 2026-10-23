const path = require("path");
const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const { errorHandler } = require("./middlewares/error.middleware");
const { NotFoundError } = require("./core/error.response");
const env = require("./config/env");

const app = express();

// Security & Parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// CORS configuration
const allowedOrigins =
  env.CORS_ORIGINS === "*"
    ? "*"
    : env.CORS_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Phục vụ tệp tĩnh ảnh đã upload (có cache 30 ngày)
const uploadRootDir = process.env.LOCAL_UPLOAD_DIR
  ? path.resolve(process.env.LOCAL_UPLOAD_DIR)
  : path.resolve(__dirname, "../uploads");

app.use(
  "/uploads",
  express.static(uploadRootDir, {
    maxAge: "30d",
    immutable: true,
  })
);

// Mount main routes under /api
app.use("/api", routes);

// 404 handler
app.use((req, res, next) => {
  next(new NotFoundError(`Đường dẫn ${req.originalUrl} không tồn tại trên hệ thống`));
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;
