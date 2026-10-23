const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const sharp = require("sharp");
const logger = require("../utils/logger");
const { BadRequestError } = require("../core/error.response");
const cloudinaryService = require("./cloudinary-upload.service");

const log = logger.child({ component: "image-storage-service" });

const MAX_IMAGE_SIZE = Number(process.env.UPLOAD_MAX_IMAGE_SIZE_BYTES) || 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "image/svg+xml",
]);

function getUploadRootDir() {
  const customDir = process.env.LOCAL_UPLOAD_DIR;
  if (customDir && customDir.trim()) {
    return path.resolve(customDir.trim());
  }
  return path.resolve(__dirname, "../../uploads");
}

function getStorageProvider() {
  const provider = (process.env.IMAGE_STORAGE_PROVIDER || "local").toLowerCase().trim();
  return provider === "cloudinary" ? "cloudinary" : "local";
}

function sanitizeFolder(folder = "materials") {
  return String(folder)
    .replace(/[^a-zA-Z0-9_\-\/]/g, "")
    .replace(/^\/+|\/+$/g, "") || "materials";
}

function buildLocalFileName(prefix = "mat", ext = ".webp") {
  const timestamp = Date.now();
  const randomHex = crypto.randomBytes(6).toString("hex");
  return `${prefix}-${timestamp}-${randomHex}${ext}`;
}

/**
 * Nén ảnh bằng Sharp:
 * - Tự động xoay đúng chiều theo EXIF
 * - Resize nếu kích thước > 1920px (giữ nguyên tỷ lệ)
 * - Convert sang WebP với chất lượng 80%
 */
async function compressImage(buffer, originalMime) {
  try {
    const pipeline = sharp(buffer)
      .rotate()
      .resize({
        width: 1920,
        height: 1920,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 80, effort: 4 });

    const compressedBuffer = await pipeline.toBuffer();
    const metadata = await sharp(compressedBuffer).metadata();

    return {
      buffer: compressedBuffer,
      format: "webp",
      width: metadata.width || 0,
      height: metadata.height || 0,
      ext: ".webp",
      mimetype: "image/webp",
    };
  } catch (err) {
    log.warn({ err: err.message }, "Không thể nén qua Sharp, lưu trữ buffer gốc");
    const ext = originalMime === "image/png" ? ".png" : originalMime === "image/webp" ? ".webp" : ".jpg";
    return {
      buffer,
      format: ext.replace(".", ""),
      width: 0,
      height: 0,
      ext,
      mimetype: originalMime || "application/octet-stream",
    };
  }
}

/**
 * Lưu file buffer xuống ổ đĩa cục bộ an toàn bằng atomic write
 */
async function saveBufferToLocal({ buffer, folder, fileName }) {
  const rootDir = getUploadRootDir();
  const cleanFolder = sanitizeFolder(folder);
  const targetDir = path.join(rootDir, cleanFolder);

  await fs.promises.mkdir(targetDir, { recursive: true });

  const targetPath = path.join(targetDir, fileName);
  const tempPath = path.join(targetDir, `${fileName}.${crypto.randomBytes(4).toString("hex")}.tmp`);

  await fs.promises.writeFile(tempPath, buffer);
  await fs.promises.rename(tempPath, targetPath);

  return {
    filePath: targetPath,
    relativePath: `${cleanFolder}/${fileName}`,
    url: `/uploads/${cleanFolder}/${fileName}`,
  };
}

/**
 * Upload và nén ảnh chính
 */
