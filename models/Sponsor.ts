import mongoose, { Schema } from "mongoose";

const SponsorSchema = new Schema(
  {
    active: { type: Boolean, default: true },
    imagePublicId: { type: String },
    imageUrl: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    websiteUrl: { type: String, trim: true }
  },
  { timestamps: true }
);

export const Sponsor =
  mongoose.models.Sponsor || mongoose.model("Sponsor", SponsorSchema);
