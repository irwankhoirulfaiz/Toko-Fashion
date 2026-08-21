"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types";

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, ukuran: string) => void;
  updateJumlah: (productId: string, ukuran: string, jumlah: number) => void;
  clear: () => void;
  total: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const items = [...get().items];
        const idx = items.findIndex(
          (i) => i.productId === item.productId && i.ukuran === item.ukuran
        );
        if (idx > -1) {
          items[idx].jumlah += item.jumlah;
        } else {
          items.push(item);
        }
        set({ items });
      },
      removeItem: (productId, ukuran) =>
        set({
          items: get().items.filter(
            (i) => !(i.productId === productId && i.ukuran === ukuran)
          ),
        }),
      updateJumlah: (productId, ukuran, jumlah) =>
        set({
          items: get().items.map((i) =>
            i.productId === productId && i.ukuran === ukuran
              ? { ...i, jumlah }
              : i
          ),
        }),
      clear: () => set({ items: [] }),
      total: () =>
        get().items.reduce((sum, i) => sum + i.harga * i.jumlah, 0),
    }),
    { name: "cart-storage" }
  )
);
