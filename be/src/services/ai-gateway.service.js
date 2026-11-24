const crypto = require("node:crypto");
const env = require("../config/env");
const { runRedisCommand } = require("../utils/redis");
const { BadRequestError, ErrorResponse, ForbiddenError } = require("../core/error.response");

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_IMAGES = 4;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const UNLIMITED_ROLES = new Set(["admin", "moderator", "superadmin"]);

// In-memory fallback only for non-production local dev when Redis isn't running
const memoryDayCounts = new Map();
const memoryMinuteCounts = new Map();

const QUOTA_SCRIPT = `
local day = tonumber(redis.call('GET', KEYS[1]) or '0')
local minute = tonumber(redis.call('GET', KEYS[2]) or '0')
local image_count = tonumber(ARGV[3]) or 1
if day + image_count > tonumber(ARGV[1]) then return 1 end
if minute >= tonumber(ARGV[2]) then return 2 end
redis.call('INCRBY', KEYS[1], image_count)
redis.call('EXPIRE', KEYS[1], 172800)
redis.call('INCR', KEYS[2])
redis.call('EXPIRE', KEYS[2], 120)
return 0
`;

const REFUND_QUOTA_SCRIPT = `
local day = tonumber(redis.call('GET', KEYS[1]) or '0')
local minute = tonumber(redis.call('GET', KEYS[2]) or '0')
local image_count = tonumber(ARGV[1]) or 1
if day > 0 then
  redis.call('DECRBY', KEYS[1], math.min(day, image_count))
end
if minute > 0 then
  redis.call('DECR', KEYS[2])
end
return 0
`;

function todayVn() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function dailyImageLimitFor(user) {
  const role = String(user?.role || "user").toLowerCase();
  if (UNLIMITED_ROLES.has(role)) {
    return env.AI_IMAGE_DAILY_LIMIT_ADMIN || 100000;
  }
  return Number.isFinite(env.AI_IMAGE_DAILY_LIMIT_USER) && env.AI_IMAGE_DAILY_LIMIT_USER >= 0
    ? env.AI_IMAGE_DAILY_LIMIT_USER
    : 10;
}

function hasValidMagicBytes(buffer, mimeType) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 12) return false;
  if (mimeType === "image/jpeg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (mimeType === "image/png") {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a
    );
  }
  if (mimeType === "image/webp") {
    return buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP";
  }
  return false;
}

function validateImageFiles(files) {
  if (!Array.isArray(files) || files.length < 1 || files.length > MAX_IMAGES) {
    throw new BadRequestError(`Vui lòng chọn từ 1 đến ${MAX_IMAGES} ảnh vật liệu.`);
  }
  for (const file of files) {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      throw new BadRequestError("Chỉ hỗ trợ ảnh định dạng JPG, PNG hoặc WEBP.");
    }
    if (!file.buffer || file.buffer.length === 0 || file.buffer.length > MAX_IMAGE_BYTES) {
      throw new BadRequestError("Mỗi ảnh phải có dung lượng tối đa 5 MB.");
    }
    if (!hasValidMagicBytes(file.buffer, file.mimetype)) {
      throw new BadRequestError("Tệp ảnh không hợp lệ hoặc bị hỏng.");
    }
  }
}

