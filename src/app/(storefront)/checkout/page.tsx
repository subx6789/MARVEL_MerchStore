"use client";

// ─────────────────────────────────────────────────────────
// Checkout Page — MARVEL MerchStore
// Online Payment (Stripe) & Cash on Delivery (+₹50 handling charge)
// Reduces inventory stock & clears cart on order completion
// ─────────────────────────────────────────────────────────
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ShieldCheck,
  ArrowRight,
  ShoppingBag,
  CheckCircle2,
  Tag,
  CreditCard,
  Banknote,
  Truck,
  PackageCheck,
  Shield,
} from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useOrderStore, type Order } from "@/stores/orderStore";
import { useInventoryStore } from "@/stores/inventoryStore";
import { useAuthStore } from "@/stores/authStore";
import { formatPrice, generateOrderNumber } from "@/lib/utils";
import {
  addressSchema,
  type AddressFormData,
} from "@/lib/validations/checkout";
import { soundFx } from "@/lib/sound";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { items, subtotal, clearCart } = useCartStore();
  const { addOrder } = useOrderStore();
  const { decrementStock } = useInventoryStore();

  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">(
    "online",
  );
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  const sub = subtotal();
  const delivery = sub >= 1999 ? 0 : 99;
  const codFee = paymentMethod === "cod" ? 50 : 0;
  const total = Math.max(0, sub - discount + delivery + codFee);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: "India" },
  });

  function applyCoupon() {
    soundFx.playClick();
    const code = couponCode.trim().toUpperCase();
    if (code === "MARVEL10") {
      const d = Math.round(sub * 0.1);
      setDiscount(d);
      toast.success("Coupon MARVEL10 applied (10% OFF)");
    } else if (code === "UNIVERSE20") {
      const d = Math.round(sub * 0.2);
      setDiscount(d);
      toast.success("Coupon UNIVERSE20 applied (20% OFF)");
    } else if (code === "FIRST200") {
      setDiscount(200);
      toast.success("Coupon FIRST200 applied (₹200 OFF)");
    } else {
      toast.error("Invalid coupon code", {
        description: "Try MARVEL10, UNIVERSE20, or FIRST200",
      });
    }
  }

  function onPlaceOrder(data: AddressFormData) {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    soundFx.playClick();
    setLoading(true);

    setTimeout(() => {
      // 1. Reduce stock for each item in the cart
      items.forEach((item) => {
        decrementStock(item.productId, item.quantity);
      });

      // 2. Build new order record
      const orderNum = generateOrderNumber();
      const newOrder: Order = {
        id: orderNum,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        items: items.map((i) => ({
          productId: i.productId,
          name: i.productName,
          price: i.price,
          quantity: i.quantity,
          imageUrl: i.imageUrl,
        })),
        subtotal: sub,
        deliveryFee: delivery,
        codFee,
        discount,
        total,
        paymentMethod,
        shippingAddress: {
          name: data.name,
          line1: data.line1,
          line2: data.line2 || "",
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          phone: data.phone || "",
        },
        status: "confirmed",
      };

      // 3. Save order to persistent OrderStore
      addOrder(newOrder);
      setPlacedOrder(newOrder);

      // 4. Clear cart completely
      clearCart();
      setLoading(false);
      soundFx.playUnlock();

      toast.success("Order Placed Successfully!", {
        description: `Order ID: ${orderNum} · Inventory updated & Cart cleared`,
      });
    }, 1200);
  }

  // Confirmation View
  if (placedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-8 text-white">
        <div className="w-20 h-20 bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center mx-auto rounded-full shadow-[0_0_30px_rgba(16,185,129,0.4)]">
          <CheckCircle2 size={44} className="text-emerald-400" />
        </div>

        <div>
          <span className="bg-emerald-500/20 text-emerald-400 text-xs font-black px-3 py-1 uppercase tracking-widest border border-emerald-500/30">
            ORDER CONFIRMED & INVENTORY RESERVED
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-white tracking-wide uppercase font-bold mt-3">
            THANK YOU FOR YOUR ORDER!
          </h1>
          <p className="text-gray-400 text-sm max-w-md mx-auto mt-2 leading-relaxed">
            Your collector gear has been allocated and stock updated in our
            vault.
          </p>
        </div>

        {/* Summary Card */}
        <div className="bg-[#14141c] border border-[#1e1e2a] p-6 text-left space-y-4 font-sans text-xs rounded-xs shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1e1e2a] pb-3">
            <span className="text-gray-400 font-bold uppercase tracking-wider">
              Order Reference ID
            </span>
            <span className="font-mono font-bold text-amber-400 text-base">
              {placedOrder.id}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Payment Method</span>
            <span className="font-bold text-white uppercase">
              {placedOrder.paymentMethod === "cod"
                ? "Cash on Delivery (+₹50)"
                : "Online Payment (Stripe)"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Estimated Delivery</span>
            <span className="text-white font-semibold">
              3–5 Business Days (Insured Express)
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Deliver To</span>
            <span className="text-white font-semibold">
              {placedOrder.shippingAddress.name},{" "}
              {placedOrder.shippingAddress.city}
            </span>
          </div>

          <div className="flex justify-between border-t border-[#1e1e2a] pt-3 font-bold text-sm">
            <span className="text-white">Total Amount</span>
            <span className="font-display text-2xl text-red-500">
              {formatPrice(placedOrder.total)}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <Link
            href="/orders"
            onClick={() => soundFx.playClick()}
            className="btn-marvel w-full justify-center text-sm py-3.5"
          >
            <PackageCheck size={18} />
            View Order History
          </Link>
          <Link
            href="/shop"
            onClick={() => soundFx.playClick()}
            className="btn-outline w-full justify-center text-sm py-3.5 border-gray-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (user?.role === "admin" || user?.email === "admin@marvel.com") {
    return (
      <div className="min-h-[55vh] flex flex-col items-center justify-center gap-6 px-4 text-center text-white">
        <Shield size={56} className="text-red-500 animate-pulse" />
        <h1 className="font-display text-4xl text-white tracking-wide uppercase font-black">
          ADMIN PURCHASING RESTRICTED
        </h1>
        <p className="text-gray-300 text-sm max-w-md leading-relaxed font-sans">
          Admin accounts are reserved for platform operations and cannot place
          customer orders. To place an order, please sign in with a customer
          account.
        </p>
        <div className="flex gap-4 pt-2">
          <Link
            href="/admin"
            onClick={() => soundFx.playClick()}
            className="btn-marvel px-6 py-3 text-xs gap-2"
          >
            Open Admin Dashboard
          </Link>
          <button
            onClick={() => logout()}
            className="btn-outline px-6 py-3 text-xs border-gray-700"
          >
            Sign Out Admin
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[55vh] flex flex-col items-center justify-center gap-6 px-4 text-center text-white">
        <ShoppingBag size={48} className="text-gray-600" />
        <h1 className="font-display text-4xl text-white tracking-wide uppercase">
          YOUR CART IS EMPTY
        </h1>
        <p className="text-gray-400 text-sm max-w-sm">
          Browse our collector drops and add gear to checkout.
        </p>
        <Link
          href="/shop"
          onClick={() => soundFx.playClick()}
          className="btn-marvel px-8 py-3.5 text-xs"
        >
          Explore All Merchandise
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 text-white">
      <h1 className="font-display text-4xl md:text-5xl text-white tracking-wide uppercase font-bold mb-8">
        CHECKOUT & ORDER
      </h1>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Address & Payment Selector */}
        <div className="lg:col-span-8 space-y-8">
          {/* 1. SHIPPING ADDRESS */}
          <div className="bg-[#14141c] border border-[#1e1e2a] p-6 md:p-8 rounded-xs shadow-xl">
            <h2 className="font-display text-2xl text-white tracking-wide uppercase mb-6 flex items-center gap-2">
              <Truck size={20} className="text-red-500" />
              1. SHIPPING ADDRESS
            </h2>

            <form
              id="checkout-form"
              onSubmit={handleSubmit(onPlaceOrder)}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-widest mb-1.5">
                  FULL NAME
                </label>
                <input
                  {...register("name")}
                  type="text"
                  placeholder="Tony Stark"
                  className="input-marvel py-3 bg-[#08080c]"
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-widest mb-1.5">
                  ADDRESS LINE 1
                </label>
                <input
                  {...register("line1")}
                  type="text"
                  placeholder="10880 Malibu Point"
                  className="input-marvel py-3 bg-[#08080c]"
                />
                {errors.line1 && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.line1.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-widest mb-1.5">
                  ADDRESS LINE 2 (OPTIONAL)
                </label>
                <input
                  {...register("line2")}
                  type="text"
                  placeholder="Suite 400"
                  className="input-marvel py-3 bg-[#08080c]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-widest mb-1.5">
                    CITY
                  </label>
                  <input
                    {...register("city")}
                    type="text"
                    placeholder="Mumbai"
                    className="input-marvel py-3 bg-[#08080c]"
                  />
                  {errors.city && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-widest mb-1.5">
                    STATE
                  </label>
                  <input
                    {...register("state")}
                    type="text"
                    placeholder="Maharashtra"
                    className="input-marvel py-3 bg-[#08080c]"
                  />
                  {errors.state && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.state.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-widest mb-1.5">
                    POSTAL CODE / PIN
                  </label>
                  <input
                    {...register("postalCode")}
                    type="text"
                    placeholder="400001"
                    className="input-marvel py-3 font-mono bg-[#08080c]"
                  />
                  {errors.postalCode && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.postalCode.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-widest mb-1.5">
                    PHONE NUMBER
                  </label>
                  <input
                    {...register("phone")}
                    type="text"
                    placeholder="9876543210"
                    className="input-marvel py-3 font-mono bg-[#08080c]"
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* 2. PAYMENT METHOD SELECTOR */}
          <div className="bg-[#14141c] border border-[#1e1e2a] p-6 md:p-8 rounded-xs shadow-xl">
            <h2 className="font-display text-2xl text-white tracking-wide uppercase mb-6 flex items-center gap-2">
              <CreditCard size={20} className="text-amber-400" />
              2. SELECT PAYMENT METHOD
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Option 1: Online Payment (Stripe) */}
              <div
                onClick={() => {
                  soundFx.playClick();
                  setPaymentMethod("online");
                }}
                className={`p-6 border rounded-xs cursor-pointer transition-all relative flex flex-col justify-between ${
                  paymentMethod === "online"
                    ? "bg-red-500/10 border-red-500 shadow-[0_0_20px_rgba(226,54,54,0.3)]"
                    : "bg-[#08080c] border-[#1e1e2a] hover:border-gray-700"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <CreditCard
                      size={28}
                      className={
                        paymentMethod === "online"
                          ? "text-red-500"
                          : "text-gray-400"
                      }
                    />
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 border border-emerald-500/30">
                      NO EXTRA FEE
                    </span>
                  </div>
                  <h3 className="font-display text-xl text-white tracking-wide uppercase">
                    ONLINE PAYMENT (STRIPE)
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    Instant payment via Credit Card, Debit Card, UPI, or
                    NetBanking secured by Stripe.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#1e1e2a] flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-400 uppercase">
                    Gateway
                  </span>
                  <span className="text-xs font-mono font-bold text-white">
                    Stripe 256-bit SSL
                  </span>
                </div>
              </div>

              {/* Option 2: Cash on Delivery (+₹50 Charge) */}
              <div
                onClick={() => {
                  soundFx.playClick();
                  setPaymentMethod("cod");
                }}
                className={`p-6 border rounded-xs cursor-pointer transition-all relative flex flex-col justify-between ${
                  paymentMethod === "cod"
                    ? "bg-amber-400/10 border-amber-400 shadow-[0_0_20px_rgba(240,180,41,0.3)]"
                    : "bg-[#08080c] border-[#1e1e2a] hover:border-gray-700"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Banknote
                      size={28}
                      className={
                        paymentMethod === "cod"
                          ? "text-amber-400"
                          : "text-gray-400"
                      }
                    />
                    <span className="bg-amber-400/20 text-amber-300 text-[10px] font-black px-2 py-0.5 border border-amber-400/40">
                      +₹50 HANDLING FEE
                    </span>
                  </div>
                  <h3 className="font-display text-xl text-white tracking-wide uppercase">
                    CASH ON DELIVERY (COD)
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    Pay in cash when your collector package is delivered to your
                    doorstep.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#1e1e2a] flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-400 uppercase">
                    COD Handling Charge
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    +₹50 Added
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Order Summary & Place Button */}
        <div className="lg:col-span-4 space-y-6">
          {/* Coupon Input */}
          <div className="bg-[#14141c] border border-[#1e1e2a] p-6 rounded-xs shadow-xl">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Tag size={14} className="text-amber-400" /> Promo / Coupon Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="MARVEL10"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="input-marvel uppercase tracking-wider font-mono text-xs bg-[#08080c] border-[#1e1e2a]"
              />
              <button
                onClick={applyCoupon}
                type="button"
                className="btn-gold shrink-0 py-2.5 px-4 text-xs cursor-pointer"
              >
                Apply
              </button>
            </div>
            <p className="text-[10px] text-gray-500 mt-2 font-medium">
              Try: MARVEL10, UNIVERSE20, FIRST200
            </p>
          </div>

          {/* Summary Box */}
          <div className="bg-[#14141c] border border-[#1e1e2a] p-6 rounded-xs shadow-xl space-y-4">
            <h2 className="font-display text-2xl text-white tracking-wide uppercase border-b border-[#1e1e2a] pb-3">
              ORDER SUMMARY
            </h2>

            <div className="space-y-2.5 text-xs font-sans">
              <div className="flex justify-between">
                <span className="text-gray-400">
                  Subtotal ({items.length} items)
                </span>
                <span className="text-white font-semibold">
                  {formatPrice(sub)}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-400">Insured Express Shipping</span>
                <span
                  className={
                    delivery === 0 ? "text-emerald-400 font-bold" : "text-white"
                  }
                >
                  {delivery === 0 ? "FREE" : formatPrice(delivery)}
                </span>
              </div>

              {/* COD Charge Row */}
              {paymentMethod === "cod" && (
                <div className="flex justify-between text-amber-400 font-bold">
                  <span>COD Handling Fee</span>
                  <span>+₹50</span>
                </div>
              )}
            </div>

            <div className="border-t border-[#1e1e2a] pt-4">
              <div className="flex justify-between items-baseline mb-6">
                <span className="font-bold text-white uppercase text-sm">
                  Grand Total
                </span>
                <span className="font-display text-3xl text-red-500 font-black">
                  {formatPrice(total)}
                </span>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={loading}
                className="btn-marvel w-full py-4 text-sm font-black tracking-widest gap-2 cursor-pointer shadow-[0_0_20px_rgba(226,54,54,0.5)]"
              >
                {loading
                  ? "Processing Order..."
                  : paymentMethod === "cod"
                    ? "Place Order (Cash on Delivery)"
                    : "Pay Now with Stripe"}
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
