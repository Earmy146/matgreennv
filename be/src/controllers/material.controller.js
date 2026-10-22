const materialService = require("../services/material.service");
const { OK, CREATED } = require("../core/success.response");

class MaterialController {
  async create(req, res, next) {
    try {
      const result = await materialService.createMaterial(req.user.id, req.body);
      new CREATED({
        message: "Đăng tin vật liệu thành công",
        data: result,
      }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async getNearby(req, res, next) {
    try {
      const { latitude, longitude, radiusKm, category, type } = req.query;
      const result = await materialService.getNearbyMaterials({
        latitude,
        longitude,
        radiusKm,
        category,
        type,
      });
      new OK({
        message: "Lấy danh sách vật liệu quanh bạn thành công",
        data: result,
      }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async list(req, res, next) {
    try {
      const { category, type, page, limit } = req.query;
      const result = await materialService.getMaterials({
        category,
        type,
        page,
        limit,
      });
      new OK({
        message: "Lấy danh sách bài đăng thành công",
        data: result,
      }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const { lat, lng } = req.query;
      const result = await materialService.getMaterialById(id, lat, lng);
      new OK({
        message: "Lấy thông tin chi tiết thành công",
        data: result,
      }).send(res);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new MaterialController();
