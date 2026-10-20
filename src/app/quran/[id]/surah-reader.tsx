"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { SurahDetailFull, AyahDetail } from "@/lib/quran-service";
import { QURAN_SURAHS } from "@/data/quran-surahs";
import { getSurahJuzInfo, toEasternArabicNumerals } from "@/data/quran-juz";
import { AudioPlayer } from "@/components/shared/audio-player";

interface SurahReaderProps {
  surah: SurahDetailFull;
}

export function SurahReader({ surah }: SurahReaderProps) {
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg">("md");
  const [showLatin, setShowLatin] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [highlightedAyah, setHighlightedAyah] = useState<number | null>(null);
  const [expandedTafsir, setExpandedTafsir] = useState<Record<number, boolean>>({});
  const [playingAudio, setPlayingAudio] = useState<{ title: string; url: string; ayahNumber?: number } | null>(null);

  // Selector modals
  const [isSurahModalOpen, setIsSurahModalOpen] = useState(false);
  const [isAyahModalOpen, setIsAyahModalOpen] = useState(false);
  const [surahModalSearch, setSurahModalSearch] = useState("");

  const juzInfo = useMemo(() => getSurahJuzInfo(surah.number), [surah.number]);

  // Save last read automatically
  useEffect(() => {
    try {
      localStorage.setItem(
        "quran_last_read",
        JSON.stringify({
          number: surah.number,
          name: surah.nameLatin,
          ayah: 1,
        })
      );
    } catch {
      // ignore
    }
  }, [surah]);

  // Smooth scroll handler for coordinate jumping
  const scrollToAyah = useCallback((ayahNumber: number) => {
    const el = document.getElementById(`ayah-${ayahNumber}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlightedAyah(ayahNumber);
      setTimeout(() => setHighlightedAyah(null), 2500);

      // Also update last read
      try {
        localStorage.setItem(
          "quran_last_read",
          JSON.stringify({
            number: surah.number,
            name: surah.nameLatin,
            ayah: ayahNumber,
          })
        );
      } catch {
        // ignore
      }
    }
  }, [surah]);

  // Auto-scroll on initial mount if hash exists in URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash) {
        const match = hash.match(/#?(?:ayah-)?(\d+)/);
        if (match) {
          const ayahNum = parseInt(match[1], 10);
          if (!isNaN(ayahNum)) {
            setTimeout(() => {
              scrollToAyah(ayahNum);
            }, 300);
          }
        }
      }
    }
  }, [scrollToAyah]);

  const copyAyah = (ayah: AyahDetail) => {
    const textToCopy = `${ayah.arabic}\n\n"${ayah.translation}"\n(QS. ${surah.nameLatin}: ${ayah.numberInSurah}) — Saku Muslim`;

    if (typeof navigator !== "undefined" && navigator?.clipboard?.writeText) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          setCopiedIndex(ayah.numberInSurah);
          setTimeout(() => setCopiedIndex(null), 2000);
        })
        .catch(() => {
          // fallback
        });
    }
  };

  const shareAyah = (ayah: AyahDetail) => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/quran/${surah.number}#ayah-${ayah.numberInSurah}` : "";
    const title = `QS. ${surah.nameLatin}: ${ayah.numberInSurah}`;
    const text = `${ayah.arabic}\n\n"${ayah.translation}"\n(QS. ${surah.nameLatin}: ${ayah.numberInSurah})`;

    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title, text, url }).catch(() => {});
    } else if (typeof navigator !== "undefined" && navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(`${text}\n${url}`).then(() => {
        setCopiedIndex(ayah.numberInSurah);
        setTimeout(() => setCopiedIndex(null), 2000);
      });
    }
  };

  const toggleTafsir = (ayahNumber: number) => {
    setExpandedTafsir((prev) => ({
      ...prev,
      [ayahNumber]: !prev[ayahNumber],
    }));
  };

  const arabicFontSizeClass = {
    sm: "text-2xl sm:text-3xl leading-[2.2]",
    md: "text-3xl sm:text-4xl lg:text-[2.75rem] leading-[2.2]",
    lg: "text-4xl sm:text-5xl lg:text-6xl leading-[2.4]",
  }[fontSize];

  // Filter surahs in modal
  const filteredModalSurahs = useMemo(() => {
    const q = surahModalSearch.toLowerCase().trim();
    if (!q) return QURAN_SURAHS;
    return QURAN_SURAHS.filter(
      (s) =>
        s.nameLatin.toLowerCase().includes(q) ||
        s.nameIndonesian.toLowerCase().includes(q) ||
        s.number.toString() === q
    );
  }, [surahModalSearch]);

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Sticky Reader Top Bar Control (NU Online Alignment) */}
      <div className="sticky top-16 z-30 flex items-center justify-between gap-2 sm:gap-4 h-14 px-3 sm:px-6 rounded-2xl border border-border bg-background/95 backdrop-blur-md shadow-xs transition-all">
        {/* Left: Back to Directory */}
        <Link
          href="/quran"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors shrink-0 cursor-pointer"
          title="Kembali ke Daftar Surah"
        >
          <span className="text-base">&larr;</span>
          <span className="hidden sm:inline">Daftar Surah</span>
        </Link>

        {/* Center: Surah & Ayah Selectors */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Previous Surah Button */}
          {surah.previousSurah ? (
            <Link
              href={`/quran/${surah.previousSurah.number}`}
              className="h-8 w-8 rounded-full border border-border bg-card flex items-center justify-center text-xs font-bold text-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer shadow-2xs"
              title={`Surah Sebelumnya: ${surah.previousSurah.nameLatin}`}
              aria-label="Surah Sebelumnya"
            >
              &lsaquo;
            </Link>
          ) : (
            <span className="h-8 w-8 rounded-full border border-border/40 bg-card/40 flex items-center justify-center text-xs text-muted-foreground/40 opacity-30 pointer-events-none">
              &lsaquo;
            </span>
          )}

          {/* Surah Dropdown Trigger */}
          <button
            type="button"
            onClick={() => setIsSurahModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card text-xs sm:text-sm font-bold text-foreground hover:border-primary shadow-xs transition-colors cursor-pointer max-w-[130px] sm:max-w-none truncate"
            title="Pilih Surah"
          >
            <span className="truncate">{surah.nameLatin}</span>
            <span className="text-[10px] text-muted-foreground">▾</span>
          </button>

          {/* Ayah Dropdown Trigger */}
          <button
            type="button"
            onClick={() => setIsAyahModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card text-xs sm:text-sm font-bold text-foreground hover:border-primary shadow-xs transition-colors cursor-pointer shrink-0"
            title="Loncat ke Ayat"
          >
            <span>Pilih Ayat</span>
            <span className="text-[10px] text-muted-foreground">▾</span>
          </button>

          {/* Next Surah Button */}
          {surah.nextSurah ? (
            <Link
              href={`/quran/${surah.nextSurah.number}`}
              className="h-8 w-8 rounded-full border border-border bg-card flex items-center justify-center text-xs font-bold text-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer shadow-2xs"
              title={`Surah Selanjutnya: ${surah.nextSurah.nameLatin}`}
              aria-label="Surah Selanjutnya"
            >
              &rsaquo;
            </Link>
          ) : (
            <span className="h-8 w-8 rounded-full border border-border/40 bg-card/40 flex items-center justify-center text-xs text-muted-foreground/40 opacity-30 pointer-events-none">
              &rsaquo;
            </span>
          )}
        </div>

        {/* Right: Reading Display Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Font Size Pills */}
          <div className="flex items-center gap-1">
            {(["sm", "md", "lg"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFontSize(s)}
                className={`h-7 px-2 rounded-md text-xs font-bold border transition-all cursor-pointer ${
                  fontSize === s
                    ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                    : "border-border text-foreground hover:bg-muted"
                }`}
                title={`Ukuran Font: ${s === "sm" ? "Kecil" : s === "md" ? "Sedang" : "Besar"}`}
              >
                {s === "sm" ? "A" : s === "md" ? "A+" : "A++"}
              </button>
            ))}
          </div>

          {/* Latin Toggle */}
          <label className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium cursor-pointer text-foreground select-none">
            <input
              type="checkbox"
              checked={showLatin}
              onChange={(e) => setShowLatin(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
            />
            <span>Latin</span>
          </label>

          {/* Translation Toggle */}
          <label className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium cursor-pointer text-foreground select-none">
            <input
              type="checkbox"
              checked={showTranslation}
              onChange={(e) => setShowTranslation(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
            />
            <span>Terjemahan</span>
          </label>
        </div>
      </div>

      {/* Surah Meta Header Banner */}
      <div className="relative overflow-hidden flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white shadow-xl border border-emerald-700/50">
        {/* Meta badges */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold tracking-wider uppercase">
          <span>Surah {surah.revelationType}</span>
          <span>•</span>
          <span>{juzInfo.label}</span>
          <span>•</span>
          <span>{surah.numberOfAyahs} Ayat</span>
        </div>

        {/* Calligraphy Arabic Name */}
        <span className="font-arabic text-5xl sm:text-6xl lg:text-7xl font-black my-4 text-white drop-shadow-sm" dir="rtl">
          {surah.nameArabic}
        </span>

        {/* Latin Title & Meaning */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
          Surah {surah.nameLatin}
        </h1>
        <p className="text-sm sm:text-base text-emerald-100 mt-1 max-w-xl">
          {surah.nameIndonesian}
        </p>

        {/* Full Surah Audio Player Trigger */}
        <button
          type="button"
          onClick={() =>
            setPlayingAudio({
              title: `Surah ${surah.nameLatin} (${surah.nameArabic})`,
              url: surah.audioFullSurah,
            })
          }
          className="mt-6 inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer hover:scale-[1.02]"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
          <span>Putar Murottal Full Surah (Syeikh Mishary Rashid Alafasy)</span>
        </button>
      </div>

      {/* Bismillah Ornament (Suppressed for Surah 9 At-Taubah, and handled cleanly for Surah 1) */}
      {surah.bismillahPre && surah.number !== 1 && (
        <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center border-b border-border/60">
          <span className="font-arabic text-3xl sm:text-4xl lg:text-5xl text-emerald-800 dark:text-emerald-300 font-bold leading-relaxed" dir="rtl">
            بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
          </span>
          <span className="text-xs sm:text-sm text-muted-foreground mt-2 italic">
            &quot;Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang&quot;
          </span>
        </div>
      )}

      {/* Verses Container (All complete verses, zero dummy placeholders) */}
      <div className="flex flex-col gap-5">
        {surah.ayahs.map((ayah) => {
          const isHighlighted = highlightedAyah === ayah.numberInSurah;
          const isExpanded = !!expandedTafsir[ayah.numberInSurah];
          const isCurrentlyPlaying = playingAudio?.ayahNumber === ayah.numberInSurah;

          return (
            <div
              key={ayah.numberInSurah}
              id={`ayah-${ayah.numberInSurah}`}
              className={`flex flex-col p-5 sm:p-7 rounded-3xl border bg-card shadow-xs transition-all duration-500 gap-4 ${
                isHighlighted
                  ? "ring-2 ring-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 border-emerald-500/80"
                  : "border-border hover:border-primary/40"
              }`}
            >
              {/* Top Row: Ayah Number & Action Toolbar */}
              <div className="flex items-center justify-between pb-3.5 border-b border-border/60">
                {/* Left: Ayah Medallion & Coordinate */}
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary text-secondary-foreground font-bold text-xs shadow-2xs">
                    {ayah.numberInSurah}
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">
                    QS. {surah.nameLatin}: {ayah.numberInSurah}
                  </span>
                </div>

                {/* Right: Action Toolbar */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {/* Play Tartil Ayah Audio */}
                  {ayah.audioUrl && (
                    <button
                      type="button"
                      title="Putar Audio Tartil Ayat Ini"
                      onClick={() =>
                        setPlayingAudio({
                          title: `QS. ${surah.nameLatin}: Ayat ${ayah.numberInSurah}`,
                          url: ayah.audioUrl,
                          ayahNumber: ayah.numberInSurah,
                        })
                      }
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        isCurrentlyPlaying
                          ? "bg-primary text-primary-foreground animate-pulse"
                          : "text-muted-foreground hover:bg-muted hover:text-primary"
                      }`}
                      aria-label={`Putar audio ayat ${ayah.numberInSurah}`}
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      <span className="hidden sm:inline">Tartil</span>
                    </button>
                  )}

                  {/* Copy Ayah */}
                  <button
                    type="button"
                    title="Salin Ayat & Terjemahan"
                    onClick={() => copyAyah(ayah)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-primary transition-colors cursor-pointer"
                  >
                    {copiedIndex === ayah.numberInSurah ? (
                      <span className="text-emerald-600 font-bold">✓ Tersalin</span>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span className="hidden sm:inline">Salin</span>
                      </>
                    )}
                  </button>

                  {/* Tafsir Toggle Button */}
                  {ayah.tafsirShort && (
                    <button
                      type="button"
                      title="Lihat Tafsir Ringkas Kemenag RI"
                      onClick={() => toggleTafsir(ayah.numberInSurah)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        isExpanded
                          ? "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 font-bold"
                          : "text-muted-foreground hover:bg-muted hover:text-amber-600"
                      }`}
                    >
                      <span>📖</span>
                      <span>Tafsir</span>
                    </button>
                  )}

                  {/* Share Ayah */}
                  <button
                    type="button"
                    title="Bagikan Ayat"
                    onClick={() => shareAyah(ayah)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-primary transition-colors cursor-pointer"
                    aria-label="Bagikan Ayat"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Arabic Uthmani Text with End-Ayah Medallion ۝ */}
              <div className="py-3 text-right" dir="rtl">
                <span className={`font-arabic text-foreground font-bold tracking-wide ${arabicFontSizeClass}`}>
                  {ayah.arabic}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-arabic text-2xl sm:text-3xl pr-2 select-none">
                  ۝{toEasternArabicNumerals(ayah.numberInSurah)}
                </span>
              </div>

              {/* Latin Transliteration */}
              {showLatin && (
                <p className="text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-300 italic leading-relaxed">
                  {ayah.transliteration}
                </p>
              )}

              {/* Indonesian Translation */}
              {showTranslation && (
                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                  {ayah.translation}
                </p>
              )}

              {/* Collapsible Tafsir Ringkas Kemenag RI Accordion Card */}
              {isExpanded && ayah.tafsirShort && (
                <div className="border-l-4 border-l-amber-500 border border-border bg-amber-50/40 dark:bg-amber-950/20 rounded-2xl p-4 sm:p-5 mt-2 animate-in fade-in slide-in-from-top-1">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="bg-amber-100 text-amber-900 dark:bg-amber-900/80 dark:text-amber-200 text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                      Tafsir Ringkas Kemenag RI — Ayat {ayah.numberInSurah}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleTafsir(ayah.numberInSurah)}
                      className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      Tutup ✕
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-foreground/80 dark:text-foreground/70 leading-relaxed whitespace-pre-line">
                    {ayah.tafsirShort}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Surah Bottom Navigation (Previous & Next Surah Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-border mt-4">
        {surah.previousSurah ? (
          <Link
            href={`/quran/${surah.previousSurah.number}`}
            className="flex items-center gap-3.5 p-4 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="h-10 w-10 rounded-xl bg-secondary text-secondary-foreground font-bold flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
              &larr;
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-muted-foreground">Surah Sebelumnya</span>
              <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                {surah.previousSurah.nameLatin}
              </span>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {surah.nextSurah ? (
          <Link
            href={`/quran/${surah.nextSurah.number}`}
            className="flex items-center justify-end text-right gap-3.5 p-4 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all group cursor-pointer sm:col-start-2"
          >
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-muted-foreground">Surah Selanjutnya</span>
              <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                {surah.nextSurah.nameLatin}
              </span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-secondary text-secondary-foreground font-bold flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
              &rarr;
            </div>
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* Surah Selector Modal */}
      {isSurahModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="flex flex-col w-full max-w-lg max-h-[80vh] rounded-3xl border border-border bg-card shadow-2xl overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-base font-bold text-foreground">Pilih Surah (1-114)</h2>
              <button
                type="button"
                onClick={() => setIsSurahModalOpen(false)}
                className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Search Input */}
            <div className="p-3 border-b border-border/60 bg-muted/30">
              <input
                type="text"
                value={surahModalSearch}
                onChange={(e) => setSurahModalSearch(e.target.value)}
                placeholder="Cari nama surah atau nomor..."
                className="w-full px-3 py-2 rounded-xl border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
            </div>

            {/* Surah List */}
            <div className="flex-1 overflow-y-auto p-2 divide-y divide-border/40">
              {filteredModalSurahs.map((s) => (
                <Link
                  key={s.number}
                  href={`/quran/${s.number}`}
                  onClick={() => setIsSurahModalOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-xl hover:bg-secondary/60 transition-colors cursor-pointer ${
                    s.number === surah.number ? "bg-secondary text-secondary-foreground font-bold" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-secondary text-secondary-foreground text-xs font-bold flex items-center justify-center">
                      {s.number}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground">{s.nameLatin}</span>
                      <span className="text-xs text-muted-foreground">
                        {s.nameIndonesian} • {s.numberOfAyahs} ayat
                      </span>
                    </div>
                  </div>
                  <span className="font-arabic text-lg font-bold" dir="rtl">
                    {s.nameArabic}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Ayah Selector Modal */}
      {isAyahModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="flex flex-col w-full max-w-md max-h-[80vh] rounded-3xl border border-border bg-card shadow-2xl overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-base font-bold text-foreground">
                Loncat ke Ayat — Surah {surah.nameLatin} (1-{surah.numberOfAyahs})
              </h2>
              <button
                type="button"
                onClick={() => setIsAyahModalOpen(false)}
                className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Ayah Grid Numbers */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                {Array.from({ length: surah.numberOfAyahs }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setIsAyahModalOpen(false);
                      scrollToAyah(num);
                    }}
                    className="h-11 rounded-xl border border-border bg-card hover:bg-primary hover:text-primary-foreground font-bold text-xs flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105"
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Audio Player when listening */}
      {playingAudio && (
        <AudioPlayer
          title={playingAudio.title}
          subtitle="Qari Syeikh Mishary Rashid Alafasy"
          audioUrl={playingAudio.url}
          onClose={() => setPlayingAudio(null)}
        />
      )}
    </div>
  );
}
