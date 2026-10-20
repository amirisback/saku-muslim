import type { Metadata } from "next";
import { ZakatView } from "./zakat-view";

export const metadata: Metadata = {
  title: "Kalkulator Zakat Penghasilan, Maal & Fitrah — Saku Muslim",
  description: "Hitung kewajiban zakat penghasilan, zakat maal (tabungan & emas), dan zakat fitrah Anda secara akurat sesuai standar nisab syar'i 85 gram emas.",
};

export default function ZakatPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <ZakatView />
    </div>
  );
}
