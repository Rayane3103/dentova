"use client";

import { ArrowRight, Newspaper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { PostLikeButton } from "@/components/public/PostLikeButton";
import { SectionHeader } from "@/components/public/SectionHeader";
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
    <section className="relative overflow-hidden bg-white px-6 py-24" id="blog">
      {/* Decorative float */}
      <motion.div
        aria-hidden="true"
        animate={{ y: [0, -15, 0] }}
        className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-dentova-teal-500/[0.03] blur-3xl"
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="mx-auto max-w-6xl">
        <div className="mb-16">
          <SectionHeader
            align="center"
            description="Retrouvez tous nos posts, conseils et annonces exclusives pour la communauté Dentova."
            eyebrow={
              <span className="inline-flex items-center gap-1.5">
                <Newspaper className="h-3 w-3 text-dentova-teal-600" />
                Actualités
              </span>
            }
            title="Restez informé·e de nos"
            accent="dernières actualités"
          />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Link
                className="group flex flex-col overflow-hidden rounded-2xl border border-dentova-navy-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                href={`/blog/${post.slug}`}
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
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Link
            className="dentova-focus inline-flex items-center gap-2 rounded-full border-2 border-dentova-navy-200 px-6 py-3 text-sm font-bold text-dentova-navy-700 transition-all hover:border-dentova-teal-500 hover:bg-dentova-teal-50 hover:text-dentova-teal-700"
            href="/blog"
          >
            Voir tous les posts
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
