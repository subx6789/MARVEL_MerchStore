"use client";

// ─────────────────────────────────────────────────────────
// Admin Login Page — MARVEL HQ Operations Security Console
// Dedicated login portal for store administrators
// Features Admin Sign In & Forgot Password OTP workflow.
// NO public user registration allowed.
// ─────────────────────────────────────────────────────────
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, ShieldCheck, Lock, ArrowLeft, KeyRound, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import { soundFx } from "@/lib/sound";
import MarvelLogo from "@/components/shared/MarvelLogo";

export default function AdminLoginPage() {
  const router = useRouter();
  const { signInWithEmail, sendResetOTP, verifyResetOTP, resetPasswordWithOTP, isLoading } = useAuthStore();

  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password 3-Step State
  const [resetStep, setResetStep] = useState<1 | 2 | 3>(1);
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Handle Admin Sign In
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick();

    if (!email || !password) {
      toast.error("Please fill in admin credentials");
      return;
    }

    const res = await signInWithEmail(email, password);
    if (res.success) {
      soundFx.playUnlock();
      toast.success("Admin Authorization Granted", {
        description: "Welcome to MARVEL HQ Operations Console",
      });
      window.location.href = "/admin";
    } else {
      toast.error("Authorization Failed", { description: res.error || "Invalid admin credentials" });
    }
  };

  // Step 1: Send Reset OTP
  const handleSendResetOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick();
    if (!email) {
      toast.error("Please enter your registered admin email");
      return;
    }
    const res = await sendResetOTP(email);
    if (res.success) {
      soundFx.playUnlock();
      setResetStep(2);
      toast.success(`Verification OTP sent to ${email}`, {
        description: `Your OTP Code is: ${res.otp}`,
        duration: 10000,
      });
    } else {
      toast.error(res.error || "Failed to send OTP code");
    }
  };

  // Step 2: Verify Reset OTP
  const handleVerifyResetOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick();
    if (!otpCode || otpCode.length < 6) {
      toast.error("Please enter the 6-digit verification code");
      return;
    }
    const res = await verifyResetOTP(email, otpCode);
    if (res.success) {
      soundFx.playUnlock();
      setResetStep(3);
      toast.success("OTP Verified! Set your new admin password.");
    } else {
      toast.error(res.error || "Invalid OTP code");
    }
  };

  // Step 3: Update Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick();
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const res = await resetPasswordWithOTP(email, newPassword);
    if (res.success) {
      soundFx.playUnlock();
      toast.success("Admin password updated successfully! You can now sign in.");
      setMode("login");
      setResetStep(1);
    } else {
      toast.error(res.error || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen bg-[#08080c] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Cyber Tech Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-150 h-75 bg-red-600/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#00f0ff]/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Cyber Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="w-full max-w-md z-10 space-y-6">
        {/* Back link */}
        <Link
          href="/"
          onClick={() => soundFx.playClick()}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Return to Storefront
        </Link>

        {/* Main Admin Console Box */}
        <div className="bg-[#14141c]/95 border border-red-500/40 shadow-[0_0_50px_rgba(0,0,0,0.9)] rounded-xs overflow-hidden backdrop-blur-xl">
          {/* Top Security Banner */}
          <div className="bg-[#e23636] text-white px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black tracking-widest uppercase">
              <ShieldCheck size={16} />
              <span>MARVEL HQ — OPERATIONS CONSOLE</span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-black/40 px-2 py-0.5 border border-white/20">
              RESTRICTED
            </span>
          </div>

          <div className="p-8 space-y-6">
            {/* Logo & Header */}
            <div className="text-center space-y-2 border-b border-[#1e1e2a] pb-6">
              <MarvelLogo size="md" />
              <h1 className="font-display text-2xl text-white tracking-wider uppercase font-extrabold pt-2">
                {mode === "login" ? "ADMIN AUTHORIZATION" : "ADMIN PASSWORD RESET"}
              </h1>
              <p className="text-xs text-gray-400 font-medium max-w-xs mx-auto leading-relaxed">
                {mode === "login"
                  ? "Enter authorized admin credentials to access store operations."
                  : resetStep === 1
                  ? "Enter registered admin email to receive verification code."
                  : resetStep === 2
                  ? `Enter 6-digit OTP code sent to ${email}`
                  : "Set a new secure password for your admin account."}
              </p>
            </div>

            {/* ── MODE 1: ADMIN SIGN IN ── */}
            {mode === "login" && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-widest mb-1.5">
                    ADMIN EMAIL
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@marvel.com"
                    className="input-marvel text-sm py-3 bg-[#08080c] focus:border-red-500"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-widest">
                      SECURITY PASSWORD
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        setMode("forgot");
                        setResetStep(1);
                      }}
                      className="text-[11px] text-amber-400 hover:underline font-bold uppercase tracking-wider"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input-marvel text-sm py-3 pr-10 bg-[#08080c] focus:border-red-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-marvel text-sm py-3.5 gap-2 uppercase tracking-widest font-black shadow-[0_0_20px_rgba(226,54,54,0.5)] cursor-pointer mt-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={16} />
                      <span>AUTHORIZE & ACCESS CONSOLE</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ── MODE 2: ADMIN FORGOT PASSWORD ── */}
            {mode === "forgot" && (
              <div className="space-y-4">
                {resetStep === 1 && (
                  <form onSubmit={handleSendResetOTP} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-widest mb-1.5">
                        ADMIN EMAIL ADDRESS
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@marvel.com"
                        className="input-marvel text-sm py-3 bg-[#08080c] focus:border-red-500"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full btn-marvel text-sm py-3.5 gap-2 uppercase tracking-widest font-black cursor-pointer"
                    >
                      {isLoading ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />}
                      <span>SEND VERIFICATION CODE</span>
                    </button>
                  </form>
                )}

                {resetStep === 2 && (
                  <form onSubmit={handleVerifyResetOTP} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-widest mb-1.5">
                        ENTER 6-DIGIT OTP CODE
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                        placeholder="849201"
                        className="input-marvel font-mono text-center text-xl tracking-[0.4em] py-3 bg-[#08080c]"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full btn-marvel text-sm py-3.5 gap-2 uppercase tracking-widest font-black cursor-pointer"
                    >
                      <MailCheck size={16} />
                      <span>VERIFY OTP CODE</span>
                    </button>
                  </form>
                )}

                {resetStep === 3 && (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-widest mb-1.5">
                        NEW ADMIN PASSWORD
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="input-marvel text-sm py-3 bg-[#08080c]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-widest mb-1.5">
                        CONFIRM NEW PASSWORD
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="input-marvel text-sm py-3 bg-[#08080c]"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full btn-marvel text-sm py-3.5 gap-2 uppercase tracking-widest font-black cursor-pointer"
                    >
                      <Lock size={16} />
                      <span>UPDATE ADMIN PASSWORD</span>
                    </button>
                  </form>
                )}

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-xs text-gray-400 hover:text-white font-bold uppercase tracking-wider"
                  >
                    ← Back to Admin Sign In
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-gray-400 font-mono">
          Authorized Admin Personnel Only. Public registration disabled.
        </p>
      </div>
    </div>
  );
}
