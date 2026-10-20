# Design & UI/UX Specifications — TASK-002: Audit & Quality Polish
**Owner**: Angel (UI/UX)  
**Date**: 2026-10-20  
**Status**: Approved  

---

## 1. Design Token Standards & Brand Consistency
- **App Name Token**: `Saku Muslim` (Konsisten di Title bar, Header, Footer, Hero, dan Meta Tags).
- **Primary Color**: Emerald-600 (`#059669`) / Emerald-500 (`#10b981`).
- **Accent Color**: Amber-400 / Amber-500 (`#f59e0b`).
- **Dark Mode Background**: `#090d16` (Deep slate night) dengan surface card `bg-card`.

---

## 2. Component State & Interaction Specs

### 2.1 Modal Asmaul Husna (`names-view.tsx`)
- **Role**: `role="dialog"` & `aria-modal="true"`.
- **Keyboard Trap / Escape Handler**: Menekan tombol `Escape` pada keyboard otomatis menutup modal.
- **Focus Management**: Tombol tutup memiliki `aria-label="Tutup Dialog Detail Asmaul Husna"` dan focus-visible ring.

### 2.2 Amalan Harian Ramadhan (`ramadhan-worship-tracker.tsx`)
- **Visual Enhancement**: Render icon kontekstual (`item.icon(isChecked)`) yang sebelumnya tidak tampil di sisi kiri kartu amalan.
- **Microinteraction**: Icon dan judul mengalami transisi halus saat item dicentang (`line-through`, opacity, background highlight).

### 2.3 Kompas Kiblat (`qibla-compass.tsx`)
- **iOS Permission Prompt**: Tampilkan tombol "Aktifkan Sensor Gerak (iOS)" jika perangkat terdeteksi mendukung sensor namun belum diberikan izin.
- **Feedback Status**: Jika GPS gagal atau dinonaktifkan, tampilkan feedback inline yang elegan tanpa blocking window alert.

### 2.4 Audio Player Portal (`audio-player.tsx`)
- **Safe Seeking**: Range slider dinonaktifkan secara visual (`opacity-50 pointer-events-none`) selama metadata durasi belum terisi (`duration === 0`).
- **Unmount Gracefulness**: Transition fade-out tanpa letupan suara atau promise error.

### 2.5 Tab Panels & Navigation (`ramadhan-dua-suite.tsx`, `doa-view.tsx`, `zakat-view.tsx`)
- **ARIA Tabs**: Setiap tab list memiliki `role="tablist"`, tombol memiliki `role="tab"`, `aria-selected`, dan panel konten memiliki `role="tabpanel"`.
- **Touch Target**: Seluruh tombol interaktif memiliki touch target minimum 44x44px.
