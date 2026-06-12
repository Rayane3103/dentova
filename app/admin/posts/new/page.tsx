import { AdminHeader } from "@/components/admin/AdminHeader";
import { PostForm } from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <>
      <AdminHeader title="Nouvel article" />
      <div className="mt-5">
        <PostForm />
      </div>
    </>
  );
}
