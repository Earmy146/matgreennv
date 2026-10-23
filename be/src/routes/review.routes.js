const express = require("express");
const reviewController = require("../controllers/review.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const router = express.Router();
router.get("/:requestId", authenticate, reviewController.list);
router.post("/:requestId", authenticate, reviewController.create);
module.exports = router;
