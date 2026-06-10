import { Inbox } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/Card";

export function EmptyAdminState({
  description,
  title
}: {
  description: string;
  title: string;
}) {
  return (
    <AdminShell>
      <h1 className="text-4xl font-extrabold text-dentova-navy">{title}</h1>
      <Card className="mt-8 flex min-h-72 flex-col items-center justify-center p-8 text-center">
        <Inbox className="h-12 w-12 text-dentova-magenta" />
        <h2 className="mt-4 text-3xl font-extrabold text-dentova-navy">
          Nothing here yet
        </h2>
        <p className="mt-2 max-w-xl text-xl text-dentova-ink/60">
          {description}
        </p>
      </Card>
    </AdminShell>
  );
}
