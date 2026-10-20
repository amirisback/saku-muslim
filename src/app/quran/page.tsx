import type { Metadata } from "next";
import { QuranDirectory } from "./quran-directory";

export const metadata: Metadata = {
  title: "Al-Qur'an Digital 30 Juz & Audio Murottal — Saku Muslim",
  description: "Baca mushaf Al-Qur'an 30 Juz lengkap 114 Surah dengan tulisan Arab bersyariat, transliterasi latin, terjemahan resmi Kemenag RI, dan audio murottal qari internasional.",
};

export default function QuranPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <QuranDirectory />
    </div>
  );
}
