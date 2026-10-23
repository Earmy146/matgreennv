const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const materialRoutes = require("./material.routes");
const chatRoutes = require("./chat.routes");
const uploadRoutes = require("./upload.routes");
const materialRequestRoutes = require("./material-request.routes");
const notificationRoutes = require("./notification.routes");
const favoriteRoutes = require("./favorite.routes");
const reviewRoutes = require("./review.routes");
const reportRoutes = require("./report.routes");
const adminRoutes = require("./admin.routes");

router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "matgreen-backend",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);
router.use("/materials", materialRoutes);
router.use("/chat", chatRoutes);
router.use("/upload", uploadRoutes);
router.use("/material-requests", materialRequestRoutes);
router.use("/notifications", notificationRoutes);
router.use("/favorites", favoriteRoutes);
router.use("/reviews", reviewRoutes);
router.use("/reports", reportRoutes);
router.use("/admin", adminRoutes);

// Public Site Config endpoint
const siteConfigController = require("../controllers/site-config.controller");
router.get("/site-config", siteConfigController.get);

module.exports = router;
