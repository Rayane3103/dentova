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

function sendViewContent(payload: Record<string, unknown>) {
  const trackingWindow = window as TrackingWindow;

  if (typeof trackingWindow.fbq !== "function") {
    return false;
  }

  trackingWindow.fbq("track", "ViewContent", payload);
  return true;
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

  let attempts = 0;
  const intervalId = window.setInterval(() => {
    attempts += 1;

    if (sendViewContent(payload) || attempts >= FBQ_POLL_MAX_ATTEMPTS) {
      window.clearInterval(intervalId);
    }
  }, FBQ_POLL_INTERVAL_MS);
}
