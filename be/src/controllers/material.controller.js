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
      const {
        latitude,
        longitude,
        radiusKm,
        diameterKm,
        category,
        type,
        search,
        status,
        page,
        limit,
      } = req.query;

      const result = await materialService.getNearbyMaterials({
        latitude,
        longitude,
        radiusKm,
        diameterKm,
        category,
        type,
        search,
        status,
        page,
        limit,
      });

      new OK({
        message: "Lấy danh sách vật liệu quanh bạn thành công",
        data: result,
      }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async getMyPosts(req, res, next) {
    try {
      const { status, page, limit } = req.query;
      const result = await materialService.getMyMaterials(req.user.id, {
        status,
        page,
        limit,
      });
      new OK({
        message: "Lấy danh sách bài đăng của bạn thành công",
        data: result,
      }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const result = await materialService.updateStatus(id, req.user.id, status);
      new OK({
        message: "Cập nhật trạng thái thành công",
        data: result,
      }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const result = await materialService.deleteMaterial(id, req.user.id);
      new OK({
        message: "Xóa bài đăng thành công",
        data: result,
      }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async list(req, res, next) {
    try {
      const { category, type, page, limit } = req.query;
      const result = await materialService.getAllMaterials({
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
