"use client";

import { useCallback, useEffect, useRef } from "react";
import { hasUsableContact } from "@/lib/validators/reservation-draft";

const DRAFT_ENDPOINT = "/api/reservations/draft";
const DEBOUNCE_MS = 1500;

export type ReservationDraftSnapshot = {
  email?: string;
  fullName?: string;
  message?: string;
  phone?: string;
  profession?: string;
  wilaya?: string;
  answers: { questionId: string; value: string[] }[];
};

function createSessionKey() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

/**
 * Quietly persists a partially filled reservation form so it can be recovered
 * from the admin console if the visitor never submits.
 *
 * Nothing is sent until the visitor has supplied a usable email or phone, and
 * every failure is swallowed — this must never interfere with the form itself.
 */
export function useReservationDraft({
  courseId,
  getSnapshot
}: {
  courseId: string;
  getSnapshot: () => ReservationDraftSnapshot;
}) {
  const snapshotRef = useRef(getSnapshot);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSentRef = useRef("");
  const stoppedRef = useRef(false);

  useEffect(() => {
    snapshotRef.current = getSnapshot;
  });

  const storageKey = `dentova-draft-${courseId}`;

  const getSessionKey = useCallback(() => {
    if (typeof window === "undefined") return "";

    try {
      const existing = window.sessionStorage.getItem(storageKey);
      if (existing) return existing;

      const created = createSessionKey();
      window.sessionStorage.setItem(storageKey, created);
      return created;
    } catch {
      // Private browsing / storage disabled — fall back to a volatile key.
      return createSessionKey();
    }
  }, [storageKey]);

  /** Returns the serialized body, or null when there is nothing new to send. */
  const buildBody = useCallback(() => {
    const snapshot = snapshotRef.current();
    if (!hasUsableContact(snapshot)) return null;

    const sessionKey = getSessionKey();
    if (!sessionKey) return null;

    const body = JSON.stringify({ ...snapshot, courseId, sessionKey });
    return body === lastSentRef.current ? null : body;
  }, [courseId, getSessionKey]);

  const flush = useCallback(
    (useBeacon: boolean) => {
      if (stoppedRef.current) return;

      const body = buildBody();
      if (!body) return;

      lastSentRef.current = body;

      if (useBeacon && typeof navigator !== "undefined" && navigator.sendBeacon) {
        navigator.sendBeacon(
          DRAFT_ENDPOINT,
          new Blob([body], { type: "application/json" })
        );
        return;
      }

      void fetch(DRAFT_ENDPOINT, {
        body,
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        method: "POST"
      }).catch(() => {
        // Allow a retry on the next change.
        lastSentRef.current = "";
      });
    },
    [buildBody]
  );

  /** Call whenever a tracked field changes. */
  const touch = useCallback(() => {
    if (stoppedRef.current) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => flush(false), DEBOUNCE_MS);
  }, [flush]);

  // Last chance to capture the lead when the tab closes or is backgrounded.
  useEffect(() => {
    const handleHide = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      flush(true);
    };

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") handleHide();
    };

    window.addEventListener("pagehide", handleHide);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("pagehide", handleHide);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [flush]);

  /** Stop capturing — the visitor completed the reservation. */
  const stopCapture = useCallback(() => {
    stoppedRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);

    try {
      window.sessionStorage.removeItem(storageKey);
    } catch {
      // Nothing to clean up.
    }
  }, [storageKey]);

  return { getSessionKey, stopCapture, touch };
}
