import { Newspaper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth/cookies";
import { getPublishedPosts } from "@/lib/data/queries";
import { Container } from "@/components/ui/Container";
import { PostLikeButton } from "@/components/public/PostLikeButton";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const [session, posts] = await Promise.all([
    getAdminSession(),
    getPublishedPosts()
  ]);

  return (
    <main className="bg-white">
      <section className="border-b border-dentova-navy-100 bg-gradient-to-b from-dentova-teal-50/50 to-white px-6 py-20">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-dentova-teal-200 bg-white px-4 py-1.5 text-xs font-black uppercase tracking-widest text-dentova-teal-700">
              <Newspaper className="h-3 w-3" />
              Blog
            </span>
            <h1 className="font-display text-4xl font-black leading-tight text-dentova-navy-950 sm:text-5xl">
              Toutes nos{" "}
              <span className="bg-gradient-to-r from-dentova-teal-600 via-dentova-lavender to-dentova-magenta bg-clip-text text-transparent">
                actualités
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm font-light text-dentova-navy-500">
              Suivez l&apos;actualité de Dentova : conseils, annonces,
              événements et bien plus encore.
            </p>
          </div>
        </Container>
      </section>

      <section className="px-6 py-16">
        <Container>
          {posts.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <Newspaper className="mb-4 h-12 w-12 text-dentova-navy-200" />
              <p className="text-lg font-semibold text-dentova-navy-500">
                Aucun post publié pour le moment.
              </p>
              <p className="mt-1 text-sm text-dentova-muted">
                Revenez bientôt pour découvrir nos actualités.
              </p>
            </div>
          ) : (
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  className="group flex flex-col overflow-hidden rounded-2xl border border-dentova-navy-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  href={`/blog/${post.slug}`}
                  key={post.id}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      alt={post.caption}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      src={post.imageUrl}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dentova-navy-950/40 to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <h2 className="line-clamp-2 font-display text-lg font-bold leading-snug text-dentova-navy-950 transition-colors group-hover:text-dentova-teal-700">
                      {post.caption}
                    </h2>
                    <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-dentova-muted">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between border-t border-dentova-navy-50 pt-3">
                      <span className="text-xs font-medium text-dentova-navy-400">
                        {new Date(post.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })}
                      </span>
                      <PostLikeButton
                        authenticated={Boolean(session)}
                        liked={false}
                        likeCount={post.likes.length}
                        postId={post.id}
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}
