import { AdminFormSkeleton } from "@/components/ui/AdminFormSkeleton";

export default function EditPostLoading() {
  return <AdminFormSkeleton fields={5} title="Modifier l'article..." />;
}
