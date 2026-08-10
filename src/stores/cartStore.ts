// ─────────────────────────────────────────────────────────
// Zustand Store — Cart
// Persisted to localStorage for guest cart support
// ─────────────────────────────────────────────────────────
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { formatPrice } from "@/lib/utils";

// What we store per cart item
export interface CartLineItem {
  id: string; // variant ID
  productId: string;
  productName: string;
  variantLabel: string; // e.g. "L / Black"
  price: number;
  imageUrl: string;
  quantity: number;
  maxStock: number;
  slug: string;
}

interface CartStore {
  items: CartLineItem[];
  isOpen: boolean;

  // Actions
  addItem: (item: Omit<CartLineItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Computed
  itemCount: () => number;
  subtotal: () => number;
  formattedSubtotal: () => string;
}

import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            // Increase quantity (respect stock limit)
            const newQty = Math.min(
              existing.quantity + (item.quantity ?? 1),
              item.maxStock
            );
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: newQty } : i
              ),
              isOpen: true,
            };
          }
          return {
            items: [
              ...state.items,
              { ...item, quantity: item.quantity ?? 1 },
            ],
            isOpen: true,
          };
        });
      },

      removeItem: (variantId) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== variantId),
        })),

      updateQuantity: (variantId, quantity) => {
        if (quantity < 1) {
          get().removeItem(variantId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === variantId
              ? { ...i, quantity: Math.min(quantity, i.maxStock) }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      itemCount: () => get().items.reduce((acc, i) => acc + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),

      formattedSubtotal: () => formatPrice(get().subtotal()),
    }),
    {
      name: "marvel-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
