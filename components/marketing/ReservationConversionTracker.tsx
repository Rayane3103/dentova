"use client";

import { useEffect } from "react";

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
  courseId: string;
  courseName: string;
  currency: string;
  reservationId?: string;
  value: number;
};

export function ReservationConversionTracker({
  courseId,
  courseName,
  currency,
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

    const eventPayload = {
      value,
      currency,
      content_name: courseName,
      content_ids: [courseId],
      content_type: "product"
    };

    const trackingWindow = window as TrackingWindow;

    trackingWindow.fbq?.("track", "Lead", eventPayload, { eventID: eventId });

    trackingWindow.dataLayer = trackingWindow.dataLayer || [];
    trackingWindow.dataLayer.push({
      event: "dentova_reservation_lead",
      event_id: eventId,
      course_id: courseId,
      course_name: courseName,
      value,
      currency
    });
  }, [courseId, courseName, currency, reservationId, value]);

  return null;
}
