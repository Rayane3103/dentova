type TrackingWindow = Window & {
  dataLayer?: Record<string, unknown>[];
  fbq?: (...args: unknown[]) => void;
};

const FBQ_POLL_INTERVAL_MS = 100;
const FBQ_POLL_MAX_ATTEMPTS = 50;

export function pushDataLayerEvent(
  event: string,
  payload: Record<string, unknown>
) {
  if (typeof window === "undefined") {
    return;
  }

  const trackingWindow = window as TrackingWindow;
  trackingWindow.dataLayer = trackingWindow.dataLayer || [];
  trackingWindow.dataLayer.push({
    event,
    ...payload
  });
}

function sendFbqTrack(
  eventName: string,
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

function pollFbqTrack(
  eventName: string,
  payload: Record<string, unknown>,
  options?: { eventID?: string }
) {
  if (sendFbqTrack(eventName, payload, options)) {
    return;
  }

  let attempts = 0;
  const intervalId = window.setInterval(() => {
    attempts += 1;

    if (sendFbqTrack(eventName, payload, options) || attempts >= FBQ_POLL_MAX_ATTEMPTS) {
      window.clearInterval(intervalId);
    }
  }, FBQ_POLL_INTERVAL_MS);
}

function sendViewContent(payload: Record<string, unknown>) {
  return sendFbqTrack("ViewContent", payload);
}

export function trackViewContent(
  payload: Record<string, unknown>,
  options?: { dataLayerEvent?: string }
) {
  if (typeof window === "undefined") {
    return;
  }

  if (options?.dataLayerEvent) {
    pushDataLayerEvent(options.dataLayerEvent, payload);
  }

  pushDataLayerEvent("dentova_view_content", payload);

  if (sendViewContent(payload)) {
    return;
  }

  pollFbqTrack("ViewContent", payload);
}

export function trackPurchase(
  payload: Record<string, unknown>,
  options?: { dataLayerEvent?: string; eventID?: string }
) {
  if (typeof window === "undefined") {
    return;
  }

  if (options?.dataLayerEvent) {
    pushDataLayerEvent(options.dataLayerEvent, payload);
  }

  pushDataLayerEvent("dentova_purchase", payload);

  if (sendFbqTrack("Purchase", payload, options)) {
    return;
  }

  pollFbqTrack("Purchase", payload, options);
}
