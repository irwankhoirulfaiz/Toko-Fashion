# 🛍️ Toko Fashion — Starter Next.js + Supabase + Midtrans

Starter toko online: listing produk, keranjang, checkout dengan Midtrans Snap, dan admin panel buat kelola produk & pantau pesanan.

## Struktur

```
src/
├── app/
│   ├── (shop)/              → halaman publik: home, produk/[slug], keranjang, checkout
│   ├── admin/                → login, dashboard pesanan, kelola produk
│   └── api/
│       ├── checkout/         → bikin order + minta Snap token ke Midtrans
│       └── midtrans-webhook/ → nerima notifikasi status pembayaran otomatis
├── components/                → Navbar, ProductCard
├── lib/supabase.ts            → Supabase client (browser & admin/server)
├── store/cart.ts              → state keranjang (Zustand + localStorage)
└── types/                     → tipe Product, Order, CartItem
supabase-schema.sql             → jalankan di Supabase buat bikin tabel
```

## 1) Setup Supabase (database + auth admin)

1. Bikin project baru di [supabase.com](https://supabase.com).
2. Buka **SQL Editor** → paste isi file `supabase-schema.sql` di repo ini → **Run**. Ini bikin tabel `products` & `orders`.
3. Buka **Authentication → Users → Add user** → buat 1 akun email/password buat login admin.
4. Buka **Project Settings → API**, copy `Project URL`, `anon public key`, dan `service_role key`.

## 2) Setup Midtrans (payment gateway)

1. Daftar di [midtrans.com](https://midtrans.com), aktifkan mode **Sandbox** dulu buat testing (gratis, gak perlu approval merchant).
2. Buka **Settings → Access Keys**, copy `Client Key` & `Server Key`.
3. Nanti kalau sudah siap terima pembayaran asli: ganti ke Production Key + ubah `isProduction: true` di `src/app/api/checkout/route.ts`, dan ganti URL `snap.js` di `layout.tsx` dari `sandbox` ke `app.midtrans.com`.
4. Setelah deploy (langkah 4), daftarkan **Payment Notification URL**: `https://domainmu.com/api/midtrans-webhook` di Settings → Configuration. Ini penting — tanpa ini status "sudah bayar" gak akan pernah otomatis ke-update.

## 3) Jalankan di lokal

```bash
npm install
cp .env.example .env.local   # isi semua value-nya sesuai punya kamu
npm run dev
```

Buka `http://localhost:3000` buat toko, dan `http://localhost:3000/admin/login` buat masuk admin panel.

## 4) Deploy ke Vercel

1. Push project ini ke GitHub.
2. Buka [vercel.com](https://vercel.com) → **New Project** → import repo GitHub kamu.
3. Sebelum deploy, buka tab **Environment Variables** → isi semua variable yang ada di `.env.example`.
4. Deploy. Setelah dapat domain, daftarkan URL webhook Midtrans (lihat langkah 2.4 di atas).

## Yang masih perlu kamu lengkapi

- [ ] Upload gambar produk: sementara pakai URL gambar manual (kolom `gambar_url`). Kalau mau upload langsung dari admin panel, tambahin **Supabase Storage** (gampang, tinggal tambah 1 bucket + sedikit kode upload).
- [ ] Halaman admin belum di-lock oleh middleware — saat ini siapa saja yang tau URL `/admin/dashboard` bisa buka meskipun belum login (form login ada, tapi belum ada pengecekan sesi). Perlu ditambahin `middleware.ts` yang cek sesi Supabase Auth sebelum kasih akses ke `/admin/*`.
- [ ] Halaman edit produk (saat ini baru bisa tambah & hapus, belum edit).
- [ ] Ongkos kirim & integrasi kurir (RajaOngkir dll) — belum ada, checkout saat ini cuma total harga produk.
- [ ] Notifikasi WhatsApp/email otomatis ke customer & admin saat ada order baru.

## Tech Stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS**
- **Supabase** — Postgres database + Auth
- **Midtrans Snap** — payment gateway
- **Zustand** — state management keranjang
