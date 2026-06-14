import { tryConnectToDatabase } from "@/lib/db/connect";
import { Pixel } from "@/models/Pixel";

/**
 * Server component that fetches active pixels from the database and
 * injects their tracking scripts into the document <head>.
 *
 * This component is included in the root layout so pixels fire on
 * every page (public, admin, and marketer). The marketer can test
 * pixel activation from any page.
 */
export async function PixelScripts() {
  // Silent skip — no database, no pixels
  if (!process.env.MONGODB_URI) {
    return null;
  }

  let pixels: { platform: string; pixelId: string }[] = [];

  try {
    await tryConnectToDatabase();
    const docs = await Pixel.find({ active: true }).lean();

    pixels = docs.map((doc) => ({
      platform: String(doc.platform),
      pixelId: String(doc.pixelId)
    }));
  } catch {
    // Silently skip on any error — don't break the page for tracking
    return null;
  }

  if (pixels.length === 0) {
    return null;
  }

  return (
    <>
      {pixels.map((pixel) => {
        if (pixel.platform === "meta") {
          return (
            <script
              dangerouslySetInnerHTML={{
                __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixel.pixelId}');
fbq('track', 'PageView');
              `.trim()
              }}
              key={`meta-${pixel.pixelId}`}
            />
          );
        }

        if (pixel.platform === "tiktok") {
          return (
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
ttq.load('${pixel.pixelId}');ttq.page();}(window,document,'ttq');
              `.trim()
              }}
              key={`tiktok-${pixel.pixelId}`}
            />
          );
        }

        return null;
      })}
    </>
  );
}
