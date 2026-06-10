import mongoose, { Schema } from "mongoose";

const NewsletterSubscriberSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true }
  },
  { timestamps: true }
);

export const NewsletterSubscriber =
  mongoose.models.NewsletterSubscriber ||
  mongoose.model("NewsletterSubscriber", NewsletterSubscriberSchema);
