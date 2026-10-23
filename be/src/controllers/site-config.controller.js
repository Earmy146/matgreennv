const siteConfigService = require("../services/site-config.service");
const { OK } = require("../core/success.response");

class SiteConfigController {
  async get(req, res, next) {
    try {
      const config = await siteConfigService.getConfig();
      new OK({
        message: "Lấy cấu hình website thành công",
        data: config,
      }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const config = await siteConfigService.updateConfig(req.body, req.user?.id);
      new OK({
        message: "Cập nhật cấu hình website thành công",
        data: config,
      }).send(res);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new SiteConfigController();
