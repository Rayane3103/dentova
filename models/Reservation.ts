import mongoose, { Schema } from "mongoose";

const ReservationSchema = new Schema(
  {
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    email: { type: String, required: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    message: { type: String, trim: true },
    phone: { type: String, required: true, trim: true },
    profession: { type: String, trim: true },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "confirmed", "cancelled"]
    },
    wilaya: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

export const Reservation =
  mongoose.models.Reservation || mongoose.model("Reservation", ReservationSchema);
