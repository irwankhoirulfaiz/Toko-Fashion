import Link from "next/link";

export default function CheckoutSuksesPage() {
  return (
    <main className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="text-2xl font-semibold text-stone-900">
        Terima kasih! 🎉
      </h1>
      <p className="mt-3 text-stone-600">
        Pesanan kamu sudah kami terima dan sedang diproses. Kami akan
        menghubungi kamu lewat WhatsApp/telepon untuk update pengiriman.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-md bg-stone-900 px-5 py-2.5 text-sm font-medium text-white"
      >
        Kembali Belanja
      </Link>
    </main>
  );
}
