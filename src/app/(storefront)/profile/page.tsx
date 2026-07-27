"use client";

// ─────────────────────────────────────────────────────────
// Profile & Account Settings Page — MARVEL MerchStore
// Avatar Customization, Edit Profile (Email disabled), Password Change, Dynamic Orders
// ─────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  Package,
  Heart,
  LogOut,
  Lock,
  CheckCircle2,
  ShieldCheck,
  Edit3,
  KeyRound,
  ExternalLink,
  Phone,
  MapPin,
  Camera,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import { useAuthModalStore } from "@/stores/authModalStore";
import { useOrderStore } from "@/stores/orderStore";
import { formatPrice } from "@/lib/utils";
import { soundFx } from "@/lib/sound";

const AVATAR_PRESETS = [
  { name: "Iron Man", url: "https://images.unsplash.com/photo-1635863138275-d9b33299680b?auto=format&fit=crop&q=80&w=200" },
  { name: "Spider-Man", url: "https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?auto=format&fit=crop&q=80&w=200" },
  { name: "Captain America", url: "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?auto=format&fit=crop&q=80&w=200" },
  { name: "Black Panther", url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=200" },
  { name: "Thor", url: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=200" },
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, updateProfile, updatePassword, logout } = useAuthStore();
  const openAuthModal = useAuthModalStore((s) => s.openModal);
  const { orders, cancelOrder } = useOrderStore();

  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "security">("profile");

  // Edit Profile Form State
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Sync user details into state
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setAvatarUrl(user.avatarUrl || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
    }
  }, [user]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 bg-red-600/10 border border-red-500/30 text-red-500 rounded-full flex items-center justify-center mb-4">
          <Lock size={32} />
        </div>
        <h1 className="font-display text-4xl text-white uppercase tracking-wide mb-2">ACCESS RESTRICTED</h1>
        <p className="text-gray-400 text-sm max-w-md mb-6">
          Please sign in to access your collector profile, manage settings, and view order history.
        </p>
        <button
          onClick={() => openAuthModal("login")}
          className="btn-marvel px-8 py-3.5 text-sm cursor-pointer"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  const userInitial = user?.name
    ? user.name.trim().charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : "M";

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick();
    setIsUpdating(true);

    const res = await updateProfile({ name, avatarUrl, phone, address });
    setIsUpdating(false);

    if (res.success) {
      soundFx.playUnlock();
      toast.success("Profile details updated successfully!");
    } else {
      toast.error(res.error || "Failed to update profile");
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick();

    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsUpdating(true);
    const res = await updatePassword(currentPassword, newPassword);
    setIsUpdating(false);

    if (res.success) {
      soundFx.playUnlock();
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast.error(res.error || "Failed to update password");
    }
  };

  const handleCancelOrder = (orderId: string) => {
    soundFx.playClick();
    if (confirm(`Are you sure you want to cancel Order ${orderId}? Item stock will be returned to inventory.`)) {
      const res = cancelOrder(orderId);
      if (res.success) {
        soundFx.playUnlock();
        toast.success(`Order ${orderId} cancelled`, {
          description: "Stock restored to inventory successfully.",
        });
      } else {
        toast.error(res.error || "Failed to cancel order");
      }
    }
  };

  const handleSignOut = async () => {
    soundFx.playClick();
    await logout();
    toast.success("Signed out successfully");
    router.push("/");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 text-white">
      {/* ── User Header Banner ── */}
      <div className="bg-[#14141c] border border-[#1e1e2a] p-6 md:p-8 rounded-xs shadow-xl mb-10 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-3xl pointer-events-none" />

        <div className="flex items-center gap-6 z-10">
          {/* Avatar Display */}
          <div className="relative group">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name || "User"}
                className="w-20 h-20 rounded-full object-cover border-2 border-red-500 shadow-[0_0_20px_rgba(226,54,54,0.6)]"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#e23636] border-2 border-red-400 text-white font-display text-4xl font-extrabold flex items-center justify-center shadow-[0_0_20px_rgba(226,54,54,0.6)]">
                {userInitial}
              </div>
            )}
            <button
              onClick={() => setActiveTab("profile")}
              className="absolute bottom-0 right-0 p-1.5 bg-[#08080c] border border-gray-700 rounded-full text-gray-300 hover:text-white hover:border-red-500 transition-colors"
              title="Change Avatar"
            >
              <Camera size={14} />
            </button>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-display text-3xl md:text-4xl text-white tracking-wide uppercase font-bold">
                {user?.name || "Marvel Collector"}
              </h1>
              <span className="bg-[#00f0ff]/10 border border-[#00f0ff]/40 text-[#00f0ff] text-[10px] font-black px-2.5 py-0.5 tracking-widest uppercase">
                VIP COLLECTOR
              </span>
            </div>
            <p className="text-sm text-gray-400 font-medium flex items-center gap-2">
              <span>{user?.email}</span>
              <span>•</span>
              <span className="text-gray-500">Official Member</span>
            </p>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="btn-outline text-xs px-5 py-2.5 border-gray-700 hover:border-red-500 gap-2 shrink-0 z-10 cursor-pointer"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>

      {/* ── Navigation Tabs ── */}
      <div className="flex items-center gap-2 border-b border-[#1e1e2a] mb-8 overflow-x-auto">
        <button
          onClick={() => {
            soundFx.playClick();
            setActiveTab("profile");
          }}
          className={`flex items-center gap-2 px-6 py-3 font-sans text-xs font-extrabold tracking-widest uppercase border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "profile"
              ? "border-red-500 text-white bg-red-500/10"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          <Edit3 size={16} />
          Edit Profile
        </button>

        <button
          onClick={() => {
            soundFx.playClick();
            setActiveTab("security");
          }}
          className={`flex items-center gap-2 px-6 py-3 font-sans text-xs font-extrabold tracking-widest uppercase border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "security"
              ? "border-red-500 text-white bg-red-500/10"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          <KeyRound size={16} />
          Password & Security
        </button>

        <button
          onClick={() => {
            soundFx.playClick();
            setActiveTab("orders");
          }}
          className={`flex items-center gap-2 px-6 py-3 font-sans text-xs font-extrabold tracking-widest uppercase border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "orders"
              ? "border-red-500 text-white bg-red-500/10"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          <Package size={16} />
          Order History ({orders.length})
        </button>
      </div>

      {/* ── TAB 1: Edit Profile ── */}
      {activeTab === "profile" && (
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-[#14141c] border border-[#1e1e2a] p-8 rounded-xs shadow-xl">
            <h2 className="font-display text-2xl text-white tracking-wide uppercase mb-6 flex items-center gap-2">
              <ShieldCheck size={20} className="text-red-500" />
              EDIT PERSONAL DETAILS
            </h2>

            <form onSubmit={handleProfileSave} className="space-y-6">
              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-widest mb-3">
                  CHOOSE AVATAR PRESET OR CUSTOM URL
                </label>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {AVATAR_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        setAvatarUrl(preset.url);
                      }}
                      className={`relative w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                        avatarUrl === preset.url
                          ? "border-red-500 scale-110 shadow-[0_0_12px_rgba(226,54,54,0.8)]"
                          : "border-gray-800 opacity-70 hover:opacity-100"
                      }`}
                      title={preset.name}
                    >
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="input-marvel text-xs py-2.5 bg-[#08080c]"
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-widest mb-2">
                  FULL NAME
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Peter Parker"
                  className="input-marvel py-3 bg-[#08080c]"
                  required
                />
              </div>

              {/* Email Address (PERMANENTLY DISABLED / READ-ONLY) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Lock size={12} className="text-red-500" />
                    EMAIL ADDRESS (READ-ONLY)
                  </label>
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                    PERMANENT COLLECTOR ID
                  </span>
                </div>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  readOnly
                  className="input-marvel py-3 bg-[#08080c]/60 border-[#1e1e2a] text-gray-500 cursor-not-allowed select-none font-mono"
                />
                <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed font-normal">
                  Note: Email address is permanently linked to your Marvel collector ID and cannot be changed.
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Phone size={14} className="text-gray-400" />
                  PHONE NUMBER
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="input-marvel py-3 bg-[#08080c]"
                />
              </div>

              {/* Shipping Address */}
              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <MapPin size={14} className="text-gray-400" />
                  DEFAULT SHIPPING ADDRESS
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  placeholder="Street, City, Pincode, State"
                  className="input-marvel py-3 bg-[#08080c]"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="btn-marvel px-8 py-3.5 text-xs tracking-widest gap-2 cursor-pointer shadow-lg"
              >
                <CheckCircle2 size={16} />
                <span>Save Profile Changes</span>
              </button>
            </form>
          </div>

          {/* Side Vault Shortcuts */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#14141c] border border-[#1e1e2a] p-6 rounded-xs space-y-4">
              <h3 className="font-display text-xl text-white tracking-wide uppercase">
                QUICK ACCOUNT LINKS
              </h3>
              <div className="space-y-3">
                <Link
                  href="/wishlist"
                  className="flex items-center justify-between p-3.5 bg-[#08080c] hover:bg-[#1c1c28] border border-[#1e1e2a] text-xs font-bold text-gray-300 hover:text-white uppercase transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Heart size={16} className="text-red-500" />
                    My Wishlist
                  </span>
                  <ExternalLink size={14} />
                </Link>

                <Link
                  href="/cart"
                  className="flex items-center justify-between p-3.5 bg-[#08080c] hover:bg-[#1c1c28] border border-[#1e1e2a] text-xs font-bold text-gray-300 hover:text-white uppercase transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Package size={16} className="text-amber-400" />
                    Cart Drawer
                  </span>
                  <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: Security & Password ── */}
      {activeTab === "security" && (
        <div className="max-w-2xl bg-[#14141c] border border-[#1e1e2a] p-8 rounded-xs shadow-xl">
          <h2 className="font-display text-2xl text-white tracking-wide uppercase mb-6 flex items-center gap-2">
            <KeyRound size={20} className="text-amber-400" />
            CHANGE ACCOUNT PASSWORD
          </h2>

          <form onSubmit={handlePasswordSave} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-widest mb-2">
                CURRENT PASSWORD
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="input-marvel py-3 bg-[#08080c]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-widest mb-2">
                NEW PASSWORD
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="input-marvel py-3 bg-[#08080c]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-widest mb-2">
                CONFIRM NEW PASSWORD
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="input-marvel py-3 bg-[#08080c]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="btn-gold px-8 py-3.5 text-xs tracking-widest gap-2 cursor-pointer shadow-lg"
            >
              <KeyRound size={16} />
              <span>Update Password</span>
            </button>
          </form>
        </div>
      )}

      {/* ── TAB 3: Order History ── */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          <h2 className="font-display text-2xl text-white tracking-wide uppercase">
            YOUR COLLECTOR ORDER HISTORY
          </h2>

          {orders.length === 0 ? (
            <div className="p-8 bg-[#14141c] border border-[#1e1e2a] text-center space-y-4">
              <Package size={40} className="text-gray-600 mx-auto" />
              <p className="text-sm text-gray-400 font-medium">No order history available yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o.id} className="bg-[#14141c] border border-[#1e1e2a] p-6 rounded-xs space-y-3 shadow-md">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-amber-400">{o.id}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 bg-gray-900 border border-gray-800 text-gray-300">
                        {o.paymentMethod === "cod" ? "COD (+₹50)" : "ONLINE"}
                      </span>
                      {o.status === "cancelled" ? (
                        <span className="uppercase text-[9px] font-extrabold tracking-widest px-2.5 py-1 bg-red-500/20 text-red-400 border border-red-500/30">
                          CANCELLED
                        </span>
                      ) : (
                        <span className="uppercase text-[9px] font-extrabold tracking-widest px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {o.status}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {o.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs text-white">
                        <span>{item.name} × {item.quantity}</span>
                        <span className="font-mono">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#1e1e2a]">
                    <span className="font-display text-2xl text-red-500">{formatPrice(o.total)}</span>
                    {o.status !== "cancelled" && o.status !== "delivered" && (
                      <button
                        onClick={() => handleCancelOrder(o.id)}
                        className="btn-outline text-[10px] px-2.5 py-1 border-red-500/40 text-red-400 hover:bg-red-500/10 gap-1 cursor-pointer"
                      >
                        <XCircle size={12} />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