async function reserveImageQuota(user, imageCount = 1) {
  const limitPerDay = dailyImageLimitFor(user);
  if (limitPerDay === 0) {
    throw new ForbiddenError("Tài khoản hiện không được bật quyền phân tích ảnh AI.");
  }

  const userId = String(user.id || user._id);
  const day = todayVn();
  const minute = Math.floor(Date.now() / 60000);
  const prefix = env.AI_RATE_LIMIT_PREFIX || "matgreen:ai";
  const dayKey = `${prefix}:image:day:${day}:${userId}`;
  const minuteKey = `${prefix}:image:minute:${minute}:${userId}`;
  const perMinute = env.AI_IMAGE_REQUESTS_PER_MINUTE || 4;

  const result = await runRedisCommand(
    "EVAL",
    QUOTA_SCRIPT,
    "2",
    dayKey,
    minuteKey,
    String(limitPerDay),
    String(perMinute),
    String(imageCount)
  );

  if (result === null || result === undefined) {
    // Fail-closed in production so quota cannot be bypassed when Redis is down
    if (env.NODE_ENV === "production") {
      throw new ErrorResponse("Tạm thời không kiểm tra được hạn mức phân tích ảnh. Vui lòng thử lại sau.", 503);
    }
    const curDay = memoryDayCounts.get(dayKey) || 0;
    const curMin = memoryMinuteCounts.get(minuteKey) || 0;
    if (curDay + imageCount > limitPerDay) {
      throw new ErrorResponse(`Bạn đã dùng hết ${limitPerDay} lượt phân tích ảnh AI hôm nay.`, 429, "AI_QUOTA_EXCEEDED");
    }
    if (curMin >= perMinute) {
      throw new ErrorResponse("Bạn gửi ảnh hơi nhanh. Vui lòng chờ 1 phút rồi thử lại.", 429, "RATE_LIMITED");
    }
    memoryDayCounts.set(dayKey, curDay + imageCount);
    memoryMinuteCounts.set(minuteKey, curMin + 1);
    return { dayKey, minuteKey, imageCount, inMemory: true };
  }

  if (Number(result) === 1) {
    throw new ErrorResponse(
      `Bạn đã dùng hết ${limitPerDay} lượt phân tích ảnh AI hôm nay. Hạn mức sẽ làm mới vào ngày mai.`,
      429,
      "AI_QUOTA_EXCEEDED"
    );
  }
  if (Number(result) === 2) {
    throw new ErrorResponse("Bạn gửi ảnh quá nhanh. Vui lòng chờ 1 phút rồi thử lại nhé.", 429, "RATE_LIMITED");
  }
  if (Number(result) !== 0) {
    throw new ErrorResponse("Không thể kiểm tra hạn mức phân tích ảnh lúc này.", 503);
  }

  return { dayKey, minuteKey, imageCount, inMemory: false };
}

async function refundImageQuota(reservation) {
  if (!reservation?.dayKey || !reservation?.minuteKey) return;
  if (reservation.inMemory) {
    const curDay = memoryDayCounts.get(reservation.dayKey) || 0;
    const curMin = memoryMinuteCounts.get(reservation.minuteKey) || 0;
    memoryDayCounts.set(reservation.dayKey, Math.max(0, curDay - (reservation.imageCount || 1)));
    memoryMinuteCounts.set(reservation.minuteKey, Math.max(0, curMin - 1));
    return;
  }
  try {
    await runRedisCommand(
      "EVAL",
      REFUND_QUOTA_SCRIPT,
      "2",
      reservation.dayKey,
      reservation.minuteKey,
      String(reservation.imageCount || 1)
    );
  } catch {
    // Best-effort refund
  }
}

function buildSignedHeaders(purpose, userId, rawBody) {
  const timestamp = String(Math.floor(Date.now() / 1000));
  const digest = crypto.createHash("sha256").update(rawBody).digest("hex");
  const signature = crypto
    .createHmac("sha256", env.JWT_SECRET)
    .update(`${purpose}:${userId}:${timestamp}:${digest}`)
    .digest("hex");

  return {
    "content-type": "application/json",
    "x-internal-user-id": userId,
    "x-internal-timestamp": timestamp,
    "x-internal-signature": signature,
  };
}

