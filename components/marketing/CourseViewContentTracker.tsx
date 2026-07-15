"use client";

import { useEffect } from "react";
import { getCourseMetaContent } from "@/lib/marketing/meta-course-tracking";

type TrackingWindow = Window & {
  dataLayer?: Record<string, unknown>[];
  fbq?: (
    command: "track",
    eventName: "ViewContent",
    parameters: Record<string, string>
  ) => void;
};

type CourseViewContentTrackerProps = {
  slug: string;
  title: string;
  categorySlug?: string;
};

export function CourseViewContentTracker({
  slug,
  title,
  categorySlug
}: CourseViewContentTrackerProps) {
  useEffect(() => {
    const metaContent = getCourseMetaContent(slug, title, categorySlug);
    const trackingWindow = window as TrackingWindow;

    trackingWindow.fbq?.("track", "ViewContent", metaContent);

    trackingWindow.dataLayer = trackingWindow.dataLayer || [];
    trackingWindow.dataLayer.push({
      event: "dentova_view_content",
      ...metaContent
    });
  }, [categorySlug, slug, title]);

  return null;
}
