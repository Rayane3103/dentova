export const ORTHOCYCLE_SLUG = "dentova-orthocycle";
export const DZD_TO_USD_RATE = 220;

export const orthoCycleMetaContent = {
  content_name: "OrthoCycle",
  content_category: "Formation_ODF"
} as const;

export type CourseMetaContent = {
  content_name: string;
  content_category: string;
};

export type CourseValuePayload = {
  value: number;
  currency: "DZD";
  value_usd: number;
  currency_usd: "USD";
};

export type CourseLeadPayload = CourseMetaContent & CourseValuePayload;

export function convertDzdPriceToUsd(priceDzd: number): number {
  return Number((priceDzd / DZD_TO_USD_RATE).toFixed(2));
}

export function getCourseValuePayload(priceDzd: number): CourseValuePayload {
  return {
    value: priceDzd,
    currency: "DZD",
    value_usd: convertDzdPriceToUsd(priceDzd),
    currency_usd: "USD"
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
