"use client";

import { useEffect } from "react";
import {
  getCourseMetaContent,
  getCourseValuePayload
} from "@/lib/marketing/meta-course-tracking";
import { trackViewContent } from "@/lib/marketing/track-meta-event";

type CourseViewContentTrackerProps = {
  slug: string;
  title: string;
  price: number;
  categorySlug?: string;
  page?: "course" | "thank-you";
};

export function CourseViewContentTracker({
  slug,
  title,
  price,
  categorySlug,
  page = "course"
}: CourseViewContentTrackerProps) {
  useEffect(() => {
    const payload = {
      page,
      ...getCourseMetaContent(slug, title, categorySlug),
      ...getCourseValuePayload(price)
    };

    trackViewContent(payload, {
      dataLayerEvent:
        page === "thank-you"
          ? "dentova_thank_you_page_view"
          : "dentova_course_page_view"
    });
  }, [categorySlug, page, price, slug, title]);

  return null;
}
