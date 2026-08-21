"use client";

import Link from "next/link";
import { useCart } from "@/store/cart";

export default function Navbar() {
  const itemCount = useCart((s) =>
    s.items.reduce((sum, i) => sum + i.jumlah, 0)
  );

  return (
    <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-stone-900"
        >
          Nama Toko
        </Link>
        <Link href="/keranjang" className="relative text-sm text-stone-700">
          Keranjang
          {itemCount > 0 && (
            <span className="ml-1 rounded-full bg-stone-900 px-1.5 py-0.5 text-xs text-white">
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
