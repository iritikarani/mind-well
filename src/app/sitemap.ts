import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/calm", priority: 0.9 },
    { path: "/signup", priority: 0.6 },
    { path: "/login", priority: 0.4 },
    { path: "/safety", priority: 0.5 },
    { path: "/privacy", priority: 0.3 },
    { path: "/terms", priority: 0.3 },
  ];
  return pages.map((p) => ({
    url: `${SITE_URL}${p.path}`,
    changeFrequency: "monthly",
    priority: p.priority,
  }));
}
