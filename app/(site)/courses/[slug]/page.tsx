import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Phone,
  UserRound
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ReservationForm } from "@/components/forms/ReservationForm";
import { ImageGallery } from "@/components/public/ImageGallery";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { includedBenefits } from "@/lib/constants";
import {
  getActiveWorkshopImages,
  getCourseBySlug
} from "@/lib/data/queries";
import { formatCourseDate, formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

type CoursePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params
}: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  return {
    title: course?.title || "Cours"
  };
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const { slug } = await params;
  const [course, gallery] = await Promise.all([
    getCourseBySlug(slug),
    getActiveWorkshopImages()
  ]);

  if (!course) {
    notFound();
  }

  return (
    <main className="bg-dentova-canvas">
      <section className="relative isolate overflow-hidden bg-dentova-graphite py-10 text-white sm:py-12">
        <Image
          alt="Atelier clinique Dentova"
          className="absolute inset-0 -z-20 object-cover"
          fill
          priority
          sizes="100vw"
          src="/images/assets/about-clinical.webp"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-dentova-graphite/95 via-dentova-graphite/80 to-dentova-graphite/40" />
        <Container className="relative grid gap-5 lg:grid-cols-[1fr_280px] lg:items-end">
          <div>
            <Badge className="bg-white text-dentova-graphite">
              {course.category.name}
            </Badge>
            <h1 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl">
              {course.title}
            </h1>
            {course.subtitle ? (
              <p className="mt-2 max-w-2xl text-base font-bold leading-relaxed text-white/70 sm:text-lg">
                {course.subtitle}
              </p>
            ) : null}
          </div>
          <div className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-xl">
            <p className="text-xs font-extrabold uppercase text-dentova-cyan">
              Session ouverte
            </p>
            <p className="mt-2 text-2xl font-extrabold text-white">
              {formatPrice(course.price)}
            </p>
            <p className="mt-1.5 text-sm font-semibold text-white/70">
              {formatCourseDate(course.date)}
              {course.time ? ` - ${course.time}` : ""}
            </p>
          </div>
        </Container>
      </section>

      <Container className="grid gap-6 py-10 lg:grid-cols-[1fr_320px] lg:items-start">
        <div className="space-y-5">
          <div className="relative mx-auto aspect-[16/10] max-w-lg overflow-hidden rounded-lg bg-white shadow-luxe">
            <Image
              alt={course.title}
              className="object-cover"
              fill
              priority
              sizes="(min-width: 1024px) 480px, 92vw"
              src={course.imageUrl}
            />
            <div className="absolute bottom-3 left-3 rounded-full bg-dentova-cyan px-3 py-1 text-sm font-extrabold text-dentova-graphite shadow-card">
              {formatPrice(course.price)}
            </div>
          </div>

          <Card className="p-5">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-extrabold text-dentova-graphite">
              <CalendarDays className="h-5 w-5 text-dentova-cyan" />
              Details du Cours
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Detail icon={UserRound} label="Formateur" value={course.instructor} />
              <Detail icon={MapPin} label="Lieu" value={course.location} />
              <Detail
                icon={Phone}
                label="Contact"
                subvalue={course.contactEmail}
                value={course.contactPhone}
              />
              <Detail
                icon={Clock}
                label="Date & Heure"
                value={`${formatCourseDate(course.date)}${course.time ? ` - ${course.time}` : ""}`}
              />
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="mb-3 text-xl font-extrabold text-dentova-graphite">
              A propos de ce cours
            </h2>
            <p className="whitespace-pre-line text-base leading-relaxed text-dentova-muted">
              {course.description}
            </p>
          </Card>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <ReservationForm course={course} />
          <Card className="p-4">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold text-dentova-graphite">
              <CheckCircle2 className="h-4 w-4 text-dentova-cyan" />
              Ce qui est inclus
            </h2>
            <ul className="space-y-2">
              {includedBenefits.map((benefit) => (
                <li
                  className="flex items-center gap-2 text-sm font-semibold text-dentova-muted"
                  key={benefit}
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-dentova-cyan" />
                  {benefit}
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-4">
            <h2 className="mb-2 flex items-center gap-2 text-lg font-extrabold text-dentova-graphite">
              <Mail className="h-4 w-4 text-dentova-cyan" />
              Besoin d&apos;aide ?
            </h2>
            <p className="text-sm text-dentova-muted">
              Contactez l&apos;equipe Dentova pour confirmer les disponibilites ou
              demander plus d&apos;informations.
            </p>
          </Card>
        </aside>
      </Container>

      {gallery.length > 0 ? <ImageGallery images={gallery} /> : null}
    </main>
  );
}

function Detail({
  icon: Icon,
  label,
  subvalue,
  value
}: {
  icon: typeof CalendarDays;
  label: string;
  subvalue?: string;
  value: string;
}) {
  return (
    <div className="flex gap-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-dentova-mint text-dentova-graphite">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs font-bold text-dentova-muted">{label}</p>
        <p className="text-sm font-extrabold text-dentova-graphite">{value}</p>
        {subvalue ? (
          <p className="text-xs font-semibold text-dentova-cyan">{subvalue}</p>
        ) : null}
      </div>
    </div>
  );
}
