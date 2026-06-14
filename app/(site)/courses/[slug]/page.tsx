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
      {/* ── Hero — course image as background ── */}
      <section className="relative isolate overflow-hidden bg-dentova-graphite pb-14 pt-24 text-white sm:pb-20 sm:pt-32">
        {course.imageUrl ? (
          <Image
            alt={course.title}
            className="absolute inset-0 -z-20 object-cover"
            fill
            priority
            sizes="100vw"
            src={course.imageUrl}
          />
        ) : null}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-dentova-graphite via-dentova-graphite/85 to-dentova-graphite/50" />

        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 bg-white/15 text-white backdrop-blur-sm">
              {course.category?.name ?? "Formation"}
            </Badge>
            <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              {course.title}
            </h1>
            {course.subtitle ? (
              <p className="mt-3 text-lg font-semibold leading-relaxed text-white/75">
                {course.subtitle}
              </p>
            ) : null}

            {/* Quick info pills */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <InfoPill icon={CalendarDays} text={formatCourseDate(course.date)} />
              {course.time ? (
                <InfoPill icon={Clock} text={course.time} />
              ) : null}
              <InfoPill icon={MapPin} text={course.location} />
              <InfoPill icon={UserRound} text={course.instructor} />
            </div>
          </div>
        </Container>
      </section>

      {/* ── Content: Image + Form side by side ── */}
      <Container className="py-12 lg:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start">
            {/* Left column — image → description → details */}
            <div className="space-y-7">
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-luxe">
                <Image
                  alt={course.title}
                  className="w-full object-contain"
                  height={0}
                  priority
                  sizes="(min-width: 1024px) 596px, 80vw"
                  src={course.imageUrl}
                  style={{ width: "100%", height: "auto" }}
                  width={0}
                />
                <div className="absolute bottom-4 left-4 rounded-full bg-dentova-cyan px-4 py-1.5 text-sm font-extrabold text-dentova-graphite shadow-card">
                  {formatPrice(course.price)}
                </div>
              </div>

              <section>
                <h2 className="mb-4 text-2xl font-extrabold text-dentova-graphite">
                  À propos de cette formation
                </h2>
                <div className="whitespace-pre-line text-base leading-relaxed text-dentova-muted">
                  {course.description}
                </div>
              </section>

              <Card className="overflow-hidden">
                <div className="border-b border-dentova-ash px-6 py-4">
                  <h2 className="flex items-center gap-2 text-lg font-extrabold text-dentova-graphite">
                    <CalendarDays className="h-5 w-5 text-dentova-teal" />
                    Détails du cours
                  </h2>
                </div>
                <div className="grid gap-0 divide-y divide-dentova-ash sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                  <DetailRow icon={UserRound} label="Formateur" value={course.instructor} />
                  <DetailRow icon={MapPin} label="Lieu" value={course.location} />
                  <DetailRow
                    icon={Clock}
                    label="Date & Heure"
                    value={`${formatCourseDate(course.date)}${course.time ? ` — ${course.time}` : ""}`}
                  />
                  <DetailRow
                    icon={Phone}
                    label="Contact"
                    value={course.contactPhone}
                    subvalue={course.contactEmail}
                  />
                </div>
              </Card>
            </div>

            {/* Right column — Form + sidebar cards */}
            <aside className="space-y-5 lg:sticky lg:top-24">
              {/* Price card */}
              <Card className="overflow-hidden">
                <div className="bg-dentova-graphite px-6 py-5 text-center text-white">
                  <p className="text-sm font-semibold text-white/60">Prix de la formation</p>
                  <p className="mt-1 text-3xl font-extrabold">{formatPrice(course.price)}</p>
                  {course.maxSeats ? (
                    <p className="mt-1.5 text-xs font-medium text-white/50">
                      Places limitées — {course.maxSeats} participants maximum
                    </p>
                  ) : null}
                </div>
              </Card>

              <ReservationForm course={course} />

              <Card className="p-5">
                <h2 className="mb-3 flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-dentova-muted">
                  <CheckCircle2 className="h-4 w-4 text-dentova-teal" />
                  Ce qui est inclus
                </h2>
                <ul className="space-y-2.5">
                  {includedBenefits.map((benefit) => (
                    <li
                      className="flex items-start gap-2.5 text-sm font-semibold text-dentova-graphite"
                      key={benefit}
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-dentova-teal" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="bg-dentova-mint/50 p-5">
                <h2 className="mb-2 flex items-center gap-2 text-sm font-extrabold text-dentova-graphite">
                  <Mail className="h-4 w-4 text-dentova-teal" />
                  Besoin d&apos;aide ?
                </h2>
                <p className="text-sm leading-relaxed text-dentova-muted">
                  Contactez l&apos;équipe Dentova pour toute question sur cette
                  formation ou pour une inscription de groupe.
                </p>
              </Card>
            </aside>
          </div>
        </div>
      </Container>

      {/* Gallery */}
      {gallery.length > 0 ? <ImageGallery images={gallery} /> : null}
    </main>
  );
}

/* ── Helper components ── */

function InfoPill({ icon: Icon, text }: { icon: typeof CalendarDays; text: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
      <Icon className="h-4 w-4 text-dentova-teal" />
      {text}
    </span>
  );
}

function DetailRow({
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
    <div className="flex gap-3 px-6 py-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-dentova-mint">
        <Icon className="h-4 w-4 text-dentova-graphite" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wider text-dentova-muted">
          {label}
        </p>
        <p className="text-sm font-extrabold text-dentova-graphite">{value}</p>
        {subvalue ? (
          <p className="truncate text-xs font-semibold text-dentova-teal">
            {subvalue}
          </p>
        ) : null}
      </div>
    </div>
  );
}
