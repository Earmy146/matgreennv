const express = require("express");
const notificationController = require("../controllers/notification.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", authenticate, notificationController.list);
router.patch("/read-all", authenticate, notificationController.markAllRead);
router.patch("/:id/read", authenticate, notificationController.markRead);

module.exports = router;
