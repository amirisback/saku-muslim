import { getHijriDate } from "@/data/islamic-calendar";

export interface RamadhanState {
  isRamadhan: boolean;
  hijriMonth: number;
  hijriYear: number;
  formattedHijri: string;
  isSimulated: boolean;
}

/**
 * Menghitung status keaktifan fitur Ramadhan berdasarkan hisab kalender Islam
 * dan override parameter simulasi (?ramadhan=true / ?ramadhan=false).
 */
export function getRamadhanState(options?: {
  date?: Date;
  forcedQueryValue?: string | null;
}): RamadhanState {
  // 1. Cek parameter override (?ramadhan=true / false)
  if (options?.forcedQueryValue === "true") {
    return {
      isRamadhan: true,
      hijriMonth: 9,
      hijriYear: 1448,
      formattedHijri: "Ramadhan 1448 H",
      isSimulated: true,
    };
  }

  if (options?.forcedQueryValue === "false") {
    return {
      isRamadhan: false,
      hijriMonth: 5,
      hijriYear: 1448,
      formattedHijri: "Jumadil Awwal 1448 H",
      isSimulated: true,
    };
  }

  // 2. Evaluasi hisab riil dari kalender Umm al-Qura
  const hijri = getHijriDate(options?.date ?? new Date());
  return {
    isRamadhan: hijri.month === 9,
    hijriMonth: hijri.month,
    hijriYear: hijri.year,
    formattedHijri: hijri.formattedId,
    isSimulated: false,
  };
}
