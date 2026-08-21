import Link from "next/link";
import { Product } from "@/types";

function formatRupiah(angka: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka);
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/produk/${product.slug}`}
      className="group block"
    >
      <div className="aspect-[3/4] w-full overflow-hidden rounded-xl bg-stone-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.gambar_url}
          alt={product.nama}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="mt-3 space-y-0.5">
        <h3 className="text-sm font-medium text-stone-900">{product.nama}</h3>
        <p className="text-sm text-stone-500">{formatRupiah(product.harga)}</p>
      </div>
    </Link>
  );
}
