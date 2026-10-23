const reportService = require("../services/report.service");
const { OK, CREATED } = require("../core/success.response");
const adminAuditService = require("../services/admin-audit.service");
const notificationService = require("../services/notification.service");
class ReportController {
  async create(req, res, next) { try { const result = await reportService.create(req.user.id, req.body); new CREATED({ message: "Đã gửi báo cáo", data: result }).send(res); } catch (err) { next(err); } }
  async list(req, res, next) { try { new OK({ message: "Lấy báo cáo thành công", data: await reportService.list(req.query) }).send(res); } catch (err) { next(err); } }
  async update(req, res, next) {
    try {
      const result = await reportService.update(req.params.id, req.body.status, req.body.resolution);
      await adminAuditService.record({ actor: req.user.id, action: `resolve_report_${req.body.status}`, targetType: "report", targetId: result._id, reason: req.body.resolution });
      const recipient = result.reporter;
      if (recipient) {
        await notificationService.create({
          recipient,
          type: "request_status",
          title: "Báo cáo đã được cập nhật",
          message: req.body.resolution,
          link: "/dashboard",
        });
      }
      new OK({ message: "Đã cập nhật báo cáo", data: result }).send(res);
    } catch (err) { next(err); }
  }
}
module.exports = new ReportController();
