const { uploadImageBuffer, uploadAttachmentBuffer } = require("../services/cloudinary-upload.service");
const { CREATED } = require("../core/success.response");
const { BadRequestError } = require("../core/error.response");

class UploadController {
  async uploadSingle(req, res, next) {
    try {
      if (!req.file) {
        throw new BadRequestError("Vui lòng đính kèm một file ảnh");
      }

      const folder = req.body.folder || "materials";
      const result = await uploadImageBuffer({
        buffer: req.file.buffer,
        mimetype: req.file.mimetype,
        originalname: req.file.originalname,
        folder,
        publicIdPrefix: "mat",
      });

      new CREATED({
        message: "Tải ảnh lên Cloudinary thành công",
        data: result,
      }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async uploadMultiple(req, res, next) {
    try {
      if (!req.files || req.files.length === 0) {
        throw new BadRequestError("Vui lòng đính kèm ít nhất một file ảnh");
      }

      const folder = req.body.folder || "materials";
      const uploadPromises = req.files.map((file) =>
        uploadImageBuffer({
          buffer: file.buffer,
          mimetype: file.mimetype,
          originalname: file.originalname,
          folder,
          publicIdPrefix: "mat",
        })
      );

      const results = await Promise.all(uploadPromises);

      new CREATED({
        message: `Đã tải lên ${results.length} ảnh thành công`,
        data: results,
      }).send(res);
    } catch (err) {
      next(err);
    }

  }

  async uploadAttachment(req, res, next) {
    try {
      if (!req.file) throw new BadRequestError("Vui lòng đính kèm file");
      const result = await uploadAttachmentBuffer({
        buffer: req.file.buffer,
        mimetype: req.file.mimetype,
        originalname: req.file.originalname,
      });
      new CREATED({ message: "Tải file thành công", data: result }).send(res);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UploadController();
