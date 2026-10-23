const mongoose = require("mongoose");

const materialRequestSchema = new mongoose.Schema(
  {
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Material",
      required: true,
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled", "completed"],
      default: "pending",
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    scheduledAt: Date,
    completedAt: Date,
  },
  { timestamps: true }
);

materialRequestSchema.index({ material: 1, requester: 1 }, { unique: true });
materialRequestSchema.index({ requester: 1, status: 1, createdAt: -1 });
materialRequestSchema.index({ material: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model("MaterialRequest", materialRequestSchema);
