import { supabase } from "@/lib/supabase";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";

// Server component: fetch langsung dari Supabase tiap request.
// Ganti { cache: "no-store" } / revalidate sesuai kebutuhan nanti.
async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal ambil produk:", error.message);
    return [];
  }
  return data ?? [];
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
          Koleksi Terbaru
        </h1>
        <p className="mt-2 text-stone-500">
          Produk fashion pilihan, dikurasi tiap minggu.
        </p>
      </section>

      {products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 p-12 text-center text-stone-500">
          Belum ada produk. Tambahkan lewat halaman admin.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
