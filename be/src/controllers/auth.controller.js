const authService = require("../services/auth.service");
const { OK, CREATED } = require("../core/success.response");

class AuthController {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      new CREATED({
        message: "Đăng ký tài khoản thành công",
        data: result,
      }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      new OK({
        message: "Đăng nhập thành công",
        data: result,
      }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async me(req, res, next) {
    try {
      new OK({
        message: "Lấy thông tin tài khoản thành công",
        data: req.user,
      }).send(res);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
