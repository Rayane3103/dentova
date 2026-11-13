import { siteConfig } from "@/lib/constants";

const BASE_URL = siteConfig.url.replace(/\/$/, "");

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      type="application/ld+json"
    />
  );
}

/**
 * Organization + WebSite markup injected once on every public page.
 * Google uses it to attach the brand name, logo and canonical site URL
 * to the search result, and to understand the site hierarchy that
 * sitelinks are generated from.
 */
export function SiteStructuredData() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: siteConfig.name,
    alternateName: "Dentova Events",
    url: `${BASE_URL}/`,
    logo: `${BASE_URL}/brand/logo.svg`,
    image: `${BASE_URL}/brand/logo.svg`,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    description:
      "Dentova est une societe specialisee dans l'organisation de formations continues en medecine dentaire : formations, masterclasses et evenements pour les praticiens en Algerie.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Alger",
      addressCountry: "DZ"
    },
    areaServed: {
      "@type": "Country",
      name: "Algerie"
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: siteConfig.phone,
        email: siteConfig.email,
        contactType: "customer service",
        availableLanguage: ["fr", "ar"]
      }
    ]
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    name: siteConfig.name,
    url: `${BASE_URL}/`,
    inLanguage: "fr",
    publisher: { "@id": `${BASE_URL}/#organization` }
  };

  return (
    <>
      <JsonLd data={organization} />
      <JsonLd data={website} />
    </>
  );
}

export type BreadcrumbItem = {
  name: string;
  /** Path relative to the site root, e.g. "/courses/implantologie". */
  path: string;
};

/**
 * BreadcrumbList markup. Google renders it as the breadcrumb trail under the
 * result title and uses it as a structural signal for sitelinks.
 */
export function BreadcrumbStructuredData({ items }: { items: BreadcrumbItem[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: `${BASE_URL}${item.path}`
        }))
      }}
    />
  );
}
