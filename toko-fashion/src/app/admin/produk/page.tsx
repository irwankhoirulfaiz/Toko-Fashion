"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types";

export default function AdminProdukPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    nama: "",
    harga: "",
    stok: "",
    deskripsi: "",
    kategori: "",
    ukuran: "S,M,L",
    gambar_url: "",
  });
  const [saving, setSaving] = useState(false);

  async function loadProducts() {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    setProducts(data ?? []);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const slug = form.nama
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const { error } = await supabase.from("products").insert({
      nama: form.nama,
      slug,
      harga: Number(form.harga),
      stok: Number(form.stok),
      deskripsi: form.deskripsi,
      kategori: form.kategori,
      ukuran: form.ukuran.split(",").map((u) => u.trim()),
      gambar_url: form.gambar_url,
    });

    setSaving(false);
    if (error) {
      alert("Gagal simpan: " + error.message);
      return;
    }
    setForm({
      nama: "",
      harga: "",
      stok: "",
      deskripsi: "",
      kategori: "",
      ukuran: "S,M,L",
      gambar_url: "",
    });
    loadProducts();
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus produk ini?")) return;
    await supabase.from("products").delete().eq("id", id);
    loadProducts();
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-stone-900">
        Kelola Produk
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mb-10 grid grid-cols-2 gap-4 rounded-xl border border-stone-200 p-6"
      >
        <input
          placeholder="Nama produk"
          className="col-span-2 rounded-md border border-stone-300 px-3 py-2 text-sm"
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
          required
        />
        <input
          placeholder="Harga (angka saja)"
          type="number"
          className="rounded-md border border-stone-300 px-3 py-2 text-sm"
          value={form.harga}
          onChange={(e) => setForm({ ...form, harga: e.target.value })}
          required
        />
        <input
          placeholder="Stok"
          type="number"
          className="rounded-md border border-stone-300 px-3 py-2 text-sm"
          value={form.stok}
          onChange={(e) => setForm({ ...form, stok: e.target.value })}
          required
        />
        <input
          placeholder="Kategori (mis: Kemeja)"
          className="rounded-md border border-stone-300 px-3 py-2 text-sm"
          value={form.kategori}
          onChange={(e) => setForm({ ...form, kategori: e.target.value })}
        />
        <input
          placeholder="Ukuran, pisah koma (S,M,L)"
          className="rounded-md border border-stone-300 px-3 py-2 text-sm"
          value={form.ukuran}
          onChange={(e) => setForm({ ...form, ukuran: e.target.value })}
        />
        <input
          placeholder="URL gambar produk"
          className="col-span-2 rounded-md border border-stone-300 px-3 py-2 text-sm"
          value={form.gambar_url}
          onChange={(e) => setForm({ ...form, gambar_url: e.target.value })}
        />
        <textarea
          placeholder="Deskripsi"
          className="col-span-2 rounded-md border border-stone-300 px-3 py-2 text-sm"
          rows={3}
          value={form.deskripsi}
          onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
        />
        <button
          type="submit"
          disabled={saving}
          className="col-span-2 rounded-md bg-stone-900 py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving ? "Menyimpan..." : "Tambah Produk"}
        </button>
      </form>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {products.map((p) => (
          <div
            key={p.id}
            className="rounded-lg border border-stone-200 p-3 text-sm"
          >
            <p className="font-medium text-stone-900">{p.nama}</p>
            <p className="text-stone-500">Stok: {p.stok}</p>
            <button
              onClick={() => handleDelete(p.id)}
              className="mt-2 text-xs text-red-500 hover:underline"
            >
              Hapus
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
