const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");
const { authenticate } = require("../middlewares/auth.middleware");

router.get("/messages", authenticate, chatController.getMessages);
router.post("/messages", authenticate, chatController.sendMessage);

module.exports = router;
