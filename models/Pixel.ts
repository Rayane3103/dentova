import mongoose, { Schema } from "mongoose";

const PixelSchema = new Schema(
  {
    platform: {
      type: String,
      required: true,
      enum: ["meta", "tiktok"],
      lowercase: true,
      trim: true
    },
    pixelId: {
      type: String,
      required: true,
      trim: true
    },
    label: {
      type: String,
      trim: true
    },
    active: {
      type: Boolean,
      default: false
    },
    verifiedAt: {
      type: Date,
      default: null
    },
    notes: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

// Compound unique index: one pixel per platform
PixelSchema.index({ platform: 1 }, { unique: true });

export const Pixel =
  mongoose.models.Pixel || mongoose.model("Pixel", PixelSchema);
