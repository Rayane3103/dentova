import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice, formatShortDate } from "@/lib/format";
import type { Course } from "@/types";

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-dentova-navy-950 shadow-xl transition-all duration-500 hover:border-dentova-teal-400/40"
      href={`/courses/${course.slug}`}
    >
      <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden">
        <Image
          alt={course.title}
          className="object-cover transition-transform duration-700 ease-out saturate-75 group-hover:scale-105"
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
          src={course.imageUrl}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[10%] bg-gradient-to-t from-dentova-navy-950/50 to-transparent" />
        <span className="absolute left-4 top-4 z-10 rounded-md bg-white/25 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
          {course.category.name}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-3 text-[11px]">
          <span className="flex items-center gap-1.5 font-semibold text-dentova-navy-300">
            <CalendarDays className="h-3 w-3 shrink-0 text-dentova-teal-400" />
            {formatShortDate(course.date)}
          </span>
          <span className="flex items-center gap-1.5 font-semibold text-dentova-navy-300">
            <MapPin className="h-3 w-3 shrink-0 text-dentova-teal-400" />
            {course.location}
          </span>
        </div>

        <h3 className="mb-2 font-display text-lg font-bold leading-snug text-white transition-colors group-hover:text-dentova-teal-300">
          {course.title}
        </h3>

        <p className="mb-4 line-clamp-4 flex-1 text-sm leading-relaxed text-dentova-navy-300">
          {course.excerpt || course.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <span className="font-display text-lg font-bold text-dentova-teal-400">
            {formatPrice(course.price)}
          </span>
          <span className="flex items-center gap-1.5 rounded-lg bg-dentova-magenta px-4 py-2 text-xs font-bold text-white transition-all group-hover:bg-dentova-violet">
            Voir les détails
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
