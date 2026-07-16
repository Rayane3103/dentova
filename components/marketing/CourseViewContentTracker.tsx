"use client";

import { useEffect } from "react";
import {
  getCourseMetaContent,
  getCourseValuePayload
} from "@/lib/marketing/meta-course-tracking";
import { trackMetaEvent } from "@/lib/marketing/track-meta-event";

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
    const viewContentPayload = {
      ...getCourseMetaContent(slug, title, categorySlug),
      ...getCourseValuePayload(price)
    };

    trackMetaEvent("ViewContent", viewContentPayload, {
      dataLayerEvent: "dentova_view_content"
    });
  }, [categorySlug, price, slug, title]);

  return null;
}
