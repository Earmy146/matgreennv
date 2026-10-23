const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authenticate } = require("../middlewares/auth.middleware");

router.post("/register", authController.register);
router.post("/verify-email", authController.verifyEmail);
router.post("/resend-otp", authController.resendOtp);
router.post("/login", authController.login);
router.get("/me", authenticate, authController.me);
router.patch("/profile", authenticate, authController.updateProfile);
router.patch("/change-password", authenticate, authController.changePassword);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/phone-verification-request", authenticate, authController.requestPhoneVerification);
router.get("/users/:id/profile", authController.publicProfile);

module.exports = router;
