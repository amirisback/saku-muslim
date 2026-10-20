import type { Metadata } from "next";
import { QiblaCompass } from "./qibla-compass";

export const metadata: Metadata = {
  title: "Kompas Arah Kiblat Presisi — Saku Muslim",
  description: "Cari arah kiblat presisi ke Ka'bah di Makkah dari lokasi Anda di Indonesia dengan sensor kompas dan rumus trigonometri bola bumi.",
};

export default function KiblatPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <QiblaCompass />
    </div>
  );
}
