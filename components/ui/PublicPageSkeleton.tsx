/**
 * Loading skeletons for public-facing pages.
 * Each variant matches the layout of its corresponding page.
 */

import { Container } from "@/components/ui/Container";

/** Hero + card grid — used on the homepage. */
export function PublicHomeSkeleton() {
  return (
    <div className="animate-page-fade-in bg-white">
      {/* Hero placeholder */}
      <section className="relative overflow-hidden bg-dentova-navy-950 px-6 pb-16 pt-28 sm:pt-32">
        <div className="mx-auto max-w-6xl space-y-6 text-center">
          <div className="mx-auto h-8 w-48 rounded-full bg-white/10 animate-pulse" />
          <div className="mx-auto h-14 w-full max-w-2xl rounded-xl bg-white/10 animate-pulse" />
          <div className="mx-auto h-5 w-full max-w-lg rounded bg-white/5 animate-pulse" />
          <div className="flex items-center justify-center gap-4 pt-2">
            <div className="h-12 w-40 rounded-full bg-white/10 animate-pulse" />
            <div className="h-12 w-40 rounded-full bg-white/5 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Card grid placeholder */}
      <section className="px-6 py-16">
        <Container>
          <div className="mb-10 space-y-3 text-center">
            <div className="mx-auto h-5 w-32 rounded-full bg-dentova-navy-100 animate-pulse" />
            <div className="mx-auto h-8 w-80 rounded-lg bg-dentova-navy-50 animate-pulse" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                className="rounded-2xl border border-dentova-navy-100 bg-white p-4"
                key={i}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="aspect-[4/3] rounded-xl bg-dentova-navy-50 animate-pulse" />
                <div className="mt-4 space-y-2">
                  <div className="h-4 w-20 rounded bg-dentova-navy-100 animate-pulse" />
                  <div className="h-5 w-48 rounded bg-dentova-navy-50 animate-pulse" />
                  <div className="h-4 w-32 rounded bg-dentova-navy-50 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}

/** Grid listing — used for courses & blog listing pages. */
export function PublicListSkeleton({ cols = 3 }: { cols?: number }) {
  return (
    <div className="animate-page-fade-in bg-white">
      {/* Hero header */}
      <section className="border-b border-dentova-navy-100 bg-gradient-to-b from-dentova-teal-50/50 to-white px-6 py-20">
        <Container>
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <div className="mx-auto h-7 w-32 rounded-full bg-white border border-dentova-teal-200 animate-pulse" />
            <div className="mx-auto h-10 w-96 rounded-xl bg-dentova-navy-50 animate-pulse" />
            <div className="mx-auto h-5 w-80 rounded bg-dentova-navy-50 animate-pulse" />
          </div>
        </Container>
      </section>

      {/* Grid */}
      <section className="px-6 py-16">
        <Container>
          <div
            className="mx-auto grid max-w-5xl gap-8"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                className="rounded-2xl border border-dentova-navy-100 bg-white overflow-hidden"
                key={i}
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <div className="aspect-[4/3] bg-dentova-navy-50 animate-pulse" />
                <div className="space-y-2 p-5">
                  <div className="h-4 w-20 rounded bg-dentova-navy-100 animate-pulse" />
                  <div className="h-5 w-full rounded bg-dentova-navy-50 animate-pulse" />
                  <div className="h-4 w-3/4 rounded bg-dentova-navy-50 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}

/** Detail skeleton — used for blog post and course detail pages. */
export function PublicDetailSkeleton() {
  return (
    <div className="animate-page-fade-in bg-white">
      {/* Hero */}
      <section className="relative bg-dentova-navy-950 px-6 pb-16 pt-20">
        <Container>
          <div className="mx-auto max-w-3xl space-y-4">
            <div className="h-5 w-24 rounded-full bg-white/10 animate-pulse" />
            <div className="h-10 w-full rounded-xl bg-white/10 animate-pulse" />
            <div className="h-5 w-2/3 rounded bg-white/5 animate-pulse" />
            <div className="flex gap-4 pt-2">
              <div className="h-4 w-32 rounded bg-white/10 animate-pulse" />
              <div className="h-4 w-32 rounded bg-white/10 animate-pulse" />
            </div>
          </div>
        </Container>
      </section>

      {/* Content */}
      <section className="px-6 py-16">
        <Container>
          <div className="mx-auto max-w-3xl space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                className="h-4 rounded bg-dentova-navy-50 animate-pulse"
                key={i}
                style={{
                  animationDelay: `${i * 80}ms`,
                  width: i === 7 ? "60%" : "100%"
                }}
              />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}

/** Text-heavy pages — used for About, Privacy, Terms, Cookies. */
export function PublicTextSkeleton() {
  return (
    <div className="animate-page-fade-in bg-white">
      <section className="border-b border-dentova-navy-100 bg-gradient-to-b from-dentova-teal-50/50 to-white px-6 py-20">
        <Container>
          <div className="mx-auto max-w-3xl space-y-3 text-center">
            <div className="mx-auto h-10 w-80 rounded-xl bg-dentova-navy-50 animate-pulse" />
            <div className="mx-auto h-5 w-96 rounded bg-dentova-navy-50 animate-pulse" />
          </div>
        </Container>
      </section>

      <section className="px-6 py-16">
        <Container>
          <div className="mx-auto max-w-3xl space-y-4">
            <div className="h-6 w-48 rounded bg-dentova-navy-50 animate-pulse" />
            {[
              "90%",
              "95%",
              "82%",
              "88%",
              "94%",
              "70%"
            ].map((width, i) => (
              <div
                className="h-4 rounded bg-dentova-navy-50 animate-pulse"
                key={i}
                style={{
                  animationDelay: `${i * 70}ms`,
                  width
                }}
              />
            ))}
            <div className="mt-8 h-6 w-40 rounded bg-dentova-navy-50 animate-pulse" />
            {[
              "85%",
              "92%",
              "78%",
              "60%"
            ].map((width, i) => (
              <div
                className="h-4 rounded bg-dentova-navy-50 animate-pulse"
                key={`b-${i}`}
                style={{
                  animationDelay: `${(i + 6) * 70}ms`,
                  width
                }}
              />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
