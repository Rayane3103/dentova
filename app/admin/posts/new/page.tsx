import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { PostForm } from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <AdminShell>
      <AdminHeader title="Nouveau post" />
      <div className="mt-5">
        <PostForm />
      </div>
    </AdminShell>
  );
}
