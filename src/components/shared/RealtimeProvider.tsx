"use client";

// ─────────────────────────────────────────────────────────
// Realtime Sync Provider — Supabase Broadcast & Table Subscriptions
// Enables site-wide realtime synchronization across windows & users
// ─────────────────────────────────────────────────────────
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useProductStore } from "@/stores/productStore";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { toast } from "sonner";

import { soundFx } from "@/lib/sound";

export default function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const { addProduct, updateProduct, deleteProduct, addDrop, updateDrop, deleteDrop, products } = useProductStore();

  useEffect(() => {
    // ── Global Touch & Click SFX Listener ──
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const clickable = target.closest("button, a, input[type='button'], input[type='submit'], [role='button'], .cursor-pointer");
      if (clickable) {
        soundFx.playClick();
      }
    };

    const handleGlobalMouseEnter = (e: MouseEvent) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const hoverable = target.closest("button, a, [role='button'], .cursor-pointer");
      if (hoverable) {
        soundFx.playHover();
      }
    };

    document.addEventListener("click", handleGlobalClick, { capture: true, passive: true });
    document.addEventListener("mouseenter", handleGlobalMouseEnter, { capture: true, passive: true });
    // ── 0. Initial Fetch from Supabase PostgreSQL Database ──
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data?.products && Array.isArray(data.products)) {
          data.products.forEach((dbProd: any) => {
            const formatted = {
              id: dbProd.id,
              name: dbProd.name,
              slug: dbProd.slug,
              price: parseFloat(dbProd.price || "0"),
              category: dbProd.metadata?.category || "topwear",
              origins: dbProd.metadata?.origins || [],
              families: dbProd.metadata?.families || [],
              stockCount: dbProd.metadata?.stockCount || 50,
              sku: dbProd.metadata?.sku || dbProd.slug,
              imageUrl: dbProd.metadata?.imageUrl || "/images/placeholder-product.jpg",
              status: dbProd.status || "active",
            };
            // Sync DB item to store
            useProductStore.getState().addProduct(formatted);
          });
        }
      })
      .catch((err) => console.error("Initial Supabase DB fetch error:", err));

    const supabase = createClient();

    // ── 1. Realtime Broadcast Channel for Live Platform Updates ──
    const realtimeChannel = supabase.channel("marvel_merch_realtime_broadcast");

    realtimeChannel
      .on("broadcast", { event: "product_created" }, ({ payload }) => {
        if (payload?.product) {
          addProduct(payload.product);
          toast.info(`New merchandise dropped live: ${payload.product.name}`);
        }
      })
      .on("broadcast", { event: "drop_scheduled" }, ({ payload }) => {
        if (payload?.drop) {
          addDrop(payload.drop);
          toast.info(`New drop scheduled: ${payload.drop.name}`);
        }
      })
      .on("broadcast", { event: "stock_updated" }, ({ payload }) => {
        if (payload?.productId && payload?.stockCount !== undefined) {
          updateProduct(payload.productId, { stockCount: payload.stockCount });
        }
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("[Supabase Realtime] Connected to broadcast channel");
        }
      });

    // ── 2. Realtime Postgres Changes Listener (Supabase DB Tables) ──
    const dbChannel = supabase
      .channel("db_changes_listener")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        (payload) => {
          if (payload.eventType === "INSERT" && payload.new) {
            addProduct(payload.new as any);
          } else if (payload.eventType === "UPDATE" && payload.new) {
            updateProduct(payload.new.id, payload.new as any);
          } else if (payload.eventType === "DELETE" && payload.old) {
            deleteProduct(payload.old.id);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "limited_drops" },
        (payload) => {
          if (payload.eventType === "INSERT" && payload.new) {
            addDrop(payload.new as any);
          } else if (payload.eventType === "UPDATE" && payload.new) {
            updateDrop(payload.new.id, payload.new as any);
          } else if (payload.eventType === "DELETE" && payload.old) {
            deleteDrop(payload.old.id);
          }
        }
      )
      .subscribe();

    // ── 3. Cross-Tab Sync via Web Storage Events ──
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "marvel_product_catalog_store" && e.newValue) {
        useProductStore.persist.rehydrate();
      }
      if (e.key === "marvel-cart-storage" && e.newValue) {
        useCartStore.persist.rehydrate();
      }
      if (e.key === "marvel_wishlist_storage" && e.newValue) {
        useWishlistStore.persist.rehydrate();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      document.removeEventListener("click", handleGlobalClick, { capture: true });
      document.removeEventListener("mouseenter", handleGlobalMouseEnter, { capture: true });
      supabase.removeChannel(realtimeChannel);
      supabase.removeChannel(dbChannel);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return <>{children}</>;
}
