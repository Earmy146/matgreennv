const crypto = require("crypto");
const { parseCloudinaryAccounts } = require("../config/cloudinary");
const { BadRequestError } = require("../core/error.response");
const logger = require("../utils/logger");

const log = logger.child({ component: "cloudinary" });

function signParams(params, apiSecret) {
  const payload = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return crypto
    .createHash("sha1")
    .update(`${payload}${apiSecret}`)
    .digest("hex");
}

function buildPublicId(prefix = "material") {
  const safePrefix = String(prefix)
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(6).toString("hex");

  return `${safePrefix || "mat"}-${timestamp}-${random}`;
}

const MAX_IMAGE_SIZE =
  Number(process.env.UPLOAD_MAX_IMAGE_SIZE_BYTES) || 5 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

async function uploadImageBuffer({
  buffer,
  mimetype = "image/jpeg",
  originalname,
  folder = "materials",
  publicIdPrefix = "mat",
}) {
  if (!buffer || !buffer.length) {
    throw new BadRequestError("Không có file ảnh để tải lên");
  }

  if (buffer.length > MAX_IMAGE_SIZE) {
    throw new BadRequestError(`Kích thước ảnh vượt quá dung lượng cho phép (${Math.round(MAX_IMAGE_SIZE / (1024 * 1024))}MB)`);
  }

  if (mimetype) {
    const normalizedMime = String(mimetype).toLowerCase().trim();
    if (!ALLOWED_MIME_TYPES.has(normalizedMime)) {
      throw new BadRequestError("Định dạng ảnh không được hỗ trợ. Chỉ chấp nhận JPG, PNG, WEBP, HEIC hoặc HEIF");
    }
  }

  const accounts = parseCloudinaryAccounts();
  if (accounts.length === 0) {
    throw new BadRequestError(
      "Chưa cấu hình tài khoản Cloudinary. Vui lòng kiểm tra CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET trong .env"
    );
  }

  let lastError = null;

  for (const account of accounts) {
    try {
      const timestamp = Math.round(Date.now() / 1000);
      const uploadFolder = `${account.folder}/${folder}`.replace(/\/+/g, "/").replace(/^\/+|\/+$/g, "");
      const public_id = buildPublicId(publicIdPrefix);

      const params = {
        folder: uploadFolder,
        public_id,
        timestamp,
      };

      const signature = signParams(params, account.apiSecret);

      const form = new FormData();
      const file = new Blob([buffer], { type: mimetype });

      form.append("file", file, originalname || "upload.jpg");
      form.append("api_key", account.apiKey);
      form.append("folder", params.folder);
      form.append("public_id", params.public_id);
      form.append("timestamp", String(timestamp));
      form.append("signature", signature);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${account.cloudName}/image/upload`,
        {
          method: "POST",
          body: form,
          signal: AbortSignal.timeout(20000),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error?.message || "Tải ảnh lên Cloudinary thất bại");
      }

      log.info(`Upload ảnh thành công lên Cloudinary: ${data.secure_url}`);

      return {
        url: data.secure_url,
        public_id: data.public_id,
        format: data.format,
        width: data.width,
        height: data.height,
        bytes: data.bytes,
        cloud_name: account.cloudName,
        uploaded_at: new Date(),
      };
    } catch (err) {
      log.warn({ err: err.message }, `Lỗi khi upload qua tài khoản ${account.cloudName}:`);
      lastError = err;
    }
  }

  throw new BadRequestError(lastError?.message || "Không thể tải ảnh lên Cloudinary");
}

async function deleteCloudinaryImage({ public_id, cloud_name }) {
  if (!public_id) return false;

  const accounts = parseCloudinaryAccounts();
  const account = cloud_name
    ? accounts.find((a) => a.cloudName === cloud_name) || accounts[0]
    : accounts[0];

  if (!account) return false;

  try {
    const timestamp = Math.round(Date.now() / 1000);
    const params = {
      public_id,
      timestamp,
    };
    const signature = signParams(params, account.apiSecret);

    const form = new FormData();
    form.append("public_id", public_id);
    form.append("api_key", account.apiKey);
    form.append("timestamp", String(timestamp));
    form.append("signature", signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${account.cloudName}/image/destroy`,
      {
        method: "POST",
        body: form,
        signal: AbortSignal.timeout(10000),
      }
    );

    const data = await response.json().catch(() => ({}));
    return data.result === "ok";
  } catch (err) {
    log.error({ err: err.message }, `Lỗi khi xóa ảnh Cloudinary ${public_id}:`);
    return false;
  }
}

/**
 * Kiểm tra kết nối với Cloudinary bằng cách upload một test pixel và xóa ngay lập tức
 */
async function testCloudinaryConnection() {
  const accounts = parseCloudinaryAccounts();
  if (accounts.length === 0) {
    throw new Error("Không tìm thấy cấu hình tài khoản Cloudinary");
  }

  const account = accounts[0];
  // 1x1 transparent PNG buffer
  const test1x1Png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
    "base64"
  );

  log.info(`Đang kiểm tra kết nối Cloudinary cloud: ${account.cloudName}...`);

  const uploadResult = await uploadImageBuffer({
    buffer: test1x1Png,
    mimetype: "image/png",
    originalname: "test_connection.png",
    folder: "system-test",
    publicIdPrefix: "ping",
  });

  // Cleanup test image
  if (uploadResult?.public_id) {
    await deleteCloudinaryImage({
      public_id: uploadResult.public_id,
      cloud_name: uploadResult.cloud_name,
    });
  }

  return {
    cloudName: account.cloudName,
    folder: account.folder,
    testUrl: uploadResult.url,
  };
}

module.exports = {
  uploadImageBuffer,
  deleteCloudinaryImage,
  testCloudinaryConnection,
};
