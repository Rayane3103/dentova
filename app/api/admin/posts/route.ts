import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { serializePost } from "@/lib/data/serialize";
import { postSchema } from "@/lib/validators/post";
import { Post } from "@/models/Post";

export const runtime = "nodejs";

export async function GET() {
  if (!hasDatabaseConfig()) {
    return NextResponse.json({ posts: [] });
  }

  await connectToDatabase();
  const posts = await Post.find({}).sort({ createdAt: -1 }).lean();

  return NextResponse.json({
    posts: posts.map((doc) => serializePost(doc as Record<string, unknown>))
  });
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = postSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 });
  }

  if (!hasDatabaseConfig()) {
    return NextResponse.json({ error: "MongoDB is required." }, { status: 503 });
  }

  await connectToDatabase();

  const existing = await Post.findOne({ slug: parsed.data.slug });
  if (existing) {
    return NextResponse.json(
      { error: "Un post avec ce slug existe déjà." },
      { status: 409 }
    );
  }

  const post = await Post.create(parsed.data);
  revalidatePath("/");

  return NextResponse.json({ post }, { status: 201 });
}
