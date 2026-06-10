import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    sortOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);
