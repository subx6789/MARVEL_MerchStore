"use client";

// ─────────────────────────────────────────────────────────
// Admin Coupons Page & Customization Creation Modal
// Dynamic Coupon Management with Full Options via useProductStore
// ─────────────────────────────────────────────────────────
import { useState } from "react";
import { Tag, Plus, Trash2, CheckCircle, Percent, DollarSign, Calendar, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useProductStore } from "@/stores/productStore";
import { formatPrice } from "@/lib/utils";

export default function AdminCouponsPage() {
  const { coupons, addCoupon, deleteCoupon } = useProductStore();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrderValue, setMinOrderValue] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [status, setStatus] = useState<"active" | "expired" | "disabled">("active");

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !discountValue) {
      toast.error("Please fill in required fields");
      return;
    }

    const valNum = parseFloat(discountValue);
    const minOrderNum = minOrderValue ? parseFloat(minOrderValue) : 0;
    const maxDiscNum = maxDiscount ? parseFloat(maxDiscount) : undefined;
    const limitNum = usageLimit ? parseInt(usageLimit) : undefined;

    addCoupon({
      code: code.toUpperCase().trim(),
      discountType,
      discountValue: valNum,
      minOrderValue: minOrderNum,
      maxDiscount: maxDiscNum,
      usageLimit: limitNum,
      startsAt: startsAt ? new Date(startsAt).toISOString() : new Date().toISOString(),
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      status,
    });

    toast.success(`Coupon code "${code.toUpperCase()}" created live!`);
    setCode("");
    setDiscountValue("");
    setMinOrderValue("");
    setMaxDiscount("");
    setUsageLimit("");
    setStartsAt("");
    setExpiresAt("");
    setIsAddOpen(false);
  };

  const handleDelete = (id: string, couponCode: string) => {
    if (confirm(`Delete coupon code "${couponCode}"?`)) {
      deleteCoupon(id);
      toast.success(`Coupon "${couponCode}" deleted`);
    }
  };

  return (
    <div className="space-y-6 text-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-white tracking-wide uppercase font-bold">
            COUPONS & OFFERS
          </h1>
          <p className="text-xs text-gray-400">
            Create custom promotional discount codes, percentage cuts & order rules
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="btn-marvel text-xs py-2.5 px-4 gap-2 cursor-pointer shadow-lg font-bold"
        >
          <Plus size={16} /> Create Coupon Code
        </button>
      </div>

      {/* ── Add Coupon Modal ── */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#14141c] border border-[#1e1e2a] p-6 md:p-8 w-full max-w-2xl rounded-xs shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1e1e2a] pb-3">
              <h2 className="font-display text-2xl text-white tracking-wide uppercase font-extrabold flex items-center gap-2">
                <Tag size={20} className="text-red-500" />
                CREATE CUSTOM PROMO COUPON
              </h2>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="text-gray-400 hover:text-white font-bold text-sm px-2 py-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">
                  COUPON CODE (UPPERCASE)
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="AVENGERS50 or STARK100"
                  className="input-marvel py-2.5 bg-[#08080c] border-[#1e1e2a] uppercase font-mono text-sm tracking-widest text-marvel-gold"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">
                    DISCOUNT TYPE
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="input-marvel py-2.5 bg-[#08080c] border-[#1e1e2a] text-xs font-bold"
                  >
                    <option value="percentage">Percentage Discount (%)</option>
                    <option value="fixed">Fixed Flat Discount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">
                    DISCOUNT VALUE ({discountType === "percentage" ? "%" : "₹"})
                  </label>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder={discountType === "percentage" ? "20 (for 20% off)" : "500 (for ₹500 off)"}
                    className="input-marvel py-2.5 bg-[#08080c] border-[#1e1e2a]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">
                    MINIMUM ORDER VALUE (₹)
                  </label>
                  <input
                    type="number"
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(e.target.value)}
                    placeholder="999"
                    className="input-marvel py-2.5 bg-[#08080c] border-[#1e1e2a]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">
                    MAX DISCOUNT CAP (₹)
                  </label>
                  <input
                    type="number"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                    placeholder="1500 (Optional cap)"
                    className="input-marvel py-2.5 bg-[#08080c] border-[#1e1e2a]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">
                    USAGE LIMIT
                  </label>
                  <input
                    type="number"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                    placeholder="100 uses (Optional)"
                    className="input-marvel py-2.5 bg-[#08080c] border-[#1e1e2a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">
                    START DATE & TIME
                  </label>
                  <input
                    type="datetime-local"
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                    className="input-marvel py-2 bg-[#08080c] border-[#1e1e2a] text-gray-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">
                    EXPIRATION DATE & TIME
                  </label>
                  <input
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="input-marvel py-2 bg-[#08080c] border-[#1e1e2a] text-gray-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">
                  STATUS
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="input-marvel py-2.5 bg-[#08080c] border-[#1e1e2a] text-xs font-bold"
                >
                  <option value="active">Active & Redeemable</option>
                  <option value="disabled">Disabled</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#1e1e2a]">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="btn-outline text-xs px-4 py-2 border-gray-700"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-marvel text-xs px-6 py-2 font-extrabold">
                  Create Coupon Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Coupons Display Grid ── */}
      {coupons.length === 0 ? (
        <div className="bg-[#14141c] border border-[#1e1e2a] p-12 text-center space-y-4 rounded-xs">
          <Tag size={42} className="text-red-500 mx-auto" />
          <h3 className="font-display text-2xl text-white tracking-wide uppercase font-extrabold">
            NO COUPONS CREATED
          </h3>
          <p className="font-sans text-xs text-gray-400 max-w-sm mx-auto">
            Click "Create Coupon Code" above to set up promotional discount codes.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((c) => (
            <div
              key={c.id}
              className="bg-[#14141c] border border-[#1e1e2a] hover:border-red-500/60 p-6 space-y-4 relative rounded-xs shadow-xl transition-all"
            >
              <div className="flex items-center justify-between border-b border-[#1e1e2a] pb-3">
                <span className="font-mono text-xl font-black text-amber-400 tracking-wider">
                  {c.code}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[9px] font-extrabold uppercase px-2 py-0.5 border ${
                      c.status === "active"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : "bg-red-500/20 text-red-400 border-red-500/30"
                    }`}
                  >
                    {c.status}
                  </span>
                  <button
                    onClick={() => handleDelete(c.id, c.code)}
                    className="text-gray-500 hover:text-red-400 transition-colors p-1"
                    title="Delete coupon"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div>
                <p className="font-display text-3xl text-white font-extrabold">
                  {c.discountType === "percentage" ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                </p>
                <p className="font-sans text-xs text-gray-400 mt-1">
                  Min Order: {formatPrice(c.minOrderValue)}
                  {c.maxDiscount ? ` · Max Cap: ₹${c.maxDiscount}` : ""}
                </p>
              </div>

              <div className="pt-3 border-t border-[#1e1e2a] flex items-center justify-between text-xs font-sans text-gray-400">
                <span>Redeemed</span>
                <span className="text-white font-mono font-bold">
                  {c.usedCount} {c.usageLimit ? `/ ${c.usageLimit}` : ""} uses
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
