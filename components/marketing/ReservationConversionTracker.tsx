"use client";

import { useEffect } from "react";
import { getCourseLeadPayload } from "@/lib/marketing/meta-course-tracking";

type Fbq = (
  command: "track",
  eventName: "Lead",
  parameters: Record<string, unknown>,
  options?: { eventID?: string }
) => void;

type TrackingWindow = Window & {
  dataLayer?: Record<string, unknown>[];
  fbq?: Fbq;
};

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

    const leadPayload = getCourseLeadPayload(
      courseSlug,
      courseName,
      value,
      categorySlug
    );
    const trackingWindow = window as TrackingWindow;

    trackingWindow.fbq?.("track", "Lead", leadPayload, { eventID: eventId });

    trackingWindow.dataLayer = trackingWindow.dataLayer || [];
    trackingWindow.dataLayer.push({
      event: "dentova_reservation_lead",
      event_id: eventId,
      ...leadPayload
    });
  }, [categorySlug, courseName, courseSlug, reservationId, value]);

  return null;
}
