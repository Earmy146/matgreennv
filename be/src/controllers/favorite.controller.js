const favoriteService = require("../services/favorite.service");
const { OK } = require("../core/success.response");

class FavoriteController {
  async list(req, res, next) {
    try {
      const result = await favoriteService.list(req.user.id);
      new OK({ message: "Lấy danh sách vật liệu đã lưu thành công", data: result }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async add(req, res, next) {
    try {
      const result = await favoriteService.add(req.user.id, req.params.materialId);
      new OK({ message: "Đã lưu bài đăng", data: result }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async remove(req, res, next) {
    try {
      const result = await favoriteService.remove(req.user.id, req.params.materialId);
      new OK({ message: "Đã bỏ lưu bài đăng", data: result }).send(res);
    } catch (err) {
      next(err);
    }
  }

  async status(req, res, next) {
    try {
      const result = await favoriteService.status(req.user.id, req.params.materialId);
      new OK({ message: "Lấy trạng thái lưu thành công", data: result }).send(res);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new FavoriteController();
