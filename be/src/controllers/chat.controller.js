const chatService = require("../services/chat.service");
const { OK, CREATED } = require("../core/success.response");

class ChatController {
  async getMessages(req, res, next) {
    try {
      const { partnerId, materialId } = req.query;
      const result = await chatService.getMessagesBetweenUsers(
        req.user.id,
        partnerId,
        materialId
      );
      new OK({
        message: "Lấy lịch sử tin nhắn thành công",
        data: result,
      }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async sendMessage(req, res, next) {
    try {
      const { receiverId, materialId, content } = req.body;
      const result = await chatService.saveMessage({
        senderId: req.user.id,
        receiverId,
        materialId,
        content,
      });
      new CREATED({
        message: "Gửi tin nhắn thành công",
        data: result,
      }).send(res);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ChatController();
