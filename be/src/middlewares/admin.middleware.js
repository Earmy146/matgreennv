const { ForbiddenError } = require("../core/error.response");

const ROLE_LEVELS = { user: 0, moderator: 1, admin: 2, superadmin: 3 };

function requireAdmin(req, res, next) {
  if ((ROLE_LEVELS[req.user?.role] || 0) < ROLE_LEVELS.admin) return next(new ForbiddenError("Chỉ quản trị viên mới có quyền này"));
  return next();
}

function requireRole(role) {
  return (req, res, next) => {
    if ((ROLE_LEVELS[req.user?.role] || 0) < (ROLE_LEVELS[role] || 0)) {
      return next(new ForbiddenError("Bạn không có đủ quyền thực hiện thao tác này"));
    }
    return next();
  };
}

module.exports = { ROLE_LEVELS, requireAdmin, requireRole };
