const express = require("express");
const router = express.Router();
const materialController = require("../controllers/material.controller");
const { authenticate } = require("../middlewares/auth.middleware");

// Lấy danh sách bài đăng theo bán kính vị trí hiện tại
router.get("/nearby", materialController.getNearby);

// Lấy danh sách bài đăng chung / phân trang / tìm kiếm
router.get("/", materialController.list);

// Chi tiết bài đăng
router.get("/:id", materialController.getById);

// Đăng bài vật liệu thừa (yêu cầu đăng nhập)
router.post("/", authenticate, materialController.create);

module.exports = router;
