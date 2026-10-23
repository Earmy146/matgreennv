const express = require("express");
const router = express.Router();
const materialController = require("../controllers/material.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { createUserRateLimit } = require("../middlewares/user-rate-limit.middleware");
const locationVerificationController = require("../controllers/location-verification.controller");
const locationVerificationLimit = createUserRateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  message: "Bạn đã yêu cầu xác minh vị trí quá nhiều lần, vui lòng thử lại sau",
});

const createMaterialLimit = createUserRateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  message: "Bạn đã đăng quá nhiều bài trong một giờ, vui lòng thử lại sau",
});

// Lấy danh sách bài đăng theo bán kính hoặc đường kính quanh vị trí hiện tại (có phân trang)
router.get("/nearby", materialController.getNearby);

// Lấy bài đăng của chính tôi (Nhà A quản lý)
router.get("/my-posts", authenticate, materialController.getMyPosts);

// Lấy danh sách bài đăng chung / phân trang / tìm kiếm
router.get("/", materialController.list);

// Chi tiết bài đăng
router.get("/:id", materialController.getById);

// Đăng bài vật liệu thừa (yêu cầu đăng nhập)
router.post("/", authenticate, createMaterialLimit, materialController.create);
router.post(
  "/:id/verify-location",
  authenticate,
  locationVerificationLimit,
  locationVerificationController.verifyMaterial
);

// Cập nhật trạng thái bài đăng (available -> reserved -> completed)
router.patch("/:id/status", authenticate, materialController.updateStatus);
router.patch("/:id", authenticate, materialController.update);

// Xóa bài đăng
router.delete("/:id", authenticate, materialController.delete);

module.exports = router;
