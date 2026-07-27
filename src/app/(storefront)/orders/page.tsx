"use client";

// ─────────────────────────────────────────────────────────
// User Orders History Page — MARVEL MerchStore
// Orders breakdown & Cancel Order button with instant stock restoration
// ─────────────────────────────────────────────────────────
import Link from "next/link";
import { Package, Truck, CheckCircle2, ArrowLeft, ShoppingBag, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useOrderStore } from "@/stores/orderStore";
import { formatPrice } from "@/lib/utils";
import { soundFx } from "@/lib/sound";

export default function UserOrdersPage() {
  const { orders, cancelOrder } = useOrderStore();

  const handleCancelOrder = (orderId: string) => {
    soundFx.playClick();
    if (confirm(`Are you sure you want to cancel Order ${orderId}? Item stock will be returned to inventory.`)) {
      const res = cancelOrder(orderId);
      if (res.success) {
        soundFx.playUnlock();
        toast.success(`Order ${orderId} has been cancelled`, {
          description: "Stock returned to inventory successfully.",
        });
      } else {
        toast.error(res.error || "Failed to cancel order");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 text-white">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1e1e2a] pb-6 mb-8">
        <div>
          <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-1">
            OFFICIAL ORDER HISTORY
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-white tracking-wide uppercase font-bold">
            MY ORDERS ({orders.length})
          </h1>
        </div>

        <Link
          href="/shop"
          onClick={() => soundFx.playClick()}
          className="btn-outline text-xs px-5 py-2.5 border-gray-700 hover:border-red-500 shrink-0 self-start md:self-auto"
        >
          <ArrowLeft size={14} />
          Browse Merch Store
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center p-8 bg-[#14141c] border border-[#1e1e2a]">
          <ShoppingBag size={48} className="text-gray-600 mb-4" />
          <h2 className="font-display text-2xl text-white uppercase tracking-wider mb-2">NO ORDERS FOUND</h2>
          <p className="text-gray-400 text-sm max-w-sm mb-6 font-normal">
            You have not placed any orders yet. Add products to cart and place an order to test!
          </p>
          <Link href="/shop" onClick={() => soundFx.playClick()} className="btn-marvel px-6 py-3 text-xs">
            Explore Merch Drops
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((o) => (
            <div
              key={o.id}
              className="bg-[#14141c] border border-[#1e1e2a] hover:border-red-500/40 p-6 rounded-xs space-y-4 transition-colors shadow-lg"
            >
              {/* Top Row: Order ID, Date, Payment Method Tag, Status */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-[#1e1e2a] pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-amber-400 text-sm">{o.id}</span>
                  <span className="text-gray-400">• {o.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 bg-gray-900 border border-gray-800 text-gray-300">
                    {o.paymentMethod === "cod" ? "CASH ON DELIVERY (+₹50)" : "ONLINE PAYMENT (STRIPE)"}
                  </span>

                  {o.status === "cancelled" ? (
                    <span className="text-[10px] font-extrabold tracking-widest uppercase px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30">
                      CANCELLED
                    </span>
                  ) : (
                    <span className="text-[10px] font-extrabold tracking-widest uppercase px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {o.status}
                    </span>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {o.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <img
                      src={item.imageUrl || "/images/placeholder-product.jpg"}
                      alt={item.name}
                      className="w-14 h-14 object-cover border border-[#1e1e2a] rounded-xs shrink-0"
                    />
                    <div className="flex-1">
                      <p className="font-sans text-sm font-bold text-white leading-snug">{item.name}</p>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">
                        Qty: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Details & Cancel Button */}
              <div className="flex flex-wrap items-center justify-between pt-3 border-t border-[#1e1e2a] text-xs gap-3">
                <div className="text-gray-400 font-normal">
                  <span>Shipping To: </span>
                  <span className="text-white font-semibold">{o.shippingAddress.name}, {o.shippingAddress.city}</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-gray-400 font-bold uppercase text-[11px]">Total:</span>
                    <span className="font-display text-2xl text-red-500 font-black">{formatPrice(o.total)}</span>
                  </div>

                  {o.status !== "cancelled" && o.status !== "delivered" && (
                    <button
                      onClick={() => handleCancelOrder(o.id)}
                      className="btn-outline text-[11px] px-3 py-1.5 border-red-500/40 text-red-400 hover:bg-red-500/10 gap-1.5 cursor-pointer"
                    >
                      <XCircle size={14} />
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
