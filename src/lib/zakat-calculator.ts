export const DEFAULT_GOLD_PRICE_PER_GRAM = 1450000; // Rp 1.450.000 / gram acuan terkini
export const DEFAULT_RICE_PRICE_PER_KG = 16000; // Rp 16.000 / kg

function sanitizeNumber(value: number, fallback = 0): number {
  if (typeof value !== "number" || !Number.isFinite(value) || isNaN(value)) {
    return fallback;
  }
  return Math.max(0, value);
}

export interface ZakatCalculationResult {
  isObligated: boolean;
  nisabValue: number;
  totalAssets: number;
  zakatDue: number;
  notes: string;
}

/**
 * Hitung Zakat Penghasilan / Profesi
 */
export function calculateZakatIncome(
  monthlyIncome: number,
  additionalIncome: number,
  monthlyExpenses: number,
  goldPricePerGram: number = DEFAULT_GOLD_PRICE_PER_GRAM
): ZakatCalculationResult {
  const safeIncome = sanitizeNumber(monthlyIncome);
  const safeAdditional = sanitizeNumber(additionalIncome);
  const safeExpenses = sanitizeNumber(monthlyExpenses);
  const safeGoldPrice = Math.max(100000, sanitizeNumber(goldPricePerGram, DEFAULT_GOLD_PRICE_PER_GRAM));

  const netIncome = Math.max(0, safeIncome + safeAdditional - safeExpenses);
  const annualNisab = 85 * safeGoldPrice;
  const monthlyNisab = Math.round(annualNisab / 12);

  const isObligated = netIncome >= monthlyNisab;
  const zakatDue = isObligated ? Math.round(netIncome * 0.025) : 0;

  return {
    isObligated,
    nisabValue: monthlyNisab,
    totalAssets: netIncome,
    zakatDue,
    notes: isObligated
      ? "Penghasilan bersih bulanan Anda telah mencapai nisab (setara 85 gram emas per tahun dibagi 12 bulan). Wajib menunaikan zakat 2.5%."
      : "Penghasilan bersih bulanan Anda belum mencapai batas nisab. Anda dianjurkan untuk memperbanyak infaq dan sedekah sukarela.",
  };
}

/**
 * Hitung Zakat Maal (Harta Simpanan / Emas / Tabungan)
 */
export function calculateZakatMaal(
  savings: number,
  goldGrams: number,
  goldPricePerGram: number = DEFAULT_GOLD_PRICE_PER_GRAM
): ZakatCalculationResult {
  const safeSavings = sanitizeNumber(savings);
  const safeGoldGrams = sanitizeNumber(goldGrams);
  const safeGoldPrice = Math.max(100000, sanitizeNumber(goldPricePerGram, DEFAULT_GOLD_PRICE_PER_GRAM));

  const goldValue = safeGoldGrams * safeGoldPrice;
  const totalAssets = safeSavings + goldValue;
  const nisabValue = 85 * safeGoldPrice;

  const isObligated = totalAssets >= nisabValue;
  const zakatDue = isObligated ? Math.round(totalAssets * 0.025) : 0;

  return {
    isObligated,
    nisabValue,
    totalAssets,
    zakatDue,
    notes: isObligated
      ? "Total harta simpanan dan emas Anda telah mencapai nisab 85 gram emas. Jika telah tersimpan selama 1 tahun hijriah (haul), wajib menunaikan zakat 2.5%."
      : "Total harta simpanan belum mencapai batas nisab 85 gram emas. Tidak ada kewajiban zakat maal, namun disunnahkan berinfaq.",
  };
}

/**
 * Hitung Zakat Fitrah
 */
export function calculateZakatFitrah(
  familyMembers: number,
  ricePricePerKg: number = DEFAULT_RICE_PRICE_PER_KG
): { familyMembers: number; riceKg: number; zakatDueRupiah: number } {
  const safeMembers = Math.max(1, Math.round(sanitizeNumber(familyMembers, 1)));
  const safeRicePrice = Math.max(1000, sanitizeNumber(ricePricePerKg, DEFAULT_RICE_PRICE_PER_KG));
  const riceKg = safeMembers * 2.5;
  const zakatDueRupiah = Math.round(riceKg * safeRicePrice);

  return {
    familyMembers: safeMembers,
    riceKg,
    zakatDueRupiah,
  };
}
