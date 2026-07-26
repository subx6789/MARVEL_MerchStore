// ─────────────────────────────────────────────────────────
// Cart Page — Full cart view with order summary
// ─────────────────────────────────────────────────────────
import type { Metadata } from "next";
import CartPageClient from "./CartPageClient";

export const metadata: Metadata = {
  title: "Cart — MARVEL MerchStore",
};

export default function CartPage() {
  return <CartPageClient />;
}
