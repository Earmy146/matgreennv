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
  async list() { return Report.find().sort({ createdAt: -1 }).limit(100).populate("reporter", "name email").populate("material", "title status owner").populate("targetUser", "name email").lean(); }
  async update(id, status, resolution) { return Report.findByIdAndUpdate(id, { status, resolution }, { new: true }).lean(); }
}
module.exports = new ReportService();
