# Frontend Implementation Deliverable: Nuansa & Fitur Spesial Ramadhan (TASK-001)

**Developer:** Fiqry (`fiqry_frontend` — Senior Frontend Web Developer)  
**Status:** Completed & Build Verified  
**Target:** Sandra (`sandra_qa`) & Faisal (`faisal_pm`)  

---

## 1. Executive Summary & Deliverables

Sesuai spesifikasi PRD Faisal (`01_prd_faisal.md`) dan Desain Angel (`02_design_angel.md`), fitur nuansa dan peribadatan Ramadhan 1448 H telah diimplementasikan secara komprehensif, modular, antislop, dan berkinerja tinggi pada stack Next.js 16 (App Router), React 19, Tailwind CSS v4, dan TypeScript Strict Mode.

### File Manifest:
1. **`src/components/shared/ramadhan-ornaments.tsx`** (BARU):
   - `FanousIcon`: Lentera gantung murni SVG dengan kubah, kaca, dan api lilin amber menyala.
   - `HilalStarIcon`: Bulan sabit emas dan bintang 8 penjuru.
   - `ArabesquePattern`: Pola geometris islami transparan sebagai background watermark.
   - `RamadhanBadge`: Pill badge tematik Ramadhan.
2. **`src/app/_components/ramadhan-dua-suite.tsx`** (BARU):
   - Tab switcher interaktif: **Niat Puasa Ramadhan** & **Doa Berbuka Puasa (Shahih)**.
   - Teks Arab berharakat tajam font Amiri, transliterasi Latin, arti bahasa Indonesia, dalil/referensi hadits shahih, tombol pemutar audio recitation (`<AudioPlayer />`), dan tombol salin teks dengan feedback visual.
3. **`src/app/_components/ramadhan-worship-tracker.tsx`** (BARU):
   - Mutaba'ah yaumiyah 4 amalan: Puasa Ramadhan, Sholat Tarawih & Witir, Tadarus Al-Qur'an 1 Juz, dan Sedekah Subuh / Infaq.
   - Meteran progres interaktif (0% s/d 100%) dengan ucapan selamat saat seluruh amalan tuntas (4/4).
   - Persistensi client-side `localStorage` harian (`ramadhan_tracker_YYYY-MM-DD`).
4. **`src/components/shared/header.tsx`** (DIPERBARUI):
   - Menambahkan badge aksen `Ramadhan Kareem 1448 H` berornamen Fanous lentera berkedip halus pada navigation bar desktop dan drawer mobile.
5. **`src/app/_components/home-hero.tsx`** (DIPERBARUI SECARA IMERSIF):
   - Thematic Hero Card bernuansa Nocturnal Emerald + Warm Gold dengan ornamen lentera gantung beranimasi `animate-subtle-float`.
   - **Dual Critical Countdown Spotlight**: Modul berdampingan Imsak (batas sahur) dan Maghrib (buka puasa) dengan countdown presisi detik real-time, mendeteksi secara otomatis target terdekat (menuju Maghrib saat berpuasa, atau menuju Imsak saat malam hari/sahur).
   - Integrasi `RamadhanDuaSuite` dan `RamadhanWorshipTracker` tepat di bawah menu utama ibadah.
   - 100% mempertahankan seluruh fitur eksisting (jadwal 5 waktu sholat hisab, 7 menu ibadah, ayat hari ini, pelacak sholat fardhu, pemutar audio adzan/ayat).
6. **`src/app/globals.css`** (DIPERBARUI):
   - Token tema Ramadhan Tailwind CSS v4 inline (`--color-ramadhan-*`, glow shadows, dan keyframe animasi `subtle-float` & `pulse-glow`).

---

## 2. Technical Validation & Quality Metrics

1. **Linting Check (`bun run lint`)**:
   - Status: **PASSED (0 errors, 0 warnings)**.
   - Tidak ada suppress warning (`@ts-ignore`, `eslint-disable`).
2. **Production Build (`bun run build`)**:
   - Status: **PASSED (Exit code 0)**.
   - Service worker Serwist dibundel dengan sukses.
   - TypeScript compilation selesai tanpa error.
   - Seluruh 14/14 static & dynamic route generated cleanly.
3. **Performance & Accessibility**:
   - Pure inline SVG, zero external bitmap images (CLS = 0).
   - Touch targets >= 44x44px.
   - Kontras warna teks memenuhi WCAG AA / AAA.

Siap diserahkan kepada Sandra (`sandra_qa`) untuk pengujian QA dan validasi Acceptance Criteria.
