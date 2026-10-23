const logger = require("../utils/logger");

function errorHandler(err, req, res, next) {
  const isMulterFileSizeError = err?.name === "MulterError" && err.code === "LIMIT_FILE_SIZE";
  const statusCode = isMulterFileSizeError ? 413 : err.statusCode || 500;
  const errorCode = isMulterFileSizeError ? "PAYLOAD_TOO_LARGE" : err.errorCode || "INTERNAL_ERROR";
  const message = isMulterFileSizeError
    ? "File vượt quá dung lượng cho phép"
    : err.message || "Lỗi máy chủ không xác định";

  if (statusCode >= 500) {
    logger.error({ err, path: req.path, method: req.method }, "Server Error: " + message);
  }

  return res.status(statusCode).json({
    status: statusCode,
    errorCode,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
}

module.exports = {
  errorHandler,
};
