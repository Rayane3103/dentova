export const ORTHOCYCLE_SLUG = "dentova-orthocycle";
export const DZD_TO_USD_RATE = 250;

export const orthoCycleMetaContent = {
  content_name: "OrthoCycle",
  content_category: "Formation_ODF"
} as const;

export type CourseMetaContent = {
  content_name: string;
  content_category: string;
};

export type CourseValuePayload = {
  /** Meta standard pair — USD default so ROAS is not misread. */
  value: number;
  currency: "USD";
  /** Explicit USD pair for manual mapping in Meta / GTM. */
  value_usd: number;
  currency_usd: "USD";
  /** Original DZD pair for manual mapping in Meta / GTM. */
  value_dzd: number;
  currency_dzd: "DZD";
};

export type CourseLeadPayload = CourseMetaContent & CourseValuePayload;

export function convertDzdPriceToUsd(priceDzd: number): number {
  return Number((priceDzd / DZD_TO_USD_RATE).toFixed(2));
}

/**
 * Exposes both DZD and USD so Meta/GTM users can map either pair.
 * Standard `value` + `currency` stay in USD to avoid 320000 DZD
 * being interpreted as 320000 USD.
 */
export function getCourseValuePayload(priceDzd: number): CourseValuePayload {
  const valueUsd = convertDzdPriceToUsd(priceDzd);

  return {
    value: valueUsd,
    currency: "USD",
    value_usd: valueUsd,
    currency_usd: "USD",
    value_dzd: priceDzd,
    currency_dzd: "DZD"
  };
}

export function getCourseMetaContent(
  slug: string,
  title: string,
  categorySlug?: string
): CourseMetaContent {
  if (slug === ORTHOCYCLE_SLUG) {
    return { ...orthoCycleMetaContent };
  }

  const categoryKey = categorySlug
    ? categorySlug.replace(/-/g, "_").toUpperCase()
    : "GENERALE";

  return {
    content_name: title,
    content_category: `Formation_${categoryKey}`
  };
}

export function getCourseLeadPayload(
  slug: string,
  title: string,
  price: number,
  categorySlug?: string
): CourseLeadPayload {
  return {
    ...getCourseMetaContent(slug, title, categorySlug),
    ...getCourseValuePayload(price)
  };
}
