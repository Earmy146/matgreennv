const mongoose = require("mongoose");
const reportSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  targetType: { type: String, enum: ["material", "user"], required: true },
  material: { type: mongoose.Schema.Types.ObjectId, ref: "Material" },
  targetUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reason: { type: String, required: true, trim: true, maxlength: 1000 },
  status: { type: String, enum: ["open", "reviewing", "resolved", "rejected"], default: "open" },
  resolution: { type: String, trim: true, maxlength: 1000 },
}, { timestamps: true });
reportSchema.index({ status: 1, createdAt: -1 });
module.exports = mongoose.model("Report", reportSchema);
