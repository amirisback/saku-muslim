"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { QURAN_SURAHS, SurahMeta } from "@/data/quran-surahs";
import { QURAN_JUZ_LIST, JuzItem } from "@/data/quran-juz";
import { AudioPlayer } from "@/components/shared/audio-player";

type TabMode = "surah" | "juz" | "nuzul";
type FilterType = "all" | "Makkiyah" | "Madaniyah";
type SortMode = "default" | "az" | "za";

interface LastReadData {
  number: number;
  name: string;
  ayah: number;
}

interface CoordinateMatch {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  isAyatKursi: boolean;
}

export function QuranDirectory() {
  const [activeTab, setActiveTab] = useState<TabMode>("surah");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortMode, setSortMode] = useState<SortMode>("default");
  const [playingSurah, setPlayingSurah] = useState<{ number: number; name: string; url: string } | null>(null);

  const [lastRead] = useState<LastReadData | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("quran_last_read");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === "object" && parsed.number) {
            return parsed;
          }
        }
      } catch {
        // ignore
      }
    }
    return null;
  });

  // Regex detector for coordinate search: e.g. "2:255" or "36:1"
  const coordinateMatch = useMemo<CoordinateMatch | null>(() => {
    const trimmed = search.trim();
    const match = trimmed.match(/^(\d{1,3})\s*:\s*(\d{1,3})$/);
    if (!match) return null;

    const surahNum = parseInt(match[1], 10);
    const ayahNum = parseInt(match[2], 10);

    const targetSurah = QURAN_SURAHS.find((s) => s.number === surahNum);
    if (!targetSurah) return null;

    if (ayahNum < 1 || ayahNum > targetSurah.numberOfAyahs) return null;

    const isAyatKursi = surahNum === 2 && ayahNum === 255;

    return {
      surahNumber: surahNum,
      surahName: targetSurah.nameLatin,
      ayahNumber: ayahNum,
      isAyatKursi,
    };
  }, [search]);

  // Filter & sort for "Surah" tab
  const filteredSurahs = useMemo(() => {
    let list = QURAN_SURAHS.filter((surah) => {
      const query = search.toLowerCase().trim();
      const matchesSearch =
        !query ||
        surah.nameLatin.toLowerCase().includes(query) ||
        surah.nameIndonesian.toLowerCase().includes(query) ||
        surah.number.toString() === query;

      const matchesType = filterType === "all" || surah.revelationType === filterType;
      return matchesSearch && matchesType;
    });

    if (sortMode === "az") {
      list = [...list].sort((a, b) => a.nameLatin.localeCompare(b.nameLatin));
    } else if (sortMode === "za") {
      list = [...list].sort((a, b) => b.nameLatin.localeCompare(a.nameLatin));
    } else {
      list = [...list].sort((a, b) => a.number - b.number);
    }

    return list;
  }, [search, filterType, sortMode]);

  // Filter for "Juz" tab
  const filteredJuzList = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return QURAN_JUZ_LIST;

    return QURAN_JUZ_LIST.filter(
      (juz) =>
        juz.name.toLowerCase().includes(query) ||
        juz.juzNumber.toString() === query ||
        juz.startSurahName.toLowerCase().includes(query) ||
        juz.endSurahName.toLowerCase().includes(query)
    );
  }, [search]);

  // List for "Urutan Turun" (revelation order)
  const nuzulSurahs = useMemo(() => {
    let list = [...QURAN_SURAHS].sort((a, b) => a.revelationOrder - b.revelationOrder);
    const query = search.toLowerCase().trim();
    if (query) {
      list = list.filter(
        (surah) =>
          surah.nameLatin.toLowerCase().includes(query) ||
          surah.nameIndonesian.toLowerCase().includes(query) ||
          surah.number.toString() === query ||
          surah.revelationOrder.toString() === query
      );
    }
    return list;
  }, [search]);

  const toggleSort = () => {
    if (sortMode === "default") setSortMode("az");
    else if (sortMode === "az") setSortMode("za");
    else setSortMode("default");
  };

  const sortLabel = {
    default: "Urut: 1-114",
    az: "Urut: A-Z",
    za: "Urut: Z-A",
  }[sortMode];

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      {/* Hero Banner Component (QuranHeroBanner) */}
      <div className="relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white shadow-xl border border-emerald-700/50">
        <div className="relative z-10 flex flex-col gap-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold tracking-widest uppercase w-fit">
            <span>Kitab Suci Umat Islam</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mt-1">
            Al-Qur&apos;anul Karim (30 Juz, 114 Surah)
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 leading-relaxed">
            Baca mushaf digital 30 Juz lengkap 114 Surah dengan terjemahan resmi Kemenag RI,
            transliterasi latin, tafsir ringkas per ayat, dan audio tartil qari Syeikh Mishary Rashid Alafasy.
          </p>
        </div>

        {/* Last Read card if available */}
        {lastRead && (
          <Link
            href={`/quran/${lastRead.number}#ayah-${lastRead.ayah}`}
            className="relative z-10 flex items-center gap-3.5 p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 transition-all text-white self-start md:self-auto shadow-md group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold text-base shadow-xs group-hover:scale-105 transition-transform">
              📖
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-emerald-200">Terakhir Dibaca</span>
              <span className="text-sm font-bold group-hover:text-amber-300 transition-colors">
                {lastRead.name}
              </span>
              <span className="text-xs text-amber-300 font-medium">Ayat {lastRead.ayah} &rarr;</span>
            </div>
          </Link>
        )}
      </div>

      {/* Smart Search Box with Coordinate Detection */}
      <div className="flex flex-col gap-3">
        <div className="relative w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari surah (misal: Al-Fatihah, Yasin, 18, atau 2:255)..."
            className="w-full rounded-2xl border border-border bg-card px-4 py-3.5 pl-11 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-xs transition-all"
          />
          <svg
            className="absolute left-4 top-4 h-4 w-4 text-muted-foreground"
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
              className="absolute right-4 top-3.5 h-6 w-6 rounded-full flex items-center justify-center text-xs text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
              aria-label="Bersihkan pencarian"
            >
              ✕
            </button>
          )}
        </div>

        {/* Instant Coordinate Jump Card (e.g. "2:255") */}
        {coordinateMatch && (
          <Link
            href={`/quran/${coordinateMatch.surahNumber}#ayah-${coordinateMatch.ayahNumber}`}
            className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all shadow-xs group cursor-pointer animate-in fade-in slide-in-from-top-1"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">⚡</span>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  Loncat Langsung ke Ayat:
                </span>
                <span className="text-sm font-bold text-foreground">
                  [{coordinateMatch.surahNumber}:{coordinateMatch.ayahNumber}] Surah {coordinateMatch.surahName} Ayat {coordinateMatch.ayahNumber}
                  {coordinateMatch.isAyatKursi ? " (Ayat Kursi)" : ""}
                </span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 group-hover:translate-x-1 transition-transform">
              Buka Ayat &rarr;
            </span>
          </Link>
        )}

        {/* Popular Surah Quick Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 text-xs">
          <span className="text-muted-foreground font-semibold shrink-0 text-[11px] uppercase tracking-wider">
            Surah Populer:
          </span>

          <Link
            href="/quran/36"
            className="shrink-0 px-3 py-1.5 rounded-full border border-border bg-card text-foreground hover:border-primary/50 hover:bg-secondary/40 font-semibold transition-all cursor-pointer"
          >
            Yasin (36)
          </Link>

          <Link
            href="/quran/56"
            className="shrink-0 px-3 py-1.5 rounded-full border border-border bg-card text-foreground hover:border-primary/50 hover:bg-secondary/40 font-semibold transition-all cursor-pointer"
          >
            Al-Waqi&apos;ah (56)
          </Link>

          <Link
            href="/quran/67"
            className="shrink-0 px-3 py-1.5 rounded-full border border-border bg-card text-foreground hover:border-primary/50 hover:bg-secondary/40 font-semibold transition-all cursor-pointer"
          >
            Al-Mulk (67)
          </Link>

          <Link
            href="/quran/18"
            className="shrink-0 px-3 py-1.5 rounded-full border border-border bg-card text-foreground hover:border-primary/50 hover:bg-secondary/40 font-semibold transition-all cursor-pointer"
          >
            Al-Kahfi (18)
          </Link>

          <Link
            href="/quran/55"
            className="shrink-0 px-3 py-1.5 rounded-full border border-border bg-card text-foreground hover:border-primary/50 hover:bg-secondary/40 font-semibold transition-all cursor-pointer"
          >
            Ar-Rahman (55)
          </Link>

          {/* Ayat Kursi Coordinate Jump Pill */}
          <Link
            href="/quran/2#ayah-255"
            className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 font-bold transition-all shadow-2xs hover:bg-amber-100 dark:hover:bg-amber-900/50 cursor-pointer"
          >
            <span>✨ Ayat Kursi (2:255)</span>
          </Link>
        </div>
      </div>

      {/* Segmented Directory Tabs (NU Online Alignment) & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-border/80">
        {/* Main 3 Tabs */}
        <div
          role="tablist"
          className="inline-flex items-center gap-1 p-1 rounded-full bg-muted/80 border border-border shadow-2xs self-start"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "surah"}
            onClick={() => setActiveTab("surah")}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "surah"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Surah (114)
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "juz"}
            onClick={() => setActiveTab("juz")}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "juz"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Juz (30)
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "nuzul"}
            onClick={() => setActiveTab("nuzul")}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "nuzul"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Urutan Turun (114)
          </button>
        </div>

        {/* Right Controls: Filter type & Sort toggle */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          {activeTab === "surah" && (
            <>
              {/* Makkiyah / Madaniyah sub-filter */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/60 border border-border">
                {[
                  { id: "all", label: "Semua" },
                  { id: "Makkiyah", label: "Makkiyah" },
                  { id: "Madaniyah", label: "Madaniyah" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilterType(tab.id as FilterType)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      filterType === tab.id
                        ? "bg-card text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Sort Toggle Button */}
              <button
                type="button"
                onClick={toggleSort}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
                title="Ubah Urutan Tampilan"
              >
                <span>{sortLabel}</span>
                <svg className="w-3.5 h-3.5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tab 1: Surah View (Standard Mushaf 1-114) */}
      {activeTab === "surah" && (
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
                  <div className="w-11 h-11 rounded-xl bg-secondary text-secondary-foreground font-bold text-xs flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-2xs">
                    {surah.number}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-sm sm:text-base text-foreground truncate group-hover:text-primary transition-colors">
                      {surah.nameLatin}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                      <span className="truncate">{surah.nameIndonesian}</span>
                      <span>•</span>
                      <span className="shrink-0">{surah.numberOfAyahs} ayat</span>
                    </div>
                  </div>
                </Link>

                <div className="flex items-center gap-2.5 shrink-0 pl-2">
                  <span className="font-arabic text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors pr-1" dir="rtl">
                    {surah.nameArabic}
                  </span>

                  <button
                    type="button"
                    title={`Putar Murottal Surah ${surah.nameLatin}`}
                    onClick={() =>
                      setPlayingSurah({
                        number: surah.number,
                        name: `Surah ${surah.nameLatin}`,
                        url: audioUrl,
                      })
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-primary transition-colors cursor-pointer"
                    aria-label={`Putar Murottal Surah ${surah.nameLatin}`}
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
      )}

      {/* Tab 2: Juz View (30 Juz Complete) */}
      {activeTab === "juz" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJuzList.map((juz: JuzItem) => (
            <div
              key={juz.juzNumber}
              className="flex flex-col p-5 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all gap-3.5 group"
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold text-xs tracking-wider uppercase">
                  {juz.name}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  {juz.totalVerses} Ayat
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                  QS. {juz.startSurahName}: {juz.startAyah} – QS. {juz.endSurahName}: {juz.endAyah}
                </span>
                <span className="text-xs text-muted-foreground">
                  Awal: {juz.startSurahName} (Ayat {juz.startAyah}) · Akhir: {juz.endSurahName} (Ayat {juz.endAyah})
                </span>
              </div>

              <Link
                href={`/quran/${juz.startSurahNumber}#ayah-${juz.startAyah}`}
                className="inline-flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground text-secondary-foreground text-xs font-bold transition-all cursor-pointer mt-1"
              >
                <span>Buka {juz.name}</span>
                <span>&rarr;</span>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Urutan Turun (Revelation Chronology 1-114) */}
      {activeTab === "nuzul" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {nuzulSurahs.map((surah: SurahMeta) => (
            <Link
              key={surah.number}
              href={`/quran/${surah.number}`}
              className="flex items-center justify-between p-4 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 font-extrabold text-xs flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-2xs">
                  #{surah.revelationOrder}
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm sm:text-base text-foreground truncate group-hover:text-primary transition-colors">
                      {surah.nameLatin}
                    </span>
                    <span className="text-[10px] font-semibold text-muted-foreground">
                      (Mushaf #{surah.number})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      surah.revelationType === "Makkiyah"
                        ? "bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40"
                        : "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40"
                    }`}>
                      {surah.revelationType}
                    </span>
                    <span>•</span>
                    <span className="truncate">{surah.nameIndonesian}</span>
                    <span>•</span>
                    <span className="shrink-0">{surah.numberOfAyahs} ayat</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 pl-2">
                <span className="font-arabic text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors" dir="rtl">
                  {surah.nameArabic}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Empty State */}
      {((activeTab === "surah" && filteredSurahs.length === 0) ||
        (activeTab === "juz" && filteredJuzList.length === 0) ||
        (activeTab === "nuzul" && nuzulSurahs.length === 0)) && (
        <div className="text-center py-12 p-6 rounded-3xl border border-dashed border-border text-muted-foreground">
          <p className="text-sm">Tidak ditemukan hasil dengan kata kunci &quot;{search}&quot;.</p>
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
