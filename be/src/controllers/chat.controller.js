const chatService = require("../services/chat.service");
const { OK, CREATED } = require("../core/success.response");

class ChatController {
  async getConversations(req, res, next) {
    try {
      const result = await chatService.getConversations(req.user.id);
      new OK({
        message: "Lấy danh sách cuộc trò chuyện thành công",
        data: result,
      }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async getMessages(req, res, next) {
    try {
      const { partnerId, materialId, page, limit } = req.query;
      const result = await chatService.getMessagesBetweenUsers(
        req.user.id,
        partnerId,
        materialId,
        page,
        limit
      );
      new OK({
        message: "Lấy lịch sử tin nhắn thành công",
        data: result,
      }).send(res);
    } catch (err) {
      next(err);
    }

    async markRead(req, res, next) {
      try {
        const { partnerId, materialId } = req.body;
        const result = await chatService.markMessagesRead(req.user.id, partnerId, materialId);
        new OK({
          message: "Đã đánh dấu tin nhắn đã đọc",
          data: result,
        }).send(res);
      } catch (err) {
        next(err);
      }
    }
  }

  async sendMessage(req, res, next) {
    try {
      const { receiverId, materialId, content, attachments } = req.body;
      const result = await chatService.saveMessage({
        senderId: req.user.id,
        receiverId,
        materialId,
        content,
        attachments,
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
