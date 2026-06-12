import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { getAdminSession } from "@/lib/auth/cookies";
import { Post } from "@/models/Post";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);

  if (!payload?.postId) {
    return NextResponse.json({ error: "postId is required." }, { status: 422 });
  }

  if (!hasDatabaseConfig()) {
    return NextResponse.json({ error: "MongoDB is required." }, { status: 503 });
  }

  await connectToDatabase();

  const post = await Post.findById(payload.postId);

  if (!post) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  const alreadyLiked = post.likes.some(
    (id: unknown) => String(id) === session.adminId
  );

  if (alreadyLiked) {
    post.likes.pull(session.adminId);
  } else {
    post.likes.push(session.adminId);
  }

  await post.save();
  revalidatePath("/");

  return NextResponse.json({
    liked: !alreadyLiked,
    likeCount: post.likes.length
  });
}
