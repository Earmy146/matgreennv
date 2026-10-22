const Message = require("../models/message.model");

class ChatService {
  async getMessagesBetweenUsers(user1Id, user2Id, materialId) {
    const query = {
      $or: [
        { sender: user1Id, receiver: user2Id },
        { sender: user2Id, receiver: user1Id },
      ],
    };

    if (materialId) {
      query.material = materialId;
    }

    return Message.find(query)
      .sort({ createdAt: 1 })
      .populate("sender", "name avatar")
      .populate("receiver", "name avatar")
      .lean();
  }

  async saveMessage({ senderId, receiverId, materialId, content }) {
    const msg = await Message.create({
      sender: senderId,
      receiver: receiverId,
      material: materialId,
      content,
    });

    return Message.findById(msg._id)
      .populate("sender", "name avatar")
      .populate("receiver", "name avatar")
      .lean();
  }
}

module.exports = new ChatService();
