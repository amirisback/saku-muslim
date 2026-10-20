import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const mainRoutes = [
  "",
  "/jadwal-sholat",
  "/quran",
  "/kiblat",
  "/doa-dzikir",
  "/asmaul-husna",
  "/zakat",
  "/kalender-hijriah",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  const staticEntries: MetadataRoute.Sitemap = mainRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: currentDate,
    changeFrequency: route === "" || route === "/jadwal-sholat" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Add 114 Surah pages
  const surahEntries: MetadataRoute.Sitemap = Array.from({ length: 114 }, (_, i) => ({
    url: `${SITE_URL}/quran/${i + 1}`,
    lastModified: currentDate,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...surahEntries];
}
