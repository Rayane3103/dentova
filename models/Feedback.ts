import mongoose, { Schema } from "mongoose";

const FeedbackSchema = new Schema(
  {
    approved: { type: Boolean, default: false },
    courseName: { type: String, trim: true },
    email: { type: String, required: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    phone: { type: String, trim: true },
    rating: { type: Number, min: 1, max: 5 },
    role: { type: String, trim: true },
    showOnHomepage: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Feedback =
  mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema);
