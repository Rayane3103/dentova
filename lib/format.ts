export const formatPrice = (price: number) =>
  new Intl.NumberFormat("fr-DZ", {
    maximumFractionDigits: 0
  }).format(price) + " DA";

/** No thousand separators — Meta Event Setup Tool reads this visible text. */
export const formatMetaSelectablePrice = (price: number) => `${price} DA`;

export const formatCourseDate = (value: string | Date) =>
  new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(value));

export const formatShortDate = (value: string | Date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
