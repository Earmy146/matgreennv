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

  async verifyEmail(req, res, next) {
    try {
      const result = await authService.verifyEmail(req.body);
      new OK({
        message: result.message || "Xác thực tài khoản thành công",
        data: result,
      }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async resendOtp(req, res, next) {
    try {
      const result = await authService.resendOtp(req.body);
      new OK({
        message: result.message || "Gửi lại mã xác thực thành công",
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

    async updateProfile(req, res, next) {
      try {
        const data = await authService.updateProfile(req.user.id, req.body);
        new OK({ message: "Cập nhật hồ sơ thành công", data }).send(res);
      } catch (err) { next(err); }
    }

    async changePassword(req, res, next) {
      try {
        const data = await authService.changePassword(req.user.id, req.body);
        new OK({ message: data.message, data }).send(res);
      } catch (err) { next(err); }
    }

    async forgotPassword(req, res, next) {
      try {
        const data = await authService.forgotPassword(req.body);
        new OK({ message: data.message, data }).send(res);
      } catch (err) { next(err); }
    }

    async resetPassword(req, res, next) {
      try {
        const data = await authService.resetPassword(req.body);
        new OK({ message: data.message, data }).send(res);
      } catch (err) { next(err); }
    }

    async requestPhoneVerification(req, res, next) {
      try {
        const data = await authService.requestPhoneVerification(req.user.id, req.body.note);
        new OK({ message: "Đã gửi yêu cầu xác minh số điện thoại tới admin", data }).send(res);
      } catch (err) { next(err); }
    }

    async publicProfile(req, res, next) {
      try {
        const data = await authService.publicProfile(req.params.id);
        new OK({ message: "Lấy hồ sơ người dùng thành công", data }).send(res);
      } catch (err) { next(err); }
    }
  }
}

module.exports = new AuthController();
