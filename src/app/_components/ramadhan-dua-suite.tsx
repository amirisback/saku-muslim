"use client";

import { useState } from "react";
import { HilalStarIcon, FanousIcon } from "@/components/shared/ramadhan-ornaments";

export interface DuaItem {
  id: "niat" | "buka";
  title: string;
  category: string;
  arabic: string;
  latin: string;
  translation: string;
  source?: string;
  alternative?: {
    arabic: string;
    latin: string;
    translation: string;
    source?: string;
  };
  audioUrl: string;
}

const RAMADHAN_DUAS: DuaItem[] = [
  {
    id: "niat",
    title: "Niat Puasa Ramadhan",
    category: "Sahur & Malam Hari",
    arabic: "نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هَذِهِ السَّنَةِ لِلَّهِ تَعَالَى",
    latin: "Nawaitu shauma ghadin 'an adaa'i fardhi syahri Ramadhaana haadzihis sanati lillaahi ta'aalaa.",
    translation:
      "Aku berniat puasa esok hari untuk menunaikan kewajiban bulan Ramadhan tahun ini karena Allah Ta'ala.",
    source: "Niat dilafalkan pada malam hari sebelum fajar/subuh",
    audioUrl: "https://www.islamcan.com/audio/dua/dua-before-fasting.mp3",
  },
  {
    id: "buka",
    title: "Doa Berbuka Puasa",
    category: "Waktu Maghrib / Iftar",
    arabic: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ",
    latin: "Dzahabaz zhama'u wabtallatil 'uruuqu wa tsabatal ajru in syaa Allah.",
    translation:
      "Telah hilang rasa haus, telah basah urat-urat, dan telah tetap pahala, insya Allah.",
    source: "HR. Abu Dawud no. 2357 & An-Nasa'i (Shahih)",
    alternative: {
      arabic: "اللَّهُمَّ لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ",
      latin: "Allahumma laka shumtu wa 'alaa rizqika afthartu.",
      translation:
        "Ya Allah, untuk-Mu aku berpuasa dan dengan rezeki-Mu aku berbuka.",
      source: "HR. Abu Dawud no. 2358",
    },
    audioUrl: "https://www.islamcan.com/audio/dua/dua-breaking-fast.mp3",
  },
];

export interface RamadhanDuaSuiteProps {
  onPlayAudio?: (track: { title: string; subtitle?: string; url: string }) => void;
}

export function RamadhanDuaSuite({ onPlayAudio }: RamadhanDuaSuiteProps) {
  const [activeTab, setActiveTab] = useState<"niat" | "buka">("niat");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const currentDua = RAMADHAN_DUAS.find((d) => d.id === activeTab) || RAMADHAN_DUAS[0];

  const handleCopy = (dua: DuaItem) => {
    let text = `${dua.title}\n\n${dua.arabic}\n\n${dua.latin}\n\n"${dua.translation}"`;
    if (dua.alternative) {
      text += `\n\nDoa Alternatif:\n${dua.alternative.arabic}\n${dua.alternative.latin}\n"${dua.alternative.translation}"`;
    }
    if (typeof navigator !== "undefined" && navigator?.clipboard?.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopiedId(dua.id);
          setTimeout(() => setCopiedId(null), 2500);
        })
        .catch(() => {
          // graceful fallback if permission denied
        });
    }
  };

  return (
    <div className="w-full flex flex-col p-6 sm:p-7 rounded-3xl border border-border bg-card shadow-sm transition-all">
      {/* Header with Title and Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <HilalStarIcon className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              Doa Pilihan Ramadhan
            </h3>
            <p className="text-xs text-muted-foreground">
              Lafadz Niat Puasa & Doa Berbuka dengan audio tartil
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div
          role="tablist"
          aria-label="Pilihan Doa Ramadhan"
          className="flex items-center p-1 rounded-2xl bg-muted border border-border w-full sm:w-auto"
        >
          {RAMADHAN_DUAS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                role="tab"
                id={`tab-${item.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${item.id}`}
                tabIndex={isActive ? 0 : -1}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer min-h-[44px] ${
                  isActive
                    ? "bg-card text-foreground shadow-xs border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FanousIcon
                  className={`w-3.5 h-3.5 ${
                    isActive ? "text-amber-500" : "text-muted-foreground/60"
                  }`}
                />
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panel Content */}
      <div
        role="tabpanel"
        id={`panel-${currentDua.id}`}
        aria-labelledby={`tab-${currentDua.id}`}
        className="mt-6 flex flex-col gap-5 animate-in fade-in-50 duration-200"
      >
        {/* Category Pill & Source Note */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {currentDua.category}
          </span>
          {currentDua.source && (
            <span className="text-[11px] text-muted-foreground italic hidden sm:inline">
              {currentDua.source}
            </span>
          )}
        </div>

        {/* Primary Arabic Lafadz Box */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-500/5 via-emerald-500/5 to-transparent border border-amber-500/20 dark:border-amber-400/15">
          <p
            className="font-arabic text-2xl sm:text-3xl sm:leading-[2.6] leading-[2.4] text-right text-foreground font-normal tracking-wide select-text"
            dir="rtl"
            lang="ar"
          >
            {currentDua.arabic}
          </p>
        </div>

        {/* Transliteration & Indonesian Translation */}
        <div className="flex flex-col gap-2">
          <p className="text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-400 italic">
            &quot;{currentDua.latin}&quot;
          </p>
          <p className="text-sm text-foreground/90 leading-relaxed">
            &quot;{currentDua.translation}&quot;
          </p>
          {currentDua.source && (
            <span className="text-[11px] text-muted-foreground italic sm:hidden mt-0.5">
              Ref: {currentDua.source}
            </span>
          )}
        </div>

        {/* Alternative Lafadz (e.g. for Doa Buka Puasa) */}
        {currentDua.alternative && (
          <div className="mt-2 pt-4 border-t border-border flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Lafadz Populer Lainnya
              </span>
              {currentDua.alternative.source && (
                <span className="text-[11px] text-muted-foreground">
                  ({currentDua.alternative.source})
                </span>
              )}
            </div>
            <div className="p-4 rounded-xl bg-muted/40 border border-border">
              <p
                className="font-arabic text-xl sm:text-2xl leading-[2.3] text-right text-foreground font-normal"
                dir="rtl"
                lang="ar"
              >
                {currentDua.alternative.arabic}
              </p>
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 italic mt-2">
                &quot;{currentDua.alternative.latin}&quot;
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                &quot;{currentDua.alternative.translation}&quot;
              </p>
            </div>
          </div>
        )}

        {/* Action Controls: Play Audio & Copy */}
        <div className="mt-2 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {onPlayAudio && (
              <button
                type="button"
                onClick={() =>
                  onPlayAudio({
                    title: currentDua.title,
                    subtitle: `Lafadz Doa Ramadhan (${currentDua.category})`,
                    url: currentDua.audioUrl,
                  })
                }
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer min-h-[44px] min-w-[44px] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                aria-label={`Dengarkan Audio ${currentDua.title}`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Dengarkan Tartil Doa</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleCopy(currentDua)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground transition-all cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Salin Teks Doa"
          >
            {copiedId === currentDua.id ? (
              <>
                <svg
                  className="w-4 h-4 text-emerald-600 dark:text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  Tersalin!
                </span>
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span>Salin Teks</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
