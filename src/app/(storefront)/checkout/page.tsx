"use client";
// ─────────────────────────────────────────────────────────
// Checkout Page — Address selection, Coupon application, Payment
// ─────────────────────────────────────────────────────────
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ShieldCheck, ArrowRight, ShoppingBag, CheckCircle2, Tag } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice, generateOrderNumber } from "@/lib/utils";
import { addressSchema, type AddressFormData } from "@/lib/validations/checkout";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [orderComplete, setOrderComplete] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sub = subtotal();
  const delivery = sub >= 1999 ? 0 : 99;
  const total = Math.max(0, sub - discount + delivery);

  const { register, handleSubmit, formState: { errors } } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: "India" },
  });

  function applyCoupon() {
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
      toast.error("Invalid coupon code", { description: "Try MARVEL10, UNIVERSE20, or FIRST200" });
    }
  }

  function onPlaceOrder(data: AddressFormData) {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const orderNum = generateOrderNumber();
      setOrderComplete(orderNum);
      clearCart();
      setLoading(false);
      toast.success("Order Placed Successfully!", { description: `Order ID: ${orderNum}` });
    }, 1200);
  }

  if (orderComplete) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-marvel-red/10 border border-marvel-red/40 flex items-center justify-center mx-auto">
          <CheckCircle2 size={40} className="text-marvel-red" />
        </div>
        <h1 className="font-display text-4xl text-marvel-white tracking-wide">ORDER CONFIRMED</h1>
        <p className="font-sans text-sm text-marvel-white-muted">
          Thank you for your order! Your collector gear has been allocated and is being prepared for vault dispatch.
        </p>

        <div className="bg-marvel-black-card border border-marvel-black-border p-6 text-left space-y-3 font-sans text-xs">
          <div className="flex justify-between">
            <span className="text-marvel-white-muted">Order Number</span>
            <span className="font-mono font-bold text-marvel-gold">{orderComplete}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-marvel-white-muted">Estimated Delivery</span>
            <span className="text-marvel-white">3–5 Business Days</span>
          </div>
          <div className="flex justify-between border-t border-marvel-black-border pt-3 font-bold text-sm">
            <span className="text-marvel-white">Total Amount Paid</span>
            <span className="font-display text-lg text-marvel-red">{formatPrice(total)}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <Link href="/shop" className="btn-marvel w-full justify-center">Continue Shopping</Link>
          <Link href="/profile" className="btn-outline w-full justify-center">View Profile</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-6 px-4">
        <ShoppingBag size={40} className="text-marvel-white-muted" />
        <h1 className="font-display text-3xl text-marvel-white tracking-wide">NO ITEMS TO CHECKOUT</h1>
        <Link href="/shop" className="btn-marvel">Browse Shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <h1 className="font-display text-hero-md text-marvel-white tracking-wide mb-8">CHECKOUT</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Delivery Address Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-marvel-black-card border border-marvel-black-border p-6">
            <h2 className="font-display text-2xl text-marvel-white tracking-wide mb-6">1. SHIPPING ADDRESS</h2>

            <form id="checkout-form" onSubmit={handleSubmit(onPlaceOrder)} className="space-y-4">
              <div>
                <label className="label-marvel block mb-1">Full Name</label>
                <input {...register("name")} type="text" placeholder="Tony Stark" className="input-marvel" />
                {errors.name && <p className="font-sans text-xs text-marvel-red mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="label-marvel block mb-1">Address Line 1</label>
                <input {...register("line1")} type="text" placeholder="10880 Malibu Point" className="input-marvel" />
                {errors.line1 && <p className="font-sans text-xs text-marvel-red mt-1">{errors.line1.message}</p>}
              </div>

              <div>
                <label className="label-marvel block mb-1">Address Line 2 (Optional)</label>
                <input {...register("line2")} type="text" placeholder="Suite 400" className="input-marvel" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-marvel block mb-1">City</label>
                  <input {...register("city")} type="text" placeholder="Mumbai" className="input-marvel" />
                  {errors.city && <p className="font-sans text-xs text-marvel-red mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="label-marvel block mb-1">State</label>
                  <input {...register("state")} type="text" placeholder="Maharashtra" className="input-marvel" />
                  {errors.state && <p className="font-sans text-xs text-marvel-red mt-1">{errors.state.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-marvel block mb-1">Postal Code / PIN</label>
                  <input {...register("postalCode")} type="text" placeholder="400001" className="input-marvel font-mono" />
                  {errors.postalCode && <p className="font-sans text-xs text-marvel-red mt-1">{errors.postalCode.message}</p>}
                </div>
                <div>
                  <label className="label-marvel block mb-1">Phone Number</label>
                  <input {...register("phone")} type="text" placeholder="9876543210" className="input-marvel font-mono" />
                  {errors.phone && <p className="font-sans text-xs text-marvel-red mt-1">{errors.phone.message}</p>}
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary & Coupon */}
        <div className="space-y-6">
          {/* Coupon */}
          <div className="bg-marvel-black-card border border-marvel-black-border p-6">
            <label className="label-marvel block mb-2 flex items-center gap-2">
              <Tag size={12} className="text-marvel-gold" /> Promo / Coupon Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="MARVEL10"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="input-marvel uppercase tracking-wider font-mono text-xs"
              />
              <button onClick={applyCoupon} type="button" className="btn-gold shrink-0 py-2.5 px-4 text-xs">
                Apply
              </button>
            </div>
            <p className="font-sans text-[10px] text-marvel-white-muted mt-2">Try: MARVEL10, UNIVERSE20, FIRST200</p>
          </div>

          {/* Summary */}
          <div className="bg-marvel-black-card border border-marvel-black-border p-6 space-y-4">
            <h2 className="font-display text-2xl text-marvel-white tracking-wide">ORDER SUMMARY</h2>

            <div className="space-y-2 text-xs font-sans">
              <div className="flex justify-between">
                <span className="text-marvel-white-muted">Subtotal ({items.length} items)</span>
                <span className="text-marvel-white">{formatPrice(sub)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-marvel-white-muted">Insured Delivery</span>
                <span className={delivery === 0 ? "text-emerald-400" : "text-marvel-white"}>
                  {delivery === 0 ? "FREE" : formatPrice(delivery)}
                </span>
              </div>
            </div>

            <div className="border-t border-marvel-black-border pt-4">
              <div className="flex justify-between items-baseline mb-6">
                <span className="font-sans font-bold text-marvel-white">Total Amount</span>
                <span className="font-display text-3xl text-marvel-red">{formatPrice(total)}</span>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={loading}
                className="btn-marvel w-full justify-between"
              >
                {loading ? "Processing Order..." : "Place Order & Pay"}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
