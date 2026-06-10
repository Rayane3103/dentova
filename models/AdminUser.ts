import mongoose, { Schema } from "mongoose";

const AdminUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: "admin", enum: ["admin"] }
  },
  { timestamps: true }
);

export const AdminUser =
  mongoose.models.AdminUser || mongoose.model("AdminUser", AdminUserSchema);
