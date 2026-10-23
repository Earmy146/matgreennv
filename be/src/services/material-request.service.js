const MaterialRequest = require("../models/material-request.model");
const Material = require("../models/material.model");
const { BadRequestError, ForbiddenError, NotFoundError } = require("../core/error.response");
const notificationService = require("./notification.service");

const REQUEST_STATUSES = ["pending", "approved", "rejected", "cancelled", "completed"];

class MaterialRequestService {
  async createRequest(requesterId, materialId, message) {
    const material = await Material.findById(materialId).select("owner title status");
    if (!material) throw new NotFoundError("Không tìm thấy bài đăng vật liệu");
    if (material.owner.toString() === requesterId.toString()) {
      throw new BadRequestError("Bạn không thể gửi yêu cầu nhận bài đăng của chính mình");
    }
    if (material.status !== "available") {
      throw new BadRequestError("Bài đăng này không còn sẵn sàng để nhận");
    }

    const existing = await MaterialRequest.findOne({ material: materialId, requester: requesterId });
    if (existing && ["pending", "approved"].includes(existing.status)) {
      throw new BadRequestError("Bạn đã có yêu cầu đang xử lý cho bài đăng này");
    }

    const request = existing
      ? await MaterialRequest.findByIdAndUpdate(
          existing._id,
          { message: message?.trim(), status: "pending", requestedAt: new Date() },
          { new: true }
        )
      : await MaterialRequest.create({
          material: materialId,
          requester: requesterId,
          message: message?.trim(),
        });

    await notificationService.create({
      recipient: material.owner,
      type: "request_created",
      title: "Có yêu cầu nhận vật liệu mới",
      message: `Có người muốn nhận bài "${material.title}".`,
      link: "/requests",
    });
    return this.populateRequest(request._id);
  }

  async listForUser(userId, role) {
    const query = role === "owner"
      ? { material: { $in: await Material.find({ owner: userId }).distinct("_id") } }
      : { requester: userId };
    return MaterialRequest.find(query)
      .populate({
        path: "material",
        select: "title type status location images owner",
        populate: { path: "owner", select: "name phone" },
      })
      .populate("requester", "name phone email")
      .sort({ createdAt: -1 })
      .lean();
  }

  async updateStatus(userId, requestId, status) {
    if (!REQUEST_STATUSES.includes(status) || status === "pending") {
      throw new BadRequestError("Trạng thái yêu cầu không hợp lệ");
    }

    const request = await MaterialRequest.findById(requestId).populate("material", "owner title status");
    if (!request) throw new NotFoundError("Không tìm thấy yêu cầu nhận vật liệu");

    const isOwner = request.material.owner.toString() === userId.toString();
    const isRequester = request.requester.toString() === userId.toString();
    if (!isOwner && !isRequester) throw new ForbiddenError("Bạn không có quyền cập nhật yêu cầu này");
    if (isRequester && !["cancelled", "completed"].includes(status)) {
      throw new ForbiddenError("Người nhận chỉ được hủy hoặc xác nhận hoàn tất yêu cầu");
    }
    if (isOwner && !["approved", "rejected", "completed"].includes(status)) {
      throw new ForbiddenError("Người đăng chỉ được duyệt, từ chối hoặc hoàn tất yêu cầu");
    }
    if (status === "approved" || status === "rejected") {
      if (!isOwner || request.status !== "pending") {
        throw new BadRequestError("Yêu cầu này không còn chờ duyệt");
      }
    }
    if (status === "cancelled" && !["pending", "approved"].includes(request.status)) {
      throw new BadRequestError("Yêu cầu này không thể hủy ở trạng thái hiện tại");
    }
    if (status === "completed" && request.status !== "approved") {
      throw new BadRequestError("Chỉ có thể hoàn tất yêu cầu đã được duyệt");
    }
    if (status === "approved" && request.material.status !== "available") {
      throw new BadRequestError("Bài đăng không còn sẵn sàng để duyệt yêu cầu");
    }

    request.status = status;
    if (status === "completed") request.completedAt = new Date();
    await request.save();
    if (status === "approved") {
      await Material.findByIdAndUpdate(request.material._id, { status: "reserved" });
    } else if (status === "completed") {
      await Material.findByIdAndUpdate(request.material._id, { status: "completed" });
    }
    const recipient = isOwner ? request.requester : request.material.owner;
    await notificationService.create({
      recipient,
      type: "request_status",
      title: "Cập nhật yêu cầu nhận vật liệu",
      message: `Yêu cầu cho bài "${request.material.title || "vật liệu"}" đã chuyển sang trạng thái ${status}.`,
      link: "/requests",
    });
    return this.populateRequest(request._id);
  }

  async scheduleRequest(userId, requestId, scheduledAt) {
    const parsedDate = new Date(scheduledAt);
    if (Number.isNaN(parsedDate.getTime()) || parsedDate.getTime() <= Date.now()) {
      throw new BadRequestError("Thời gian nhận phải là thời điểm hợp lệ trong tương lai");
    }
    if (parsedDate.getTime() > Date.now() + 90 * 24 * 60 * 60 * 1000) {
      throw new BadRequestError("Không thể đặt lịch quá 90 ngày kể từ hôm nay");
    }

    const request = await MaterialRequest.findById(requestId).populate("material", "owner title status");
    if (!request) throw new NotFoundError("Không tìm thấy yêu cầu nhận vật liệu");
    const isOwner = request.material.owner.toString() === userId.toString();
    const isRequester = request.requester.toString() === userId.toString();
    if (!isOwner && !isRequester) throw new ForbiddenError("Bạn không có quyền đặt lịch cho yêu cầu này");
    if (request.status !== "approved") {
      throw new BadRequestError("Chỉ yêu cầu đã được duyệt mới có thể đặt lịch");
    }

    request.scheduledAt = parsedDate;
    await request.save();
    const recipient = isOwner ? request.requester : request.material.owner;
    await notificationService.create({
      recipient,
      type: "request_scheduled",
      title: "Lịch nhận vật liệu đã được cập nhật",
      message: `Lịch nhận bài "${request.material.title || "vật liệu"}": ${parsedDate.toLocaleString("vi-VN")}.`,
      link: "/requests",
    });
    return this.populateRequest(request._id);
  }

  populateRequest(id) {
    return MaterialRequest.findById(id)
      .populate({
        path: "material",
        select: "title type status location images owner",
        populate: { path: "owner", select: "name phone" },
      })
      .populate("requester", "name phone email")
      .lean();
  }
}

module.exports = new MaterialRequestService();
