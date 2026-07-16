"use client";

import { useEffect } from "react";
import {
  getCourseMetaContent,
  getCourseValuePayload
} from "@/lib/marketing/meta-course-tracking";
import { pushDataLayerEvent } from "@/lib/marketing/track-meta-event";

type CourseViewContentTrackerProps = {
  slug: string;
  title: string;
  price: number;
  categorySlug?: string;
};

export function CourseViewContentTracker({
  slug,
  title,
  price,
  categorySlug
}: CourseViewContentTrackerProps) {
  useEffect(() => {
    pushDataLayerEvent("dentova_course_page_view", {
      ...getCourseMetaContent(slug, title, categorySlug),
      ...getCourseValuePayload(price)
    });
  }, [categorySlug, price, slug, title]);

  return null;
}
