import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-card/60 backdrop-blur-sm mt-auto pb-20 lg:pb-8 pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Info */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              </div>
              <span className="font-bold text-base text-foreground tracking-tight">
                Saku Muslim
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Platform pendamping ibadah umat muslim untuk mempermudah pelaksanaan sholat tepat waktu, membaca dan menghafal Al-Qur&apos;an, menemukan arah kiblat, serta menunaikan zakat.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Fitur Utama
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <Link href="/jadwal-sholat" className="hover:text-primary transition-colors">
                Jadwal Sholat
              </Link>
              <Link href="/quran" className="hover:text-primary transition-colors">
                Al-Qur&apos;an Digital
              </Link>
              <Link href="/kiblat" className="hover:text-primary transition-colors">
                Arah Kiblat
              </Link>
              <Link href="/doa-dzikir" className="hover:text-primary transition-colors">
                Doa & Dzikir
              </Link>
              <Link href="/asmaul-husna" className="hover:text-primary transition-colors">
                99 Asmaul Husna
              </Link>
              <Link href="/zakat" className="hover:text-primary transition-colors">
                Kalkulator Zakat
              </Link>
              <Link href="/kalender-hijriah" className="hover:text-primary transition-colors">
                Kalender Hijriah
              </Link>
            </div>
          </div>

          {/* Reference Info */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Standar & Rujukan
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Perhitungan waktu sholat mengacu pada standar Kementerian Agama Republik Indonesia (Kemenag RI) dengan sudut Subuh -20° dan Isya -18°. Arah kiblat dihitung menggunakan formula trigonometri bola koordinat Ka&apos;bah Makkah Al-Mukarramah.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground text-center sm:text-left">
          <p>© {currentYear} Saku Muslim. Seluruh hak cipta dilindungi.</p>
          <p className="italic text-[11px]">
            &quot;Sesungguhnya sholat itu adalah fardhu yang ditentukan waktunya atas orang-orang yang beriman.&quot; (QS. An-Nisa: 103)
          </p>
        </div>
      </div>
    </footer>
  );
}
