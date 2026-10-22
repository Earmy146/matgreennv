const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "sat_thep",          // Sắt thép cũ
        "gach_ngoi",          // Gạch, ngói cũ/vỡ
        "cua_kinh",           // Cửa gỗ, nhôm kính
        "thiet_bi_ve_sinh",   // Bồn cầu, lavabo, sen vòi
        "go_copha",           // Gỗ ván ép, copha
        "xa_ban",             // Xà bần, đất đá san lấp
        "khac",               // Khác
      ],
      default: "khac",
    },
    type: {
      type: String,
      required: true,
      enum: ["free", "sell"], // free: Cho/Tặng miễn phí, sell: Bán thanh lý
      default: "free",
    },
    price: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String, // ví dụ: "tấn", "m2", "chiếc", "xe", "tổng gói"
      default: "gói",
    },
    images: {
      type: [String],
      default: [],
    },
    // Vị trí địa lý lưu dạng GeoJSON Point để truy vấn bán kính siêu tốc trên MongoDB
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      // [longitude, latitude] - Lưu ý MongoDB chuẩn GeoJSON: kinh độ trước, vĩ độ sau
      coordinates: {
        type: [Number],
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
    contactPhone: {
      type: String,
      required: true,
      trim: true,
    },
    contactZalo: {
      type: String,
      trim: true,
    },
    contactName: {
      type: String,
      trim: true,
    },
    contactHours: {
      type: String,
      trim: true, // ví dụ: "7h - 18h hàng ngày", "Báo trước 30 phút"
    },
    status: {
      type: String,
      enum: ["available", "reserved", "completed"],
      default: "available",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Đánh chỉ mục 2dsphere phục vụ truy vấn tìm kiếm vật liệu trong bán kính X km
materialSchema.index({ location: "2dsphere" });
materialSchema.index({ category: 1, type: 1, status: 1 });

module.exports = mongoose.model("Material", materialSchema);
