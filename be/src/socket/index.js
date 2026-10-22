const { Server } = require("socket.io");
const logger = require("../utils/logger");
const chatService = require("../services/chat.service");

function initSocket(server, allowedOrigins = ["*"]) {
  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const onlineUsers = new Map(); // userId -> socketId

  io.on("connection", (socket) => {
    logger.info(`Client đã kết nối Socket: ${socket.id}`);

    socket.on("join", (userId) => {
      onlineUsers.set(userId, socket.id);
      logger.info(`User ${userId} đã online (socket: ${socket.id})`);
    });

    socket.on("send_message", async (data) => {
      try {
        const { senderId, receiverId, materialId, content } = data;
        const savedMsg = await chatService.saveMessage({
          senderId,
          receiverId,
          materialId,
          content,
        });

        // Gửi cho người nhận nếu đang online
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("new_message", savedMsg);
        }

        // Phản hồi lại cho người gửi
        socket.emit("message_sent", savedMsg);
      } catch (err) {
        logger.error({ err }, "Lỗi khi xử lý realtime message");
        socket.emit("error", { message: "Không thể gửi tin nhắn" });
      }
    });

    socket.on("disconnect", () => {
      for (const [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          onlineUsers.delete(userId);
          logger.info(`User ${userId} đã ngắt kết nối socket`);
          break;
        }
      }
    });
  });

  return io;
}

module.exports = { initSocket };
