-- Jalankan ini di Supabase Dashboard -> SQL Editor -> New query -> Run

create extension if not exists "uuid-ossp";

create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  nama text not null,
  deskripsi text,
  harga integer not null,
  stok integer not null default 0,
  gambar_url text,
  kategori text,
  ukuran text[] default '{}',
  created_at timestamptz default now()
);

create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  order_id text unique not null,
  items jsonb not null,
  total integer not null,
  status text not null default 'pending',
  nama_penerima text not null,
  alamat text not null,
  telepon text not null,
  created_at timestamptz default now()
);

-- Row Level Security: produk boleh dibaca publik, tapi cuma bisa
-- ditulis/diubah lewat request yang login (dipakai admin panel).
-- Order cuma bisa dibaca/ditulis dari server (service role key),
-- BUKAN dari browser client — makanya operasi order selalu lewat
-- API route (/api/checkout, /api/midtrans-webhook), bukan supabase.ts biasa.

alter table products enable row level security;
alter table orders enable row level security;

create policy "Produk bisa dibaca siapa saja"
  on products for select
  using (true);

create policy "Produk cuma bisa diubah user yang login"
  on products for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Tidak ada policy select/insert untuk 'orders' secara sengaja —
-- semua akses order HARUS lewat service role key di server (lihat lib/supabase.ts).
