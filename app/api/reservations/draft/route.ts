import { NextResponse } from "next/server";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { reservationDraftSchema } from "@/lib/validators/reservation-draft";
import { AbandonedCart } from "@/models/AbandonedCart";

export const runtime = "nodejs";

/**
 * Best-effort capture of a partially filled reservation form.
 *
 * This endpoint is fire-and-forget from the visitor's point of view: it never
 * blocks the form, never surfaces an error, and a failure here must never stop
 * someone from completing a reservation.
 */
export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = reservationDraftSchema.safeParse(payload);

  // Rejected drafts (no usable contact yet) are a normal, expected outcome.
  if (!parsed.success) {
    return NextResponse.json({ saved: false }, { status: 202 });
  }

  if (!hasDatabaseConfig()) {
    return NextResponse.json({ saved: false }, { status: 202 });
  }

  const { answers, courseId, sessionKey, ...contact } = parsed.data;
  const email = (contact.email ?? "").trim().toLowerCase();
  const phone = (contact.phone ?? "").trim();

  const fields = {
    answers,
    email,
    fullName: contact.fullName ?? "",
    lastActivityAt: new Date(),
    message: contact.message ?? "",
    phone,
    profession: contact.profession ?? "",
    wilaya: contact.wilaya ?? ""
  };

  try {
    await connectToDatabase();

    // 1. Same browser session — the common case.
    const existing = await AbandonedCart.findOne({ courseId, sessionKey });

    if (existing) {
      existing.set(fields);
      await existing.save();
      return NextResponse.json({ saved: true });
    }

    // 2. Same person, new session. Matching on contact details keeps one row
    //    per person per course instead of one per visit.
    const identityMatch: Record<string, string>[] = [];
    if (email) identityMatch.push({ email });
    if (phone) identityMatch.push({ phone });

    if (identityMatch.length > 0) {
      const previous = await AbandonedCart.findOne({
        courseId,
        converted: false,
        $or: identityMatch
      });

      if (previous) {
        previous.set({ ...fields, sessionKey });
        previous.attempts = (Number(previous.attempts) || 1) + 1;
        await previous.save();
        return NextResponse.json({ saved: true });
      }
    }

    // 3. Brand new lead. Upsert rather than create so two concurrent saves
    //    from the same session cannot trip the unique index.
    await AbandonedCart.findOneAndUpdate(
      { courseId, sessionKey },
      {
        $set: fields,
        $setOnInsert: { attempts: 1, converted: false, status: "new" }
      },
      { new: true, setDefaultsOnInsert: true, upsert: true }
    );

    return NextResponse.json({ saved: true });
  } catch (error) {
    console.error("[dentova] Reservation draft save failed:", error);
    return NextResponse.json({ saved: false }, { status: 202 });
  }
}
