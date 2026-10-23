const notificationService = require("../services/notification.service");
const { OK } = require("../core/success.response");

class NotificationController {
  async list(req, res, next) {
    try {
      const result = await notificationService.listForUser(req.user.id, req.query.limit);
      new OK({ message: "Lấy thông báo thành công", data: result }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async markRead(req, res, next) {
    try {
      const result = await notificationService.markRead(req.user.id, req.params.id);
      new OK({ message: "Đã cập nhật thông báo", data: result }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async markAllRead(req, res, next) {
    try {
      const result = await notificationService.markAllRead(req.user.id);
      new OK({ message: "Đã đọc tất cả thông báo", data: result }).send(res);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new NotificationController();
