const env = require("../config/env");
const { calculateHaversineDistance } = require("../utils/haversine");
const { BadRequestError, ForbiddenError, NotFoundError } = require("../core/error.response");
const Material = require("../models/material.model");

const VERIFICATION_DISTANCE_LIMIT_KM = 2;

function classifyVerification({ distanceKm, accuracy }) {
  if (distanceKm <= Math.max(VERIFICATION_DISTANCE_LIMIT_KM, (accuracy || 0) / 1000)) {
    return "verified";
  }
  return "flagged";
}

async function reverseGeocode(latitude, longitude) {
  if (!env.LOCATION_VERIFICATION_ENABLED) {
    throw new BadRequestError("Tính năng xác minh địa chỉ chưa được cấu hình trên máy chủ");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}&zoom=18&addressdetails=1`,
      {
        headers: { "User-Agent": env.LOCATION_VERIFICATION_USER_AGENT },
        signal: controller.signal,
      }
    );
    if (!response.ok) throw new Error(`Reverse geocoding failed with status ${response.status}`);
    const data = await response.json();
    if (!data.display_name) throw new Error("Reverse geocoding returned no address");
    return data;
  } finally {
    clearTimeout(timeout);
  }
}

class LocationVerificationService {
  async verifyMaterialLocation(userId, materialId) {
    const material = await Material.findById(materialId);
    if (!material) throw new NotFoundError("Không tìm thấy bài đăng vật liệu");
    if (material.owner.toString() !== userId.toString()) {
      throw new ForbiddenError("Bạn không có quyền xác minh bài đăng này");
    }

    const [longitude, latitude] = material.location.coordinates;
    let geocoded;
    try {
      geocoded = await reverseGeocode(latitude, longitude);
    } catch (error) {
      material.location.verificationStatus = "unverified";
      material.location.verificationError = error.message;
      await material.save();
      throw error;
    }

    const [verifiedLongitude, verifiedLatitude] = [Number(geocoded.lon), Number(geocoded.lat)];
    if (
      !Number.isFinite(verifiedLongitude) ||
      !Number.isFinite(verifiedLatitude) ||
      verifiedLongitude < -180 ||
      verifiedLongitude > 180 ||
      verifiedLatitude < -90 ||
      verifiedLatitude > 90
    ) {
      throw new BadRequestError("Dịch vụ bản đồ trả về tọa độ không hợp lệ");
    }
    const distanceKm = calculateHaversineDistance(
      latitude,
      longitude,
      verifiedLatitude,
      verifiedLongitude
    );
    const status = classifyVerification({
      distanceKm,
      accuracy: material.location.accuracy,
    });

    material.location.verificationStatus = status;
    material.location.verifiedAddress = geocoded.display_name;
    material.location.verificationDistanceKm = distanceKm;
    material.location.verifiedAt = new Date();
    material.location.verificationError = undefined;
    await material.save();
    return material.toObject();
  }
}

module.exports = {
  LocationVerificationService,
  classifyVerification,
  reverseGeocode,
};
