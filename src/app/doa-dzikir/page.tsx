import type { Metadata } from "next";
import { DoaDzikirView } from "./doa-view";

export const metadata: Metadata = {
  title: "Kumpulan Doa Harian & Tasbih Digital — Saku Muslim",
  description: "Kumpulan doa-doa harian lengkap Hisnul Muslim bersumber shahih dengan teks Arab, latin, terjemahan, dan tasbih digital interaktif bergetar.",
};

export default function DoaDzikirPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <DoaDzikirView />
    </div>
  );
}
