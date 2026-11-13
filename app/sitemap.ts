import type { MetadataRoute } from "next";
import { getPublishedCourses, getPublishedPosts } from "@/lib/data/queries";
import { siteConfig } from "@/lib/constants";

export const dynamic = "force-dynamic";

function toDate(value: string | undefined) {
  if (!value) {
    return new Date();
  }

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/$/, "");

  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/courses`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/inscription`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.2 }
  ];

  const [courses, posts] = await Promise.all([
    getPublishedCourses(),
    getPublishedPosts()
  ]);

  const courseEntries: MetadataRoute.Sitemap = courses.map((course) => ({
    url: `${base}/courses/${course.slug}`,
    lastModified: toDate(course.date),
    changeFrequency: "weekly",
    priority: 0.8
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: toDate(post.updatedAt),
    changeFrequency: "monthly",
    priority: 0.6
  }));

  return [...staticEntries, ...courseEntries, ...postEntries];
}
