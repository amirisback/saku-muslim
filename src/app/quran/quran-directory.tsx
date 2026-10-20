"use client";

import { useState } from "react";
import Link from "next/link";
import { QURAN_SURAHS } from "@/data/quran-surahs";
import { AudioPlayer } from "@/components/shared/audio-player";

export function QuranDirectory() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "Makkiyah" | "Madaniyah">("all");
  const [lastRead] = useState<{ number: number; name: string; ayah: number } | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("quran_last_read");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === "object") {
            return parsed;
          }
        }
      } catch {
        // ignore
      }
    }
    return null;
  });
  const [playingSurah, setPlayingSurah] = useState<{ number: number; name: string; url: string } | null>(null);

  const filteredSurahs = QURAN_SURAHS.filter((surah) => {
    const matchesSearch =
      surah.nameLatin.toLowerCase().includes(search.toLowerCase()) ||
      surah.nameIndonesian.toLowerCase().includes(search.toLowerCase()) ||
      surah.number.toString().includes(search);

    const matchesType =
      filterType === "all" || surah.revelationType === filterType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white shadow-lg">
        <div className="flex flex-col gap-1 max-w-xl">
          <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">
            Kitab Suci Umat Islam
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Al-Qur&apos;anul Karim (30 Juz, 114 Surah)
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1">
            Baca mushaf digital dengan terjemahan Bahasa Indonesia lengkap dan lantunan qari Syeikh Mishary Rashid Alafasy.
          </p>
        </div>

        {/* Last Read card if available */}
        {lastRead && (
          <Link
            href={`/quran/${lastRead.number}`}
            className="flex items-center gap-3 p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 transition-all text-white self-start md:self-auto"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold text-sm">
              📖
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-emerald-200">Terakhir Dibaca</span>
              <span className="text-sm font-bold">{lastRead.name}</span>
              <span className="text-[10px] text-emerald-200">Ayat {lastRead.ayah}</span>
            </div>
          </Link>
        )}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari surah (misal: Al-Fatihah, Yasin, 67)..."
            className="w-full rounded-xl border border-border bg-card px-4 py-2.5 pl-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          />
          <svg
            className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-3 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Makkiyah / Madaniyah Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border self-stretch sm:self-auto">
          {[
            { id: "all", label: "Semua (114)" },
            { id: "Makkiyah", label: "Makkiyah (86)" },
            { id: "Madaniyah", label: "Madaniyah (28)" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id as typeof filterType)}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterType === tab.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Surah List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredSurahs.map((surah) => {
          const padded = surah.number.toString().padStart(3, "0");
          const audioUrl = `https://server8.mp3quran.net/afs/${padded}.mp3`;

          return (
            <div
              key={surah.number}
              className="flex items-center justify-between p-4 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all group"
            >
              <Link
                href={`/quran/${surah.number}`}
                className="flex items-center gap-3.5 flex-1 min-w-0"
              >
                {/* Number Badge */}
                <div className="w-10 h-10 rounded-xl bg-secondary text-secondary-foreground font-bold text-xs flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {surah.number}
                </div>

                {/* Latin Info */}
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                    {surah.nameLatin}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="truncate">{surah.nameIndonesian}</span>
                    <span>•</span>
                    <span className="shrink-0">{surah.numberOfAyahs} ayat</span>
                  </div>
                </div>
              </Link>

              {/* Arabic Name & Audio Button */}
              <div className="flex items-center gap-3 shrink-0 pl-2">
                <span className="font-arabic text-xl font-bold text-foreground" dir="rtl">
                  {surah.nameArabic}
                </span>

                <button
                  type="button"
                  title="Dengarkan Murottal"
                  onClick={() =>
                    setPlayingSurah({
                      number: surah.number,
                      name: `Surah ${surah.nameLatin}`,
                      url: audioUrl,
                    })
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-primary transition-colors cursor-pointer"
                  aria-label={`Dengarkan Surah ${surah.nameLatin}`}
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSurahs.length === 0 && (
        <div className="text-center py-12 p-6 rounded-2xl border border-dashed border-border text-muted-foreground">
          <p className="text-sm">Tidak ditemukan surah dengan kata kunci &quot;{search}&quot;.</p>
        </div>
      )}

      {/* Floating Audio Player when listening */}
      {playingSurah && (
        <AudioPlayer
          title={playingSurah.name}
          subtitle="Qari Syeikh Mishary Rashid Alafasy"
          audioUrl={playingSurah.url}
          onClose={() => setPlayingSurah(null)}
        />
      )}
    </div>
  );
}
