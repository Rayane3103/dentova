import mongoose, { Schema } from "mongoose";

const ClientSignupSchema = new Schema(
  {
    courseInterest: { type: String, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    fullName: { type: String, required: true, trim: true },
    message: { type: String, trim: true },
    newsletterOptIn: { type: Boolean, default: true },
    phone: { type: String, trim: true },
    profession: { type: String, trim: true },
    status: {
      type: String,
      enum: ["new", "contacted", "archived"],
      default: "new"
    },
    wilaya: { type: String, trim: true }
  },
  { timestamps: true }
);

export const ClientSignup =
  mongoose.models.ClientSignup ||
  mongoose.model("ClientSignup", ClientSignupSchema);
