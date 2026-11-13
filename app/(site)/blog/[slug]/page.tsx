import { ArrowLeft, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminSession } from "@/lib/auth/cookies";
import { getPostBySlug } from "@/lib/data/queries";
import { Container } from "@/components/ui/Container";
import { PostLikeButton } from "@/components/public/PostLikeButton";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPostPage({ params }: RouteContext) {
  const { slug } = await params;
  const [session, post] = await Promise.all([
    getAdminSession(),
    getPostBySlug(slug)
  ]);

  if (!post) {
    notFound();
  }

  return (
    <main className="bg-white">
      <article className="px-6 py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Link
              className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-dentova-navy-500 transition hover:text-dentova-teal-700"
              href="/blog"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour aux actualités
            </Link>

            <div className="relative mb-8 aspect-video overflow-hidden rounded-2xl">
              <Image
                alt={post.caption}
                className="object-cover"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                src={post.imageUrl}
              />
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-dentova-navy-400">
              <span className="font-medium">
                {new Date(post.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })}
              </span>
              <span aria-hidden>·</span>
              <div className="flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5 text-dentova-magenta" />
                <span className="font-medium">{post.likes.length} like{post.likes.length !== 1 ? "s" : ""}</span>
              </div>
            </div>

            <h1 className="font-display text-3xl font-black leading-tight text-dentova-navy-950 sm:text-4xl">
              {post.caption}
            </h1>

            <div className="mt-8 flex items-center border-t border-dentova-navy-50 pt-6">
              <PostLikeButton
                authenticated={Boolean(session)}
                liked={false}
                likeCount={post.likes.length}
                postId={post.id}
              />
            </div>

            <div className="mt-6 whitespace-pre-wrap text-base leading-relaxed text-dentova-navy-800">
              {post.content}
            </div>
          </div>
        </Container>
      </article>
    </main>
  );
}
