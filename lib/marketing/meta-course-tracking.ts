export const ORTHOCYCLE_SLUG = "dentova-orthocycle";

export const orthoCycleMetaContent = {
  content_name: "OrthoCycle",
  content_category: "Formation_ODF"
} as const;

export type CourseMetaContent = {
  content_name: string;
  content_category: string;
};

export type CourseLeadPayload = CourseMetaContent & {
  value: number;
  currency: "DZD";
};

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
    value: price,
    currency: "DZD"
  };
}
