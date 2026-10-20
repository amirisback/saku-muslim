import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSurahDetail } from "@/data/quran-verses";
import { QURAN_SURAHS } from "@/data/quran-surahs";
import { SurahReader } from "./surah-reader";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const num = parseInt(id, 10);
  const meta = QURAN_SURAHS.find((s) => s.number === num);

  if (!meta) {
    return {
      title: "Surah Tidak Ditemukan — Saku Muslim",
    };
  }

  return {
    title: `Surah ${meta.nameLatin} (${meta.nameArabic}) — Al-Qur'an Saku Muslim`,
    description: `Baca Surah ${meta.nameLatin} (${meta.nameIndonesian}) lengkap ${meta.numberOfAyahs} ayat dengan teks Arab, latin, terjemahan Indonesia, dan audio murottal.`,
  };
}

export default async function SurahPage({ params }: PageProps) {
  const { id } = await params;
  const num = parseInt(id, 10);

  if (isNaN(num) || num < 1 || num > 114) {
    notFound();
  }

  const surah = getSurahDetail(num);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <SurahReader surah={surah} />
    </div>
  );
}