async function postInternalVision({ purpose, path, user, files, extraBody }) {
  validateImageFiles(files);
  const reservation = await reserveImageQuota(user, files.length);

  const userId = String(user.id || user._id);
  const body = JSON.stringify({
    user_id: userId,
    images: files.map((file) => ({
      image_base64: file.buffer.toString("base64"),
      mime_type: file.mimetype,
    })),
    ...extraBody,
  });

  const headers = buildSignedHeaders(purpose, userId, body);
  const endpoint = `${env.AI_SERVICE_URL.replace(/\/$/, "")}${path}`;
  const timeoutMs = env.AI_IMAGE_TIMEOUT_MS || 120000;

  let response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers,
      body,
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch {
    await refundImageQuota(reservation);
    throw new ErrorResponse("Dịch vụ phân tích ảnh AI tạm thời không khả dụng. Vui lòng thử lại sau.", 503);
  }

  if (!response.ok) {
    if (response.status >= 500) {
      await refundImageQuota(reservation);
    }
    let detail = "Không thể phân tích ảnh lúc này. Vui lòng thử lại sau.";
    try {
      const errJson = await response.json();
      if (typeof errJson?.detail === "string" && errJson.detail.trim()) {
        detail = errJson.detail.trim();
      }
    } catch {
      // ignore non-JSON error body
    }
    const mappedStatus = response.status === 429 ? 429 : response.status === 503 ? 503 : 502;
    throw new ErrorResponse(detail, mappedStatus);
  }

  return response.json();
}

async function inspectMaterialImages({ user, files, note = "", address = "" }) {
  if (typeof note !== "string" || note.length > 1500) {
    throw new BadRequestError("Ghi chú tối đa 1.500 ký tự.");
  }
  return postInternalVision({
    purpose: "vision-inspect",
    path: "/internal/vision/inspect-material",
    user,
    files,
    extraBody: {
      note: note.trim(),
      address: typeof address === "string" ? address.trim().slice(0, 300) : "",
    },
  });
}

async function analyzeDemolitionImages({ user, files, description = "", address = "" }) {
  if (typeof description !== "string" || description.length > 4000) {
    throw new BadRequestError("Mô tả công trình tối đa 4.000 ký tự.");
  }
  return postInternalVision({
    purpose: "vision-demolition",
    path: "/internal/vision/analyze-demolition",
    user,
    files,
    extraBody: {
      description: description.trim(),
      address: typeof address === "string" ? address.trim().slice(0, 300) : "",
    },
  });
}

async function getUserAiQuota(user) {
  const userId = String(user.id || user._id);
  const role = String(user?.role || "user").toLowerCase();
  const isUnlimited = UNLIMITED_ROLES.has(role);
  const imageDailyLimit = isUnlimited ? -1 : dailyImageLimitFor(user);

  const prefix = env.AI_RATE_LIMIT_PREFIX || "matgreen:ai";
  const day = todayVn();
  const imageDayKey = `${prefix}:image:day:${day}:${userId}`;
  const chatDayKey = `${prefix}:day:${day}:${userId}`;

  let imageUsed = 0;
  let chatUsed = 0;

  const rawImage = await runRedisCommand("GET", imageDayKey);
  if (rawImage !== null && rawImage !== undefined) {
    imageUsed = Math.max(0, Number(rawImage) || 0);
  } else if (memoryDayCounts.has(imageDayKey)) {
    imageUsed = memoryDayCounts.get(imageDayKey) || 0;
  }

  const rawChat = await runRedisCommand("GET", chatDayKey);
  if (rawChat !== null && rawChat !== undefined) {
    chatUsed = Math.max(0, Number(rawChat) || 0);
  }

  const chatDailyLimit = isUnlimited ? -1 : 50;

  return {
    role,
    unlimited: isUnlimited,
    image: {
      dailyLimit: imageDailyLimit,
      used: imageUsed,
      remaining: imageDailyLimit === -1 ? -1 : Math.max(0, imageDailyLimit - imageUsed),
    },
    chat: {
      dailyLimit: chatDailyLimit,
      used: chatUsed,
      remaining: chatDailyLimit === -1 ? -1 : Math.max(0, chatDailyLimit - chatUsed),
    },
  };
}

module.exports = {
  inspectMaterialImages,
  analyzeDemolitionImages,
  getUserAiQuota,
  validateImageFiles,
  buildSignedHeaders,
  dailyImageLimitFor,
};
