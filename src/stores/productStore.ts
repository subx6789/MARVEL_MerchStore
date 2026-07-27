"use client";

// ─────────────────────────────────────────────────────────
// Central Product & Catalog Store
// Single source of truth for Products, Drops, Events & Coupons
// Allows full dynamic CRUD management via Admin Dashboard
// ─────────────────────────────────────────────────────────
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ProductItem {
  id: string;
  slug: string;
  name: string;
  description?: string;
  price: number;
  comparePrice?: number;
  imageUrl: string;
  category: string;
  origins?: string[];  // e.g. ["tech", "cosmic"]
  families?: string[]; // e.g. ["avengers", "guardians-of-the-galaxy"]
  badge?: "limited" | "new" | "exclusive" | "event-only" | "vip";
  stockCount: number;
  sku: string;
  status: "active" | "archived" | "draft";
}

export interface DropItem {
  id: string;
  name: string;
  description: string;
  price: number;
  totalStock: number;
  soldCount: number;
  status: "live" | "scheduled" | "ended";
  startsAt: string;
  endsAt: string;
  slug: string;
  imageUrl?: string;
}

export interface EventItem {
  id: string;
  name: string;
  slug: string;
  venue: string;
  date: string;
  status: "upcoming" | "live" | "ended";
  productsCount: number;
  description: string;
  bannerUrl?: string;
}

interface ProductStore {
  products: ProductItem[];
  drops: DropItem[];
  events: EventItem[];

  // Product Actions
  addProduct: (product: Omit<ProductItem, "id">) => void;
  updateProduct: (id: string, data: Partial<ProductItem>) => void;
  deleteProduct: (id: string) => void;

  // Drop Actions
  addDrop: (drop: Omit<DropItem, "id">) => void;
  updateDrop: (id: string, data: Partial<DropItem>) => void;
  deleteDrop: (id: string) => void;

  // Event Actions
  addEvent: (event: Omit<EventItem, "id">) => void;
  updateEvent: (id: string, data: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      // Clean starting state (No seeded mock data as requested)
      products: [],
      drops: [],
      events: [],

      // Product Actions
      addProduct: (productData) =>
        set((state) => ({
          products: [
            {
              ...productData,
              id: `prd_${Date.now()}`,
            },
            ...state.products,
          ],
        })),

      updateProduct: (id, data) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...data } : p)),
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      // Drop Actions
      addDrop: (dropData) =>
        set((state) => ({
          drops: [
            {
              ...dropData,
              id: `drp_${Date.now()}`,
            },
            ...state.drops,
          ],
        })),

      updateDrop: (id, data) =>
        set((state) => ({
          drops: state.drops.map((d) => (d.id === id ? { ...d, ...data } : d)),
        })),

      deleteDrop: (id) =>
        set((state) => ({
          drops: state.drops.filter((d) => d.id !== id),
        })),

      // Event Actions
      addEvent: (eventData) =>
        set((state) => ({
          events: [
            {
              ...eventData,
              id: `evt_${Date.now()}`,
            },
            ...state.events,
          ],
        })),

      updateEvent: (id, data) =>
        set((state) => ({
          events: state.events.map((e) => (e.id === id ? { ...e, ...data } : e)),
        })),

      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        })),
    }),
    {
      name: "marvel_product_catalog_store",
    }
  )
);
