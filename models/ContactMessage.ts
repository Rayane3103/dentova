import mongoose, { Schema } from "mongoose";

const ContactMessageSchema = new Schema(
  {
    email: { type: String, required: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    phone: { type: String, trim: true },
    status: {
      type: String,
      default: "new",
      enum: ["new", "read", "archived"]
    }
  },
  { timestamps: true }
);

export const ContactMessage =
  mongoose.models.ContactMessage ||
  mongoose.model("ContactMessage", ContactMessageSchema);
