const { BadRequestError } = require("../core/error.response");

function parseCoordinate(value, name, min, max) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) {
    throw new BadRequestError(`${name} không hợp lệ`);
  }
  return parsed;
}

function parsePositiveNumber(value, name, fallback) {
  if (value === undefined || value === null || value === "") return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new BadRequestError(`${name} phải là số lớn hơn 0`);
  }
  return parsed;
}

function parseCapturedAt(value, now = Date.now()) {
  const capturedAt = new Date(value);
  if (Number.isNaN(capturedAt.getTime())) {
    throw new BadRequestError("Thời điểm lấy GPS không hợp lệ");
  }
  if (capturedAt.getTime() < now - 15 * 60 * 1000 || capturedAt.getTime() > now + 60 * 1000) {
    throw new BadRequestError("Vị trí GPS đã quá cũ hoặc thời điểm không hợp lệ");
  }
  return capturedAt;
}

function parseAccuracy(value) {
  const accuracy = parsePositiveNumber(value, "Độ chính xác GPS");
  if (accuracy > 5000) {
    throw new BadRequestError("Độ chính xác GPS quá thấp, vui lòng thử lại ngoài trời");
  }
  return accuracy;
}

module.exports = {
  parseAccuracy,
  parseCapturedAt,
  parseCoordinate,
  parsePositiveNumber,
};
