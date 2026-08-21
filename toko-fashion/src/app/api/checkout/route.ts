import { NextRequest, NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import { supabaseAdmin } from "@/lib/supabase";
import { CartItem } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, total, nama, telepon, alamat } = body as {
      items: CartItem[];
      total: number;
      nama: string;
      telepon: string;
      alamat: string;
    };

    if (!items?.length || !nama || !telepon || !alamat) {
      return NextResponse.json(
        { error: "Data checkout tidak lengkap" },
        { status: 400 }
      );
    }

    const orderId = `ORDER-${Date.now()}`;

    // 1) Simpan order dulu di Supabase dengan status "pending"
    const admin = supabaseAdmin();
    const { error: dbError } = await admin.from("orders").insert({
      order_id: orderId,
      items,
      total,
      status: "pending",
      nama_penerima: nama,
      alamat,
      telepon,
    });
    if (dbError) throw new Error(dbError.message);

    // 2) Minta Snap token ke Midtrans
    // NB: ganti isProduction: true kalau sudah pakai Server Key production
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY!,
    });

    const transaction = await snap.createTransaction({
      transaction_details: { order_id: orderId, gross_amount: total },
      customer_details: { first_name: nama, phone: telepon },
      item_details: items.map((i) => ({
        id: i.productId,
        name: `${i.nama} (${i.ukuran})`,
        price: i.harga,
        quantity: i.jumlah,
      })),
    });

    return NextResponse.json({ token: transaction.token, orderId });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Gagal memproses checkout" },
      { status: 500 }
    );
  }
}
