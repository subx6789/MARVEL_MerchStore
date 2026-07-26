// ─────────────────────────────────────────────────────────
// Zustand Store — Wishlist
// Persisted to localStorage
// ─────────────────────────────────────────────────────────
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface WishlistItem {
  productId: string;
  productName: string;
  price: number;
  imageUrl: string;
  slug: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  toggle: (item: WishlistItem) => void;
  isWishlisted: (productId: string) => boolean;
  count: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          if (state.items.find((i) => i.productId === item.productId)) {
            return state; // Already wishlisted
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      toggle: (item) => {
        const wishlisted = get().isWishlisted(item.productId);
        if (wishlisted) {
          get().removeItem(item.productId);
        } else {
          get().addItem(item);
        }
      },

      isWishlisted: (productId) =>
        get().items.some((i) => i.productId === productId),

      count: () => get().items.length,
    }),
    {
      name: "marvel-wishlist",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
