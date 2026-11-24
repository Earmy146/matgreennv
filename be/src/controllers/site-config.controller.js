const siteConfigService = require("../services/site-config.service");
const notificationService = require("../services/notification.service");
const User = require("../models/user.model");
const { OK, CREATED } = require("../core/success.response");
const { BadRequestError } = require("../core/error.response");

class SiteConfigController {
  async get(req, res, next) {
    try {
      const config = await siteConfigService.getConfig();
      new OK({
        message: "Lấy cấu hình website thành công",
        data: config,
      }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const config = await siteConfigService.updateConfig(req.body, req.user?.id);
      new OK({
        message: "Cập nhật cấu hình website thành công",
        data: config,
      }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async submitContact(req, res, next) {
    try {
      const { name, phone, email, subject, message } = req.body || {};
      const cleanName = String(name || "").trim();
      const cleanPhone = String(phone || "").trim();
      const cleanEmail = String(email || "").trim();
      const cleanSubject = String(subject || "Yêu cầu hỗ trợ chung").trim();
      const cleanMessage = String(message || "").trim();

      if (cleanName.length < 2 || cleanPhone.length < 8) {
        throw new BadRequestError("Vui lòng nhập họ tên và số điện thoại liên hệ hợp lệ");
      }

      const staffUsers = await User.find({
        role: { $in: ["admin", "superadmin", "moderator"] },
        suspendedAt: null,
      })
        .select("_id")
        .lean();

      const summary = `${cleanName} (${cleanPhone}${cleanEmail ? ` · ${cleanEmail}` : ""})${
        cleanMessage ? `: ${cleanMessage.slice(0, 140)}` : ""
      }`;

      await Promise.all(
        staffUsers.map((staff) =>
          notificationService.create({
            recipient: staff._id,
            type: "moderation",
            title: `Liên hệ mới: ${cleanSubject.slice(0, 60)}`,
            message: summary,
            link: "/admin",
          })
        )
      );

      new CREATED({
        message: "Đã gửi yêu cầu hỗ trợ thành công! Đội ngũ MatGreen sẽ liên hệ lại sớm nhất.",
        data: { received: true },
      }).send(res);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new SiteConfigController();
