"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

/**
 * Thin animated progress bar that appears during client-side navigations.
 * Gives instant visual feedback that a route change is in progress.
 */
function TopLoaderBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const initialRender = useRef(true);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    // Do not trigger the bar on the very first render (initial page load)
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    setLoading(true);

    // Auto-finish after a reasonable window.
    // The skeleton (loading.tsx) handles cases that take longer.
    timerRef.current = setTimeout(() => {
      setLoading(false);
    }, 900);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <div aria-hidden className="fixed inset-x-0 top-0 z-[9999] h-[3px]">
      <div className="h-full w-full animate-top-loader bg-gradient-to-r from-dentova-teal-400 via-dentova-magenta to-dentova-teal-400" />
    </div>
  );
}

/**
 * Thin navigation progress bar. Wrapped in its own Suspense boundary
 * because `useSearchParams()` requires it in Next.js 15.
 */
export function TopLoader() {
  return (
    <Suspense fallback={null}>
      <TopLoaderBar />
    </Suspense>
  );
}
