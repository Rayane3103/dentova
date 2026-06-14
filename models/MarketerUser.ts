import mongoose, { Schema } from "mongoose";

const MarketerUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: "marketer", enum: ["marketer"] }
  },
  { timestamps: true }
);

export const MarketerUser =
  mongoose.models.MarketerUser || mongoose.model("MarketerUser", MarketerUserSchema);
