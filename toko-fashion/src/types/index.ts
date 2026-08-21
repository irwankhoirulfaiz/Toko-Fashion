export type Product = {
  id: string;
  slug: string;
  nama: string;
  deskripsi: string;
  harga: number;
  stok: number;
  gambar_url: string;
  kategori: string;
  ukuran: string[];
  created_at?: string;
};

export type CartItem = {
  productId: string;
  nama: string;
  harga: number;
  ukuran: string;
  jumlah: number;
  gambar_url: string;
};

export type Order = {
  id: string;
  order_id: string; // dipakai sbg reference ke Midtrans
  items: CartItem[];
  total: number;
  status: "pending" | "paid" | "shipped" | "cancelled";
  nama_penerima: string;
  alamat: string;
  telepon: string;
  created_at?: string;
};
