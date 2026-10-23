const User = require("../models/user.model");
const Material = require("../models/material.model");
const { OK } = require("../core/success.response");
const { NotFoundError } = require("../core/error.response");

class AdminController {
  async users(req, res, next) {
    try {
      const users = await User.find().select("-password -verificationOtp -resetPasswordOtp").sort({ createdAt: -1 }).limit(100).lean();
      new OK({ message: "Lấy danh sách người dùng thành công", data: users }).send(res);
    } catch (err) { next(err); }
  }
  async suspendUser(req, res, next) {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, { isSuspended: Boolean(req.body.suspended) }, { new: true }).select("-password");
      if (!user) throw new NotFoundError("Không tìm thấy người dùng");
      new OK({ message: "Đã cập nhật trạng thái người dùng", data: user }).send(res);
    } catch (err) { next(err); }
  }
  async materials(req, res, next) {
    try {
      const materials = await Material.find().populate("owner", "name email").sort({ createdAt: -1 }).limit(100).lean();
      new OK({ message: "Lấy danh sách bài đăng moderation thành công", data: materials }).send(res);
    } catch (err) { next(err); }
  }
  async moderateMaterial(req, res, next) {
    try {
      const material = await Material.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
      if (!material) throw new NotFoundError("Không tìm thấy bài đăng");
      new OK({ message: "Đã cập nhật bài đăng", data: material }).send(res);
    } catch (err) { next(err); }
  }
}
module.exports = new AdminController();
