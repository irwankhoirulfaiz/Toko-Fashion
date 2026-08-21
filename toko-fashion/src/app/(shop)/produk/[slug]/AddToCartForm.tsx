"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cart";
import { Product } from "@/types";

export default function AddToCartForm({ product }: { product: Product }) {
  const [ukuran, setUkuran] = useState(product.ukuran?.[0] ?? "");
  const [jumlah, setJumlah] = useState(1);
  const addItem = useCart((s) => s.addItem);
  const router = useRouter();

  function handleAdd() {
    addItem({
      productId: product.id,
      nama: product.nama,
      harga: product.harga,
      ukuran,
      jumlah,
      gambar_url: product.gambar_url,
    });
    router.push("/keranjang");
  }

  return (
    <div className="mt-6 space-y-4">
      {product.ukuran?.length > 0 && (
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Ukuran
          </label>
          <div className="flex gap-2">
            {product.ukuran.map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setUkuran(u)}
                className={`rounded-md border px-3 py-1.5 text-sm ${
                  ukuran === u
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-300 text-stone-700 hover:border-stone-500"
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium text-stone-700">
          Jumlah
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setJumlah((j) => Math.max(1, j - 1))}
            className="h-8 w-8 rounded-md border border-stone-300 text-stone-600"
          >
            −
          </button>
          <span className="w-6 text-center">{jumlah}</span>
          <button
            type="button"
            onClick={() => setJumlah((j) => j + 1)}
            className="h-8 w-8 rounded-md border border-stone-300 text-stone-600"
          >
            +
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="w-full rounded-md bg-stone-900 py-3 text-sm font-medium text-white hover:bg-stone-800"
      >
        Tambah ke Keranjang
      </button>
    </div>
  );
}
