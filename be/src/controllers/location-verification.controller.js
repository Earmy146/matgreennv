const { OK } = require("../core/success.response");
const { LocationVerificationService } = require("../services/location-verification.service");

const locationVerificationService = new LocationVerificationService();

class LocationVerificationController {
  async verifyMaterial(req, res, next) {
    try {
      const result = await locationVerificationService.verifyMaterialLocation(
        req.user.id,
        req.params.id
      );
      new OK({ message: "Đã kiểm tra vị trí bài đăng", data: result }).send(res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LocationVerificationController();
