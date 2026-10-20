"use client";

import { useState, useSyncExternalStore } from "react";
import { FanousIcon } from "@/components/shared/ramadhan-ornaments";
import { getTodayTrackerKey } from "@/lib/prayer-calculator";

export interface RamadhanWorshipState {
  fasting: boolean;
  tarawih: boolean;
  tadarus: boolean;
  sedekah: boolean;
}

interface WorshipItemConfig {
  key: keyof RamadhanWorshipState;
  title: string;
  subtitle: string;
  badge: string;
  icon: (checked: boolean) => React.ReactNode;
}

const WORSHIP_ITEMS: WorshipItemConfig[] = [
  {
    key: "fasting",
    title: "Puasa Ramadhan",
    subtitle: "Menahan lapar, dahaga, dan hawa nafsu sejak terbit fajar hingga maghrib.",
    badge: "Fardhu 'Ain",
    icon: (checked) => (
      <svg
        className={`w-5 h-5 ${checked ? "text-emerald-500" : "text-muted-foreground"}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    ),
  },
  {
    key: "tarawih",
    title: "Sholat Tarawih & Witir",
    subtitle: "Qiyamul lail berjamaah di masjid atau munfarid di rumah (8/20 rakaat + 3 witir).",
    badge: "Sunnah Mu'akkad",
    icon: (checked) => (
      <svg
        className={`w-5 h-5 ${checked ? "text-emerald-500" : "text-muted-foreground"}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
  },
  {
    key: "tadarus",
    title: "Tadarus Al-Qur'an (1 Juz)",
    subtitle: "Membaca dan mentadabburi 1 juz per hari untuk target khatam di akhir bulan suci.",
    badge: "Target Khatam",
    icon: (checked) => (
      <svg
        className={`w-5 h-5 ${checked ? "text-emerald-500" : "text-muted-foreground"}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
  {
    key: "sedekah",
    title: "Sedekah Subuh / Infaq",
    subtitle: "Mengeluarkan sedekah terbaik di awal hari untuk pembersih harta & keberkahan rezeki.",
    badge: "Keberkahan",
    icon: (checked) => (
      <svg
        className={`w-5 h-5 ${checked ? "text-emerald-500" : "text-muted-foreground"}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

const emptySubscribe = () => () => {};

export function RamadhanWorshipTracker() {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [trackerState, setTrackerState] = useState<RamadhanWorshipState>(() => {
    if (typeof window !== "undefined") {
      try {
        const todayKey = getTodayTrackerKey("ramadhan_tracker");
        const saved = localStorage.getItem(todayKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === "object") {
            return {
              fasting: false,
              tarawih: false,
              tadarus: false,
              sedekah: false,
              ...parsed,
            };
          }
        }
      } catch {
        // LocalStorage access fallback
      }
    }
    return {
      fasting: false,
      tarawih: false,
      tadarus: false,
      sedekah: false,
    };
  });

  const toggleItem = (key: keyof RamadhanWorshipState) => {
    setTrackerState((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      try {
        const todayKey = getTodayTrackerKey("ramadhan_tracker");
        localStorage.setItem(todayKey, JSON.stringify(updated));
      } catch {
        // LocalStorage access fallback
      }
      return updated;
    });
  };

  const completedCount = Object.values(trackerState).filter(Boolean).length;
  const totalCount = WORSHIP_ITEMS.length;
  const percentCompleted = Math.round((completedCount / totalCount) * 100);
  const isAllCompleted = completedCount === totalCount;

  return (
    <div className="w-full flex flex-col p-6 sm:p-7 rounded-3xl border border-border bg-card shadow-sm transition-all">
      {/* Header with Title and Progress Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <FanousIcon className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              Amalan Harian Ramadhan
            </h3>
            <p className="text-xs text-muted-foreground">
              Mutaba&apos;ah Yaumiyah 4 pilar ibadah di bulan suci
            </p>
          </div>
        </div>

        {/* Progress Counter Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-bold text-foreground">
            {completedCount} / {totalCount} Selesai
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-mono">
            {percentCompleted}%
          </span>
        </div>
      </div>

      {/* Progress Bar Meter */}
      <div className="mt-4 w-full">
        <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 transition-all duration-500 ease-out"
            style={{ width: `${percentCompleted}%` }}
          />
        </div>
      </div>

      {/* Celebration Banner when 100% completed */}
      {isAllCompleted && (
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-transparent border border-amber-400/40 text-foreground flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
          <span className="text-2xl select-none">🎉</span>
          <div>
            <p className="text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-300">
              Maa syaa Allah! Seluruh amalan utama hari ini telah lengkap.
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Semoga Allah Ta&apos;ala menerima amal puasa, sholat, tilawah, dan infaq Anda.
            </p>
          </div>
        </div>
      )}

      {/* 4 Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {WORSHIP_ITEMS.map((item) => {
          const isChecked = trackerState[item.key];
          return (
            <button
              key={item.key}
              type="button"
              role="checkbox"
              aria-checked={isChecked}
              aria-label={`Tandai ${item.title}`}
              onClick={() => toggleItem(item.key)}
              className={`flex items-start gap-3 p-4 rounded-2xl border text-left transition-all cursor-pointer min-h-[44px] min-w-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                isChecked
                  ? "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/50 shadow-xs"
                  : "border-border bg-card hover:border-amber-400/40 hover:bg-muted/40"
              }`}
            >
              {/* Checkbox Icon */}
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors border ${
                  isChecked
                    ? "bg-emerald-500 border-emerald-500 text-white shadow-xs"
                    : "border-muted-foreground/30 bg-muted/30 text-transparent"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              {/* Title, Subtitle, & Badge */}
              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 truncate">
                    <span className="shrink-0">{item.icon(isChecked)}</span>
                    <span
                      className={`text-sm font-bold truncate transition-colors ${
                        isChecked
                          ? "text-emerald-900 dark:text-emerald-200 line-through opacity-85"
                          : "text-foreground"
                      }`}
                    >
                      {item.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-muted text-muted-foreground shrink-0 border border-border">
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                  {item.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Storage Footer Note */}
      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Tersimpan otomatis di peramban Anda untuk hari ini</span>
        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
          {isClient
            ? new Date().toLocaleDateString("id-ID", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })
            : ""}
        </span>
      </div>
    </div>
  );
}
