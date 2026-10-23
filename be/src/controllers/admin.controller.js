const User = require("../models/user.model");
const Material = require("../models/material.model");
const { OK } = require("../core/success.response");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const adminAuditService = require("../services/admin-audit.service");
const notificationService = require("../services/notification.service");
const logger = require("../utils/logger");

class AdminController {
  async users(req, res, next) {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 25));
      const query = req.query.search ? { $or: [{ name: { $regex: req.query.search, $options: "i" } }, { email: { $regex: req.query.search, $options: "i" } }] } : {};
      const [items, total] = await Promise.all([
        User.find(query).select("-password -verificationOtp -resetPasswordOtp").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
        User.countDocuments(query),
      ]);
      new OK({ message: "Lấy danh sách người dùng thành công", data: { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } } }).send(res);
    } catch (err) { next(err); }
  }
  async suspendUser(req, res, next) {
    try {
      if (!req.body.reason?.trim()) throw new BadRequestError("Lý do khóa/mở khóa tài khoản là bắt buộc");
      const user = await User.findByIdAndUpdate(req.params.id, { isSuspended: Boolean(req.body.suspended) }, { new: true }).select("-password");
      if (!user) throw new NotFoundError("Không tìm thấy người dùng");
      await adminAuditService.record({ actor: req.user.id, action: user.isSuspended ? "suspend_user" : "unsuspend_user", targetType: "user", targetId: user._id, reason: req.body.reason });
      await notificationService.create({ recipient: user._id, type: "moderation", title: user.isSuspended ? "Tài khoản bị tạm khóa" : "Tài khoản đã được mở khóa", message: req.body.reason, link: "/dashboard" });
      new OK({ message: "Đã cập nhật trạng thái người dùng", data: user }).send(res);
    } catch (err) { next(err); }
  }
  async materials(req, res, next) {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 25));
      const [items, total] = await Promise.all([
        Material.find().populate("owner", "name email").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
        Material.countDocuments(),
      ]);
      new OK({ message: "Lấy danh sách bài đăng moderation thành công", data: { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } } }).send(res);
    } catch (err) { next(err); }
  }
  async moderateMaterial(req, res, next) {
    try {
      if (!req.body.reason?.trim()) throw new BadRequestError("Lý do ẩn/hiện bài đăng là bắt buộc");
      const material = await Material.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
      if (!material) throw new NotFoundError("Không tìm thấy bài đăng");
      await adminAuditService.record({ actor: req.user.id, action: `moderate_material_${req.body.status}`, targetType: "material", targetId: material._id, reason: req.body.reason });
      await notificationService.create({ recipient: material.owner, type: "moderation", title: "Cập nhật bài đăng", message: req.body.reason, link: `/materials/${material._id}` });
      new OK({ message: "Đã cập nhật bài đăng", data: material }).send(res);
    } catch (err) { next(err); }
  }
  async stats(req, res, next) {
    try {
      const [users, suspendedUsers, materials, openReports, reviewingReports, resolvedReports] = await Promise.all([
        User.countDocuments(), User.countDocuments({ isSuspended: true }), Material.countDocuments(),
        require("../models/report.model").countDocuments({ status: "open" }),
        require("../models/report.model").countDocuments({ status: "reviewing" }),
        require("../models/report.model").countDocuments({ status: "resolved" }),
      ]);
      new OK({ message: "Lấy thống kê moderation thành công", data: { users, suspendedUsers, materials, reports: { open: openReports, reviewing: reviewingReports, resolved: resolvedReports } } }).send(res);
    } catch (err) { next(err); }
  }
  async auditLogs(req, res, next) {
    try { new OK({ message: "Lấy nhật ký admin thành công", data: await adminAuditService.list(req.query) }).send(res); } catch (err) { next(err); }
  }
  async phoneVerificationRequests(req, res, next) {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 25));
      const query = { phoneVerificationRequestedAt: { $ne: null }, phoneVerified: false };
      const [items, total] = await Promise.all([
        User.find(query).select("name email phone bio phoneVerified phoneVerificationRequestedAt phoneVerificationNote").sort({ phoneVerificationRequestedAt: 1 }).skip((page - 1) * limit).limit(limit).lean(),
        User.countDocuments(query),
      ]);
      new OK({ message: "Lấy yêu cầu xác minh số điện thoại thành công", data: { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } } }).send(res);
    } catch (err) { next(err); }
  }
  async verifyPhone(req, res, next) {
    try {
      const { verified, reason } = req.body;
      if (typeof verified !== "boolean" || !reason?.trim()) throw new BadRequestError("Trạng thái và lý do xử lý là bắt buộc");
      const user = await User.findByIdAndUpdate(req.params.id, {
        phoneVerified: verified,
        phoneVerificationRequestedAt: null,
        phoneVerificationNote: reason.trim(),
      }, { new: true }).select("-password -verificationOtp -resetPasswordOtp");
      if (!user) throw new NotFoundError("Không tìm thấy người dùng");
      await adminAuditService.record({ actor: req.user.id, action: verified ? "verify_phone" : "reject_phone", targetType: "user", targetId: user._id, reason });
      await notificationService.create({
        recipient: user._id,
        type: "moderation",
        title: verified ? "Số điện thoại đã được xác minh" : "Yêu cầu xác minh số điện thoại chưa được duyệt",
        message: reason.trim(),
        link: "/profile",
      });
      new OK({ message: "Đã cập nhật xác minh số điện thoại", data: user }).send(res);
    } catch (err) { next(err); }
  }
}
module.exports = new AdminController();
