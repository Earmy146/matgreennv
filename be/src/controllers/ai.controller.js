const { OK } = require("../core/success.response");
const aiGatewayService = require("../services/ai-gateway.service");

class AiController {
  async inspectMaterial(req, res, next) {
    try {
      const files = Array.isArray(req.files) ? req.files : [];
      const data = await aiGatewayService.inspectMaterialImages({
        user: req.user,
        files,
        note: req.body?.note || "",
        address: req.body?.address || "",
      });
      new OK({
        message: "Phân tích ảnh vật liệu thành công",
        data,
      }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async analyzeDemolitionImages(req, res, next) {
    try {
      const files = Array.isArray(req.files) ? req.files : [];
      const data = await aiGatewayService.analyzeDemolitionImages({
        user: req.user,
        files,
        description: req.body?.description || "",
        address: req.body?.address || "",
      });
      new OK({
        message: "Bóc tách công trình từ ảnh thành công",
        data,
      }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async getQuota(req, res, next) {
    try {
      const data = await aiGatewayService.getUserAiQuota(req.user);
      new OK({
        message: "Lấy hạn mức AI thành công",
        data,
      }).send(res);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AiController();
