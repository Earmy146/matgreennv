const express = require("express");
const favoriteController = require("../controllers/favorite.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", authenticate, favoriteController.list);
router.get("/:materialId/status", authenticate, favoriteController.status);
router.post("/:materialId", authenticate, favoriteController.add);
router.delete("/:materialId", authenticate, favoriteController.remove);

module.exports = router;
