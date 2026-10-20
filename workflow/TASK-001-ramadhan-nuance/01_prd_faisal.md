# PRD: Nuansa Visual & Fitur Khusus Ramadhan (TASK-001-ramadhan-nuance)

**Author:** Faisal (Product Manager & Business Analyst)  
**Status:** Approved / Frozen  
**Target Delivery:** Tim FE (Angel, Fiqry, Sandra)  

---

## 1. Executive Summary & Problem Statement

### Problem Statement
Aplikasi Saku Muslim saat ini memiliki fungsionalitas dasar jadwal sholat dan Al-Qur'an, namun tampilannya terasa terlalu korporat/generik dan belum merefleksikan kekhusyukan, kemeriahan, dan kekhidmatan bulan suci Ramadhan. Pengguna muslim membutuhkan akses instan ke penanda waktu kritis khas Ramadhan (Imsak untuk sahur dan Maghrib untuk buka puasa), doa harian Ramadhan (niat & berbuka dengan audio), serta pelacak amalan ibadah harian (sholat fardhu, tarawih, tadarus, sedekah).

### Product Goals
1. Menghadirkan atmosfer visual Ramadhan yang imersif, hangat, dan bernilai seni tinggi (Warm Gold, Emerald Glow, ornamen Fanous/Lentera & Hilal) tanpa slop dan tanpa memperlambat loading.
2. Menyediakan widget terpadu **Dual Countdown Waktu Kritis**: hitung mundur presisi menuju Imsak (penutupan sahur) dan Maghrib (Buka Puasa).
3. Menyediakan **Interactive Ramadhan Du'a Suite**: Niat Puasa & Doa Buka Puasa dengan lafadz Arab, transliterasi Latin, arti bahasa Indonesia, dan audio tartil.
4. Memperkaya **Ramadhan Daily Worship Checklist**: pelacak puasa harian, sholat tarawih & witir, target tadarus Al-Qur'an, dan sedekah subuh yang tersimpan secara lokal dan persisten.
5. Memastikan kepatuhan ketat terhadap antislop, ponytail (YAGNI), WCAG AA contrast, dan zero warning build.

---

## 2. Boundaries

### In Scope
- **Thematic Hero Overhaul**: Background gradient Emerald-Teal dengan aksen Warm Gold & Amber, aksen SVG lentera gantung (fanous), bulan sabit (hilal), dan kaligrafi/badge "Marhaban Ya Ramadhan 1448 H".
- **Dual Critical Countdown**: Komponen hitung mundur aktif menuju waktu Imsak (batas sahur) dan waktu Maghrib (buka puasa) tersinkronisasi otomatis dengan hisab kota pengguna.
- **Ramadhan Du'a Suite**: Tab/Modal interaktif berisi Doa Niat Puasa Ramadhan dan Doa Berbuka Puasa dengan pemutar audio recitation.
- **Daily Worship Tracker (Ramadhan Edition)**: Checklist interaktif Puasa, Tarawih/Witir, Tadarus Al-Qur'an, dan Sedekah Subuh tersimpan di `localStorage` harian.
- **Header & Ambient Touch**: Badge aksen Ramadhan Kareem halus dan ornamen lentera pada navigation header.

### Out of Scope (Ponytail / YAGNI)
- Fitur gamifikasi kompleks (leaderboard, XP point, badge social).
- Audio background autoplay tanpa interaksi pengguna.
- Integrasi push notification native server yang memerlukan backend push server.

---

## 3. Acceptance Criteria (BDD / Gherkin Matrix)

### AC-01: Ramadhan Thematic Hero & Ambient Accent
```gherkin
Scenario: Pengguna membuka halaman beranda
  Given pengguna mengakses halaman utama "/"
  Then hero section menampilkan ornamen Ramadhan (Fanous / Lentera gantung SVG dan Hilal)
  And terdapat badge tematik "Marhaban Ya Ramadhan 1448 H"
  And palet warna menggunakan harmoni Emerald (#059669 / #064e3b) dan Warm Amber/Gold (#d97706 / #f59e0b)
  And header menampilkan aksen lentera Ramadhan yang konsisten
```

