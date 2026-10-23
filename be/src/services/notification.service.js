const Notification = require("../models/notification.model");

class NotificationService {
  async create({ recipient, type, title, message, link }) {
    return Notification.create({ recipient, type, title, message, link });
  }

  async listForUser(userId, limit = 30) {
    const safeLimit = Math.min(50, Math.max(1, Number(limit) || 30));
    const [items, unreadCount] = await Promise.all([
      Notification.find({ recipient: userId }).sort({ createdAt: -1 }).limit(safeLimit).lean(),
      Notification.countDocuments({ recipient: userId, readAt: null }),
    ]);
    return { items, unreadCount };
  }

  async markRead(userId, notificationId) {
    return Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId, readAt: null },
      { $set: { readAt: new Date() } },
      { new: true }
    ).lean();
  }

  async markAllRead(userId) {
    const result = await Notification.updateMany(
      { recipient: userId, readAt: null },
      { $set: { readAt: new Date() } }
    );
    return { modifiedCount: result.modifiedCount };
  }
}

module.exports = new NotificationService();
