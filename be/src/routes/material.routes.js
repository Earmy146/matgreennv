const express = require("express");
const router = express.Router();
const materialController = require("../controllers/material.controller");
const { authenticate } = require("../middlewares/auth.middleware");

// Lấy danh sách bài đăng theo bán kính hoặc đường kính quanh vị trí hiện tại (có phân trang)
router.get("/nearby", materialController.getNearby);

// Lấy bài đăng của chính tôi (Nhà A quản lý)
router.get("/my-posts", authenticate, materialController.getMyPosts);

// Lấy danh sách bài đăng chung / phân trang / tìm kiếm
router.get("/", materialController.list);

// Chi tiết bài đăng
router.get("/:id", materialController.getById);

// Đăng bài vật liệu thừa (yêu cầu đăng nhập)
router.post("/", authenticate, materialController.create);

// Cập nhật trạng thái bài đăng (available -> reserved -> completed)
router.patch("/:id/status", authenticate, materialController.updateStatus);

// Xóa bài đăng
router.delete("/:id", authenticate, materialController.delete);

module.exports = router;
