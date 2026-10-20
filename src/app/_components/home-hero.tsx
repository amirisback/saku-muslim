"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { INDONESIA_CITIES, CityLocation } from "@/data/prayer-data";
import {
  calculatePrayerTimes,
  getNextPrayer,
} from "@/lib/prayer-calculator";
import { getRamadhanState } from "@/lib/ramadhan";
import { AudioPlayer } from "@/components/shared/audio-player";
import {
  FanousIcon,
  HilalStarIcon,
  ArabesquePattern,
  RamadhanBadge,
} from "@/components/shared/ramadhan-ornaments";
import { RamadhanDuaSuite } from "@/app/_components/ramadhan-dua-suite";
import { RamadhanWorshipTracker } from "@/app/_components/ramadhan-worship-tracker";

function parseTimeToSeconds(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number);
  return (h || 0) * 3600 + (m || 0) * 60;
}

function formatCountdown(totalSec: number): string {
  const safeSec = Math.max(0, totalSec);
  const h = Math.floor(safeSec / 3600);
  const m = Math.floor((safeSec % 3600) / 60);
  const s = safeSec % 60;
  return `${h.toString().padStart(2, "0")}j ${m.toString().padStart(2, "0")}m ${s.toString().padStart(2, "0")}d`;
}

function getLocalTodayKey(prefix: string): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${prefix}_${year}-${month}-${day}`;
}

export function HomeHeroContent({ forcedQuery }: { forcedQuery: string | null }) {
  const [selectedCity, setSelectedCity] = useState<CityLocation>(INDONESIA_CITIES[0]);
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());
  const [todayPrayerCheck, setTodayPrayerCheck] = useState<Record<string, boolean>>(() => {
    if (typeof window !== "undefined") {
      try {
        const todayKey = getLocalTodayKey("prayer_tracker");
        const saved = localStorage.getItem(todayKey);
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore storage error
      }
    }
    return {
      Subuh: false,
      Dzuhur: false,
      Ashar: false,
      Maghrib: false,
      Isya: false,
    };
  });
  const [playingAudio, setPlayingAudio] = useState<{
    title: string;
    subtitle?: string;
    url: string;
  } | null>(null);

  const togglePrayerCheck = (prayerName: string) => {
    setTodayPrayerCheck((prev) => {
      const updated = { ...prev, [prayerName]: !prev[prayerName] };
      try {
        const todayKey = getLocalTodayKey("prayer_tracker");
        localStorage.setItem(todayKey, JSON.stringify(updated));
      } catch {
        // ignore storage errors
      }
      return updated;
    });
  };

  // Clock tick every 1 second for precision countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const ramadhanState = getRamadhanState({
    date: currentTime,
    forcedQueryValue: forcedQuery,
  });
  const isRamadhan = ramadhanState.isRamadhan;

  const schedule = calculatePrayerTimes(
    currentTime,
    selectedCity.latitude,
    selectedCity.longitude,
    selectedCity.timezone
  );

  const nextPrayer = getNextPrayer(schedule, currentTime);

  // Dual Critical Countdown Calculation (Imsak & Maghrib)
  const currentSeconds =
    currentTime.getHours() * 3600 +
    currentTime.getMinutes() * 60 +
    currentTime.getSeconds();

  const imsakSec = parseTimeToSeconds(schedule.imsak);
  const maghribSec = parseTimeToSeconds(schedule.maghrib);

  let activeTarget: "Imsak" | "Maghrib" = "Maghrib";
  let isFastingNow = false;

  if (currentSeconds >= imsakSec && currentSeconds < maghribSec) {
    activeTarget = "Maghrib";
    isFastingNow = true;
  } else {
    activeTarget = "Imsak";
    isFastingNow = false;
  }

  // Calculate remaining seconds for both targets
  const remainingImsakSec =
    currentSeconds < imsakSec
      ? imsakSec - currentSeconds
      : 86400 - currentSeconds + imsakSec;

  const remainingMaghribSec =
    currentSeconds < maghribSec
      ? maghribSec - currentSeconds
      : 86400 - currentSeconds + maghribSec;

  const prayerItems: { name: string; key: keyof typeof schedule; time: string }[] = [
    { name: "Subuh", key: "fajr", time: schedule.fajr },
    { name: "Dzuhur", key: "dhuhr", time: schedule.dhuhr },
    { name: "Ashar", key: "asr", time: schedule.asr },
    { name: "Maghrib", key: "maghrib", time: schedule.maghrib },
    { name: "Isya", key: "isha", time: schedule.isha },
  ];

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Hero Card Container (Differentiated between Regular and Ramadhan State) */}
      <div
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white p-6 sm:p-8 lg:p-9 shadow-2xl transition-all ${
          isRamadhan ? "border border-amber-400/20" : "border border-emerald-500/20"
        }`}
      >
        {/* Ornaments rendered ONLY during Ramadhan */}
        {isRamadhan && (
          <>
            {/* Subtle geometric pattern watermark */}
            <ArabesquePattern className="absolute -right-8 -top-8 w-80 h-80 opacity-[0.07] text-amber-300 pointer-events-none select-none" />

            {/* Floating Lantern Background Motif */}
            <div className="absolute right-6 top-4 sm:right-12 sm:top-6 pointer-events-none opacity-40 sm:opacity-70 animate-subtle-float">
              <FanousIcon
                className="w-12 h-16 sm:w-16 sm:h-20 text-amber-400 animate-pulse-glow"
                glowing
              />
            </div>
          </>
        )}

        <div className="relative z-10 flex flex-col gap-6 sm:gap-7">
          {/* Top Bar: Location Selector, Hijri Date, & Theme Pill */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/15 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <select
                  aria-label="Pilih Kota untuk Jadwal Hisab"
                  value={selectedCity.id}
                  onChange={(e) => {
                    const found = INDONESIA_CITIES.find((c) => c.id === e.target.value);
                    if (found) setSelectedCity(found);
                  }}
                  className={`bg-black/30 hover:bg-black/40 text-white font-medium text-xs sm:text-sm rounded-xl px-3 py-1.5 border border-white/20 focus:outline-none cursor-pointer transition-colors ${
                    isRamadhan ? "focus:ring-2 focus:ring-amber-400" : "focus:ring-2 focus:ring-emerald-400"
                  }`}
                >
                  {INDONESIA_CITIES.map((city) => (
                    <option key={city.id} value={city.id} className="bg-emerald-950 text-white">
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              {isRamadhan && (
                <RamadhanBadge text="Ramadhan 1448 H" variant="gold" className="hidden xs:inline-flex" />
              )}
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-emerald-100 bg-white/10 px-3 py-1.5 rounded-full w-fit backdrop-blur-xs border border-white/10">
              <HilalStarIcon
                className={`w-3.5 h-3.5 ${isRamadhan ? "text-amber-300" : "text-emerald-300"}`}
              />
              <span>{ramadhanState.formattedHijri}</span>
            </div>
          </div>

          {/* Header Banner Content */}
          {isRamadhan ? (
            /* State B: Ramadhan Thematic Banner */
            <div className="flex flex-col gap-1 max-w-2xl">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-widest">
                <span>Marhaban Ya Ramadhan 1448 H</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-emerald-200 font-normal">Bulan Penuh Ampunan</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white mt-1">
                Jadwal Imsakiyah &amp; Waktu Sholat Presisi
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-arabic mt-1" dir="rtl">
                شَهْرُ رَمَضَانَ الَّذِي أُنْزِلَ فِيهِ الْقُرْآنُ هُدًى لِلنَّاسِ
              </p>
            </div>
          ) : (
            /* State A: Regular Islamic Companion Banner */
            <div className="flex flex-col gap-1 max-w-2xl">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-widest">
                <span>Waktu Sholat Fardhu Berikutnya</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-emerald-200 font-normal">Ibadah Sepanjang Waktu</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white mt-1">
                Jadwal Sholat &amp; Ibadah Harian Presisi
              </h1>
              <div className="flex flex-col gap-1 mt-1">
                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-arabic" dir="rtl">
                  إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا
                </p>
                <p className="text-[11px] sm:text-xs text-emerald-200/80 italic">
                  &quot;Sesungguhnya sholat itu adalah kewajiban yang ditentukan waktunya atas orang-orang yang beriman.&quot; (QS. An-Nisa: 103)
                </p>
              </div>
            </div>
          )}

          {/* CENTERPIECE SPOTLIGHT: DUAL FOR RAMADHAN vs SINGLE FOR REGULAR */}
          {isRamadhan ? (
            /* State B: Dual Critical Countdown Spotlight (Imsak & Maghrib) */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Waktu Imsak (Batas Sahur) */}
              <div
                className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all border ${
                  activeTarget === "Imsak"
                    ? "bg-white/15 border-amber-400 ring-2 ring-amber-400/80 shadow-[0_0_25px_-4px_rgba(245,158,11,0.35)]"
                    : "bg-white/10 border-white/15 hover:bg-white/12"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center">
                      <HilalStarIcon className="w-4 h-4 text-amber-300" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
                      Imsak (Batas Sahur)
                    </span>
                  </div>
                  {activeTarget === "Imsak" ? (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 animate-pulse">
                      Fokus Menuju Imsak
                    </span>
                  ) : (
                    <span className="text-[11px] text-emerald-200/80">Esok Hari</span>
                  )}
                </div>

                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
                      {schedule.imsak}
                    </span>
                    <span className="text-xs text-emerald-200 ml-1.5 font-sans">
                      {selectedCity.timezone === 7 ? "WIB" : selectedCity.timezone === 8 ? "WITA" : "WIT"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-emerald-200 block uppercase tracking-wider">
                      Hitung Mundur
                    </span>
                    <span className="text-base sm:text-lg font-mono font-bold text-amber-300 tabular-nums">
                      {formatCountdown(remainingImsakSec)}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-emerald-100/80 mt-2">
                  Batas akhir waktu makan sahur (10 menit sebelum fajar/Subuh).
                </p>
              </div>

              {/* Card 2: Waktu Maghrib (Buka Puasa / Iftar) */}
              <div
                className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all border ${
                  activeTarget === "Maghrib"
                    ? "bg-white/15 border-amber-400 ring-2 ring-amber-400/80 shadow-[0_0_25px_-4px_rgba(245,158,11,0.35)]"
                    : "bg-white/10 border-white/15 hover:bg-white/12"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center">
                      <FanousIcon className="w-4 h-4 text-amber-300" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
                      Maghrib (Buka Puasa)
                    </span>
                  </div>
                  {activeTarget === "Maghrib" ? (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 animate-pulse">
                      Fokus Buka Puasa
                    </span>
                  ) : (
                    <span className="text-[11px] text-emerald-200/80">
                      {isFastingNow ? "Hari Ini" : "Esok Hari"}
                    </span>
                  )}
                </div>

                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
                      {schedule.maghrib}
                    </span>
                    <span className="text-xs text-emerald-200 ml-1.5 font-sans">
                      {selectedCity.timezone === 7 ? "WIB" : selectedCity.timezone === 8 ? "WITA" : "WIT"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-emerald-200 block uppercase tracking-wider">
                      Hitung Mundur
                    </span>
                    <span className="text-base sm:text-lg font-mono font-bold text-amber-300 tabular-nums">
                      {formatCountdown(remainingMaghribSec)}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-emerald-100/80 mt-2">
                  Saat matahari terbenam untuk menyegerakan berbuka dan sholat Maghrib.
                </p>
              </div>
            </div>
          ) : (
            /* State A: Single Next Prayer Spotlight Card (Spacious & Focused) */
            <div className="relative overflow-hidden rounded-2xl p-5 sm:p-6 bg-white/10 dark:bg-white/5 border border-emerald-400/25 shadow-lg backdrop-blur-sm transition-all hover:border-emerald-400/40">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                {/* Left: Next Prayer Name & Precise Time */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-emerald-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
                      Sholat Berikutnya: {nextPrayer ? nextPrayer.name : "Subuh"}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                      Fardhu
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2.5 mt-2">
                    <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white tabular-nums">
                      {nextPrayer ? nextPrayer.time : "--:--"}
                    </span>
                    <span className="text-sm font-semibold text-emerald-200">
                      {selectedCity.timezone === 7 ? "WIB" : selectedCity.timezone === 8 ? "WITA" : "WIT"}
                    </span>
                  </div>

                  <p className="text-xs text-emerald-100/80 mt-1">
                    Waktu sholat wilayah {selectedCity.name} dan sekitarnya.
                  </p>
                </div>

                {/* Right: Countdown & Adhan CTA Button */}
                <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-4 border-t md:border-t-0 border-white/10 pt-4 md:pt-0">
                  <div className="text-left md:text-right">
                    <span className="text-[11px] text-emerald-200 block uppercase tracking-wider font-semibold">
                      Hitung Mundur Menuju {nextPrayer?.name || "Sholat"}
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-2xl sm:text-3xl font-mono font-black text-emerald-300 tabular-nums mt-0.5 block"
                    >
                      {formatCountdown(nextPrayer ? nextPrayer.remainingSeconds : 0)}
                    </span>
                    <span className="text-[11px] text-emerald-200/90">
                      (tersisa {nextPrayer ? nextPrayer.formattedRemaining : "..."})
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setPlayingAudio({
                        title: `Kumandang Adzan (${nextPrayer?.name || "Sholat"})`,
                        subtitle: `Suara Muadzin Makkah Al-Mukarramah`,
                        url: "https://www.islamcan.com/audio/adhan/azan1.mp3",
                      })
                    }
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer min-h-[44px] min-w-[44px] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                    aria-label={`Dengarkan Kumandang Adzan ${nextPrayer?.name || "Sholat"}`}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                    </svg>
                    <span>Dengarkan Adzan {nextPrayer?.name || ""}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Ramadhan Mode: Extra Next Prayer Banner & Adhan Player Button */}
          {isRamadhan && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-white/10">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-emerald-200 font-semibold">
                  Sholat Fardhu Berikutnya
                </span>
                <div className="flex items-baseline gap-2.5 mt-0.5">
                  <span className="text-xl sm:text-2xl font-bold text-white">
                    {nextPrayer ? nextPrayer.name : "Subuh"}
                  </span>
                  <span className="text-lg sm:text-xl font-mono font-bold text-amber-300">
                    {nextPrayer ? nextPrayer.time : "--:--"}
                  </span>
                  <span className="text-xs text-emerald-100">
                    (tersisa {nextPrayer ? nextPrayer.formattedRemaining : "..."})
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setPlayingAudio({
                    title: `Kumandang Adzan (${nextPrayer?.name || "Sholat"})`,
                    subtitle: `Suara Muadzin Makkah Al-Mukarramah`,
                    url: "https://www.islamcan.com/audio/adhan/azan1.mp3",
                  })
                }
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-all self-start sm:self-auto cursor-pointer min-h-[44px] min-w-[44px] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                aria-label="Dengarkan Kumandang Adzan"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
                <span>Dengarkan Adzan</span>
              </button>
            </div>
          )}

          {/* 5 Prayer Times Horizontal Ribbon */}
          <div className="grid grid-cols-5 gap-1.5 sm:gap-3 pt-2">
            {prayerItems.map((p) => {
              const isNext = nextPrayer?.name === p.name;
              return (
                <div
                  key={p.name}
                  className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl transition-all ${
                    isNext
                      ? isRamadhan
                        ? "bg-white text-emerald-950 shadow-lg scale-105 font-bold ring-2 ring-amber-400"
                        : "bg-white text-emerald-950 shadow-lg scale-105 font-bold ring-2 ring-emerald-400"
                      : "bg-white/10 text-white hover:bg-white/15"
                  }`}
                >
                  <span
                    className={`text-[11px] sm:text-xs ${
                      isNext ? "text-emerald-800 font-bold" : "text-emerald-200"
                    }`}
                  >
                    {p.name}
                  </span>
                  <span className="text-sm sm:text-base font-bold font-mono mt-0.5 tabular-nums">
                    {p.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Action Menu Grid (7 core tools) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold tracking-tight text-foreground">
            Menu Utama Ibadah
          </h3>
          <span className="text-xs text-muted-foreground">7 Fitur Lengkap</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            {
              href: "/jadwal-sholat",
              title: "Jadwal Sholat",
              desc: "Waktu hisab & bulanan",
              color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400",
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ),
            },
            {
              href: "/quran",
              title: "Al-Qur'an",
              desc: "114 Surah & audio",
              color: "text-teal-600 bg-teal-50 dark:bg-teal-950/40 dark:text-teal-400",
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              ),
            },
            {
              href: "/kiblat",
              title: "Arah Kiblat",
              desc: "Kompas akurat Ka'bah",
              color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400",
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <polygon
                    points="12 2 19 21 12 17 5 21 12 2"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
            },
            {
              href: "/doa-dzikir",
              title: "Doa & Dzikir",
              desc: "Doa & tasbih digital",
              color: "text-cyan-600 bg-cyan-50 dark:bg-cyan-950/40 dark:text-cyan-400",
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              ),
            },
            {
              href: "/asmaul-husna",
              title: "Asmaul Husna",
              desc: "99 Nama mulia Allah",
              color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400",
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              ),
            },
            {
              href: "/zakat",
              title: "Kalkulator Zakat",
              desc: "Profesi, maal & fitrah",
              color: "text-orange-600 bg-orange-50 dark:bg-orange-950/40 dark:text-orange-400",
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              ),
            },
            {
              href: "/kalender-hijriah",
              title: "Kalender Hijriah",
              desc: "Puasa sunnah & libur",
              color: "text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400",
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              ),
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col p-4 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all group min-h-[44px]"
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${item.color}`}
              >
                {item.icon}
              </div>
              <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                {item.title}
              </span>
              <span className="text-[11px] text-muted-foreground mt-0.5">
                {item.desc}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* SPECIAL RAMADHAN SUITE SECTION (Rendered ONLY when isRamadhan is true) */}
      {isRamadhan && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ramadhan Interactive Du'a Suite Card */}
          <RamadhanDuaSuite onPlayAudio={setPlayingAudio} />

          {/* Ramadhan Daily Worship Checklist Card */}
          <RamadhanWorshipTracker />
        </div>
      )}

      {/* DUAL SECTION: DAILY VERSE & 5 DAILY PRAYER TRACKER (Direct Flow in Regular Mode) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ayat Hari Ini (Daily Verse) */}
        <div className="flex flex-col p-6 rounded-3xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <h3 className="text-sm font-bold text-foreground">Ayat Hari Ini</h3>
            </div>
            <Link
              href="/quran"
              className="text-xs font-semibold text-primary hover:underline min-h-[44px] inline-flex items-center"
            >
              Buka Al-Qur&apos;an &rarr;
            </Link>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <span
              className="text-right font-arabic text-2xl leading-loose text-foreground py-2"
              dir="rtl"
            >
              أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ
            </span>
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 italic">
              &quot;Alaa bidzikrillaahi tathma-innul quluub&quot;
            </p>
            <p className="text-sm text-muted-foreground">
              &quot;Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram.&quot; (QS. Ar-Ra&apos;d: 28)
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Surah Ar-Ra&apos;d, Ayat 28</span>
            <button
              type="button"
              onClick={() =>
                setPlayingAudio({
                  title: "QS. Ar-Ra'd : 28",
                  subtitle: "Syeikh Mishary Rashid Alafasy",
                  url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1735.mp3",
                })
              }
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors cursor-pointer min-h-[44px]"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              Dengarkan Ayat
            </button>
          </div>
        </div>

        {/* Pelacak Sholat 5 Waktu Harian */}
        <div className="flex flex-col p-6 rounded-3xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <h3 className="text-sm font-bold text-foreground">
                Pelacak Sholat Fardhu Hari Ini
              </h3>
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              {Object.values(todayPrayerCheck).filter(Boolean).length}/5 Selesai
            </span>
          </div>

          <p className="text-xs text-muted-foreground mt-3">
            Tandai sholat yang telah Anda kerjakan hari ini untuk menjaga kedisiplinan ibadah fardhu.
          </p>

          <div className="grid grid-cols-5 gap-2 mt-4">
            {["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"].map((pName) => {
              const isChecked = todayPrayerCheck[pName];
              return (
                <button
                  key={pName}
                  type="button"
                  role="checkbox"
                  aria-checked={isChecked}
                  aria-label={`Tandai Sholat ${pName}`}
                  onClick={() => togglePrayerCheck(pName)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer min-h-[44px] min-w-[44px] ${
                    isChecked
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200"
                      : "border-border bg-muted/40 text-muted-foreground hover:border-emerald-300"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 text-xs transition-colors ${
                      isChecked
                        ? "bg-emerald-500 text-white"
                        : "border border-muted-foreground/40 text-transparent"
                    }`}
                  >
                    ✓
                  </div>
                  <span className="text-xs font-semibold">{pName}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 pt-3 border-t border-border flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">
              Tersimpan otomatis di peramban Anda
            </span>
            <Link
              href="/jadwal-sholat"
              className="text-xs font-semibold text-primary hover:underline min-h-[44px] inline-flex items-center"
            >
              Lihat Selengkapnya &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Audio player portal if activated */}
      {playingAudio && (
        <AudioPlayer
          title={playingAudio.title}
          subtitle={playingAudio.subtitle}
          audioUrl={playingAudio.url}
          onClose={() => setPlayingAudio(null)}
        />
      )}
    </div>
  );
}

function HomeHeroWithSearchParams() {
  const searchParams = useSearchParams();
  const forcedQuery = searchParams?.get("ramadhan") ?? null;
  return <HomeHeroContent forcedQuery={forcedQuery} />;
}

export function HomeHero() {
  return (
    <Suspense fallback={<HomeHeroContent forcedQuery={null} />}>
      <HomeHeroWithSearchParams />
    </Suspense>
  );
}
