const { OK } = require("../core/success.response");
const aiGatewayService = require("../services/ai-gateway.service");
const aiHistoryService = require("../services/ai-history.service");

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

  async listConversations(req, res, next) {
    try {
      const data = await aiHistoryService.listConversations(req.user.id, req.query?.limit);
      new OK({ message: "Lấy lịch sử chat AI thành công", data }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async getConversation(req, res, next) {
    try {
      const data = await aiHistoryService.getConversation(req.user.id, req.params.id);
      new OK({ message: "Lấy chi tiết hội thoại AI thành công", data }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async saveConversationTurn(req, res, next) {
    try {
      const data = await aiHistoryService.saveTurn(req.user.id, req.body);
      new OK({ message: "Đã lưu lịch sử trò chuyện AI", data }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async deleteConversation(req, res, next) {
    try {
      const data = await aiHistoryService.deleteConversation(req.user.id, req.params.id);
      new OK({ message: "Đã xóa cuộc trò chuyện AI", data }).send(res);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AiController();
