class ErrorResponse extends Error {
  constructor(message = "Lỗi hệ thống máy chủ", statusCode = 500, errorCode = "INTERNAL_ERROR") {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.status = statusCode;
    this.errorCode = errorCode;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message = "Yêu cầu không hợp lệ", errorCode = "BAD_REQUEST") {
    super(message, 400, errorCode);
  }
}

class AuthFailureError extends ErrorResponse {
  constructor(message = "Xác thực không thành công", errorCode = "UNAUTHORIZED") {
    super(message, 401, errorCode);
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(message = "Không có quyền truy cập", errorCode = "FORBIDDEN") {
    super(message, 403, errorCode);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(message = "Không tìm thấy dữ liệu yêu cầu", errorCode = "NOT_FOUND") {
    super(message, 404, errorCode);
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(message = "Dữ liệu bị trùng lặp hoặc xung đột", errorCode = "CONFLICT") {
    super(message, 409, errorCode);
  }
}

module.exports = {
  ErrorResponse,
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
  NotFoundError,
  ConflictRequestError,
};
