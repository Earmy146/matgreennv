const Message = require("../models/message.model");
const mongoose = require("mongoose");
const { BadRequestError } = require("../core/error.response");
const notificationService = require("./notification.service");

class ChatService {
  async getMessagesBetweenUsers(user1Id, user2Id, materialId, page = 1, limit = 30) {
    if (!user2Id || user1Id === user2Id) {
      throw new BadRequestError("Đối tác trò chuyện không hợp lệ");
    }

    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(50, Math.max(1, Number(limit) || 30));
    const query = {
      $or: [
        { sender: user1Id, receiver: user2Id },
        { sender: user2Id, receiver: user1Id },
      ],
    };

    if (materialId) {
      query.material = materialId;
    }

    const [items, total] = await Promise.all([
      Message.find(query)
      .sort({ createdAt: -1, _id: -1 })
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit)
      .populate("sender", "name avatar")
      .populate("receiver", "name avatar")
      .lean(),
      Message.countDocuments(query),
    ]);

    return {
      items: items.reverse(),
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        hasMore: safePage * safeLimit < total,
      },
    };
  }

  async saveMessage({ senderId, receiverId, materialId, content }) {
    if (!receiverId || senderId === receiverId) {
      throw new BadRequestError("Người nhận tin nhắn không hợp lệ");
    }

    const normalizedContent = String(content || "").trim();
    if (!normalizedContent || normalizedContent.length > 2000) {
      throw new BadRequestError("Tin nhắn phải có từ 1 đến 2000 ký tự");
    }

    const msg = await Message.create({
      sender: senderId,
      receiver: receiverId,
      material: materialId,
      content: normalizedContent,
    });

    const savedMessage = await Message.findById(msg._id)
      .populate("sender", "name avatar")
      .populate("receiver", "name avatar")
      .lean();

    await notificationService.create({
      recipient: receiverId,
      type: "chat",
      title: "Tin nhắn mới",
      message: `${savedMessage.sender.name}: ${normalizedContent.slice(0, 120)}`,
      link: `/chat?partnerId=${senderId}${materialId ? `&materialId=${materialId}` : ""}`,
    });

    return savedMessage;
  }

  async markMessagesRead(userId, partnerId, materialId) {
    if (!partnerId || userId === partnerId) {
      throw new BadRequestError("Đối tác trò chuyện không hợp lệ");
    }

    const query = { sender: partnerId, receiver: userId, isRead: false };
    if (materialId) query.material = materialId;

    const result = await Message.updateMany(query, { $set: { isRead: true } });
    return { modifiedCount: result.modifiedCount };
  }

  async getConversations(userId) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    return Message.aggregate([
      {
        $match: {
          $or: [{ sender: userObjectId }, { receiver: userObjectId }],
        },
      },
      { $sort: { createdAt: -1, _id: -1 } },
      {
        $set: {
          partnerId: {
            $cond: [{ $eq: ["$sender", userObjectId] }, "$receiver", "$sender"],
          },
        },
      },
      {
        $group: {
          _id: "$partnerId",
          lastMessage: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ["$receiver", userObjectId] }, { $eq: ["$isRead", false] }] },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { "lastMessage.createdAt": -1 } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "partner",
        },
      },
      { $unwind: "$partner" },
      {
        $project: {
          _id: 0,
          partner: { _id: "$partner._id", name: "$partner.name", avatar: "$partner.avatar" },
          materialId: "$lastMessage.material",
          lastMessage: {
            _id: "$lastMessage._id",
            content: "$lastMessage.content",
            createdAt: "$lastMessage.createdAt",
          },
          unreadCount: 1,
        },
      },
    ]);
  }
}

module.exports = new ChatService();
