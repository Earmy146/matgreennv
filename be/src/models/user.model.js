const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isSuspended: { type: Boolean, default: false },
    // Xác thực tài khoản qua Gmail / SMTP
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationOtp: {
      code: { type: String },
      expiresAt: { type: Date },
    },
    resetPasswordOtp: {
      code: { type: String },
      expiresAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