async function uploadImage({
  buffer,
  mimetype,
  originalname,
  folder = "materials",
  publicIdPrefix = "mat",
}) {
  if (!buffer || !buffer.length) {
    throw new BadRequestError("Không có file ảnh để tải lên");
  }

  if (buffer.length > MAX_IMAGE_SIZE) {
    throw new BadRequestError(
      `Kích thước ảnh vượt quá dung lượng cho phép (${Math.round(MAX_IMAGE_SIZE / (1024 * 1024))}MB)`
    );
  }

  const normalizedMime = String(mimetype || "").toLowerCase().trim();
  if (normalizedMime && !ALLOWED_MIME_TYPES.has(normalizedMime)) {
    throw new BadRequestError(
      "Định dạng ảnh không được hỗ trợ. Chỉ chấp nhận JPG, PNG, SVG, WEBP, HEIC hoặc HEIF"
    );
  }

  const provider = getStorageProvider();

  // 1. Chế độ Cloudinary (nếu cấu hình IMAGE_STORAGE_PROVIDER=cloudinary)
  if (provider === "cloudinary") {
    return cloudinaryService.uploadImageBuffer({
      buffer,
      mimetype,
      originalname,
      folder,
      publicIdPrefix,
    });
  }

  // 2. Chế độ Local Server (mặc định) có nén WebP bằng Sharp
  const startTime = Date.now();
  const { buffer: processedBuffer, format, width, height, ext } = await compressImage(
    buffer,
    normalizedMime
  );

  const cleanFolder = sanitizeFolder(folder);
  const fileName = buildLocalFileName(publicIdPrefix, ext);
  const { url, relativePath } = await saveBufferToLocal({
    buffer: processedBuffer,
    folder: cleanFolder,
    fileName,
  });

  const durationMs = Date.now() - startTime;
  const originalKb = Math.round(buffer.length / 1024);
  const compressedKb = Math.round(processedBuffer.length / 1024);

  log.info(
    `[Local Upload] Đã tối ưu & lưu ảnh ${fileName}: ${originalKb}KB -> ${compressedKb}KB (${durationMs}ms)`
  );

  return {
    url,
    public_id: relativePath,
    format,
    width,
    height,
    bytes: processedBuffer.length,
    provider: "local",
    uploaded_at: new Date(),
  };
}

/**
 * Upload tệp đính kèm (Chat, tài liệu PDF, zip)
 */
async function uploadAttachment({
  buffer,
  mimetype,
  originalname,
  folder = "chat",
}) {
  if (!buffer || !buffer.length) {
    throw new BadRequestError("Không có file để tải lên");
  }

  if (buffer.length > MAX_IMAGE_SIZE) {
    throw new BadRequestError(
      `File vượt quá dung lượng cho phép (${Math.round(MAX_IMAGE_SIZE / (1024 * 1024))}MB)`
    );
  }

  const provider = getStorageProvider();
  if (provider === "cloudinary") {
    return cloudinaryService.uploadAttachmentBuffer({
      buffer,
      mimetype,
      originalname,
      folder,
    });
  }

  const cleanFolder = sanitizeFolder(folder);
  const ext = path.extname(originalname || "") || ".bin";
  const fileName = buildLocalFileName("att", ext);

  const { url, relativePath } = await saveBufferToLocal({
    buffer,
    folder: cleanFolder,
    fileName,
  });

  return {
    url,
    public_id: relativePath,
    format: ext.replace(".", ""),
    bytes: buffer.length,
    originalname: originalname || "attachment",
    mimetype,
    provider: "local",
    uploaded_at: new Date(),
  };
}

/**
 * Xóa ảnh an toàn hỗ trợ cả Local Storage và Cloudinary
 */
async function deleteImage({ public_id, url, cloud_name }) {
  if (!public_id && !url) return false;

  if ((url && url.includes("cloudinary.com")) || cloud_name) {
    return cloudinaryService.deleteCloudinaryImage({ public_id, cloud_name });
  }

  try {
    const rootDir = getUploadRootDir();
    let targetRelative = public_id;

    if (!targetRelative && url && url.startsWith("/uploads/")) {
      targetRelative = url.replace(/^\/uploads\//, "");
    }

    if (!targetRelative) return false;

    const normalizedRelative = path.normalize(targetRelative).replace(/^(\.\.(\/|\\|$))+/, "");
    const absolutePath = path.join(rootDir, normalizedRelative);

    if (!absolutePath.startsWith(path.normalize(rootDir))) {
      log.warn(`Phát hiện cố gắng xóa file ngoài thư mục uploads: ${targetRelative}`);
      return false;
    }

    if (fs.existsSync(absolutePath)) {
      await fs.promises.unlink(absolutePath);
      log.info(`[Local Delete] Đã xóa file: ${normalizedRelative}`);
      return true;
    }
    return false;
  } catch (err) {
    log.error({ err: err.message }, `Lỗi khi xóa file local: ${public_id || url}`);
    return false;
  }
}

module.exports = {
  uploadImage,
  uploadAttachment,
  deleteImage,
  getUploadRootDir,
  getStorageProvider,
};
