import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { AbandonedCart } from "@/models/AbandonedCart";

/**
 * Flags a visitor's draft as converted so it drops off the abandoned list.
 *
 * Runs after the reservation response has already been sent — every failure is
 * swallowed on purpose, since a bookkeeping problem here must never affect a
 * confirmed reservation.
 */
export async function markDraftConverted(input: {
  courseId: string;
  email?: string;
  phone?: string;
  reservationId: string;
  sessionKey?: string;
}) {
  if (!hasDatabaseConfig()) return;

  const email = (input.email ?? "").trim().toLowerCase();
  const phone = (input.phone ?? "").trim();

  // Match the draft the same way it was captured: session first, then contact.
  const identity: Record<string, string>[] = [];
  if (input.sessionKey) identity.push({ sessionKey: input.sessionKey });
  if (email) identity.push({ email });
  if (phone) identity.push({ phone });

  if (identity.length === 0) return;

  try {
    await connectToDatabase();

    await AbandonedCart.updateMany(
      { courseId: input.courseId, converted: false, $or: identity },
      {
        $set: {
          converted: true,
          convertedAt: new Date(),
          reservationId: input.reservationId
        }
      }
    );
  } catch (error) {
    console.error("[dentova] Abandoned cart conversion flag failed:", error);
  }
}
