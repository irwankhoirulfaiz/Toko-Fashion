"use client";

import { useState } from "react";
import { useCart } from "@/store/cart";

declare global {
  interface Window {
    snap: {
      pay: (token: string, options?: Record<string, unknown>) => void;
    };
  }
}

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const [form, setForm] = useState({ nama: "", telepon: "", alamat: "" });
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, total: total(), ...form }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Checkout gagal");

      // Snap.js sudah di-load di layout lewat <script>, lihat layout.tsx
      window.snap.pay(data.token, {
        onSuccess: () => {
          clear();
          window.location.href = "/checkout/sukses";
        },
        onPending: () => {
          clear();
          window.location.href = "/checkout/sukses";
        },
        onError: () => alert("Pembayaran gagal, coba lagi ya."),
      });
    } catch (e) {
      alert(e instanceof Error ? e.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-stone-900">Checkout</h1>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">
            Nama Penerima
          </label>
          <input
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">
            No. Telepon
          </label>
          <input
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
            value={form.telepon}
            onChange={(e) => setForm({ ...form, telepon: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">
            Alamat Lengkap
          </label>
          <textarea
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
            rows={3}
            value={form.alamat}
            onChange={(e) => setForm({ ...form, alamat: e.target.value })}
          />
        </div>

        <button
          disabled={loading || items.length === 0}
          onClick={handleCheckout}
          className="w-full rounded-md bg-stone-900 py-3 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Bayar Sekarang"}
        </button>
      </div>
    </main>
  );
}
