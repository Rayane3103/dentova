import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { postSchema } from "@/lib/validators/post";
import { Post } from "@/models/Post";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const payload = await request.json().catch(() => null);
  const parsed = postSchema.partial().safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 });
  }

  if (!hasDatabaseConfig()) {
    return NextResponse.json({ error: "MongoDB is required." }, { status: 503 });
  }

  await connectToDatabase();

  if (parsed.data.slug) {
    const conflict = await Post.findOne({
      slug: parsed.data.slug,
      _id: { $ne: id }
    });
    if (conflict) {
      return NextResponse.json(
        { error: "Un post avec ce slug existe déjà." },
        { status: 409 }
      );
    }
  }

  const post = await Post.findByIdAndUpdate(id, parsed.data, { new: true });
  revalidatePath("/");

  return post
    ? NextResponse.json({ post })
    : NextResponse.json({ error: "Post not found." }, { status: 404 });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params;

  if (!hasDatabaseConfig()) {
    return NextResponse.json({ error: "MongoDB is required." }, { status: 503 });
  }

  await connectToDatabase();
  await Post.findByIdAndDelete(id);
  revalidatePath("/");

  return NextResponse.json({ ok: true });
}
