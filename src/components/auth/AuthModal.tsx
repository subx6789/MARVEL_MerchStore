"use client";

// ─────────────────────────────────────────────────────────
// AuthModal — High-Octane Marvel MerchStore Auth Modal
// Matches marvel-drop-zone.lovable.app/auth design precisely:
// Hazard tape bars, BetterAuth engine, Gold action button.
// OTP Email verification during registration & password reset.
// Strict dismissal rule: Outside click does NOT close modal.
// ─────────────────────────────────────────────────────────
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Loader2, ShieldCheck, KeyRound, CheckCircle2, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuthModalStore } from "@/stores/authModalStore";
import { useAuthStore } from "@/stores/authStore";
import { soundFx } from "@/lib/sound";

export default function AuthModal() {
  const { isOpen, view, closeModal, setView } = useAuthModalStore();
  const {
    signInWithEmail,
    sendRegistrationOTP,
    verifyRegistrationOTP,
    sendResetOTP,
    verifyResetOTP,
    resetPasswordWithOTP,
    isLoading,
  } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Registration OTP step (1 = details form, 2 = 6-digit OTP verification)
  const [regStep, setRegStep] = useState<1 | 2>(1);
  const [regOtpCode, setRegOtpCode] = useState("");

  // Forgot Password OTP step (1 = email, 2 = OTP, 3 = new password)
  const [resetStep, setResetStep] = useState<1 | 2 | 3>(1);
  const [resetOtpCode, setResetOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!isOpen) return null;

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick();
    if (!email || !password) {
      toast.error("Please fill in email and password");
      return;
    }
    const res = await signInWithEmail(email, password);
    if (res.success) {
      soundFx.playUnlock();
      toast.success("Welcome back to MARVEL!");
      closeModal();
    } else {
      toast.error("Login Failed", { description: res.error });
    }
  };

  // Registration Step 1: Send OTP to Email
  const handleSendRegOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick();
    if (!name || !email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }
    const res = await sendRegistrationOTP(email, name, password);
    if (res.success) {
      soundFx.playUnlock();
      setRegStep(2);
      toast.success(`Verification OTP sent to ${email}`, {
        description: `Your Registration OTP is: ${res.otp}`,
        duration: 10000,
      });
    } else {
      toast.error(res.error || "Failed to send registration code");
    }
  };

  // Registration Step 2: Verify OTP & Complete Creation
  const handleVerifyRegOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick();
    if (!regOtpCode || regOtpCode.length < 6) {
      toast.error("Please enter the complete 6-digit OTP code");
      return;
    }
    const res = await verifyRegistrationOTP(regOtpCode);
    if (res.success) {
      soundFx.playUnlock();
      toast.success("Account created successfully! Welcome to MARVEL!");
      setRegStep(1);
      closeModal();
    } else {
      toast.error(res.error || "Registration Verification Failed");
    }
  };

  // Password Reset Step 1: Send OTP
  const handleSendResetOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick();
    if (!email) {
      toast.error("Please enter your registered email address");
      return;
    }
    const res = await sendResetOTP(email);
    if (res.success) {
      soundFx.playUnlock();
      setResetStep(2);
      toast.success(`Verification OTP sent to ${email}`, {
        description: `Your Reset OTP Code is: ${res.otp}`,
        duration: 10000,
      });
    } else {
      toast.error(res.error || "Failed to send OTP");
    }
  };

  // Password Reset Step 2: Verify OTP
  const handleVerifyResetOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick();
    if (!resetOtpCode || resetOtpCode.length < 6) {
      toast.error("Please enter the 6-digit OTP code");
      return;
    }
    const res = await verifyResetOTP(email, resetOtpCode);
    if (res.success) {
      soundFx.playUnlock();
      setResetStep(3);
      toast.success("OTP Verified! Enter your new password.");
    } else {
      toast.error(res.error || "Invalid OTP code");
    }
  };

  // Password Reset Step 3: Update Password
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
      toast.success("Password updated! You can now sign in.");
      setResetStep(1);
      setView("login");
    } else {
      toast.error(res.error || "Failed to reset password");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay (Intentionally does NOT close on outside click) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Content Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-md bg-[#141419] border border-[#26262a] shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden rounded-xs"
          >
            {/* Top Yellow & Black Hazard Caution Tape */}
            <div className="h-3.5 w-full bg-[repeating-linear-gradient(-45deg,#f0b429,#f0b429_12px,#000000_12px,#000000_24px)] shadow-md" />

            {/* Explicit Close Button (Cross) */}
            <button
              onClick={() => {
                soundFx.playClick();
                closeModal();
              }}
              className="absolute top-6 right-6 p-2 bg-[#08080c] border border-gray-800 text-gray-400 hover:text-white hover:border-red-500 rounded-full transition-all duration-200 z-20 group"
              aria-label="Close modal"
              title="Close modal"
            >
              <X size={18} className="group-hover:rotate-90 transition-transform duration-200" />
            </button>

            {/* Main Modal Body */}
            <div className="p-8 sm:p-10">
              {/* Header Title */}
              <div className="mb-6 pr-8">
                <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-[#f0b429] uppercase tracking-widest">
                  {view === "forgot" ? <KeyRound size={14} /> : <ShieldCheck size={14} />}
                  <span>Official Collector Account</span>
                </div>
                <h2 className="font-display text-4xl text-white tracking-wide uppercase font-extrabold">
                  {view === "login"
                    ? "SIGN IN"
                    : view === "register"
                    ? "CREATE AN ACCOUNT"
                    : "RESET PASSWORD"}
                </h2>
                <p className="text-xs text-gray-400 font-medium mt-1 leading-relaxed">
                  {view === "register" && regStep === 2
                    ? `Enter the 6-digit OTP code sent to ${email}`
                    : view === "forgot"
                    ? resetStep === 1
                      ? "Enter your email to receive a 6-digit verification OTP."
                      : resetStep === 2
                      ? `Enter the 6-digit OTP code sent to ${email}`
                      : "Create a new secure password for your account."
                    : "Accounts keep drops fair and unlock event-only merch."}
                </p>
              </div>

              {/* View 1: LOGIN */}
              {view === "login" && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-widest mb-1.5">
                      EMAIL
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="input-marvel text-sm py-3 bg-[#0d0d12]"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-widest">
                        PASSWORD
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          soundFx.playClick();
                          setResetStep(1);
                          setView("forgot");
                        }}
                        className="text-[11px] text-gray-400 hover:text-[#f0b429] transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="input-marvel text-sm py-3 pr-10 bg-[#0d0d12]"
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
                    className="w-full bg-[#f0b429] hover:bg-[#ffc800] text-black font-extrabold font-sans text-sm tracking-widest uppercase py-3.5 transition-all shadow-[0_0_20px_rgba(240,180,41,0.4)] flex items-center justify-center gap-2 mt-4 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <span>SIGN IN</span>
                    )}
                  </button>
                </form>
              )}

              {/* View 2: REGISTER (2-step OTP workflow) */}
              {view === "register" && (
                <div>
                  {regStep === 1 ? (
                    <form onSubmit={handleSendRegOTP} className="space-y-4">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-widest mb-1.5">
                          FULL NAME
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Peter Parker"
                          className="input-marvel text-sm py-3 bg-[#0d0d12]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-widest mb-1.5">
                          EMAIL
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="input-marvel text-sm py-3 bg-[#0d0d12]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-widest mb-1.5">
                          PASSWORD
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="input-marvel text-sm py-3 pr-10 bg-[#0d0d12]"
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
                        className="w-full bg-[#f0b429] hover:bg-[#ffc800] text-black font-extrabold font-sans text-sm tracking-widest uppercase py-3.5 transition-all shadow-[0_0_20px_rgba(240,180,41,0.4)] flex items-center justify-center gap-2 mt-4 cursor-pointer"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>Sending OTP...</span>
                          </>
                        ) : (
                          <span>SEND VERIFICATION CODE</span>
                        )}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyRegOTP} className="space-y-4">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-widest mb-1.5">
                          ENTER 6-DIGIT VERIFICATION OTP
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          value={regOtpCode}
                          onChange={(e) => setRegOtpCode(e.target.value.replace(/\D/g, ""))}
                          placeholder="592014"
                          className="input-marvel font-mono text-center text-xl tracking-[0.4em] py-3 bg-[#0d0d12]"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#f0b429] hover:bg-[#ffc800] text-black font-extrabold font-sans text-sm tracking-widest uppercase py-3.5 transition-all shadow-[0_0_20px_rgba(240,180,41,0.4)] flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <MailCheck size={16} />
                        <span>VERIFY OTP & COMPLETE REGISTRATION</span>
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* View 3: FORGOT PASSWORD */}
              {view === "forgot" && (
                <div>
                  {resetStep === 1 && (
                    <form onSubmit={handleSendResetOTP} className="space-y-4">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-widest mb-1.5">
                          REGISTERED EMAIL
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="input-marvel text-sm py-3 bg-[#0d0d12]"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#f0b429] hover:bg-[#ffc800] text-black font-extrabold font-sans text-sm tracking-widest uppercase py-3.5 transition-all shadow-[0_0_20px_rgba(240,180,41,0.4)] flex items-center justify-center gap-2 mt-2 cursor-pointer"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>Sending OTP...</span>
                          </>
                        ) : (
                          <span>SEND OTP CODE</span>
                        )}
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
                          value={resetOtpCode}
                          onChange={(e) => setResetOtpCode(e.target.value.replace(/\D/g, ""))}
                          placeholder="849201"
                          className="input-marvel font-mono text-center text-xl tracking-[0.4em] py-3 bg-[#0d0d12]"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#f0b429] hover:bg-[#ffc800] text-black font-extrabold font-sans text-sm tracking-widest uppercase py-3.5 transition-all shadow-[0_0_20px_rgba(240,180,41,0.4)] flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>VERIFY OTP</span>
                      </button>
                    </form>
                  )}

                  {resetStep === 3 && (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-widest mb-1.5">
                          NEW PASSWORD
                        </label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="input-marvel text-sm py-3 bg-[#0d0d12]"
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
                          className="input-marvel text-sm py-3 bg-[#0d0d12]"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#f0b429] hover:bg-[#ffc800] text-black font-extrabold font-sans text-sm tracking-widest uppercase py-3.5 transition-all shadow-[0_0_20px_rgba(240,180,41,0.4)] flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <CheckCircle2 size={16} />
                        <span>UPDATE PASSWORD</span>
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* View Switcher Links */}
              <div className="mt-6 pt-4 border-t border-[#26262a] text-center space-y-2">
                {view === "login" ? (
                  <p className="text-xs text-gray-400 font-medium">
                    New here?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        setRegStep(1);
                        setView("register");
                      }}
                      className="text-[#f0b429] hover:underline font-bold"
                    >
                      Create an account
                    </button>
                  </p>
                ) : view === "register" ? (
                  <p className="text-xs text-gray-400 font-medium">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        setView("login");
                      }}
                      className="text-[#f0b429] hover:underline font-bold"
                    >
                      Sign in
                    </button>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      setResetStep(1);
                      setView("login");
                    }}
                    className="text-xs text-[#f0b429] hover:underline font-bold"
                  >
                    ← Back to Sign In
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Yellow & Black Hazard Caution Tape */}
            <div className="h-3.5 w-full bg-[repeating-linear-gradient(-45deg,#f0b429,#f0b429_12px,#000000_12px,#000000_24px)] shadow-md" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
