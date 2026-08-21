import { createClient } from "@supabase/supabase-js";

// Isi 2 env var ini di .env.local (lihat .env.example)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Dipakai di client component & server component buat baca data publik (produk, dll)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Dipakai HANYA di server (API routes) buat operasi yang butuh akses penuh,
// misal update status order dari webhook Midtrans. JANGAN pernah import file
// ini di client component — service role key harus tetap rahasia di server.
export function supabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });
}
