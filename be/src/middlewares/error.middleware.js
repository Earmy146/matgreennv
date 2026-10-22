const logger = require("../utils/logger");

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const errorCode = err.errorCode || "INTERNAL_ERROR";
  const message = err.message || "Lỗi máy chủ không xác định";

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
