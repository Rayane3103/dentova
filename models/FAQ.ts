import mongoose, { Schema } from "mongoose";

const FAQSchema = new Schema(
  {
    answer: { type: String, required: true },
    category: { type: String, default: "General", trim: true },
    published: { type: Boolean, default: true },
    question: { type: String, required: true, trim: true },
    sortOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const FAQ = mongoose.models.FAQ || mongoose.model("FAQ", FAQSchema);
