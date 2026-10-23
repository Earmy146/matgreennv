const express = require("express");
const articleController = require("../controllers/article.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { requireRole, requireAdmin } = require("../middlewares/admin.middleware");

const router = express.Router();

// Public routes
router.get("/", articleController.getAll);
router.get("/:slugOrId", articleController.getBySlugOrId);
router.post("/:id/views", articleController.incrementViews);

// Admin / Moderator routes
router.post("/", authenticate, requireRole("moderator"), articleController.create);
router.put("/:id", authenticate, requireRole("moderator"), articleController.update);
router.delete("/:id", authenticate, requireAdmin, articleController.delete);

module.exports = router;
