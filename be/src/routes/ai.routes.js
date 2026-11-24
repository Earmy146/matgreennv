const express = require("express");
const multer = require("multer");
const router = express.Router();

const { authenticate } = require("../middlewares/auth.middleware");
const aiController = require("../controllers/ai.controller");
const { BadRequestError } = require("../core/error.response");

const visionUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB mỗi ảnh
    files: 4,
  },
  fileFilter: (req, file, cb) => {
    if (["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestError("Chỉ chấp nhận ảnh định dạng JPG, PNG hoặc WEBP."));
    }
  },
});

function handleUpload(req, res, next) {
  visionUpload.array("images", 4)(req, res, (err) => {
    if (!err) return next();
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return next(new BadRequestError("Mỗi ảnh không được vượt quá 5 MB."));
      }
      if (err.code === "LIMIT_FILE_COUNT" || err.code === "LIMIT_UNEXPECTED_FILE") {
        return next(new BadRequestError("Tối đa 4 ảnh cho mỗi lần phân tích AI."));
      }
      return next(new BadRequestError("Lỗi tải ảnh lên: " + err.message));
    }
    return next(err);
  });
}

router.get("/quota", authenticate, aiController.getQuota);
router.post("/inspect-material", authenticate, handleUpload, aiController.inspectMaterial);
router.post("/analyze-demolition-images", authenticate, handleUpload, aiController.analyzeDemolitionImages);

module.exports = router;
