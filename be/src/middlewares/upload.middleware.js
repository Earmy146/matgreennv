const multer = require("multer");
const { BadRequestError } = require("../core/error.response");

const storage = multer.memoryStorage();

const MAX_FILE_SIZE =
  Number(process.env.UPLOAD_MAX_IMAGE_SIZE_BYTES) || 5 * 1024 * 1024;

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
  ];

  if (allowedMimes.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(
      new BadRequestError(
        "Chỉ chấp nhận file ảnh có định dạng JPG, PNG, WEBP, HEIC hoặc HEIF"
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter,
});

module.exports = {
  uploadSingle: upload.single("image"),
  uploadMultiple: upload.array("images", 5), // Tối đa 5 ảnh một lúc cho vật liệu
};
