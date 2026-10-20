"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SurahDetailData } from "@/data/quran-verses";
import { AudioPlayer } from "@/components/shared/audio-player";

export function SurahReader({ surah }: { surah: SurahDetailData }) {
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg">("md");
  const [showLatin, setShowLatin] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [playingAudio, setPlayingAudio] = useState<{ title: string; url: string } | null>(null);

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

  const copyAyah = (ayahNumber: number, text: string, translation: string) => {
    const fullText = `${text}\n\n"${translation}" (QS. ${surah.nameLatin}: ${ayahNumber})`;
    if (typeof navigator !== "undefined" && navigator?.clipboard?.writeText) {
      navigator.clipboard
        .writeText(fullText)
        .then(() => {
          setCopiedIndex(ayahNumber);
          setTimeout(() => setCopiedIndex(null), 2000);
        })
        .catch(() => {
          // graceful fallback
        });
    }
  };

  const fontSizeClass = {
    sm: "text-2xl leading-loose",
    md: "text-3xl sm:text-4xl leading-loose",
    lg: "text-4xl sm:text-5xl leading-loose",
  }[fontSize];

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/quran"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
        >
          &larr; Kembali ke Daftar Surah
        </Link>
        <span className="text-xs text-muted-foreground font-medium">
          Surah ke-{surah.number} dari 114
        </span>
      </div>

      {/* Surah Banner Card */}
      <div className="flex flex-col items-center justify-center text-center p-8 rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 text-white shadow-xl">
        <span className="font-arabic text-4xl sm:text-5xl font-black mb-2" dir="rtl">
          {surah.nameArabic}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Surah {surah.nameLatin}
        </h1>
        <p className="text-sm text-emerald-100 mt-1">
          {surah.nameIndonesian} • {surah.revelationType} • {surah.numberOfAyahs} Ayat
        </p>

        {/* Action Button: Play Full Surah */}
        <button
          type="button"
          onClick={() =>
            setPlayingAudio({
              title: `Surah ${surah.nameLatin}`,
              url: surah.audioFullSurah,
            })
          }
          className="mt-6 inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow transition-all cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
          Putar Murottal Surah Ini
        </button>
      </div>

      {/* Reading Controls Bar */}
      <div className="sticky top-20 z-30 flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl border border-border bg-card/95 backdrop-blur-md shadow-sm">
        {/* Font size toggles */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-muted-foreground mr-1">Ukuran Font:</span>
          {(["sm", "md", "lg"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFontSize(s)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                fontSize === s
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-foreground hover:bg-muted"
              }`}
            >
              {s === "sm" ? "A" : s === "md" ? "A+" : "A++"}
            </button>
          ))}
        </div>

        {/* Latin & Translation checkboxes */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <label className="inline-flex items-center gap-1.5 cursor-pointer text-foreground">
            <input
              type="checkbox"
              checked={showLatin}
              onChange={(e) => setShowLatin(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
            />
            Latin
          </label>

          <label className="inline-flex items-center gap-1.5 cursor-pointer text-foreground">
            <input
              type="checkbox"
              checked={showTranslation}
              onChange={(e) => setShowTranslation(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
            />
            Terjemahan
          </label>
        </div>
      </div>

      {/* Bismillah Calligraphy (kecuali surah 9 At-Taubah) */}
      {surah.number !== 9 && (
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <span className="font-arabic text-3xl sm:text-4xl text-emerald-800 dark:text-emerald-300 font-bold" dir="rtl">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </span>
          <span className="text-xs text-muted-foreground mt-2 italic">
            &quot;Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang&quot;
          </span>
        </div>
      )}

      {/* Verses Container */}
      <div className="flex flex-col gap-4">
        {surah.ayahs.map((ayah) => (
          <div
            key={ayah.numberInSurah}
            id={`ayah-${ayah.numberInSurah}`}
            className="flex flex-col p-6 rounded-3xl border border-border bg-card shadow-sm hover:border-primary/40 transition-colors"
          >
            {/* Top row: Ayah number medallion & action icons */}
            <div className="flex items-center justify-between pb-4 border-b border-border/60">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary text-secondary-foreground font-bold text-xs">
                  {ayah.numberInSurah}
                </div>
                <span className="text-xs text-muted-foreground">
                  QS. {surah.nameLatin}: {ayah.numberInSurah}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {ayah.audioUrl && (
                  <button
                    type="button"
                    title="Putar Ayat"
                    onClick={() =>
                      setPlayingAudio({
                        title: `QS. ${surah.nameLatin}: ${ayah.numberInSurah}`,
                        url: ayah.audioUrl!,
                      })
                    }
                    className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-primary transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                )}

                <button
                  type="button"
                  title="Salin Ayat"
                  onClick={() =>
                    copyAyah(ayah.numberInSurah, ayah.arabic, ayah.translation)
                  }
                  className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-primary transition-colors cursor-pointer text-xs"
                >
                  {copiedIndex === ayah.numberInSurah ? (
                    <span className="text-emerald-600 font-bold">✓ Tersalin</span>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Arabic Text */}
            <div className="py-6 text-right" dir="rtl">
              <span className={`font-arabic text-foreground font-bold tracking-wide ${fontSizeClass}`}>
                {ayah.arabic}
              </span>
            </div>

            {/* Transliteration */}
            {showLatin && (
              <p className="text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-300 italic mb-2">
                {ayah.transliteration}
              </p>
            )}

            {/* Indonesian Translation */}
            {showTranslation && (
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                {ayah.translation}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Surah Navigation Bar (Previous & Next) */}
      <div className="flex items-center justify-between pt-6 border-t border-border mt-4">
        {surah.number > 1 ? (
          <Link
            href={`/quran/${surah.number - 1}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted transition-colors"
          >
            &larr; Surah Sebelumnya
          </Link>
        ) : (
          <div />
        )}

        {surah.number < 114 ? (
          <Link
            href={`/quran/${surah.number + 1}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted transition-colors"
          >
            Surah Selanjutnya &rarr;
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* Floating Audio Player when listening */}
      {playingAudio && (
        <AudioPlayer
          title={playingAudio.title}
          subtitle="Syeikh Mishary Rashid Alafasy"
          audioUrl={playingAudio.url}
          onClose={() => setPlayingAudio(null)}
        />
      )}
    </div>
  );
}
