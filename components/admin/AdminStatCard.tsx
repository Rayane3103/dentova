import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export function AdminStatCard({
  href,
  label,
  value
}: {
  href: string;
  label: string;
  value: number;
}) {
  return (
    <Link href={href}>
      <Card
        className={cn(
          "group p-4 transition duration-200 hover:border-dentova-teal/30 hover:shadow-md"
        )}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-dentova-muted">
          {label}
        </p>
        <p className="mt-2 text-2xl font-bold tabular-nums text-dentova-navy transition group-hover:text-dentova-teal">
          {value}
        </p>
      </Card>
    </Link>
  );
}
