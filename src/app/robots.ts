import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Personal, signed-in pages — nothing a search engine should index.
      disallow: ["/dashboard", "/games", "/badges", "/settings", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
