import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Home,
  Mail,
  Phone
} from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReservationConversionTracker } from "@/components/marketing/ReservationConversionTracker";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { getCourseBySlug } from "@/lib/data/queries";
import { formatCourseDate, formatPrice } from "@/lib/format";

type ThankYouPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    reservation?: string;
  }>;
};

export async function generateMetadata({
  params
}: ThankYouPageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  return {
    title: course ? `Merci pour votre inscription | ${course.title}` : "Merci",
    description:
      "Votre demande de reservation Dentova a bien ete envoyee. Notre equipe vous contactera pour confirmer votre place.",
    robots: {
      index: false,
      follow: false
    }
  };
}

export default async function CourseThankYouPage({
  params,
  searchParams
}: ThankYouPageProps) {
  const [{ slug }, { reservation }] = await Promise.all([params, searchParams]);
  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-dentova-canvas">
      <ReservationConversionTracker
        courseId={course.id}
        courseName={course.title}
        currency="DZD"
        reservationId={reservation}
        value={course.price}
      />

      <section className="relative isolate overflow-hidden bg-dentova-graphite px-0 pb-16 pt-24 text-white sm:pb-20 sm:pt-32">
        <div className="absolute inset-x-0 bottom-0 -z-10 h-px bg-dentova-teal/40" />
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-dentova-teal text-dentova-graphite shadow-luxe">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <Badge className="mb-4 border-white/15 bg-white/10 text-white backdrop-blur">
              Demande envoyee
            </Badge>
            <h1 className="text-3xl font-extrabold leading-tight sm:text-5xl">
              Merci, votre inscription est bien recue.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-relaxed text-white/75 sm:text-lg">
              L&apos;equipe Dentova va vous contacter tres bientot pour confirmer
              votre place et finaliser les details pratiques.
            </p>
          </div>
        </Container>
      </section>

      <Container className="-mt-10 pb-16">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_340px]">
          <Card className="p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-dentova-mint text-dentova-graphite">
                <CalendarDays className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-dentova-muted">
                  Formation reservee
                </p>
                <h2 className="mt-2 text-2xl font-extrabold text-dentova-graphite">
                  {course.title}
                </h2>
                {course.subtitle ? (
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-dentova-muted">
                    {course.subtitle}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <InfoTile label="Date" value={formatCourseDate(course.date)} />
              <InfoTile label="Lieu" value={course.location} />
              <InfoTile label="Prix" value={formatPrice(course.price)} />
            </div>

            <div className="mt-8 rounded-lg border border-dentova-ash bg-dentova-mint/40 p-5">
              <h3 className="text-sm font-extrabold text-dentova-graphite">
                Prochaine etape
              </h3>
              <p className="mt-2 text-sm font-medium leading-relaxed text-dentova-muted">
                Gardez votre telephone disponible. Notre equipe verifiera vos
                informations et vous confirmera la reservation directement.
              </p>
            </div>
          </Card>

          <aside className="space-y-4">
            <Card className="p-5">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-dentova-muted">
                Besoin de parler a l&apos;equipe ?
              </h2>
              <div className="mt-4 space-y-3 text-sm font-semibold text-dentova-graphite">
                <a
                  className="dentova-focus flex items-center gap-3 rounded-lg border border-dentova-ash px-4 py-3 transition hover:border-dentova-teal hover:bg-dentova-mint/40"
                  href={`tel:${course.contactPhone}`}
                >
                  <Phone className="h-4 w-4 text-dentova-teal" />
                  {course.contactPhone}
                </a>
                <a
                  className="dentova-focus flex items-center gap-3 rounded-lg border border-dentova-ash px-4 py-3 transition hover:border-dentova-teal hover:bg-dentova-mint/40"
                  href={`mailto:${course.contactEmail}`}
                >
                  <Mail className="h-4 w-4 text-dentova-teal" />
                  <span className="truncate">{course.contactEmail}</span>
                </a>
              </div>
            </Card>

            <div className="grid gap-3">
              <Button
                asChild
                className="w-full"
                href={`/courses/${course.slug}`}
                variant="secondary"
              >
                <ArrowRight className="h-4 w-4" />
                Revoir la formation
              </Button>
              <Button asChild className="w-full" href="/" variant="outline">
                <Home className="h-4 w-4" />
                Retour a l&apos;accueil
              </Button>
            </div>
          </aside>
        </div>
      </Container>
    </main>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-dentova-ash bg-white px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wider text-dentova-muted">
        {label}
      </p>
      <p className="mt-1 text-sm font-extrabold text-dentova-graphite">
        {value}
      </p>
    </div>
  );
}
