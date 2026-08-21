import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import AddToCartForm from "./AddToCartForm";

async function getProduct(slug: string) {
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();
  return data;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="aspect-[3/4] overflow-hidden rounded-xl bg-stone-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.gambar_url}
            alt={product.nama}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">
            {product.nama}
          </h1>
          <p className="mt-2 text-xl text-stone-700">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
            }).format(product.harga)}
          </p>
          <p className="mt-4 text-stone-600 leading-relaxed">
            {product.deskripsi}
          </p>

          <AddToCartForm product={product} />
        </div>
      </div>
    </main>
  );
}
