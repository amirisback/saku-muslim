import type { Metadata } from "next";
import { PrayerView } from "./prayer-view";

export const metadata: Metadata = {
  title: "Jadwal Sholat & Adzan — Saku Muslim",
  description: "Jadwal waktu sholat akurat seluruh kota di Indonesia sesuai hisab Kemenag RI lengkap dengan waktu Imsak, Subuh, Dzuhur, Ashar, Maghrib, Isya, dan audio adzan.",
};

export default function JadwalSholatPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <PrayerView />
    </div>
  );
}
