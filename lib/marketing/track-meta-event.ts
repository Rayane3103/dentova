type MetaEventName = "Lead" | "ViewContent";

type TrackingWindow = Window & {
  dataLayer?: Record<string, unknown>[];
  fbq?: (...args: unknown[]) => void;
};

const FBQ_POLL_INTERVAL_MS = 100;
const FBQ_POLL_MAX_ATTEMPTS = 50;

function pushDataLayerEvent(
  event: string,
  payload: Record<string, unknown>
) {
  const trackingWindow = window as TrackingWindow;
  trackingWindow.dataLayer = trackingWindow.dataLayer || [];
  trackingWindow.dataLayer.push({
    event,
    ...payload
  });
}

function sendFbqEvent(
  eventName: MetaEventName,
  payload: Record<string, unknown>,
  options?: { eventID?: string }
) {
  const trackingWindow = window as TrackingWindow;

  if (typeof trackingWindow.fbq !== "function") {
    return false;
  }

  if (options?.eventID) {
    trackingWindow.fbq("track", eventName, payload, { eventID: options.eventID });
  } else {
    trackingWindow.fbq("track", eventName, payload);
  }

  return true;
}

export function trackMetaEvent(
  eventName: MetaEventName,
  payload: Record<string, unknown>,
  options?: {
    dataLayerEvent?: string;
    eventID?: string;
  }
) {
  if (typeof window === "undefined") {
    return;
  }

  if (options?.dataLayerEvent) {
    pushDataLayerEvent(options.dataLayerEvent, payload);
  }

  if (sendFbqEvent(eventName, payload, options)) {
    return;
  }

  let attempts = 0;
  const intervalId = window.setInterval(() => {
    attempts += 1;

    if (sendFbqEvent(eventName, payload, options) || attempts >= FBQ_POLL_MAX_ATTEMPTS) {
      window.clearInterval(intervalId);
    }
  }, FBQ_POLL_INTERVAL_MS);
}
