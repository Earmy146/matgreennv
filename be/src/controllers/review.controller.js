const reviewService = require("../services/review.service");
const { OK, CREATED } = require("../core/success.response");
class ReviewController {
  async create(req, res, next) {
    try {
      const result = await reviewService.create(req.user.id, req.params.requestId, req.body.rating, req.body.comment);
      new CREATED({ message: "Đánh giá giao dịch thành công", data: result }).send(res);
    } catch (err) { next(err); }
  }
  async list(req, res, next) {
    try {
      const result = await reviewService.listForRequest(req.user.id, req.params.requestId);
      new OK({ message: "Lấy đánh giá thành công", data: result }).send(res);
    } catch (err) { next(err); }
  }
}
module.exports = new ReviewController();
