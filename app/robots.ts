import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants";

const BASE_URL = siteConfig.url.replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/marketer",
          "/marketer/",
          "/api/",
          "/login",
          "/courses/*/thank-you"
        ]
      }
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL
  };
}
