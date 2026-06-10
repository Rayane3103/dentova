import Image from "next/image";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/Card";
import { workshopImages } from "@/lib/constants";

export default function WorkshopImagesPage() {
  return (
    <AdminShell>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-4xl font-extrabold text-dentova-navy">
          Workshop Images
        </h1>
        <Link
          className="rounded-lg bg-dentova-magenta px-5 py-2 font-bold text-white"
          href="/admin/workshop-images/new"
        >
          Add Workshop Images
        </Link>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {workshopImages.map((image) => (
          <Card className="overflow-hidden" key={image.id}>
            <div className="relative aspect-[4/3] bg-dentova-ice">
              <Image
                alt={image.title}
                className="object-cover"
                fill
                sizes="(min-width: 1024px) 30vw, 92vw"
                src={image.imageUrl}
              />
            </div>
            <div className="p-5">
              <h2 className="text-2xl font-extrabold text-dentova-navy">
                {image.title}
              </h2>
              <p className="text-dentova-ink/60">{image.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </AdminShell>
  );
}
