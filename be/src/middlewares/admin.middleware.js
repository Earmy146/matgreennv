const { ForbiddenError } = require("../core/error.response");

function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") return next(new ForbiddenError("Chỉ quản trị viên mới có quyền này"));
  return next();
}

module.exports = { requireAdmin };
