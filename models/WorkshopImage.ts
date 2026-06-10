import mongoose, { Schema } from "mongoose";

const WorkshopImageSchema = new Schema(
  {
    active: { type: Boolean, default: true },
    description: { type: String, trim: true },
    imagePublicId: { type: String },
    imageUrl: { type: String, required: true },
    order: { type: Number, default: 0 },
    title: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

export const WorkshopImage =
  mongoose.models.WorkshopImage ||
  mongoose.model("WorkshopImage", WorkshopImageSchema);
