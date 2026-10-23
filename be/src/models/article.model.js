const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, default: "Chuyên gia MatGreen" },
    avatar: { type: String, default: "/assets/images/resources/about-author-1.png" },
  },
  { _id: false }
);

const articleSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Kinh Tế Tuần Hoàn", "Kinh Nghiệm Tháo Dỡ", "Vật Liệu Xanh", "Hướng Dẫn & Mẹo"],
      default: "Kinh Tế Tuần Hoàn",
    },
    author: {
      type: authorSchema,
      default: () => ({}),
    },
    publishedAt: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },
    thumbnail: {
      type: String,
      required: true,
    },
    bannerImage: {
      type: String,
      default: "",
    },
    views: {
      type: Number,
      default: 0,
    },
    readTimeMinutes: {
      type: Number,
      default: 5,
    },
    tags: {
      type: [String],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Article", articleSchema);
