const Favorite = require("../models/favorite.model");
const Material = require("../models/material.model");
const { BadRequestError, NotFoundError } = require("../core/error.response");

class FavoriteService {
  async add(userId, materialId) {
    const material = await Material.findById(materialId).select("_id");
    if (!material) throw new NotFoundError("Không tìm thấy bài đăng vật liệu");
    try {
      await Favorite.create({ user: userId, material: materialId });
    } catch (err) {
      if (err.code !== 11000) throw err;
    }
    return { materialId, saved: true };
  }

  async remove(userId, materialId) {
    const result = await Favorite.deleteOne({ user: userId, material: materialId });
    if (!result.deletedCount) throw new BadRequestError("Bài đăng này chưa được lưu");
    return { materialId, saved: false };
  }

  async list(userId) {
    return Favorite.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "material",
        populate: { path: "owner", select: "name phone avatar email" },
      })
      .lean();
  }

  async status(userId, materialId) {
    const saved = await Favorite.exists({ user: userId, material: materialId });
    return { materialId, saved: Boolean(saved) };
  }
}

module.exports = new FavoriteService();
