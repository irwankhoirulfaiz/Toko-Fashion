import { supabaseAdmin } from "@/lib/supabase";
import { Order } from "@/types";
import Link from "next/link";

async function getOrders(): Promise<Order[]> {
  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) {
    console.error(error.message);
    return [];
  }
  return data ?? [];
}

const statusColor: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-green-100 text-green-700",
  shipped: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
};

export default async function AdminDashboardPage() {
  const orders = await getOrders();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-stone-900">
          Pesanan Masuk
        </h1>
        <Link
          href="/admin/produk"
          className="rounded-md border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          Kelola Produk →
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-stone-200">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-left text-stone-500">
            <tr>
              <th className="px-4 py-3 font-medium">Order ID</th>
              <th className="px-4 py-3 font-medium">Penerima</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="px-4 py-3 font-mono text-xs text-stone-600">
                  {o.order_id}
                </td>
                <td className="px-4 py-3">{o.nama_penerima}</td>
                <td className="px-4 py-3">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(o.total)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      statusColor[o.status] ?? "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-stone-400"
                >
                  Belum ada pesanan masuk.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
