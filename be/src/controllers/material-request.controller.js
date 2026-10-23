const materialRequestService = require("../services/material-request.service");
const { OK, CREATED } = require("../core/success.response");

class MaterialRequestController {
  async create(req, res, next) {
    try {
      const { materialId, message } = req.body;
      const result = await materialRequestService.createRequest(req.user.id, materialId, message);
      new CREATED({ message: "Gửi yêu cầu nhận vật liệu thành công", data: result }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async listMine(req, res, next) {
    try {
      const role = req.query.role === "owner" ? "owner" : "requester";
      const result = await materialRequestService.listForUser(req.user.id, role);
      new OK({ message: "Lấy danh sách yêu cầu thành công", data: result }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const result = await materialRequestService.updateStatus(
        req.user.id,
        req.params.id,
        req.body.status
      );
      new OK({ message: "Cập nhật yêu cầu thành công", data: result }).send(res);
    } catch (err) {
      next(err);
    }

  }

  async schedule(req, res, next) {
    try {
      const result = await materialRequestService.scheduleRequest(
        req.user.id,
        req.params.id,
        req.body.scheduledAt
      );
      new OK({ message: "Đặt lịch nhận vật liệu thành công", data: result }).send(res);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new MaterialRequestController();
