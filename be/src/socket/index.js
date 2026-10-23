const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");
const chatService = require("../services/chat.service");
const env = require("../config/env");

function initSocket(server, allowedOrigins = ["*"]) {
  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Vui lòng đăng nhập để sử dụng chat"));
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      socket.userId = decoded.id;
      return next();
    } catch (err) {
      return next(new Error("Phiên đăng nhập không hợp lệ"));
    }
  });

  io.on("connection", (socket) => {
    logger.info(`Client đã kết nối Socket: ${socket.id}`);
    socket.join(`user:${socket.userId}`);

    socket.on("send_message", async (data) => {
      try {
        const { receiverId, materialId, content, attachments } = data;
        const savedMsg = await chatService.saveMessage({
          senderId: socket.userId,
          receiverId,
          materialId,
          content,
          attachments,
        });

        socket.on("typing", ({ receiverId, materialId, isTyping }) => {
          if (!receiverId || receiverId === socket.userId) return;
          io.to(`user:${receiverId}`).emit("typing", {
            senderId: socket.userId,
            materialId,
            isTyping: Boolean(isTyping),
          });
        });

        io.to(`user:${receiverId}`).emit("new_message", savedMsg);
        io.to(`user:${socket.userId}`).emit("message_sent", savedMsg);
      } catch (err) {
        logger.error({ err }, "Lỗi khi xử lý realtime message");
        socket.emit("error", { message: "Không thể gửi tin nhắn" });
      }
    });

    socket.on("disconnect", () => {
      logger.info(`User ${socket.userId} đã ngắt kết nối socket`);
    });
  });

  return io;
}

module.exports = { initSocket };
