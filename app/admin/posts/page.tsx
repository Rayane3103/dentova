import { Eye, Pencil, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { getAllPosts } from "@/lib/data/queries";

export default async function AdminPostsPage() {
  const posts = await getAllPosts();

  return (
    <>
      <AdminHeader
        actions={
          <Button asChild href="/admin/posts/new" size="sm">
            <Plus className="h-3.5 w-3.5" />
            Nouvel article
          </Button>
        }
        description="Gérez le blog et publiez des actualités"
        title="Blog"
      />
      <div className="space-y-3">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <Pencil className="h-7 w-7 text-slate-400" />
            </div>
            <h3 className="mt-5 text-base font-bold text-slate-800">
              Aucun article
            </h3>
            <p className="mt-1.5 max-w-sm text-sm text-slate-500">
              Commencez à publier du contenu pour votre blog.
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <div
              className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md lg:flex-row"
              key={post.id}
            >
              {post.imageUrl && (
                <div className="relative shrink-0 overflow-hidden rounded-lg border border-slate-100 lg:h-44 lg:w-44">
                  <Image
                    alt={post.caption}
                    className="object-cover"
                    fill
                    sizes="(max-width: 1024px) 100vw, 176px"
                    src={post.imageUrl}
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-800">
                    {post.caption}
                  </h3>
                  {!post.published && <StatusBadge variant="draft" />}
                  {post.published && <StatusBadge variant="published" />}
                </div>
                <p className="line-clamp-2 text-sm leading-relaxed text-slate-500">
                  {post.content.slice(0, 200)}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {post.likes.length} like{post.likes.length !== 1 ? "s" : ""}
                  </span>
                  <span aria-hidden>·</span>
                  <span>
                    {new Date(post.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </span>
                  <span aria-hidden>·</span>
                  <Link
                    className="text-dentova-navy hover:underline"
                    href={`/blog/${post.slug}`}
                    target="_blank"
                  >
                    Voir l&apos;article ↗
                  </Link>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link
                  className="dentova-focus inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  href={`/admin/posts/${post.id}/edit`}
                >
                  <Pencil className="mr-1.5 h-3.5 w-3.5" />
                  Modifier
                </Link>
                <AdminDeleteButton endpoint={`/api/admin/posts/${post.id}`} />
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
