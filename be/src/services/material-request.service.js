const MaterialRequest = require("../models/material-request.model");
const Material = require("../models/material.model");
const { BadRequestError, ForbiddenError, NotFoundError } = require("../core/error.response");

const REQUEST_STATUSES = ["pending", "approved", "rejected", "cancelled", "completed"];

class MaterialRequestService {
  async createRequest(requesterId, materialId, message) {
    const material = await Material.findById(materialId).select("owner status");
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

    const request = await MaterialRequest.findById(requestId).populate("material", "owner status");
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
    await request.save();
    if (status === "approved") {
      await Material.findByIdAndUpdate(request.material._id, { status: "reserved" });
    } else if (status === "completed") {
      await Material.findByIdAndUpdate(request.material._id, { status: "completed" });
    }
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
