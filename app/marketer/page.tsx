import {
  BarChart3,
  BookOpen,
  Mail,
  MessageSquare,
  Star,
  Ticket,
  TrendingUp,
  Users
} from "lucide-react";
import Link from "next/link";
import { MarketerHeader } from "@/components/marketer/MarketerHeader";
import { MarketerStatCard } from "@/components/marketer/MarketerStatCard";
import { TrendIndicator } from "@/components/marketer/TrendIndicator";
import { BarChart, TopCoursesList } from "@/components/marketer/AnalyticsChart";
import { getMarketerStats } from "@/lib/data/queries";

export default async function MarketerDashboardPage() {
  const stats = await getMarketerStats();

  return (
    <>
      <MarketerHeader
        description="Vue d'ensemble de vos performances marketing"
        icon={BarChart3}
        title="Tableau de bord"
      />

      {!stats ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <BarChart3 className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="mt-4 text-sm font-bold text-slate-700">
            Base de données non disponible
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Configurez <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono">MONGODB_URI</code> pour activer les statistiques marketing.
          </p>
        </div>
      ) : (
        <>
          {/* ── Key Metrics Row ────────────────────── */}
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <MarketerStatCard
              accent="navy"
              icon={Ticket}
              label="Réservations"
              subtitle={
                <TrendIndicator
                  current={stats.reservationsThisMonth}
                  label="ce mois"
                  previous={stats.reservationsLastMonth}
                />
              }
              value={stats.reservations}
            />
            <MarketerStatCard
              accent="teal"
              icon={Users}
              label="Inscriptions"
              subtitle={
                <TrendIndicator
                  current={stats.signupsThisMonth}
                  label="ce mois"
                  previous={0}
                />
              }
              value={stats.signups}
            />
            <MarketerStatCard
              accent="magenta"
              icon={Mail}
              label="Abonnés newsletter"
              subtitle={
                <span className="text-xs text-slate-400">
                  +{stats.subscribersThisMonth} ce mois
                </span>
              }
              value={stats.subscribers}
            />
            <MarketerStatCard
              accent="amber"
              icon={Star}
              label="Avis en attente"
              subtitle={
                <span className="text-xs text-slate-400">
                  À modérer
                </span>
              }
              value={stats.pendingFeedback}
            />
          </div>

          {/* ── Second Row ─────────────────────────── */}
          <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <MarketerStatCard
              accent="default"
              icon={BookOpen}
              label="Formations publiées"
              subtitle={
                <span className="text-xs text-slate-400">
                  Sur {stats.courses} au total
                </span>
              }
              value={stats.publishedCourses}
            />
            <MarketerStatCard
              accent="emerald"
              icon={TrendingUp}
              label="Réservations confirmées"
              subtitle={
                <TrendIndicator
                  current={stats.confirmedReservations}
                  previous={stats.pendingReservations}
                  label="vs en attente"
                />
              }
              value={stats.confirmedReservations}
            />
            <MarketerStatCard
              accent="default"
              icon={MessageSquare}
              label="Messages"
              subtitle={
                <span className="text-xs text-slate-400">
                  {stats.newMessages} non lus
                </span>
              }
              value={stats.messages}
            />
          </div>

          {/* ── Charts + Top Courses ───────────────── */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {/* Reservations by month chart */}
            {stats.reservationsByMonth.length > 0 ? (
              <BarChart
                data={stats.reservationsByMonth.map((r) => ({
                  label: r.month,
                  value: r.count
                }))}
                title="Réservations par mois"
              />
            ) : (
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-bold text-slate-800">
                  Réservations par mois
                </h3>
                <p className="py-8 text-center text-sm text-slate-400">
                  Données insuffisantes pour afficher le graphique.
                </p>
              </div>
            )}

            {/* Top courses */}
            <TopCoursesList courses={stats.topCoursesByReservations} />
          </div>

          {/* ── Quick Links ────────────────────────── */}
          <div className="mt-8">
            <h2 className="mb-4 text-sm font-bold text-slate-800">
              Accès rapides
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                className="group flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:border-dentova-navy/30 hover:shadow-md"
                href="/marketer/pixels"
                prefetch={true}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-dentova-navy/10 text-dentova-navy transition group-hover:bg-dentova-navy/15">
                  <TrendingUp className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Pixels tracking
                  </p>
                  <p className="text-xs text-slate-400">
                    Gérer Meta et TikTok
                  </p>
                </div>
              </Link>

              <Link
                className="group flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:border-dentova-teal-300 hover:shadow-md"
                href="/admin/reservations"
                prefetch={true}
                target="_blank"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-dentova-teal-50 text-dentova-teal-600 transition group-hover:bg-dentova-teal-100">
                  <Ticket className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Réservations
                  </p>
                  <p className="text-xs text-slate-400">
                    Voir dans la console admin
                  </p>
                </div>
              </Link>

              <Link
                className="group flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:border-dentova-magenta/40 hover:shadow-md"
                href="/admin/newsletter"
                prefetch={true}
                target="_blank"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-dentova-magenta/10 text-dentova-magenta transition group-hover:bg-dentova-magenta/15">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Newsletter
                  </p>
                  <p className="text-xs text-slate-400">
                    Liste des abonnés
                  </p>
                </div>
              </Link>

              <Link
                className="group flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:border-amber-300 hover:shadow-md"
                href="/admin/feedback"
                prefetch={true}
                target="_blank"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition group-hover:bg-amber-100">
                  <Star className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Avis clients
                  </p>
                  <p className="text-xs text-slate-400">
                    Modérer les retours
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
