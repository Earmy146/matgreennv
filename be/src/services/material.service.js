const Material = require("../models/material.model");
const { calculateHaversineDistance } = require("../utils/haversine");
const { NotFoundError, BadRequestError } = require("../core/error.response");

class MaterialService {
  /**
   * Tạo bài đăng vật liệu mới (Nhà A)
   */
  async createMaterial(userId, data) {
    const {
      title,
      description,
      category,
      type,
      price,
      unit,
      images,
      latitude,
      longitude,
      address,
      contactPhone,
    } = data;

    if (latitude === undefined || longitude === undefined || !address) {
      throw new BadRequestError("Vui lòng cung cấp tọa độ và địa chỉ công trình");
    }

    const material = await Material.create({
      title,
      description,
      category,
      type,
      price: type === "free" ? 0 : Number(price || 0),
      unit,
      images: images || [],
      location: {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)], // GeoJSON: [lng, lat]
      },
      address,
      contactPhone,
      owner: userId,
    });

    return material;
  }

  /**
   * Tìm kiếm vật liệu quanh vị trí người dùng trong bán kính X km (Nhà B)
   */
  async getNearbyMaterials({
    latitude,
    longitude,
    radiusKm = 10,
    category,
    type,
    status = "available",
  }) {
    const lat = Number(latitude);
    const lng = Number(longitude);
    const radius = Number(radiusKm);

    if (isNaN(lat) || isNaN(lng)) {
      throw new BadRequestError("Tọa độ hiện tại (latitude, longitude) không hợp lệ");
    }

    const radiusInMeters = radius * 1000;

    const query = {
      status,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: radiusInMeters,
        },
      },
    };

    if (category) {
      query.category = category;
    }

    if (type) {
      query.type = type;
    }

    const materials = await Material.find(query)
      .populate("owner", "name phone avatar")
      .lean();

    // Tính toán khoảng cách chính xác theo km và sắp xếp
    const materialsWithDistance = materials.map((item) => {
      const [itemLng, itemLat] = item.location?.coordinates || [0, 0];
      const distanceKm = calculateHaversineDistance(lat, lng, itemLat, itemLng);
      return {
        ...item,
        distanceKm,
      };
    });

    return materialsWithDistance;
  }

  /**
   * Lấy danh sách bài đăng chung hoặc phân trang
   */
  async getMaterials({ category, type, status = "available", page = 1, limit = 20 }) {
    const query = { status };
    if (category) query.category = category;
    if (type) query.type = type;

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Material.find(query)
        .populate("owner", "name phone avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Material.countDocuments(query),
    ]);

    return {
      items,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Lấy chi tiết bài đăng
   */
  async getMaterialById(id, userLat, userLng) {
    const material = await Material.findById(id)
      .populate("owner", "name phone email avatar")
      .lean();

    if (!material) {
      throw new NotFoundError("Không tìm thấy thông tin vật liệu");
    }

    let distanceKm = null;
    if (userLat !== undefined && userLng !== undefined) {
      const [lng, lat] = material.location?.coordinates || [];
      distanceKm = calculateHaversineDistance(
        Number(userLat),
        Number(userLng),
        lat,
        lng
      );
    }

    return {
      ...material,
      distanceKm,
    };
  }
}

module.exports = new MaterialService();
