import mongoose, { Schema } from "mongoose";

const CourseSchema = new Schema(
  {
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    contactEmail: { type: String, required: true, trim: true },
    contactPhone: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    excerpt: { type: String, trim: true },
    featured: { type: Boolean, default: false },
    imagePublicId: { type: String },
    imageUrl: { type: String, required: true },
    instructor: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    maxSeats: { type: Number },
    price: { type: Number, required: true },
    published: { type: Boolean, default: true },
    showOnHomepage: { type: Boolean, default: true },
    slug: { type: String, required: true, unique: true, trim: true },
    subtitle: { type: String, trim: true },
    time: { type: String, trim: true },
    title: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

export const Course =
  mongoose.models.Course || mongoose.model("Course", CourseSchema);
