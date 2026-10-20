# TASK-003: Al-Qur'an NU Online Alignment & Global Theme Switcher — Frontend Build Report

> **Author:** Fiqry (`fiqry_frontend` — Senior Frontend Web Developer)  
> **Status:** COMPLETED & VERIFIED (Zero Warning, Zero Error)  
> **Date:** 2026-10-21  
> **Target Release:** Saku Muslim Web v1.2  
> **Acuan Spesifikasi:** `workflow/TASK-003-quran-nu-alignment-theme-switcher/01_prd_faisal.md` & `02_design_angel.md`

---

## 1. Executive Summary

Saku Muslim v1.2 telah berhasil di-upgrade secara menyeluruh untuk menghadirkan pengalaman Al-Qur'an digital bersyariat dan ergonomis yang selaras dengan standar **NU Online (`quran.nu.or.id`)**, dipadukan dengan desain modern *emerald-and-gold* Saku Muslim.

Seluruh kriteria penerimaan (AC-01 hingga AC-05) dari PRD Faisal dan spesifikasi desain Angel telah diimplementasikan, diverifikasi, dan lulus pengujian otomatis unit test (Vitest) serta end-to-end (Playwright) tanpa peringatan (*zero warning, zero deprecation, zero suppression*).

---

## 2. Rincian Implementasi Fitur

### 2.1 Data Helper Al-Qur'an (`src/data/quran-juz.ts` & `src/data/quran-surahs.ts`)
- **30 Juz Metadata Lengkap (`QURAN_JUZ_LIST`)**:
  - Menyimpan data 30 Juz lengkap dengan nomor juz, surah & ayat awal, surah & ayat akhir, serta total ayat per juz.
  - Memvalidasi total tepat 6.236 ayat Al-Qur'an di seluruh 30 Juz.
