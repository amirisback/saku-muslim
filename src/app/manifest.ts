import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Saku Muslim — Sahabat Ibadah Umat Muslim",
    short_name: "SakuMuslim",
    description: "Aplikasi ibadah muslim terlengkap: jadwal sholat, Al-Qur'an digital, arah kiblat, doa harian, asmaul husna, zakat, dan kalender hijriah.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#059669",
    icons: [
      {
        src: "/icon-192x192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/icon-512x512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
    ],
  };
}
