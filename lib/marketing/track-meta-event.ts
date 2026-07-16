type TrackingWindow = Window & {
  dataLayer?: Record<string, unknown>[];
};

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
