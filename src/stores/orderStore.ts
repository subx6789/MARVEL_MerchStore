"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useInventoryStore } from "@/stores/inventoryStore";

export interface OrderItem {
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  codFee: number;
  discount: number;
  total: number;
  paymentMethod: "online" | "cod";
  shippingAddress: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string;
  };
  status: "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
}

interface OrderStore {
  orders: Order[];
  addOrder: (order: Order) => void;
  cancelOrder: (orderId: string) => { success: boolean; error?: string };
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [], // Clear mock data as requested — starting clean for dynamic admin & user testing

      addOrder: (newOrder) =>
        set((state) => ({
          orders: [newOrder, ...state.orders],
        })),

      cancelOrder: (orderId) => {
        const { orders } = get();
        const targetOrder = orders.find((o) => o.id === orderId);

        if (!targetOrder) {
          return { success: false, error: "Order not found" };
        }

        if (targetOrder.status === "cancelled") {
          return { success: false, error: "Order is already cancelled" };
        }

        if (targetOrder.status === "delivered" || targetOrder.status === "shipped") {
          return { success: false, error: "Cannot cancel an order that is already shipped or delivered" };
        }

        // Restore stock levels for each item in the order
        targetOrder.items.forEach((item) => {
          const key = item.productId || item.name;
          useInventoryStore.getState().incrementStock(key, item.quantity);
        });

        // Update order status to cancelled
        const updatedOrders = orders.map((o) =>
          o.id === orderId ? { ...o, status: "cancelled" as const } : o
        );

        set({ orders: updatedOrders });
        return { success: true };
      },
    }),
    {
      name: "marvel_user_orders",
    }
  )
);
