import mongoose, { Schema } from "mongoose";

const ReservationAnswerSchema = new Schema(
  {
    questionId: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, enum: ["text", "select"], default: "text" },
    value: { type: [String], default: [] }
  },
  { _id: false }
);

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
      enum: ["pending", "confirmed", "paid", "cancelled"]
    },
    answers: { type: [ReservationAnswerSchema], default: [] },
    wilaya: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

export const Reservation =
  mongoose.models.Reservation || mongoose.model("Reservation", ReservationSchema);
