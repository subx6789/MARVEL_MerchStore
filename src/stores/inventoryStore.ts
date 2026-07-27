"use client";

// ─────────────────────────────────────────────────────────
// InventoryStore — Atomic Stock Management
// Stores live product stock levels dynamically
// ─────────────────────────────────────────────────────────
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface InventoryStore {
  stocks: Record<string, number>;
  getStock: (productId: string, defaultStock?: number) => number;
  decrementStock: (productId: string, quantity: number, defaultStock?: number) => boolean;
  incrementStock: (productId: string, quantity: number) => void;
  setStock: (productId: string, quantity: number) => void;
}

export const useInventoryStore = create<InventoryStore>()(
  persist(
    (set, get) => ({
      stocks: {}, // Completely empty initial stocks - populated dynamically via Admin Dashboard & Storefront

      getStock: (productId, defaultStock = 50) => {
        const current = get().stocks[productId];
        return current !== undefined ? current : defaultStock;
      },

      decrementStock: (productId, quantity, defaultStock = 50) => {
        const currentStock = get().getStock(productId, defaultStock);
        if (currentStock < quantity) {
          return false;
        }

        set((state) => ({
          stocks: {
            ...state.stocks,
            [productId]: currentStock - quantity,
          },
        }));
        return true;
      },

      incrementStock: (productId, quantity) => {
        const currentStock = get().getStock(productId, 0);
        set((state) => ({
          stocks: {
            ...state.stocks,
            [productId]: currentStock + quantity,
          },
        }));
      },

      setStock: (productId, quantity) => {
        set((state) => ({
          stocks: {
            ...state.stocks,
            [productId]: quantity,
          },
        }));
      },
    }),
    {
      name: "marvel_inventory_stocks",
    }
  )
);
