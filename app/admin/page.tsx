import {
  BookOpen,
  LayoutDashboard,
  MessageSquare,
  Newspaper,
  Star,
  Ticket,
  TrendingUp,
  Users
} from "lucide-react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { getAdminStats, getAllCourses } from "@/lib/data/queries";

export default async function AdminDashboardPage() {
  const [stats, courses] = await Promise.all([getAdminStats(), getAllCourses()]);

  return (
    <>
      <AdminHeader
        description="Vue d'ensemble de votre activité"
        icon={LayoutDashboard}
        title="Tableau de bord"
      />

      {!stats ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-slate-500">
            Configurez <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">MONGODB_URI</code>{" "}
            sur Vercel pour activer le tableau de bord.
          </p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
            <AdminStatCard
              accent="blue"
              href="/admin/courses"
              icon={BookOpen}
              label="Formations"
              value={stats.courses}
            />
            <AdminStatCard
              accent="emerald"
              href="/admin/reservations"
              icon={Ticket}
              label="Réservations"
              value={stats.reservations}
            />
            <AdminStatCard
              accent="default"
              href="/admin/signups"
              icon={Users}
              label="Inscriptions"
              value={stats.signups + stats.reservations}
            />
            <AdminStatCard
              accent="amber"
              href="/admin/feedback"
              icon={Star}
              label="Avis en attente"
              value={stats.pendingFeedback}
            />
            <AdminStatCard
              accent="default"
              href="/admin/messages"
              icon={MessageSquare}
              label="Messages"
              value={stats.newMessages}
            />
          </div>

          {/* Quick Links + Recent Courses */}
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {/* Recent Courses */}
            <div className="lg:col-span-2">
              <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                  <div>
                    <h2 className="text-sm font-bold text-slate-800">
                      Formations récentes
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-400">
                      Dernières formations ajoutées au catalogue
                    </p>
                  </div>
                  <Link
                    className="text-xs font-semibold text-dentova-navy transition hover:text-dentova-navy/70"
                    href="/admin/courses"
                  >
                    Voir tout →
                  </Link>
                </div>
                <div className="divide-y divide-slate-50">
                  {courses.slice(0, 5).length === 0 ? (
                    <p className="px-6 py-8 text-center text-sm text-slate-400">
                      Aucune formation créée pour le moment.
                    </p>
                  ) : (
                    courses.slice(0, 5).map((course) => (
                      <div
                        className="flex items-center justify-between gap-4 px-6 py-3.5 transition hover:bg-slate-50/70"
                        key={course.id}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {course.title}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-400">
                            {course.instructor} ·{" "}
                            {new Date(course.date).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                              year: "numeric"
                            })}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <span className="text-sm font-semibold text-slate-700">
                            DA {course.price.toLocaleString("fr-DZ")}
                          </span>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                              course.published
                                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                                : "bg-slate-100 text-slate-500 ring-1 ring-slate-200"
                            }`}
                          >
                            {course.published ? "Publié" : "Brouillon"}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-4">
                <h2 className="text-sm font-bold text-slate-800">
                  Actions rapides
                </h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  Raccourcis fréquents
                </p>
              </div>
              <div className="p-3">
                <Link
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  href="/admin/courses/new"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <BookOpen className="h-5 w-5" />
                  </span>
                  Créer une formation
                </Link>
                <Link
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  href="/admin/posts/new"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-dentova-navy/10 text-dentova-navy">
                    <Newspaper className="h-5 w-5" />
                  </span>
                  Rédiger un article
                </Link>
                <Link
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  href="/admin/reservations"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Ticket className="h-5 w-5" />
                  </span>
                  Gérer les réservations
                </Link>
                <Link
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  href="/admin/feedback"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <Star className="h-5 w-5" />
                  </span>
                  Modérer les avis
                </Link>
                <Link
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  href="/"
                  target="_blank"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                    <TrendingUp className="h-5 w-5" />
                  </span>
                  Voir le site public ↗
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
