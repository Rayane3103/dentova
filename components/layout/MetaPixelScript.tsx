/**
 * Loads the Meta fbevents.js library and fbq stub once.
 * Pixel IDs are initialized separately so init still runs even if GTM
 * already created the fbq stub.
 */
export function MetaFbeventsLoader() {
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
        `.trim()
      }}
      id="meta-fbevents-loader"
    />
  );
}

/**
 * Initializes a Meta pixel ID and tracks PageView.
 * Safe to call alongside GTM as long as the loader above is present.
 */
export function MetaPixelInit({ pixelId }: { pixelId: string }) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
fbq('init', '${pixelId}');
fbq('track', 'PageView');
          `.trim()
        }}
        id={`meta-pixel-init-${pixelId}`}
      />
      <noscript>
        <img
          alt=""
          height="1"
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          style={{ display: "none" }}
          width="1"
        />
      </noscript>
    </>
  );
}
