const Review = require("../models/review.model");
const MaterialRequest = require("../models/material-request.model");
const { BadRequestError, ForbiddenError, NotFoundError } = require("../core/error.response");

class ReviewService {
  async create(userId, requestId, rating, comment) {
    const request = await MaterialRequest.findById(requestId).populate("material", "owner");
    if (!request) throw new NotFoundError("Không tìm thấy giao dịch");
    if (request.status !== "completed") throw new BadRequestError("Chỉ được đánh giá giao dịch đã hoàn tất");
    const reviewerIsOwner = request.material.owner.toString() === userId.toString();
    const reviewerIsRequester = request.requester.toString() === userId.toString();
    if (!reviewerIsOwner && !reviewerIsRequester) throw new ForbiddenError("Bạn không thuộc giao dịch này");
    const reviewedUser = reviewerIsOwner ? request.requester : request.material.owner;
    try {
      return await Review.create({ request: requestId, reviewer: userId, reviewedUser, rating, comment });
    } catch (err) {
      if (err.code === 11000) throw new BadRequestError("Bạn đã đánh giá giao dịch này");
      throw err;
    }
  }
  async listForRequest(userId, requestId) {
    const request = await MaterialRequest.findById(requestId).populate("material", "owner");
    if (!request) throw new NotFoundError("Không tìm thấy giao dịch");
    if (request.requester.toString() !== userId.toString() && request.material.owner.toString() !== userId.toString()) {
      throw new ForbiddenError("Bạn không có quyền xem đánh giá");
    }
    return Review.find({ request: requestId }).populate("reviewer", "name avatar").lean();
  }
}
module.exports = new ReviewService();
