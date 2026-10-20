import type { Metadata } from "next";
import { NamesView } from "./names-view";

export const metadata: Metadata = {
  title: "99 Asmaul Husna Lengkap Tulisan Arab, Latin & Arti — Saku Muslim",
  description: "Daftar lengkap 99 Asmaul Husna (nama-nama indah Allah SWT) dilengkapi kaligrafi Arab, pelafalan latin, terjemahan Indonesia, dan audio lantunan merdu.",
};

export default function AsmaulHusnaPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <NamesView />
    </div>
  );
}
