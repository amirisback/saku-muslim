"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { FanousIcon } from "@/components/shared/ramadhan-ornaments";
import { getRamadhanState } from "@/lib/ramadhan";
import { ThemeSwitcher } from "@/app/_components/theme-switcher";

export interface HeaderProps {
  appName?: string;
  isRamadhan?: boolean;
}

function HeaderContent({
  appName,
  isRamadhan,
}: {
  appName: string;
  isRamadhan: boolean;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/jadwal-sholat", label: "Jadwal Sholat" },
    { href: "/quran", label: "Al-Qur'an" },
    { href: "/kiblat", label: "Arah Kiblat" },
    { href: "/doa-dzikir", label: "Doa & Dzikir" },
    { href: "/asmaul-husna", label: "Asmaul Husna" },
    { href: "/zakat", label: "Zakat" },
    { href: "/kalender-hijriah", label: "Kalender" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Theme Accent */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-sm transition-transform group-hover:scale-105">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Crescent Moon & Star */}
                <path d="M12 3a6 6 0 0 0 9 9 9 0 1 1-9-9Z" />
                <path d="M19 3v4" />
                <path d="M21 5h-4" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-lg leading-tight text-foreground">
                {appName}
              </span>
              <span className="text-[10px] font-medium tracking-wide text-emerald-600 dark:text-emerald-400 uppercase">
                Islamic Companion
              </span>
            </div>
          </Link>

          {/* Ramadhan Header Accent (Visible ONLY when isRamadhan is true) */}
          {isRamadhan && (
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-500/30 shadow-xs">
              <FanousIcon className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>Ramadhan 1448 H</span>
            </div>
          )}
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname
              ? link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href)
              : false;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-secondary text-secondary-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Button & Mobile Burger */}
        <div className="flex items-center gap-2">
          {/* Global Theme Switcher */}
          <div className="hidden sm:flex items-center">
            <ThemeSwitcher variant="desktop" />
          </div>

          <Link
            href="/jadwal-sholat"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Waktu Sholat
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground hover:bg-muted focus:outline-none"
            aria-label="Buka Menu"
          >
            {mobileMenuOpen ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border bg-card/95 backdrop-blur-md px-4 py-4 animate-in slide-in-from-top-2">
          {/* Mobile Ramadhan Header Banner (Visible ONLY when isRamadhan is true) */}
          {isRamadhan && (
            <div className="flex items-center justify-between mb-3 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-transparent border border-amber-500/20">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 dark:text-amber-300">
                <FanousIcon className="w-4 h-4 text-amber-500 animate-pulse" />
                <span>Marhaban Ya Ramadhan 1448 H</span>
              </div>
              <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                Bulan Berkah
              </span>
            </div>
          )}

          <nav className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const isActive = pathname
                ? link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href)
                : false;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-secondary text-secondary-foreground font-semibold"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Theme Switcher */}
          <div className="pt-3 border-t border-border mt-3">
            <ThemeSwitcher variant="mobile" />
          </div>
        </div>
      )}
    </header>
  );
}

function HeaderWithSearchParams({
  appName,
  isRamadhanProp,
}: {
  appName: string;
  isRamadhanProp?: boolean;
}) {
  const searchParams = useSearchParams();
  const forcedQuery = searchParams?.get("ramadhan") ?? null;
  const ramadhanState = getRamadhanState({ forcedQueryValue: forcedQuery });
  const activeRamadhan = isRamadhanProp !== undefined ? isRamadhanProp : ramadhanState.isRamadhan;

  return <HeaderContent appName={appName} isRamadhan={activeRamadhan} />;
}

export function Header({ appName = "Saku Muslim", isRamadhan }: HeaderProps) {
  const defaultState = getRamadhanState();
  const initialIsRamadhan = isRamadhan !== undefined ? isRamadhan : defaultState.isRamadhan;

  return (
    <Suspense fallback={<HeaderContent appName={appName} isRamadhan={initialIsRamadhan} />}>
      <HeaderWithSearchParams appName={appName} isRamadhanProp={isRamadhan} />
    </Suspense>
  );
}
