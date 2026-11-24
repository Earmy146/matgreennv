const mongoose = require("mongoose");

const recommendedMaterialSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, default: "khac" },
    type: { type: String, default: "free" },
    price: { type: Number, default: 0 },
    unit: { type: String, default: "gói" },
    address: { type: String, default: "" },
    distance_km: { type: Number, default: null },
    image: { type: String, default: null },
    status: { type: String, default: "available" },
  },
  { _id: false }
);

const aiMessageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 12000,
    },
    recommended_materials: {
      type: [recommendedMaterialSchema],
      default: [],
    },
    tools_used: {
      type: [String],
      default: [],
    },
    model: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const aiConversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 140,
      default: "Cuộc trò chuyện mới",
    },
    materialId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Material",
      default: null,
    },
    messages: {
      type: [aiMessageSchema],
      default: [],
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

aiConversationSchema.index({ user: 1, lastMessageAt: -1 });

module.exports = mongoose.model("AiConversation", aiConversationSchema);
