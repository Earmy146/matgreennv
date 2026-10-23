const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Material",
    },
    content: {
      type: String,
      required: false,
      trim: true,
    },
    attachments: [{
      url: { type: String, required: true },
      name: { type: String, required: true },
      mimetype: { type: String, required: true },
      size: { type: Number, min: 0 },
    }],
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ sender: 1, receiver: 1, createdAt: 1 });
messageSchema.index({ receiver: 1, sender: 1, material: 1, createdAt: -1 });

module.exports = mongoose.model("Message", messageSchema);
