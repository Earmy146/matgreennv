const jwt = require("jsonwebtoken");
const { AuthFailureError } = require("../core/error.response");
const env = require("../config/env");
const User = require("../models/user.model");

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AuthFailureError("Vui lòng đăng nhập để thực hiện thao tác này"));
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("isSuspended");
    if (user?.isSuspended) return next(new AuthFailureError("Tài khoản đã bị tạm khóa"));
    req.user = decoded;
    return next();
  } catch (err) {
    return next(new AuthFailureError("Phiên đăng nhập đã hết hạn hoặc không hợp lệ"));
  }
}

module.exports = {
  authenticate,
};
