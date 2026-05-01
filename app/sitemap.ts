import type { MetadataRoute } from "next";

const BASE = "https://exampulse.uz";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: BASE,               lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/tests`,    lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/lessons`,  lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/pricing`,  lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/leaderboard`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE}/global-chat`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
    { url: `${BASE}/contact`,  lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];
}
