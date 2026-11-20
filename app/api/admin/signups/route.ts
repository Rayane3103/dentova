import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { adminSignupUpdateSchema } from "@/lib/validators/admin-signup";
import { ClientSignup } from "@/models/ClientSignup";

export const runtime = "nodejs";

export async function GET() {
  if (!hasDatabaseConfig()) {
    return NextResponse.json({ signups: [] });
  }

  await connectToDatabase();
  const signups = await ClientSignup.find({}).sort({ createdAt: -1 }).lean();

  return NextResponse.json({ signups });
}

export async function PATCH(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = adminSignupUpdateSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 });
  }

  if (!hasDatabaseConfig()) {
    return NextResponse.json({ error: "MongoDB is required." }, { status: 503 });
  }

  await connectToDatabase();
  const signup = await ClientSignup.findByIdAndUpdate(
    parsed.data.id,
    { status: parsed.data.status },
    { new: true }
  );

  if (!signup) {
    return NextResponse.json({ error: "Signup not found." }, { status: 404 });
  }

  revalidatePath("/admin/signups");

  return NextResponse.json({ signup });
}
