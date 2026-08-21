"use client";

import Link from "next/link";
import { useCart } from "@/store/cart";

function formatRupiah(angka: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka);
}

export default function CartPage() {
  const { items, removeItem, updateJumlah, total } = useCart();

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-stone-500">Keranjang kamu masih kosong.</p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm font-medium text-stone-900 underline"
        >
          Lihat koleksi
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-stone-900">Keranjang</h1>

      <div className="divide-y divide-stone-200">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.ukuran}`}
            className="flex items-center gap-4 py-4"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.gambar_url}
              alt={item.nama}
              className="h-20 w-16 rounded-md object-cover"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-stone-900">{item.nama}</p>
              <p className="text-sm text-stone-500">
                Ukuran {item.ukuran} · {formatRupiah(item.harga)}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() =>
                    updateJumlah(
                      item.productId,
                      item.ukuran,
                      Math.max(1, item.jumlah - 1)
                    )
                  }
                  className="h-7 w-7 rounded border border-stone-300 text-stone-600"
                >
                  −
                </button>
                <span className="w-5 text-center text-sm">{item.jumlah}</span>
                <button
                  onClick={() =>
                    updateJumlah(item.productId, item.ukuran, item.jumlah + 1)
                  }
                  className="h-7 w-7 rounded border border-stone-300 text-stone-600"
                >
                  +
                </button>
                <button
                  onClick={() => removeItem(item.productId, item.ukuran)}
                  className="ml-3 text-xs text-red-500 hover:underline"
                >
                  Hapus
                </button>
              </div>
            </div>
            <p className="text-sm font-medium text-stone-900">
              {formatRupiah(item.harga * item.jumlah)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-stone-200 pt-4">
        <span className="text-stone-600">Total</span>
        <span className="text-lg font-semibold text-stone-900">
          {formatRupiah(total())}
        </span>
      </div>

      <Link
        href="/checkout"
        className="mt-6 block w-full rounded-md bg-stone-900 py-3 text-center text-sm font-medium text-white hover:bg-stone-800"
      >
        Lanjut ke Checkout
      </Link>
    </main>
  );
}
