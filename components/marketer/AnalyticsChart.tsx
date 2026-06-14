"use client";

import { cn } from "@/lib/utils";

type BarDatum = {
  label: string;
  value: number;
  maxValue?: number;
};

export function BarChart({
  data,
  title,
  className,
  height = 160
}: {
  data: BarDatum[];
  title?: string;
  className?: string;
  height?: number;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={cn("rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm", className)}>
      {title && (
        <h3 className="mb-5 text-sm font-bold text-slate-800">{title}</h3>
      )}
      <div
        className="flex items-end gap-2"
        style={{ height }}
      >
        {data.map((item) => {
          const pct = (item.value / max) * 100;
          return (
            <div
              key={item.label}
              className="group relative flex flex-1 flex-col items-center justify-end"
            >
              {/* Value tooltip */}
              <div className="invisible absolute -top-8 z-10 rounded-lg bg-slate-800 px-2 py-1 text-[10px] font-semibold text-white opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                {item.value}
              </div>

              {/* Bar */}
              <div
                className="relative w-full max-w-[48px] rounded-t-lg transition-all duration-500"
                style={{
                  height: `${Math.max(pct, 2)}%`,
                  background: `linear-gradient(180deg, #3c348a ${0}%, #14123a ${100}%)`
                }}
              >
                {/* Shine effect */}
                <div className="absolute inset-x-2 top-0 h-8 rounded-t-lg bg-white/15" />
              </div>

              {/* Label */}
              <span className="mt-2 text-[10px] font-medium text-slate-400 whitespace-nowrap">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TopCoursesList({
  courses,
  className
}: {
  courses: {
    courseId: string;
    title: string;
    count: number;
    imageUrl: string;
    date: string;
  }[];
  className?: string;
}) {
  if (courses.length === 0) {
    return (
      <div className={cn("rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm", className)}>
        <h3 className="mb-4 text-sm font-bold text-slate-800">
          Top formations par réservations
        </h3>
        <p className="py-6 text-center text-sm text-slate-400">
          Aucune réservation pour le moment.
        </p>
      </div>
    );
  }

  const max = Math.max(...courses.map((c) => c.count), 1);

  return (
    <div className={cn("rounded-2xl border border-slate-200/80 bg-white shadow-sm", className)}>
      <div className="border-b border-slate-100 px-6 py-4">
        <h3 className="text-sm font-bold text-slate-800">
          Top formations par réservations
        </h3>
      </div>
      <div className="divide-y divide-slate-50">
        {courses.map((course, i) => (
          <div
            key={course.courseId}
            className="flex items-center gap-4 px-6 py-3.5 transition hover:bg-slate-50/70"
          >
            {/* Rank */}
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                i === 0
                  ? "bg-dentova-magenta/10 text-dentova-magenta"
                  : i === 1
                  ? "bg-dentova-navy/10 text-dentova-navy"
                  : i === 2
                  ? "bg-dentova-teal-50 text-dentova-teal-600"
                  : "bg-slate-100 text-slate-500"
              )}
            >
              {i + 1}
            </span>

            {/* Course info */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                {course.title}
              </p>
              <p className="mt-0.5 text-xs text-slate-400">
                {course.date
                  ? new Date(course.date).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })
                  : "Date inconnue"}
              </p>
            </div>

            {/* Bar + count */}
            <div className="flex items-center gap-3">
              <div className="hidden h-1.5 w-20 overflow-hidden rounded-full bg-slate-100 sm:block">
                <div
                  className="h-full rounded-full bg-dentova-navy transition-all"
                  style={{
                    width: `${Math.round((course.count / max) * 100)}%`
                  }}
                />
              </div>
              <span className="text-sm font-bold tabular-nums text-slate-700">
                {course.count}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
