const mongoose = require("mongoose");
const AiConversation = require("../models/ai-conversation.model");
const { BadRequestError, NotFoundError } = require("../core/error.response");

const MAX_MESSAGES_PER_CONVERSATION = 60;

function deriveTitle(text) {
  const cleaned = String(text || "").replace(/\s+/g, " ").trim();
  if (!cleaned) return "Tư vấn MatGreen AI";
  return cleaned.length > 72 ? `${cleaned.slice(0, 72)}...` : cleaned;
}

class AiHistoryService {
  async listConversations(userId, limit = 20) {
    const safeLimit = Math.max(1, Math.min(30, Number(limit) || 20));
    const docs = await AiConversation.find({ user: userId })
      .sort({ lastMessageAt: -1 })
      .limit(safeLimit)
      .select("title materialId lastMessageAt createdAt messages")
      .lean();

    return docs.map((doc) => {
      const lastMsg = doc.messages?.[doc.messages.length - 1];
      return {
        _id: doc._id,
        title: doc.title,
        materialId: doc.materialId || null,
        messageCount: doc.messages?.length || 0,
        lastMessagePreview: lastMsg?.content ? String(lastMsg.content).slice(0, 120) : "",
        lastMessageAt: doc.lastMessageAt || doc.createdAt,
        createdAt: doc.createdAt,
      };
    });
  }

  async getConversation(userId, conversationId) {
    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      throw new BadRequestError("Mã cuộc trò chuyện AI không hợp lệ");
    }
    const doc = await AiConversation.findOne({ _id: conversationId, user: userId }).lean();
    if (!doc) {
      throw new NotFoundError("Không tìm thấy cuộc trò chuyện AI");
    }
    return doc;
  }

  async saveTurn(userId, payload) {
    const { conversationId, userMessage, assistantMessage, materialId } = payload || {};
    if (!userMessage || typeof userMessage.content !== "string" || !userMessage.content.trim()) {
      throw new BadRequestError("Thiếu nội dung câu hỏi của người dùng");
    }
    if (!assistantMessage || typeof assistantMessage.content !== "string" || !assistantMessage.content.trim()) {
      throw new BadRequestError("Thiếu nội dung phản hồi của trợ lý AI");
    }

    const sanitizedUserMsg = {
      role: "user",
      content: userMessage.content.trim().slice(0, 4000),
      recommended_materials: [],
      tools_used: [],
      createdAt: new Date(),
    };

    const sanitizedAssistantMsg = {
      role: "assistant",
      content: assistantMessage.content.trim().slice(0, 12000),
      recommended_materials: Array.isArray(assistantMessage.recommended_materials)
        ? assistantMessage.recommended_materials.slice(0, 8)
        : [],
      tools_used: Array.isArray(assistantMessage.tools_used)
        ? assistantMessage.tools_used.slice(0, 10).map(String)
        : [],
      model: assistantMessage.model ? String(assistantMessage.model).slice(0, 80) : null,
      createdAt: new Date(),
    };

    let doc = null;
    if (conversationId && mongoose.Types.ObjectId.isValid(conversationId)) {
      doc = await AiConversation.findOne({ _id: conversationId, user: userId });
    }

    if (!doc) {
      doc = new AiConversation({
        user: userId,
        title: deriveTitle(sanitizedUserMsg.content),
        materialId: materialId && mongoose.Types.ObjectId.isValid(materialId) ? materialId : null,
        messages: [sanitizedUserMsg, sanitizedAssistantMsg],
        lastMessageAt: new Date(),
      });
    } else {
      doc.messages.push(sanitizedUserMsg, sanitizedAssistantMsg);
      if (doc.messages.length > MAX_MESSAGES_PER_CONVERSATION) {
        doc.messages = doc.messages.slice(-MAX_MESSAGES_PER_CONVERSATION);
      }
      doc.lastMessageAt = new Date();
    }

    await doc.save();
    return doc.toObject();
  }

  async deleteConversation(userId, conversationId) {
    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      throw new BadRequestError("Mã cuộc trò chuyện AI không hợp lệ");
    }
    const deleted = await AiConversation.findOneAndDelete({ _id: conversationId, user: userId });
    if (!deleted) {
      throw new NotFoundError("Không tìm thấy cuộc trò chuyện AI để xóa");
    }
    return { deleted: true, id: conversationId };
  }
}

module.exports = new AiHistoryService();
