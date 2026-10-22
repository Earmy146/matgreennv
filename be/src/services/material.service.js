const Material = require("../models/material.model");
const { calculateHaversineDistance } = require("../utils/haversine");
const { NotFoundError, BadRequestError, ForbiddenError } = require("../core/error.response");

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
      contactZalo,
      contactName,
      contactHours,
    } = data;

    if (latitude === undefined || longitude === undefined || !address) {
      throw new BadRequestError("Vui lòng cung cấp tọa độ định vị và địa chỉ công trình");
    }

    if (!contactPhone) {
      throw new BadRequestError("Vui lòng cung cấp số điện thoại liên hệ");
    }

    const material = await Material.create({
      title,
      description,
      category,
      type: type === "sell" ? "sell" : "free",
      price: type === "free" ? 0 : Number(price || 0),
      unit: unit || "gói",
      images: Array.isArray(images) ? images : images ? [images] : [],
      location: {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)], // GeoJSON: [lng, lat]
      },
      address,
      contactPhone,
      contactZalo: contactZalo || contactPhone,
      contactName: contactName || "",
      contactHours: contactHours || "Liên hệ giờ hành chính",
      owner: userId,
      status: "available",
    });

    return material;
  }

  /**
   * Tìm kiếm vật liệu quanh vị trí người nhận (Nhà B) trong vòng bán kính hoặc đường kính
   * HỖ TRỢ PHÂN TRANG (PAGINATION) ĐẦY ĐỦ
   */
  async getNearbyMaterials({
    latitude,
    longitude,
    radiusKm,
    diameterKm,
    category,
    type,
    search,
    status = "available",
    page = 1,
    limit = 12,
  }) {
    const lat = Number(latitude);
    const lng = Number(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      throw new BadRequestError("Tọa độ hiện tại (latitude, longitude) không hợp lệ");
    }

    // Nếu người dùng nhập đường kính, bán kính = đường kính / 2
    let radius = 5; // Mặc định 5km
    if (diameterKm) {
      radius = Number(diameterKm) / 2;
    } else if (radiusKm) {
      radius = Number(radiusKm);
    }

    const currentPage = Math.max(1, Number(page) || 1);
    const pageSize = Math.max(1, Number(limit) || 12);
    const skip = (currentPage - 1) * pageSize;

    // Bán kính trái đất ~ 6378.1 km
    const radiusInRadians = radius / 6378.1;

    const query = {
      status,
      location: {
        $geoWithin: {
          $centerSphere: [[lng, lat], radiusInRadians],
        },
      },
    };

    if (category) {
      query.category = category;
    }

    if (type) {
      query.type = type;
    }

    if (search && typeof search === "string" && search.trim()) {
      const term = search.trim();
      query.$or = [
        { title: { $regex: term, $options: "i" } },
        { description: { $regex: term, $options: "i" } },
        { "location.address": { $regex: term, $options: "i" } },
      ];
    }

    // Đếm tổng số bài đăng trong bán kính để làm phân trang
    const [rawMaterials, total] = await Promise.all([
      Material.find(query)
        .populate("owner", "name phone avatar email")
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Material.countDocuments(query),
    ]);

    // Tính toán khoảng cách chính xác theo km (Haversine) cho từng bài đăng
    const items = rawMaterials
      .map((item) => {
        const [itemLng, itemLat] = item.location?.coordinates || [0, 0];
        const distanceKm = calculateHaversineDistance(lat, lng, itemLat, itemLng);
        return {
          ...item,
          distanceKm,
        };
      })
      .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));

    const totalPages = Math.ceil(total / pageSize) || 1;

    return {
      items,
      pagination: {
        page: currentPage,
        limit: pageSize,
        total,
        totalPages,
        hasPrevPage: currentPage > 1,
        hasNextPage: currentPage < totalPages,
      },
      searchRadiusKm: radius,
      searchDiameterKm: radius * 2,
    };
  }

  /**
   * Lấy danh sách bài đăng của chính người dùng (Nhà A quản lý tin)
   */
  async getMyMaterials(userId, { status, page = 1, limit = 10 }) {
    const query = { owner: userId };
    if (status) query.status = status;

    const currentPage = Math.max(1, Number(page) || 1);
    const pageSize = Math.max(1, Number(limit) || 10);
    const skip = (currentPage - 1) * pageSize;

    const [items, total] = await Promise.all([
      Material.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Material.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / pageSize) || 1;

    return {
      items,
      pagination: {
        page: currentPage,
        limit: pageSize,
        total,
        totalPages,
        hasPrevPage: currentPage > 1,
        hasNextPage: currentPage < totalPages,
      },
    };
  }

  /**
   * Cập nhật trạng thái bài đăng (available -> reserved -> completed)
   */
  async updateStatus(id, userId, status) {
    const validStatuses = ["available", "reserved", "completed"];
    if (!validStatuses.includes(status)) {
      throw new BadRequestError("Trạng thái không hợp lệ");
    }

    const material = await Material.findById(id);
    if (!material) {
      throw new NotFoundError("Không tìm thấy thông tin vật liệu");
    }

    if (material.owner.toString() !== userId.toString()) {
      throw new ForbiddenError("Bạn không có quyền chỉnh sửa bài đăng này");
    }

    material.status = status;
    await material.save();
    return material;
  }

  /**
   * Xóa bài đăng
   */
  async deleteMaterial(id, userId) {
    const material = await Material.findById(id);
    if (!material) {
      throw new NotFoundError("Không tìm thấy thông tin vật liệu");
    }

    if (material.owner.toString() !== userId.toString()) {
      throw new ForbiddenError("Bạn không có quyền xóa bài đăng này");
    }

    await Material.findByIdAndDelete(id);
    return { success: true, message: "Đã xóa bài đăng thành công" };
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
