"use client";

import { useState } from "react";
import { INDONESIA_CITIES, CityLocation, PrayerTimesSchedule } from "@/data/prayer-data";
import {
  calculatePrayerTimes,
  getNextPrayer,
  getTodayTrackerKey,
  NextPrayerInfo,
} from "@/lib/prayer-calculator";
import { getHijriDate } from "@/data/islamic-calendar";
import { AudioPlayer } from "@/components/shared/audio-player";

export function PrayerView() {
  const [selectedCity, setSelectedCity] = useState<CityLocation>(INDONESIA_CITIES[0]);
  const [currentDate] = useState<Date>(() => new Date());
  const [playingAdhan, setPlayingAdhan] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<Record<string, boolean>>(() => {
    if (typeof window !== "undefined") {
      try {
        const todayKey = getTodayTrackerKey("prayer_tracker");
        const saved = localStorage.getItem(todayKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === "object") {
            return {
              Subuh: false,
              Dzuhur: false,
              Ashar: false,
              Maghrib: false,
              Isya: false,
              ...parsed,
            };
          }
        }
      } catch {
        // ignore
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

  const todaySchedule = calculatePrayerTimes(
    currentDate,
    selectedCity.latitude,
    selectedCity.longitude,
    selectedCity.timezone
  );

  const nextPrayer: NextPrayerInfo = getNextPrayer(todaySchedule, currentDate);

  const toggleCheck = (name: string) => {
    setChecklist((prev) => {
      const next = { ...prev, [name]: !prev[name] };
      try {
        const todayKey = getTodayTrackerKey("prayer_tracker");
        localStorage.setItem(todayKey, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const hijri = getHijriDate(currentDate);

  // Generate 30 days monthly table for current month
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const monthlySchedules = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(currentYear, currentMonth, i + 1);
    const sched = calculatePrayerTimes(
      d,
      selectedCity.latitude,
      selectedCity.longitude,
      selectedCity.timezone
    );
    const isToday = i + 1 === currentDate.getDate();
    return {
      date: i + 1,
      dayName: d.toLocaleDateString("id-ID", { weekday: "short" }),
      schedule: sched,
      isToday,
    };
  });

  const prayerCards: { name: string; key: keyof PrayerTimesSchedule; time: string; desc: string }[] = [
    { name: "Imsak", key: "imsak", time: todaySchedule.imsak, desc: "Batas akhir sahur" },
    { name: "Subuh", key: "fajr", time: todaySchedule.fajr, desc: "Awal sholat fardhu fajar" },
    { name: "Terbit", key: "sunrise", time: todaySchedule.sunrise, desc: "Matahari terbit (syuruq)" },
    { name: "Dzuhur", key: "dhuhr", time: todaySchedule.dhuhr, desc: "Matahari tergelincir ke barat" },
    { name: "Ashar", key: "asr", time: todaySchedule.asr, desc: "Bayangan sama panjang" },
    { name: "Maghrib", key: "maghrib", time: todaySchedule.maghrib, desc: "Waktu berbuka puasa" },
    { name: "Isya", key: "isha", time: todaySchedule.isha, desc: "Awal waktu sholat malam" },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Top Section: City & Date Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl border border-border bg-card shadow-sm">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <span>Standar Kemenag RI</span>
            <span>•</span>
            <span>{hijri.formattedId}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-1">
            Jadwal Sholat & Adzan
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Waktu sholat akurat untuk wilayah {selectedCity.name} dan sekitarnya
          </p>
        </div>

        {/* City picker dropdown */}
        <div className="flex items-center gap-3">
          <label htmlFor="city-select" className="text-xs font-medium text-muted-foreground whitespace-nowrap">
            Pilih Kota:
          </label>
          <select
            id="city-select"
            value={selectedCity.id}
            onChange={(e) => {
              const c = INDONESIA_CITIES.find((item) => item.id === e.target.value);
              if (c) setSelectedCity(c);
            }}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            {INDONESIA_CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.province})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hero Active Prayer Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white shadow-lg">
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wider text-emerald-200 font-semibold">
            Menuju Waktu Sholat
          </span>
          <div className="flex items-baseline gap-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              {nextPrayer ? nextPrayer.name : "Subuh"}
            </h2>
            <span className="text-2xl sm:text-3xl font-mono font-bold text-amber-300">
              {nextPrayer ? nextPrayer.time : "--:--"}
            </span>
          </div>
          <p className="text-xs text-emerald-100">
            Waktu tersisa: <span className="font-bold text-white">{nextPrayer ? nextPrayer.formattedRemaining : "memuat..."}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() =>
              setPlayingAdhan(
                "https://www.islamcan.com/audio/adhan/azan1.mp3"
              )
            }
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
            Putar Adzan Makkah
          </button>
          <button
            type="button"
            onClick={() =>
              setPlayingAdhan(
                "https://www.islamcan.com/audio/adhan/azan2.mp3"
              )
            }
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            Adzan Madinah
          </button>
        </div>
      </div>

      {/* 7 Prayer Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {prayerCards.map((p) => {
          const isNext = nextPrayer?.name === p.name;
          return (
            <div
              key={p.name}
              className={`flex flex-col p-4 rounded-2xl border transition-all ${
                isNext
                  ? "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 shadow-md ring-2 ring-emerald-500/30"
                  : "border-border bg-card hover:border-border/80"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${isNext ? "text-primary" : "text-muted-foreground"}`}>
                  {p.name}
                </span>
                {isNext && (
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </div>
              <span className="text-xl sm:text-2xl font-black font-mono text-foreground mt-2">
                {p.time}
              </span>
              <span className="text-[10px] text-muted-foreground mt-1 line-clamp-1">
                {p.desc}
              </span>
            </div>
          );
        })}
      </div>

      {/* Tracker Sholat Harian */}
      <div className="p-6 rounded-3xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <h3 className="text-sm font-bold text-foreground">
              Catatan Disiplin Sholat 5 Waktu Hari Ini
            </h3>
          </div>
          <span className="text-xs font-semibold text-primary">
            {Object.values(checklist).filter(Boolean).length} dari 5 Dikerjakan
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
          {["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"].map((name) => {
            const isDone = checklist[name];
            return (
              <button
                key={name}
                type="button"
                onClick={() => toggleCheck(name)}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isDone
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-100"
                    : "border-border bg-muted/30 text-muted-foreground hover:border-emerald-400"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                    isDone
                      ? "bg-emerald-500 text-white"
                      : "border border-border text-transparent"
                  }`}
                >
                  ✓
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold">{name}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {isDone ? "Selesai" : "Belum dicatat"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Monthly Timetable Table */}
      <div className="p-6 rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border">
          <div>
            <h3 className="text-base font-bold text-foreground">
              Jadwal Sholat Bulanan — {currentDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
            </h3>
            <p className="text-xs text-muted-foreground">
              Wilayah {selectedCity.name} (Koordinat {selectedCity.latitude.toFixed(2)}°, {selectedCity.longitude.toFixed(2)}°)
            </p>
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-muted-foreground font-semibold">
                <th className="py-2.5 px-3">Tanggal</th>
                <th className="py-2.5 px-3">Hari</th>
                <th className="py-2.5 px-3">Imsak</th>
                <th className="py-2.5 px-3">Subuh</th>
                <th className="py-2.5 px-3">Terbit</th>
                <th className="py-2.5 px-3">Dzuhur</th>
                <th className="py-2.5 px-3">Ashar</th>
                <th className="py-2.5 px-3">Maghrib</th>
                <th className="py-2.5 px-3">Isya</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {monthlySchedules.map((item) => (
                <tr
                  key={item.date}
                  className={`transition-colors font-mono ${
                    item.isToday
                      ? "bg-emerald-50/80 dark:bg-emerald-950/60 font-bold text-emerald-900 dark:text-emerald-100"
                      : "hover:bg-muted/40 text-foreground"
                  }`}
                >
                  <td className="py-2.5 px-3 font-sans">
                    {item.date} {item.isToday && <span className="ml-1 text-[10px] text-emerald-600 font-bold">(Hari ini)</span>}
                  </td>
                  <td className="py-2.5 px-3 font-sans capitalize">{item.dayName}</td>
                  <td className="py-2.5 px-3">{item.schedule.imsak}</td>
                  <td className="py-2.5 px-3">{item.schedule.fajr}</td>
                  <td className="py-2.5 px-3">{item.schedule.sunrise}</td>
                  <td className="py-2.5 px-3">{item.schedule.dhuhr}</td>
                  <td className="py-2.5 px-3">{item.schedule.asr}</td>
                  <td className="py-2.5 px-3">{item.schedule.maghrib}</td>
                  <td className="py-2.5 px-3">{item.schedule.isha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Audio Player when listening to adhan */}
      {playingAdhan && (
        <AudioPlayer
          title="Kumandang Adzan"
          subtitle={`Wilayah ${selectedCity.name}`}
          audioUrl={playingAdhan}
          onClose={() => setPlayingAdhan(null)}
        />
      )}
    </div>
  );
}