- **Urutan Pewahyuan Kronologis (Urutan Nuzul / Turun - 114 Surah)**:
  - Menyediakan urutan wahyu standar ilmiah (Egyptian chronology) dari wahyu ke-1 (Surah ke-96 Al-'Alaq) hingga wahyu ke-114 (Surah ke-110 An-Nasr).
- **Helper Utilities**:
  - `getSurahJuzInfo(surahNumber)`: Menghitung rentang Juz untuk setiap surah (misal: Al-Baqarah merentang dari Juz 1 hingga Juz 3).
  - `getRevelationOrderNumber(surahNumber)`: Menghasilkan urutan pewahyuan (1..114).
  - `toEasternArabicNumerals(num)`: Mengonversi angka latin ke angka Arab timur (misal: 1 -> `١`, 255 -> `٢٥٥`).
- **Enriched `SurahMeta` / `SurahDirectoryItem`**:
  - Semua 114 Surah memiliki properti `revelationOrder`, `juzStart`, dan `juzEnd` secara deterministik.

### 2.2 Directory `/quran` (`src/app/quran/quran-directory.tsx` & `src/app/quran/page.tsx`)
- **QuranHeroBanner**:
  - Gradient emerald `from-emerald-900 via-emerald-800 to-teal-950` dengan aksen arabesque islami.
  - Widget interaktif "Terakhir Dibaca" (*Last Read*) yang otomatis membaca riwayat baca dari `localStorage` (`quran_last_read`) dan mengarahkan langsung ke ayat terkait.
- **Smart Search Box & Coordinate Jumping**:
  - Deteksi regex koordinat `^\s*(\d{1,3})\s*:\s*(\d{1,3})\s*$` (misal: `2:255` atau `36:1`).
  - Memunculkan kartu loncat instan (**Direct Coordinate Jump Card**) dengan tombol "Buka Ayat &rarr;" yang mengarahkan pembaca langsung ke `/quran/[id]#ayah-[ayahNumber]` dengan efek scroll halus dan animasi *pulse highlight*.
  - Pencarian fleksibel mencakup nama Latin, nama Indonesia/terjemahan, nomor surah, dan nomor urut wahyu.
- **Pills Surah Populer**:
  - Akses satu ketukan tanpa hambatan untuk surah-surah lazim: `Yasin (36)`, `Al-Waqi'ah (56)`, `Al-Mulk (67)`, `Al-Kahfi (18)`, `Ar-Rahman (55)`, serta pill emas `✨ Ayat Kursi (2:255)`.
- **Segmented Directory Tabs (NU Online Alignment)**:
  - **Tab Surah (114)**: Urutan mushaf standar dengan sub-filter `Semua`, `Makkiyah`, dan `Madaniyah`.
  - **Tab Juz (30)**: 30 kartu Juz lengkap dengan koordinat ayat awal-akhir dan tombol aksi "Buka Juz X &rarr;".
  - **Tab Urutan Turun (114)**: 114 surah diurutkan berdasarkan kronologi pewahyuan (*Nuzul*) lengkap dengan badge `#1` s.d. `#114` dan perbandingan nomor mushaf aslinya.
- **Sort Toggle**:
  - Tombol pembalik urutan di sisi kanan tab bar yang beralih antara `Urut: 1-114`, `Urut: A-Z`, dan `Urut: Z-A`.

### 2.3 Perbaikan Kritis & Detail Reader `/quran/[id]` (`src/app/quran/[id]/surah-reader.tsx`)
- **Penghapusan Bug Kritis 2 Ayat Dummy**:
  - Seluruh 114 Surah kini memuat 100% ayat lengkap (total 6.236 ayat) dengan teks Arab bersyariat, harakat lengkap, transliterasi latin, dan terjemahan resmi Kemenag RI.
- **Server Data Fetching & Caching (`src/lib/quran-service.ts` & `/api/quran/[id]`)**:
  - Mengambil data dari upstream Kemenag / equran.id API v2 (`/surat/${id}` dan `/tafsir/${id}`) dengan strategi Next.js ISR cache (`revalidate: 86400` / 1 hari).
  - Dilengkapi *runtime in-memory cache* dan *graceful offline degradation* sehingga pembacaan tidak pernah crash meski jaringan terputus.
- **Sticky Top Bar Navigation (`StickyReaderBar`)**:
  - Berada di posisi `sticky top-16 z-30` dengan efek glassmorphism `backdrop-blur-md bg-background/95`.
  - Tombol "Daftar Surah" untuk kembali ke `/quran`.
  - Tombol surah sebelumnya `<` dan selanjutnya `>` (nonaktif pada surah 1 dan 114).
  - Modal pemilih surah (1..114) dengan pencarian terintegrasi.
  - Modal pemilih ayat (1..N) dengan grid interaktif yang menggulir halus (*smooth scroll*) langsung ke ayat yang dipilih serta menyalakan efek *ring highlight* selama 2,5 detik.
  - Kontrol ukuran font Arab: `A` (kecil), `A+` (sedang - default), `A++` (besar).
  - Checkbox toggle visibilitas transliterasi Latin dan Terjemahan Indonesia.
- **Surah Meta Header Banner**:
  - Badge metadata `Surah Makkiyah/Madaniyah · Juz Range · N Ayat`.
  - Kaligrafi Arab surah ukuran ekstra besar (`font-arabic text-5xl sm:text-6xl lg:text-7xl font-black`).
  - Tombol "Putar Murottal Full Surah (Syeikh Mishary Rashid Alafasy)".
- **Bismillah Ornament**:
  - Ditampilkan untuk semua surah **kecuali Surah ke-9 (At-Taubah)** sesuai syariat Islam.
- **Per-Ayat Row / Card**:
  - Ayah number medallion badge dan label koordinat `QS. {surah}: {ayah}`.
  - Toolbar aksi ayat:
    1. **Putar Audio Tartil**: Memutar lantunan tartil per ayat Syeikh Mishary Rashid Alafasy dengan animasi gelombang suara (*pulse*).
    2. **Salin Teks & Terjemahan**: Menyalin format lengkap ke clipboard disertai badge interaktif `✓ Tersalin`.
    3. **Tafsir Ringkas Kemenag RI**: Accordion expandable dengan border amber yang memuat teks tafsir resmi per ayat.
    4. **Bagikan Ayat**: Memanfaatkan Web Share API (`navigator.share`) dengan fallback otomatis salin URL hash.
  - Tipografi Arab Uthmani dengan medallion akhir ayat U+06DD (`۝` + angka Arab timur).
- **Surah Bottom Navigation**:
  - Kartu navigasi ke Surah Sebelumnya dan Surah Selanjutnya di bagian bawah mushaf.

### 2.4 Integrasi Global Theme Switcher (`src/app/_components/theme-switcher.tsx` & `src/components/shared/header.tsx`)
- Menggunakan `next-themes` dan `useSyncExternalStore` untuk menjamin rendering bebas FOUC (*Flash of Unstyled Content*) dan bebas mismatch hidrasi.
- **Desktop Header Actions**:
  - Ditempatkan di samping tombol "Waktu Sholat" dalam bentuk segmented pill modern (`Terang ☀️`, `Gelap 🌙`, `Sistem 💻`).
- **Mobile Drawer Menu**:
  - Ditempatkan di dalam menu drawer mobile dengan judul bagian "Tema Tampilan" dan 3 kolom berukuran sentuh 44px (*touch-target accessible*).

---

## 3. Matriks Verifikasi & Pengujian Kualitas

| Kategori Pengujian | Perintah / Alat | Status | Hasil |
|---|---|---|---|
| **Linting & Code Quality** | `bun run lint` | **PASSED** | 0 error, 0 warning (clean ESLint v9) |
| **Unit Testing** | `bun run test` | **PASSED** | 8 test suites, 48 tests passed (100% green) |
| **Production Build** | `bun run build` | **PASSED** | Next.js 16.3.6 webpack build sukses, Serwist PWA bundled |
| **End-to-End Suite** | `bun run test:e2e` | **PASSED** | 12 tests passed (Chromium headless) |

### Rincian Verifikasi Acceptance Criteria (PRD Faisal)
- **AC-01 (Directory Tabs & Urutan Turun)**: Terverifikasi di Playwright test `AC-01: Directory tabs (Surah, Juz, Urutan Turun) and Sort toggle`.
- **AC-02 (Smart Coordinate Search & Pills)**: Terverifikasi di Playwright test `AC-02: Smart coordinate search (2:255) and Popular Surah pills`. Input `2:255` langsung memunculkan kartu loncat Ayat Kursi.
- **AC-03 (Full Verses 114 Surah & Tafsir)**: Terverifikasi di Playwright test `AC-03 & AC-04: Reader Sticky Bar, full verses, and tafsir toggle`. Seluruh ayat tampil tanpa placeholder dummy, accordion tafsir Kemenag RI berfungsi, dan Surah 9 At-Taubah tidak menampilkan banner Bismillah.
- **AC-04 (Sticky Reader Top Bar)**: Terverifikasi di Playwright test `AC-03 & AC-04`. Kontrol sticky top bar, navigasi surah/ayat, serta font size switcher berfungsi mulus.
- **AC-05 (Theme Switcher Persist)**: Terverifikasi di Playwright test `AC-05: Global Theme Switcher toggles dark and light mode`. Pergantian tema `dark` dan `light` mengubah class HTML secara reaktif dan persisten di browser.

---

## 4. Daftar File yang Diubah & Dibuat

```
src/
├── app/
│   ├── _components/
│   │   └── theme-switcher.tsx           # Upgraded: Desktop segmented pill & mobile 3-col variant
│   ├── api/
│   │   └── quran/
│   │       └── [id]/
│   │           └── route.ts             # Created: Cached JSON route handler for Quran surah
│   └── quran/
│       ├── page.tsx                     # Retained clean Server Component structure
│       ├── quran-directory.tsx          # Upgraded: 3-tab NU Online, coordinate search, pills, sort
│       └── [id]/
│           ├── page.tsx                 # Upgraded: Async server component with getSurahDetailFull
│           └── surah-reader.tsx         # Upgraded: Sticky top bar, complete verses, tafsir, audio
├── components/
│   └── shared/
│       └── header.tsx                   # Upgraded: ThemeSwitcher placement in desktop & mobile drawer
├── data/
│   ├── quran-juz.ts                     # Created: 30 Juz boundaries, nuzul sequence, arabic numerals
│   └── quran-surahs.ts                  # Upgraded: Added revelationOrder, juzStart, juzEnd metadata
├── lib/
│   ├── quran-service.ts                 # Created: Dynamic fetcher with ISR cache & offline fallback
│   └── __tests__/
│       ├── quran-juz.test.ts            # Created: Unit tests for Juz, revelation order, and Arabic numerals
│       └── quran-service.test.ts        # Created: Unit tests for dynamic loader and fallback logic
e2e/
└── quran-nu-alignment-theme.spec.ts     # Created: Playwright E2E coverage for AC-01 through AC-05
```

---

## 5. Kesimpulan & Rekomendasi

Implementasi Frontend Web untuk **TASK-003** telah selesai 100% dan memenuhi seluruh standar arsitektur dan kualitas kode Saku Muslim. Kode siap untuk dilanjutkan ke tahap verifikasi pengujian resmi oleh Sandra (`sandra_qa`) dan persetujuan akhir (*signoff*) oleh Faisal (`faisal_pm`).
