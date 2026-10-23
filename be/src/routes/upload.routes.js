const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/upload.controller");
const { uploadSingle, uploadMultiple, uploadAttachment } = require("../middlewares/upload.middleware");

// Tải 1 ảnh (avatar, thumbnail)
router.post("/image", uploadSingle, uploadController.uploadSingle);

// Tải nhiều ảnh (ảnh vật liệu, ảnh hiện trạng tháo dỡ)
router.post("/images", uploadMultiple, uploadController.uploadMultiple);
router.post("/attachment", uploadAttachment, uploadController.uploadAttachment);

module.exports = router;
