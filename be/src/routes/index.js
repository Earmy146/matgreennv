const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const materialRoutes = require("./material.routes");
const chatRoutes = require("./chat.routes");

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

module.exports = router;
