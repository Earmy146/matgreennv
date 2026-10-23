const express = require("express");
const materialRequestController = require("../controllers/material-request.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { createUserRateLimit } = require("../middlewares/user-rate-limit.middleware");

const router = express.Router();

router.use(authenticate);
const createRequestLimit = createUserRateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 30,
  message: "Bạn đã gửi quá nhiều yêu cầu, vui lòng thử lại sau",
});
router.get("/", materialRequestController.listMine);
router.post("/", createRequestLimit, materialRequestController.create);
router.patch("/:id/status", materialRequestController.updateStatus);
router.patch("/:id/schedule", materialRequestController.schedule);

module.exports = router;