### AC-02: Dual Countdown Waktu Kritis Imsak & Maghrib (Buka Puasa)
```gherkin
Scenario: Menampilkan countdown waktu Imsak dan Buka Puasa
  Given pengguna memilih kota di hero section
  When sistem memproses kalkulasi waktu hisab hari ini
  Then tampil kartu ringkasan Imsak (Sahur) dan Maghrib (Buka Puasa)
  And terdapat indikator countdown aktif (jam dan menit tersisa) menuju waktu Imsak atau Buka Puasa terdekat
  And waktu Imsak dihitung tepat 10 menit sebelum waktu Subuh
```

### AC-03: Interactive Ramadhan Du'a Suite
```gherkin
Scenario: Membaca dan mendengarkan Doa Niat Puasa dan Doa Buka Puasa
  Given pengguna berada di section Doa Ramadhan
  When pengguna memilih tab "Niat Puasa" atau "Doa Buka Puasa"
  Then sistem menampilkan teks Arab dengan harakat lengkap dan font arab proporsional
  And sistem menampilkan transliterasi Latin serta terjemahan bahasa Indonesia
  When pengguna menekan tombol "Dengarkan Doa"
  Then audio recitation diputar melalui komponen AudioPlayer tanpa memutus alur browsing
```

### AC-04: Ramadhan Daily Worship Checklist
```gherkin
Scenario: Menandai amalan harian Ramadhan
  Given checklist amalan Ramadhan menampilkan 4 item: Puasa Hari Ini, Sholat Tarawih & Witir, Tadarus Al-Qur'an (1 Juz), Sedekah Subuh
  When pengguna mencentang salah satu amalan
  Then checkbox berubah status menjadi selesai dengan feedback visual aksen emas/hijau
  And progres total terupdate secara realtime (misal: "3/4 Selesai")
  And state tersimpan di localStorage dengan key tanggal hari ini agar tidak hilang saat reload
```

### AC-05: Accessibility, Contrast & Theme Adaptability
```gherkin
Scenario: Pengguna berpindah antara Dark Mode dan Light Mode
  Given pengguna menggunakan tema Light atau Dark
  Then seluruh elemen teks ornamen Ramadhan memiliki rasio kontras minimal 4.5:1 (WCAG AA)
  And semua elemen interaktif memiliki touch target minimal 44x44px
  And tidak ada layout shift (CLS < 0.1) saat font Arab atau data sholat dimuat
```

### AC-06: Strict Zero Warning Build
```gherkin
Scenario: Verifikasi kualitas kode produksi
  Given seluruh perubahan kode selesai diimplementasikan
  When perintah "bun run lint" dan "bun run build" dijalankan
  Then tidak ada error TypeScript maupun warning ESLint
  And tidak ada penggunaan //@ts-ignore atau suppress warning apapun
```

---

## 4. Contract Freeze & Integration Specs

1. **Jadwal Hisab**: Menggunakan `calculatePrayerTimes(date, lat, lng, timezone)` dari `@/lib/prayer-calculator.ts` yang sudah menghasilkan `imsak`, `fajr`, `maghrib`, dll.
2. **Audio Endpoints**: Recitation audio menggunakan URL CDN publik terverifikasi yang kompatibel dengan `<AudioPlayer />`.
3. **Storage Format**:
   - `ramadhan_tracker_YYYY-MM-DD`: `{ fasting: boolean, tarawih: boolean, tadarus: boolean, sedekah: boolean }`.

---

## 5. Execution Handoff
- **Angel (`angel_uiux`)**: Desain token Tailwind v4, spesifikasi visual SVG Fanous/Hilal, palet warna, dan hierarki komponen di `02_design_angel.md`.
- **Fiqry (`fiqry_frontend`)**: Implementasi komponen React/Next.js di `03_build_frontend.md`.
- **Sandra (`sandra_qa`)**: Uji fungsional, responsivitas, dan quality gate di `04_qa_sandra.md`.
