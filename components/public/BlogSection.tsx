"use client";

import { ArrowRight, Newspaper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PostLikeButton } from "@/components/public/PostLikeButton";
import type { BlogPost } from "@/types";

export function BlogSection({
  authenticated,
  posts
}: {
  authenticated: boolean;
  posts: BlogPost[];
}) {
  if (posts.length === 0) return null;

  return (
    <section className="bg-white px-6 py-24" id="blog">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-dentova-teal-200 bg-dentova-teal-50 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-dentova-teal-700">
            <Newspaper className="h-3 w-3 text-dentova-teal-600" />
            Actualités
          </span>
          <h2 className="font-display text-3xl font-black leading-tight text-dentova-navy-950 sm:text-4xl lg:text-5xl">
            Restez informé·e de nos{" "}
            <span className="bg-gradient-to-r from-dentova-teal-600 via-dentova-lavender to-dentova-magenta bg-clip-text text-transparent">
              dernières actualités
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm font-light text-dentova-navy-500">
            Retrouvez tous nos posts, conseils et annonces exclusives pour la
            communauté Dentova.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
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
                <h3 className="line-clamp-2 font-display text-lg font-bold leading-snug text-dentova-navy-950 group-hover:text-dentova-teal-700 transition-colors">
                  {post.caption}
                </h3>
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
                    authenticated={authenticated}
                    liked={false}
                    likeCount={post.likes.length}
                    postId={post.id}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            className="dentova-focus inline-flex items-center gap-2 rounded-full border-2 border-dentova-navy-200 px-6 py-3 text-sm font-bold text-dentova-navy-700 transition-all hover:border-dentova-teal-500 hover:bg-dentova-teal-50 hover:text-dentova-teal-700"
            href="/blog"
          >
            Voir tous les posts
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
