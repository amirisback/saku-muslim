"use client";

import { useState } from "react";
import {
  calculateZakatIncome,
  calculateZakatMaal,
  calculateZakatFitrah,
  DEFAULT_GOLD_PRICE_PER_GRAM,
  DEFAULT_RICE_PRICE_PER_KG,
} from "@/lib/zakat-calculator";

export function ZakatView() {
  const [activeTab, setActiveTab] = useState<"income" | "maal" | "fitrah">("income");
  const [goldPrice, setGoldPrice] = useState<number>(DEFAULT_GOLD_PRICE_PER_GRAM);
  const [ricePrice, setRicePrice] = useState<number>(DEFAULT_RICE_PRICE_PER_KG);

  // Income Zakat Inputs
  const [monthlyIncome, setMonthlyIncome] = useState<number>(12000000);
  const [otherIncome, setOtherIncome] = useState<number>(1000000);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(2000000);

  // Maal Zakat Inputs
  const [savings, setSavings] = useState<number>(50000000);
  const [goldGrams, setGoldGrams] = useState<number>(90);

  // Fitrah Zakat Inputs
  const [familyMembers, setFamilyMembers] = useState<number>(4);

  // Live calculations
  const incomeResult = calculateZakatIncome(
    monthlyIncome,
    otherIncome,
    monthlyExpenses,
    goldPrice
  );

  const maalResult = calculateZakatMaal(
    savings,
    goldGrams,
    goldPrice
  );

  const fitrahResult = calculateZakatFitrah(
    familyMembers,
    ricePrice
  );

  const formatRp = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white shadow-lg">
        <div className="flex flex-col gap-1 max-w-xl">
          <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">
            Rukun Islam Ketiga
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Kalkulator Zakat Lengkap
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1">
            Hitung kewajiban zakat profesi, zakat maal (harta & emas), serta zakat fitrah dengan acuan nisab syar&apos;i.
          </p>
        </div>

        {/* Current Gold Standard Pill */}
        <div className="flex flex-col bg-white/10 p-3.5 rounded-2xl border border-white/20 self-start md:self-auto text-xs">
          <span className="text-emerald-200">Acuan Nisab Emas (85g):</span>
          <span className="font-bold font-mono text-sm text-amber-300">
            {formatRp(85 * goldPrice)}
          </span>
          <span className="text-[10px] text-emerald-200">
            ({formatRp(goldPrice)}/gram)
          </span>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-muted/60 border border-border">
        {[
          { id: "income", label: "💼 Zakat Penghasilan" },
          { id: "maal", label: "💰 Zakat Maal & Emas" },
          { id: "fitrah", label: "🌾 Zakat Fitrah" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Zakat Penghasilan */}
      {activeTab === "income" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inputs Card */}
          <div className="flex flex-col p-6 rounded-3xl border border-border bg-card shadow-sm gap-4">
            <h3 className="font-bold text-base text-foreground border-b border-border pb-3">
              Rincian Penghasilan Bulanan
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Gaji / Penghasilan Pokok per Bulan:
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-muted-foreground font-semibold">Rp</span>
                <input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 pl-9 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Penghasilan Tambahan / Bonus / Tunjangan:
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-muted-foreground font-semibold">Rp</span>
                <input
                  type="number"
                  value={otherIncome}
                  onChange={(e) => setOtherIncome(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 pl-9 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Pengeluaran Kebutuhan Pokok & Utang Jatuh Tempo:
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-muted-foreground font-semibold">Rp</span>
                <input
                  type="number"
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 pl-9 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 pt-2 border-t border-border">
              <label className="text-xs font-semibold text-muted-foreground">
                Harga Emas per Gram Saat Ini:
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-muted-foreground font-semibold">Rp</span>
                <input
                  type="number"
                  value={goldPrice}
                  onChange={(e) => setGoldPrice(Math.max(100000, parseInt(e.target.value) || DEFAULT_GOLD_PRICE_PER_GRAM))}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 pl-9 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Results Card */}
          <div className="flex flex-col p-6 rounded-3xl border border-border bg-card shadow-sm justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-bold text-base text-foreground">Hasil Hitung Zakat</h3>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                    incomeResult.isObligated
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                  }`}
                >
                  {incomeResult.isObligated ? "Wajib Zakat" : "Belum Mencapai Nisab"}
                </span>
              </div>

              <div className="flex flex-col gap-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Penghasilan Bersih Bulanan:</span>
                  <span className="font-bold font-mono text-foreground">
                    {formatRp(incomeResult.totalAssets)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Nisab Bulanan (85g Emas / 12):</span>
                  <span className="font-bold font-mono text-foreground">
                    {formatRp(incomeResult.nisabValue)}
                  </span>
                </div>
              </div>

              {/* Big Due Number */}
              <div className="p-4 rounded-2xl bg-secondary/60 border border-primary/20 flex flex-col items-center text-center mt-2">
                <span className="text-xs text-muted-foreground font-medium">
                  Zakat Penghasilan yang Harus Dibayar (2.5%)
                </span>
                <span className="text-3xl font-black font-mono text-primary mt-1">
                  {formatRp(incomeResult.zakatDue)}
                </span>
                <span className="text-[11px] text-muted-foreground mt-0.5">
                  per bulan
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {incomeResult.notes}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Zakat Maal & Emas */}
      {activeTab === "maal" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col p-6 rounded-3xl border border-border bg-card shadow-sm gap-4">
            <h3 className="font-bold text-base text-foreground border-b border-border pb-3">
              Rincian Harta Simpanan & Emas (Haul 1 Tahun)
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Total Tabungan, Deposito & Giro (Rp):
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-muted-foreground font-semibold">Rp</span>
                <input
                  type="number"
                  value={savings}
                  onChange={(e) => setSavings(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 pl-9 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Berat Emas yang Dimiliki & Disimpan (gram):
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={goldGrams}
                  onChange={(e) => setGoldGrams(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 pr-14 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-semibold">gram</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 pt-2 border-t border-border">
              <label className="text-xs font-semibold text-muted-foreground">
                Harga Emas per Gram Saat Ini:
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-muted-foreground font-semibold">Rp</span>
                <input
                  type="number"
                  value={goldPrice}
                  onChange={(e) => setGoldPrice(Math.max(100000, parseInt(e.target.value) || DEFAULT_GOLD_PRICE_PER_GRAM))}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 pl-9 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col p-6 rounded-3xl border border-border bg-card shadow-sm justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-bold text-base text-foreground">Hasil Hitung Zakat Maal</h3>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                    maalResult.isObligated
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                  }`}
                >
                  {maalResult.isObligated ? "Wajib Zakat" : "Belum Mencapai Nisab"}
                </span>
              </div>

              <div className="flex flex-col gap-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Total Harta Simpanan:</span>
                  <span className="font-bold font-mono text-foreground">
                    {formatRp(maalResult.totalAssets)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Batas Nisab Emas (85g Emas):</span>
                  <span className="font-bold font-mono text-foreground">
                    {formatRp(maalResult.nisabValue)}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-secondary/60 border border-primary/20 flex flex-col items-center text-center mt-2">
                <span className="text-xs text-muted-foreground font-medium">
                  Zakat Maal yang Harus Ditunaikan (2.5%)
                </span>
                <span className="text-3xl font-black font-mono text-primary mt-1">
                  {formatRp(maalResult.zakatDue)}
                </span>
                <span className="text-[11px] text-muted-foreground mt-0.5">
                  per tahun haul
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {maalResult.notes}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Zakat Fitrah */}
      {activeTab === "fitrah" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col p-6 rounded-3xl border border-border bg-card shadow-sm gap-4">
            <h3 className="font-bold text-base text-foreground border-b border-border pb-3">
              Keluarga & Nilai Beras
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Jumlah Anggota Keluarga (Jiwa):
              </label>
              <input
                type="number"
                min="1"
                value={familyMembers}
                onChange={(e) => setFamilyMembers(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Harga Beras yang Dikonsumsi per Kg (Rp):
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-muted-foreground font-semibold">Rp</span>
                <input
                  type="number"
                  value={ricePrice}
                  onChange={(e) => setRicePrice(Math.max(1000, parseInt(e.target.value) || DEFAULT_RICE_PRICE_PER_KG))}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 pl-9 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col p-6 rounded-3xl border border-border bg-card shadow-sm justify-between">
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-base text-foreground border-b border-border pb-3">
                Kewajiban Zakat Fitrah
              </h3>

              <div className="flex flex-col gap-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Jumlah Jiwa:</span>
                  <span className="font-bold font-mono text-foreground">
                    {fitrahResult.familyMembers} orang
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Takaran Beras (2.5 kg/jiwa):</span>
                  <span className="font-bold font-mono text-foreground">
                    {fitrahResult.riceKg} kg beras
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-secondary/60 border border-primary/20 flex flex-col items-center text-center mt-2">
                <span className="text-xs text-muted-foreground font-medium">
                  Atau Setara Uang Tunai
                </span>
                <span className="text-3xl font-black font-mono text-primary mt-1">
                  {formatRp(fitrahResult.zakatDueRupiah)}
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Zakat fitrah wajib ditunaikan sebelum pelaksanaan Sholat Idul Fitri bagi setiap jiwa muslim yang memiliki kelebihan makanan pokok pada malam dan hari raya Idul Fitri.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
