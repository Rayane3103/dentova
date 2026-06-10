import mongoose, { Schema } from "mongoose";

const MentorSchema = new Schema(
  {
    active: { type: Boolean, default: true },
    bio: { type: String, trim: true },
    imagePublicId: { type: String },
    imageUrl: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    showOnHomepage: { type: Boolean, default: true },
    specialty: { type: String, trim: true },
    title: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

export const Mentor = mongoose.models.Mentor || mongoose.model("Mentor", MentorSchema);
