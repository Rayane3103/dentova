import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { ClientSignup } from "@/models/ClientSignup";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params;

  if (!hasDatabaseConfig()) {
    return NextResponse.json({ error: "MongoDB is required." }, { status: 503 });
  }

  await connectToDatabase();
  const deleted = await ClientSignup.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json({ error: "Signup not found." }, { status: 404 });
  }

  revalidatePath("/admin/signups");

  return NextResponse.json({ ok: true });
}
