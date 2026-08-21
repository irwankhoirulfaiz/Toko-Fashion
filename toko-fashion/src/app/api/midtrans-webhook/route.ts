import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

// Daftarkan URL ini (https://domainmu.com/api/midtrans-webhook) di
// Midtrans Dashboard -> Settings -> Configuration -> Payment Notification URL
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { order_id, status_code, gross_amount, signature_key, transaction_status } =
    body;

  // Verifikasi signature biar notifikasi ini beneran dari Midtrans, bukan orang iseng
  const expectedSignature = crypto
    .createHash("sha512")
    .update(order_id + status_code + gross_amount + process.env.MIDTRANS_SERVER_KEY)
    .digest("hex");

  if (signature_key !== expectedSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  let status: "pending" | "paid" | "cancelled" = "pending";
  if (transaction_status === "settlement" || transaction_status === "capture") {
    status = "paid";
  } else if (
    transaction_status === "cancel" ||
    transaction_status === "deny" ||
    transaction_status === "expire"
  ) {
    status = "cancelled";
  }

  const admin = supabaseAdmin();
  await admin.from("orders").update({ status }).eq("order_id", order_id);

  return NextResponse.json({ received: true });
}
