const express = require("express");
const reportController = require("../controllers/report.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { requireAdmin } = require("../middlewares/admin.middleware");
const router = express.Router();
router.post("/", authenticate, reportController.create);
router.get("/", authenticate, requireAdmin, reportController.list);
router.patch("/:id", authenticate, requireAdmin, reportController.update);
module.exports = router;
