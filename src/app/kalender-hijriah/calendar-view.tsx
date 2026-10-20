"use client";

import { useState } from "react";
import {
  HIJRI_MONTHS_ID,
  ISLAMIC_EVENTS,
  getHijriDate,
} from "@/data/islamic-calendar";

export function CalendarView() {
  const [currentDate] = useState<Date>(new Date());
  const hijri = getHijriDate(currentDate);

  // Generate calendar grid for current Gregorian month
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(year, month, i + 1);
    const dayOfWeek = d.getDay(); // 0 Sun, 1 Mon, 4 Thu
    const isToday = i + 1 === currentDate.getDate();
    const h = getHijriDate(d);

    // Check if sunnah fasting
    const isMondayOrThursday = dayOfWeek === 1 || dayOfWeek === 4;
    const isAyyamulBidh = h.day === 13 || h.day === 14 || h.day === 15;
    const isSunnahFasting = isMondayOrThursday || isAyyamulBidh;

    return {
      date: i + 1,
      hijriDay: h.day,
      isToday,
      isSunnahFasting,
      fastingType: isAyyamulBidh ? "Ayyamul Bidh" : isMondayOrThursday ? "Senin-Kamis" : "",
    };
  });

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white shadow-lg">
        <div className="flex flex-col gap-1 max-w-xl">
          <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">
            Penanggalan Islam Ummul Qura
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Kalender Hijriah & Puasa Sunnah
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1">
            Hari ini: {currentDate.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>

        {/* Hijri Date Medallion */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/10 border border-white/20 text-center self-start md:self-auto min-w-[180px]">
          <span className="text-xs text-emerald-200">Tanggal Hijriah Hari Ini</span>
          <span className="text-xl sm:text-2xl font-black text-amber-300 mt-0.5">
            {hijri.formattedId}
          </span>
          <span className="text-[11px] text-emerald-100 mt-0.5">
            Bulan {hijri.monthNameId}
          </span>
        </div>
      </div>

      {/* Monthly Dual Calendar Grid */}
      <div className="p-6 rounded-3xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <h3 className="font-bold text-base text-foreground">
            {currentDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
          </h3>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Hari Ini
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              Puasa Sunnah
            </span>
          </div>
        </div>

        {/* Weekdays header */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-muted-foreground mt-4 pb-2 border-b border-border/50">
          <span className="text-red-500">Min</span>
          <span>Sen</span>
          <span>Sel</span>
          <span>Rab</span>
          <span>Kam</span>
          <span>Jum</span>
          <span>Sab</span>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-2 mt-2">
          {/* Empty placeholders for first day offset */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-16 rounded-2xl bg-transparent" />
          ))}

          {daysArray.map((day) => (
            <div
              key={day.date}
              className={`h-16 sm:h-20 p-2 rounded-2xl border flex flex-col justify-between transition-all ${
                day.isToday
                  ? "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 font-bold ring-2 ring-emerald-500/30"
                  : day.isSunnahFasting
                  ? "border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20"
                  : "border-border/60 bg-muted/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${day.isToday ? "text-primary" : "text-foreground"}`}>
                  {day.date}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {day.hijriDay}H
                </span>
              </div>

              {day.isSunnahFasting && (
                <span className="text-[9px] font-bold text-amber-700 dark:text-amber-300 bg-amber-200/50 dark:bg-amber-900/60 px-1 py-0.5 rounded truncate">
                  Puasa
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Islamic Events Timeline */}
      <div className="p-6 rounded-3xl border border-border bg-card shadow-sm">
        <h3 className="font-bold text-base text-foreground pb-4 border-b border-border">
          Hari Besar & Momentum Penting Islam Sepanjang Tahun
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {ISLAMIC_EVENTS.map((event) => (
            <div
              key={event.titleId}
              className="flex items-start gap-3.5 p-4 rounded-2xl border border-border bg-muted/20 hover:border-primary/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary text-secondary-foreground flex flex-col items-center justify-center shrink-0 font-bold text-xs">
                <span>{event.day}</span>
                <span className="text-[9px] uppercase">{HIJRI_MONTHS_ID[event.month - 1].slice(0, 3)}</span>
              </div>

              <div className="flex flex-col">
                <h4 className="font-bold text-sm text-foreground">
                  {event.titleId}
                </h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {event.descriptionId}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
