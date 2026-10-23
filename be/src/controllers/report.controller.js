const reportService = require("../services/report.service");
const { OK, CREATED } = require("../core/success.response");
class ReportController {
  async create(req, res, next) { try { const result = await reportService.create(req.user.id, req.body); new CREATED({ message: "Đã gửi báo cáo", data: result }).send(res); } catch (err) { next(err); } }
  async list(req, res, next) { try { new OK({ message: "Lấy báo cáo thành công", data: await reportService.list() }).send(res); } catch (err) { next(err); } }
  async update(req, res, next) { try { new OK({ message: "Đã cập nhật báo cáo", data: await reportService.update(req.params.id, req.body.status, req.body.resolution) }).send(res); } catch (err) { next(err); } }
}
module.exports = new ReportController();
