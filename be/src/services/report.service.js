const Report = require("../models/report.model");
const Material = require("../models/material.model");
const User = require("../models/user.model");
const { BadRequestError, NotFoundError } = require("../core/error.response");
class ReportService {
  async create(userId, { targetType, materialId, targetUserId, reason }) {
    if (!reason?.trim()) throw new BadRequestError("Vui lòng nhập lý do báo cáo");
    if (targetType === "material" && !(await Material.exists({ _id: materialId }))) throw new NotFoundError("Không tìm thấy bài đăng");
    if (targetType === "user" && !(await User.exists({ _id: targetUserId }))) throw new NotFoundError("Không tìm thấy người dùng");
    return Report.create({ reporter: userId, targetType, material: targetType === "material" ? materialId : undefined, targetUser: targetType === "user" ? targetUserId : undefined, reason });
  }
  async list({ page = 1, limit = 25, status } = {}) {
    const currentPage = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(limit) || 25));
    const query = status ? { status } : {};
    const [items, total] = await Promise.all([
      Report.find(query).sort({ createdAt: -1 }).skip((currentPage - 1) * pageSize).limit(pageSize)
        .populate("reporter", "name email").populate("material", "title status owner").populate("targetUser", "name email").lean(),
      Report.countDocuments(query),
    ]);
    return { items, pagination: { page: currentPage, limit: pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }
  async update(id, status, resolution) {
    if (!["open", "reviewing", "resolved", "rejected"].includes(status) || !resolution?.trim()) {
      throw new BadRequestError("Trạng thái và lý do xử lý là bắt buộc");
    }
    const report = await Report.findByIdAndUpdate(id, { status, resolution: resolution.trim() }, { new: true }).lean();
    if (!report) throw new NotFoundError("Không tìm thấy báo cáo");
    return report;
  }
}
module.exports = new ReportService();
