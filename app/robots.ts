export const dynamic = "force-static";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/tests", "/lessons", "/pricing", "/leaderboard", "/contact", "/global-chat"],
        disallow: ["/admin", "/dashboard", "/profile", "/results", "/api/"],
      },
    ],
    sitemap: "https://exampulse.uz/sitemap.xml",
    host: "https://exampulse.uz",
  };
}
