const User = require("../models/user.model");
const Material = require("../models/material.model");
const MaterialRequest = require("../models/material-request.model");
const Report = require("../models/report.model");
const AiConversation = require("../models/ai-conversation.model");
const env = require("../config/env");
const { OK } = require("../core/success.response");
const { BadRequestError, ForbiddenError, NotFoundError } = require("../core/error.response");
const adminAuditService = require("../services/admin-audit.service");
const notificationService = require("../services/notification.service");

class AdminController {
  async users(req, res, next) {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
      const query = {};
      if (req.query.search && String(req.query.search).trim()) {
        const term = String(req.query.search).trim();
        query.$or = [
          { name: { $regex: term, $options: "i" } },
          { email: { $regex: term, $options: "i" } },
          { phone: { $regex: term, $options: "i" } },
        ];
      }
      if (req.query.role && req.query.role !== "all") {
        query.role = req.query.role;
      }
      if (req.query.suspended === "true") query.isSuspended = true;
      if (req.query.suspended === "false") query.isSuspended = false;

      const [items, total] = await Promise.all([
        User.find(query)
          .select("-password -verificationOtp -resetPasswordOtp")
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
        User.countDocuments(query),
      ]);
      new OK({
        message: "Lấy danh sách người dùng thành công",
        data: { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } },
      }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async suspendUser(req, res, next) {
    try {
      if (!req.body.reason?.trim()) throw new BadRequestError("Lý do khóa/mở khóa tài khoản là bắt buộc");
      const target = await User.findById(req.params.id);
      if (!target) throw new NotFoundError("Không tìm thấy người dùng");
      if (target.role === "admin" || target.role === "superadmin") {
        throw new ForbiddenError("Không thể khóa tài khoản quản trị viên");
      }
      target.isSuspended = Boolean(req.body.suspended);
      await target.save();

      await adminAuditService.record({
        actor: req.user.id,
        action: target.isSuspended ? "suspend_user" : "unsuspend_user",
        targetType: "user",
        targetId: target._id,
        reason: req.body.reason.trim(),
      });
      await notificationService.create({
        recipient: target._id,
        type: "moderation",
        title: target.isSuspended ? "Tài khoản bị tạm khóa" : "Tài khoản đã được mở khóa",
        message: req.body.reason.trim(),
        link: "/dashboard",
      });
      const safeUser = target.toObject();
      delete safeUser.password;
      new OK({ message: "Đã cập nhật trạng thái người dùng", data: safeUser }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async updateUserRole(req, res, next) {
    try {
      const { role, reason } = req.body;
      if (!["user", "moderator"].includes(role)) {
        throw new BadRequestError("Chỉ hỗ trợ phân quyền Thành viên (user) hoặc Kiểm duyệt viên (moderator)");
      }
      if (!reason?.trim()) throw new BadRequestError("Vui lòng nhập lý do thay đổi vai trò");
      if (String(req.params.id) === String(req.user.id)) {
        throw new ForbiddenError("Không thể tự thay đổi vai trò của chính mình");
      }

      const target = await User.findById(req.params.id);
      if (!target) throw new NotFoundError("Không tìm thấy người dùng");
      if (target.role === "admin" || target.role === "superadmin") {
        throw new ForbiddenError("Không thể thay đổi vai trò của quản trị viên cấp cao");
      }

      target.role = role;
      await target.save();

      await adminAuditService.record({
        actor: req.user.id,
        action: `change_role_${role}`,
        targetType: "user",
        targetId: target._id,
        reason: reason.trim(),
      });
      await notificationService.create({
        recipient: target._id,
        type: "moderation",
        title: "Cập nhật vai trò tài khoản",
        message: `Vai trò của bạn đã được cập nhật thành ${role === "moderator" ? "Kiểm duyệt viên" : "Thành viên"}. Lý do: ${reason.trim()}`,
        link: "/profile",
      });

      const safeUser = target.toObject();
      delete safeUser.password;
      new OK({ message: "Đã cập nhật vai trò người dùng", data: safeUser }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async materials(req, res, next) {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
      const query = {};
      if (req.query.status && req.query.status !== "all") {
        query.status = req.query.status;
      }
      if (req.query.category && req.query.category !== "all") {
        query.category = req.query.category;
      }
      if (req.query.type && req.query.type !== "all") {
        query.type = req.query.type;
      }
      if (req.query.search && String(req.query.search).trim()) {
        const term = String(req.query.search).trim();
        query.$or = [
          { title: { $regex: term, $options: "i" } },
          { "location.address": { $regex: term, $options: "i" } },
          { contactPhone: { $regex: term, $options: "i" } },
        ];
      }

      const [items, total] = await Promise.all([
        Material.find(query)
          .populate("owner", "name email phone avatar phoneVerified")
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
        Material.countDocuments(query),
      ]);
      new OK({
        message: "Lấy danh sách bài đăng moderation thành công",
        data: { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } },
      }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async moderateMaterial(req, res, next) {
    try {
      if (!req.body.reason?.trim()) throw new BadRequestError("Lý do ẩn/hiện bài đăng là bắt buộc");
      const material = await Material.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
      );
      if (!material) throw new NotFoundError("Không tìm thấy bài đăng");
      await adminAuditService.record({
        actor: req.user.id,
        action: `moderate_material_${req.body.status}`,
        targetType: "material",
        targetId: material._id,
        reason: req.body.reason.trim(),
      });
      await notificationService.create({
        recipient: material.owner,
        type: "moderation",
        title: "Cập nhật trạng thái bài đăng",
        message: req.body.reason.trim(),
        link: `/materials/${material._id}`,
      });
      new OK({ message: "Đã cập nhật bài đăng", data: material }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async deleteMaterial(req, res, next) {
    try {
      const reason = String(req.body?.reason || req.query?.reason || "").trim();
      if (!reason) throw new BadRequestError("Lý do xóa bài đăng là bắt buộc");
      const material = await Material.findByIdAndDelete(req.params.id);
      if (!material) throw new NotFoundError("Không tìm thấy bài đăng");

      await adminAuditService.record({
        actor: req.user.id,
        action: "delete_material",
        targetType: "material",
        targetId: material._id,
        reason,
      });
      await notificationService.create({
        recipient: material.owner,
        type: "moderation",
        title: `Bài đăng "${material.title}" đã bị gỡ`,
        message: `Lý do từ Ban quản trị: ${reason}`,
        link: "/my-posts",
      });
      new OK({ message: "Đã xóa vĩnh viễn bài đăng vi phạm", data: { deleted: true, id: req.params.id } }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async stats(req, res, next) {
    try {
      const probeAiPromise = fetch(`${env.AI_SERVICE_URL.replace(/\/$/, "")}/health/ready`, {
        signal: AbortSignal.timeout(3000),
      })
        .then((r) => (r.ok ? r.json() : { status: "unreachable" }))
        .catch(() => ({ status: "unreachable" }));

      const [
        users,
        suspendedUsers,
        verifiedPhones,
        materials,
        freeMaterials,
        sellMaterials,
        completedMaterials,
        categoryAgg,
        totalRequests,
        completedRequests,
        aiConversations,
        openReports,
        reviewingReports,
        resolvedReports,
        aiHealth,
      ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ isSuspended: true }),
        User.countDocuments({ phoneVerified: true }),
        Material.countDocuments(),
        Material.countDocuments({ type: "free" }),
        Material.countDocuments({ type: "sell" }),
        Material.countDocuments({ status: "completed" }),
        Material.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
        MaterialRequest.countDocuments(),
        MaterialRequest.countDocuments({ status: "completed" }),
        AiConversation.countDocuments(),
        Report.countDocuments({ status: "open" }),
        Report.countDocuments({ status: "reviewing" }),
        Report.countDocuments({ status: "resolved" }),
        probeAiPromise,
      ]);

      new OK({
        message: "Lấy thống kê quản trị thành công",
        data: {
          users,
          suspendedUsers,
          verifiedPhones,
          materials,
          freeMaterials,
          sellMaterials,
          completedMaterials,
          categoryBreakdown: categoryAgg.map((row) => ({
            category: row._id || "khac",
            count: row.count,
          })),
          requests: {
            total: totalRequests,
            completed: completedRequests,
          },
          aiConversations,
          aiHealth,
          reports: {
            open: openReports,
            reviewing: reviewingReports,
            resolved: resolvedReports,
          },
        },
      }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async auditLogs(req, res, next) {
    try {
      new OK({
        message: "Lấy nhật ký admin thành công",
        data: await adminAuditService.list(req.query),
      }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async phoneVerificationRequests(req, res, next) {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 25));
      const query = { phoneVerificationRequestedAt: { $ne: null }, phoneVerified: false };
      const [items, total] = await Promise.all([
        User.find(query)
          .select("name email phone bio phoneVerified phoneVerificationRequestedAt phoneVerificationNote")
          .sort({ phoneVerificationRequestedAt: 1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
        User.countDocuments(query),
      ]);
      new OK({
        message: "Lấy yêu cầu xác minh số điện thoại thành công",
        data: { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } },
      }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async verifyPhone(req, res, next) {
    try {
      const { verified, reason } = req.body;
      if (typeof verified !== "boolean" || !reason?.trim()) {
        throw new BadRequestError("Trạng thái và lý do xử lý là bắt buộc");
      }
      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          phoneVerified: verified,
          phoneVerificationRequestedAt: null,
          phoneVerificationNote: reason.trim(),
        },
        { new: true }
      ).select("-password -verificationOtp -resetPasswordOtp");
      if (!user) throw new NotFoundError("Không tìm thấy người dùng");
      await adminAuditService.record({
        actor: req.user.id,
        action: verified ? "verify_phone" : "reject_phone",
        targetType: "user",
        targetId: user._id,
        reason: reason.trim(),
      });
      await notificationService.create({
        recipient: user._id,
        type: "moderation",
        title: verified
          ? "Số điện thoại đã được xác minh"
          : "Yêu cầu xác minh số điện thoại chưa được duyệt",
        message: reason.trim(),
        link: "/profile",
      });
      new OK({ message: "Đã cập nhật xác minh số điện thoại", data: user }).send(res);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AdminController();
