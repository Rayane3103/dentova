"use client";

import { useEffect } from "react";
import { getCourseTrackingPayload } from "@/lib/marketing/meta-course-tracking";
import { pushDataLayerEvent } from "@/lib/marketing/track-meta-event";

type ReservationConversionTrackerProps = {
  courseName: string;
  courseSlug: string;
  categorySlug?: string;
  reservationId?: string;
  value: number;
};

export function ReservationConversionTracker({
  courseName,
  courseSlug,
  categorySlug,
  reservationId,
  value
}: ReservationConversionTrackerProps) {
  useEffect(() => {
    if (!reservationId || value <= 0) {
      return;
    }

    const eventId = `reservation-${reservationId}`;
    const storageKey = `dentova:${eventId}`;

    try {
      if (window.sessionStorage.getItem(storageKey)) {
        return;
      }

      window.sessionStorage.setItem(storageKey, "tracked");
    } catch {
      // Continue tracking if session storage is unavailable.
    }

    pushDataLayerEvent("dentova_reservation_complete", {
      event_id: eventId,
      ...getCourseTrackingPayload(courseSlug, courseName, value, categorySlug)
    });
  }, [categorySlug, courseName, courseSlug, reservationId, value]);

  return null;
}
