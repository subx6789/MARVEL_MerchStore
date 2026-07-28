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
  comparePrice?: number;
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
  startDate?: string;
  endDate?: string;
  status: "upcoming" | "live" | "ended";
  productsCount: number;
  description: string;
  bannerUrl?: string;
}

export interface CouponItem {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  startsAt?: string;
  expiresAt?: string;
  status: "active" | "expired" | "disabled";
}

interface ProductStore {
  products: ProductItem[];
  drops: DropItem[];
  events: EventItem[];
  coupons: CouponItem[];

  // Product Actions
  addProduct: (product: Omit<ProductItem, "id"> & { id?: string }) => void;
  updateProduct: (id: string, data: Partial<ProductItem>) => void;
  deleteProduct: (id: string) => void;

  // Drop Actions
  addDrop: (drop: Omit<DropItem, "id"> & { id?: string }) => void;
  updateDrop: (id: string, data: Partial<DropItem>) => void;
  deleteDrop: (id: string) => void;

  // Event Actions
  addEvent: (event: Omit<EventItem, "id"> & { id?: string }) => void;
  updateEvent: (id: string, data: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;

  // Coupon Actions
  addCoupon: (coupon: Omit<CouponItem, "id" | "usedCount"> & { id?: string; usedCount?: number }) => void;
  updateCoupon: (id: string, data: Partial<CouponItem>) => void;
  deleteCoupon: (id: string) => void;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      // Clean starting state (No seeded mock data as requested)
      products: [],
      drops: [],
      events: [],
      coupons: [],

      // Product Actions
      addProduct: (productData) =>
        set((state) => {
          const id = productData.id || `prd_${Date.now()}`;
          const exists = state.products.some(
            (p) => p.id === id || (productData.slug && p.slug === productData.slug)
          );
          if (exists) {
            return {
              products: state.products.map((p) =>
                p.id === id || (productData.slug && p.slug === productData.slug)
                  ? { ...p, ...productData, id: p.id }
                  : p
              ),
            };
          }
          return {
            products: [{ ...productData, id }, ...state.products],
          };
        }),

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
        set((state) => {
          const id = dropData.id || `drp_${Date.now()}`;
          const exists = state.drops.some(
            (d) => d.id === id || (dropData.slug && d.slug === dropData.slug)
          );
          if (exists) {
            return {
              drops: state.drops.map((d) =>
                d.id === id || (dropData.slug && d.slug === dropData.slug)
                  ? { ...d, ...dropData, id: d.id }
                  : d
              ),
            };
          }
          return {
            drops: [{ ...dropData, id }, ...state.drops],
          };
        }),

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
        set((state) => {
          const id = eventData.id || `evt_${Date.now()}`;
          const exists = state.events.some(
            (e) => e.id === id || (eventData.slug && e.slug === eventData.slug)
          );
          if (exists) {
            return {
              events: state.events.map((e) =>
                e.id === id || (eventData.slug && e.slug === eventData.slug)
                  ? { ...e, ...eventData, id: e.id }
                  : e
              ),
            };
          }
          return {
            events: [{ ...eventData, id }, ...state.events],
          };
        }),

      updateEvent: (id, data) =>
        set((state) => ({
          events: state.events.map((e) => (e.id === id ? { ...e, ...data } : e)),
        })),

      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        })),

      // Coupon Actions
      addCoupon: (couponData) =>
        set((state) => {
          const id = couponData.id || `cpn_${Date.now()}`;
          const codeUpper = couponData.code.toUpperCase().trim();
          const exists = state.coupons.some((c) => c.id === id || c.code === codeUpper);
          if (exists) {
            return {
              coupons: state.coupons.map((c) =>
                c.id === id || c.code === codeUpper
                  ? { ...c, ...couponData, code: codeUpper, id: c.id }
                  : c
              ),
            };
          }
          return {
            coupons: [
              {
                ...couponData,
                id,
                code: codeUpper,
                usedCount: couponData.usedCount || 0,
              },
              ...state.coupons,
            ],
          };
        }),

      updateCoupon: (id, data) =>
        set((state) => ({
          coupons: state.coupons.map((c) => (c.id === id ? { ...c, ...data } : c)),
        })),

      deleteCoupon: (id) =>
        set((state) => ({
          coupons: state.coupons.filter((c) => c.id !== id),
        })),
    }),
    {
      name: "marvel_product_catalog_store",
    }
  )
);
