import mongoose, { Schema } from "mongoose";

const AbandonedCartAnswerSchema = new Schema(
  {
    questionId: { type: String, required: true },
    value: { type: [String], default: [] }
  },
  { _id: false }
);

/**
 * A partially filled reservation form. Rows are upserted while the visitor
 * types and flagged `converted` once they actually submit, so "abandoned" is
 * derived at query time (converted: false + stale lastActivityAt) rather than
 * stored — no cron job required.
 */
const AbandonedCartSchema = new Schema(
  {
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    sessionKey: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, default: "" },
    fullName: { type: String, trim: true, default: "" },
    message: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    profession: { type: String, trim: true, default: "" },
    wilaya: { type: String, trim: true, default: "" },
    answers: { type: [AbandonedCartAnswerSchema], default: [] },
    attempts: { type: Number, default: 1 },
    status: {
      type: String,
      default: "new",
      enum: ["new", "contacted", "lost"]
    },
    converted: { type: Boolean, default: false },
    convertedAt: { type: Date },
    reservationId: { type: Schema.Types.ObjectId, ref: "Reservation" },
    lastActivityAt: { type: Date, required: true, default: Date.now }
  },
  { timestamps: true }
);

// One row per browser session per course — the primary upsert key.
AbandonedCartSchema.index({ courseId: 1, sessionKey: 1 }, { unique: true });
// Fallback identity lookups when a visitor returns in a new session.
AbandonedCartSchema.index({ courseId: 1, email: 1 });
AbandonedCartSchema.index({ courseId: 1, phone: 1 });
// Drives the admin list query.
AbandonedCartSchema.index({ converted: 1, lastActivityAt: -1 });

export const AbandonedCart =
  mongoose.models.AbandonedCart ||
  mongoose.model("AbandonedCart", AbandonedCartSchema);
