import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { PostForm } from "@/components/admin/PostForm";
import { getPostAdminRecord } from "@/lib/data/queries";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export default async function EditPostPage({ params }: RouteContext) {
  const { id } = await params;
  const post = await getPostAdminRecord(id);

  if (!post) {
    notFound();
  }

  return (
    <AdminShell>
      <AdminHeader title="Modifier le post" />
      <div className="mt-5">
        <PostForm
          initialValues={{
            caption: String(post.caption),
            content: String(post.content),
            imageUrl: String(post.imageUrl),
            imagePublicId: post.imagePublicId ? String(post.imagePublicId) : undefined,
            published: Boolean(post.published),
            slug: String(post.slug)
          }}
          postId={id}
        />
      </div>
    </AdminShell>
  );
}
