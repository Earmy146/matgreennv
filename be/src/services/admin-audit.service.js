const AdminAuditLog = require("../models/admin-audit-log.model");

class AdminAuditService {
  async record({ actor, action, targetType, targetId, reason, metadata }) {
    return AdminAuditLog.create({ actor, action, targetType, targetId, reason, metadata });
  }

  async list({ page = 1, limit = 25 }) {
    const currentPage = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(limit) || 25));
    const [items, total] = await Promise.all([
      AdminAuditLog.find()
        .populate("actor", "name email role")
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .lean(),
      AdminAuditLog.countDocuments(),
    ]);
    return { items, pagination: { page: currentPage, limit: pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }
}

module.exports = new AdminAuditService();
