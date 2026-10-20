import type { Metadata } from "next";
import { CalendarView } from "./calendar-view";

export const metadata: Metadata = {
  title: "Kalender Hijriah & Jadwal Puasa Sunnah — Saku Muslim",
  description: "Kalender Islam penanggalan Hijriah lengkap penanda jadwal puasa sunnah Senin-Kamis, Ayyamul Bidh, awal Ramadhan, dan hari besar Islam.",
};

export default function KalenderHijriahPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <CalendarView />
    </div>
  );
}
