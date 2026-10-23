const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");
const { authenticate } = require("../middlewares/auth.middleware");

router.get("/messages", authenticate, chatController.getMessages);
router.get("/conversations", authenticate, chatController.getConversations);
router.post("/messages", authenticate, chatController.sendMessage);
router.patch("/messages/read", authenticate, chatController.markRead);

module.exports = router;
