# PRD — TASK-002: Comprehensive Code Audit, Bug Fixes, Code Smells & E2E Testing
**Owner**: Faisal (PM)  
**Date**: 2026-10-20  
**Status**: In Progress  

---

## 1. Background & Objectives
Proyek **Saku Muslim** telah mengimplementasikan serangkaian fitur utama (Jadwal Sholat, Al-Qur'an, Kiblat, Doa & Dzikir, 99 Asmaul Husna, Kalkulator Zakat, Kalender Hijriah, dan Ornamen Ramadhan). Audit menyeluruh diperlukan untuk mengidentifikasi:
1. Potensi Bug (Memory leaks, hydration mismatches, timezone inconsistency, NaN calculation errors).
2. Code Smells (Duplikasi key localStorage, dead code, inkonsistensi nama aplikasi, missing error boundaries).
3. Unused Imports (Redundant React imports pada React 19 JSX runtime).
4. Code Enhancements (Accessibility ARIA dialog, iOS compass sensor permission, input sanitization).
5. End-to-End (E2E) Verification (Automated browser testing untuk seluruh modul aplikasi).

---

## 2. User Stories & Acceptance Criteria

### US-1: Memory Leak & Audio Stability
- **Story**: Sebagai pengguna yang menggunakan tasbih digital dan memutar audio murottal/adzan, saya ingin aplikasi berjalan lancar tanpa penurunan performa atau audio crash.
- **AC-1.1**: AudioContext pada tasbih digital didaur ulang (singleton) atau ditutup dengan benar sehingga tidak mencapai limit browser audio hardware.
- **AC-1.2**: Komponen `AudioPlayer` membersihkan audio listener dan mem-pause audio saat di-unmount/ditutup.
- **AC-1.3**: Slider scrubbing tidak menghasilkan NaN atau crash saat metadata durasi masih memuat (`duration === 0`).

### US-2: Hydration & Timezone Data Integrity
- **Story**: Sebagai pengguna di Indonesia (WIB, WITA, WIT), saya ingin checklist sholat dan amalan harian tersimpan sinkron tanpa perbedaan tanggal antara tengah malam hingga fajar.
- **AC-2.1**: Key tracker sholat menggunakan waktu lokal yang seragam antara `home-hero.tsx` dan `prayer-view.tsx` (`getTodayTrackerKey`).
- **AC-2.2**: State yang membaca `localStorage` disinkronkan setelah mount untuk menghindari hydration mismatch error di React 19 / Next.js 16.
- **AC-2.3**: Countdown detik tidak memicu hydration warning antara SSR server time dan browser client time.

### US-3: Calculation Precision & Sanitization
- **Story**: Sebagai pembayar zakat dan pencari waktu ibadah, saya ingin perhitungan matematis tidak pernah menghasilkan `NaN` atau angka cacat saat input dikosongkan atau diisi acak.
- **AC-3.1**: `calculateZakatIncome`, `calculateZakatMaal`, dan `calculateZakatFitrah` memvalidasi `Number.isFinite` dan tidak mengembalikan `NaN`.
- **AC-3.2**: `calculatePrayerTimes` dan `getNextPrayer` memiliki safe fallback jika jadwal atau waktu berformat tak terduga.
- **AC-3.3**: `getHijriDate` memfilter karakter non-digit Unicode sebelum `parseInt` sehingga tahun hijriah selalu valid.

### US-4: Code Hygiene & Modern React 19 Cleanliness
- **Story**: Sebagai developer, saya ingin codebase bersih dari unused imports dan dead code.
- **AC-4.1**: Hapus seluruh unused default import `React` pada komponen React 19.
- **AC-4.2**: Bersihkan dead code (misal: icon yang didefinisikan namun tidak di-render di `ramadhan-worship-tracker.tsx`).
- **AC-4.3**: Konsistenkan branding app name menjadi "Saku Muslim".

### US-5: Accessibility & Device Compatibility
- **Story**: Sebagai pengguna ponsel pintar dan pembaca layar, saya ingin navigasi dan interaksi memenuhi kaidah a11y.
- **AC-5.1**: Modal Asmaul Husna memiliki `role="dialog"`, `aria-modal="true"`, dan tombol Escape keyboard handler.
- **AC-5.2**: Fitur kompas kiblat menyediakan tombol otorisasi sensor untuk iOS 13+ (`requestPermission`).
- **AC-5.3**: Seluruh clipboard API call dibungkus dengan `.catch()` graceful fallback.

### US-6: End-to-End Testing (Playwright)
- **Story**: Sebagai QA dan stakeholder, saya ingin semua flow aplikasi terverifikasi oleh rangkaian tes E2E otomatis.
- **AC-6.1**: Seluruh 7 rute utama (`/`, `/jadwal-sholat`, `/quran`, `/quran/[id]`, `/kiblat`, `/doa-dzikir`, `/asmaul-husna`, `/zakat`, `/kalender-hijriah`) diuji dan lulus (100% pass).
- **AC-6.2**: Test report tercatat dalam deliverable QA `04_qa_sandra.md`.
