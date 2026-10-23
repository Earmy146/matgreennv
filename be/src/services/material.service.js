const Material = require("../models/material.model");
const { calculateHaversineDistance } = require("../utils/haversine");
const { NotFoundError, BadRequestError, ForbiddenError } = require("../core/error.response");
const {
  parseAccuracy,
  parseCapturedAt,
  parseCoordinate,
  parsePositiveNumber,
} = require("../utils/location-validation");

const EARTH_RADIUS_KM = 6371;

class MaterialService {
  async updateMaterial(id, userId, data, userRole = "user") {
    const isStaff = userRole === "admin" || userRole === "moderator";
    const material = isStaff
      ? await Material.findById(id)
      : await Material.findOne({ _id: id, owner: userId });
    if (!material) throw new NotFoundError("Không tìm thấy bài đăng hoặc bạn không có quyền sửa");
    const allowed = ["title", "description", "category", "type", "price", "unit", "images", "address", "contactPhone", "contactZalo", "contactName", "contactHours", "status"];
    for (const key of allowed) if (data[key] !== undefined) {
      if (key === "address") {
        if (!material.location) material.location = { type: "Point", coordinates: [105.8542, 21.0285] };
        material.location.address = String(data[key]).trim();
      } else {
        material[key] = data[key];
      }
    }
    if (material.type === "free") material.price = 0;
    await material.save();
    return material;
  }
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
      accuracy,
      capturedAt,
      address,
      contactPhone,
      contactZalo,
      contactName,
      contactHours,
    } = data;

    if (typeof title !== "string" || title.trim().length < 5 || title.trim().length > 180) {
      throw new BadRequestError("Tiêu đề phải dài từ 5 đến 180 ký tự");
    }
    if (description && (typeof description !== "string" || description.trim().length > 5000)) {
      throw new BadRequestError("Mô tả không được vượt quá 5.000 ký tự");
    }
    if (latitude === undefined || longitude === undefined || !address?.trim()) {
      throw new BadRequestError("Vui lòng cung cấp tọa độ định vị và địa chỉ công trình");
    }
    if (accuracy === undefined || capturedAt === undefined) {
      throw new BadRequestError("Vui lòng lấy GPS hiện tại trước khi đăng bài");
    }


    const parsedLatitude = parseCoordinate(latitude, "Vĩ độ", -90, 90);
    const parsedLongitude = parseCoordinate(longitude, "Kinh độ", -180, 180);
    const parsedAccuracy = parseAccuracy(accuracy);
    const parsedCapturedAt = parseCapturedAt(capturedAt);

    if (!contactPhone) {
      throw new BadRequestError("Vui lòng cung cấp số điện thoại liên hệ");
    }
    if (!/^[0-9+().\-\s]{8,25}$/.test(String(contactPhone).trim())) {
      throw new BadRequestError("Số điện thoại liên hệ không hợp lệ");
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
        coordinates: [parsedLongitude, parsedLatitude],
        address: address.trim(),
        accuracy: parsedAccuracy,
        capturedAt: parsedCapturedAt,
        source: "browser_gps",
      },
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
    excludeUserId = null,
  }) {
    const lat = parseCoordinate(latitude, "Vĩ độ", -90, 90);
    const lng = parseCoordinate(longitude, "Kinh độ", -180, 180);

    // Nếu người dùng nhập đường kính, bán kính = đường kính / 2
    let radius = 5;
    if (diameterKm) {
      radius = parsePositiveNumber(diameterKm, "Đường kính") / 2;
    } else if (radiusKm) {
      radius = parsePositiveNumber(radiusKm, "Bán kính");
    }

    if (radius > 200) {
      throw new BadRequestError("Bán kính tìm kiếm không được vượt quá 200 km");
    }

    const currentPage = Math.max(1, Number(page) || 1);
    const pageSize = Math.max(1, Math.min(50, Number(limit) || 12));
    const skip = (currentPage - 1) * pageSize;

    // Bán kính trái đất ~ 6378.1 km
    const query = {
      status,
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

    // Loại trừ bài của chính người đang đăng nhập
    if (excludeUserId) {
      query.owner = { $ne: excludeUserId };
    }

    // Đếm tổng số bài đăng trong bán kính để làm phân trang
    const [rawMaterials, total] = await Promise.all([
      Material.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: [lng, lat] },
            key: "location",
            distanceField: "distanceMeters",
            maxDistance: radius * 1000,
            spherical: true,
            query,
          },
        },
        { $skip: skip },
        { $limit: pageSize },
      ]),
      Material.countDocuments({
        ...query,
        location: {
          $geoWithin: {
            $centerSphere: [[lng, lat], radius / EARTH_RADIUS_KM],
          },
        },
      }),
    ]);

    await Material.populate(rawMaterials, {
      path: "owner",
      select: "name phone avatar email",
    });

    // Tính toán khoảng cách chính xác theo km (Haversine) cho từng bài đăng
    const items = rawMaterials
      .map((item) => {
        const [itemLng, itemLat] = item.location?.coordinates || [0, 0];
        const distanceKm = Number.isFinite(item.distanceMeters)
          ? Math.round((item.distanceMeters / 1000) * 100) / 100
          : calculateHaversineDistance(lat, lng, itemLat, itemLng);
        return {
          ...item,
          distanceKm,
        };
      });

    const totalPages = Math.ceil(total / pageSize);

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

  async getAllMaterials({ category, type, page = 1, limit = 12 }) {
    const query = { status: "available" };
    if (category) query.category = category;
    if (type) query.type = type;

    const currentPage = Math.max(1, Number(page) || 1);
    const pageSize = Math.max(1, Math.min(50, Number(limit) || 12));
    const [items, total] = await Promise.all([
      Material.find(query)
        .populate("owner", "name phone avatar email bio phoneVerified")
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .lean(),
      Material.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / pageSize);
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
      .populate("owner", "name phone email avatar bio phoneVerified")
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
