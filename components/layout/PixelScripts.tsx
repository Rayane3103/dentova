import { MetaFbeventsLoader, MetaPixelInit } from "@/components/layout/MetaPixelScript";
import { tryConnectToDatabase } from "@/lib/db/connect";
import { Pixel } from "@/models/Pixel";

const ENV_META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();

function uniqueIds(ids: string[]) {
  return [...new Set(ids.filter(Boolean))];
}

/**
 * Fetches active pixels from the database and injects tracking scripts
 * into the document head. Meta falls back to NEXT_PUBLIC_META_PIXEL_ID
 * when no active DB pixel is configured.
 */
export async function PixelScripts() {
  const metaPixelIds: string[] = [];
  const tiktokPixelIds: string[] = [];

  if (process.env.MONGODB_URI) {
    try {
      await tryConnectToDatabase();
      const docs = await Pixel.find({ active: true }).lean();

      for (const doc of docs) {
        const platform = String(doc.platform);
        const pixelId = String(doc.pixelId);

        if (platform === "meta") {
          metaPixelIds.push(pixelId);
        }

        if (platform === "tiktok") {
          tiktokPixelIds.push(pixelId);
        }
      }
    } catch {
      // Fall through to env fallback below.
    }
  }

  if (metaPixelIds.length === 0 && ENV_META_PIXEL_ID) {
    metaPixelIds.push(ENV_META_PIXEL_ID);
  }

  const uniqueMetaPixelIds = uniqueIds(metaPixelIds);
  const uniqueTiktokPixelIds = uniqueIds(tiktokPixelIds);

  if (uniqueMetaPixelIds.length === 0 && uniqueTiktokPixelIds.length === 0) {
    return null;
  }

  return (
    <>
      {uniqueMetaPixelIds.length > 0 ? <MetaFbeventsLoader /> : null}
      {uniqueMetaPixelIds.map((pixelId) => (
        <MetaPixelInit key={`meta-${pixelId}`} pixelId={pixelId} />
      ))}
      {uniqueTiktokPixelIds.map((pixelId) => (
        <script
          dangerouslySetInnerHTML={{
            __html: `
!function(w,d,t){w.TiktokAnalyticsObject=t;
var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify",
"instances","debug","on","off","once","ready","alias","group",
"enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){
t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)
ttq.setAndDefer(e,ttq.methods[n]);return e};
ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";
ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},
ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};
var o=document.createElement("script");o.type="text/javascript",
o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;
var a=document.getElementsByTagName("script")[0];
a.parentNode.insertBefore(o,a)};
ttq.load('${pixelId}');ttq.page();}(window,document,'ttq');
            `.trim()
          }}
          id={`tiktok-pixel-${pixelId}`}
          key={`tiktok-${pixelId}`}
        />
      ))}
    </>
  );
}
