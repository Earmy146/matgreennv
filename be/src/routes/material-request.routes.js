const express = require("express");
const materialRequestController = require("../controllers/material-request.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authenticate);
router.get("/", materialRequestController.listMine);
router.post("/", materialRequestController.create);
router.patch("/:id/status", materialRequestController.updateStatus);

module.exports = router;
