"use client";
// ─────────────────────────────────────────────────────────
// Forgot Password Page
// ─────────────────────────────────────────────────────────
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordFormData) {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast.error("Error sending reset link", { description: error.message });
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
    toast.success("Password reset email sent!");
  }

  return (
    <div>
      <h1 className="font-display text-4xl text-marvel-white tracking-wide mb-2">RESET PASSWORD</h1>
      <p className="font-sans text-sm text-marvel-white-muted mb-8">
        Enter your registered email address to receive a secure recovery link.
      </p>

      {sent ? (
        <div className="bg-marvel-black-card border border-emerald-500/30 p-6 text-center space-y-4">
          <CheckCircle2 size={40} className="text-emerald-400 mx-auto" />
          <h2 className="font-display text-2xl text-marvel-white">CHECK YOUR INBOX</h2>
          <p className="font-sans text-xs text-marvel-white-muted leading-relaxed">
            We sent a password reset link to your email address. Follow the instructions to set a new password.
          </p>
          <Link href="/login" className="btn-outline w-full text-center text-xs block">
            Return to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="label-marvel block mb-2">Email Address</label>
            <input {...register("email")} type="email" placeholder="your@email.com" className="input-marvel" />
            {errors.email && <p className="font-sans text-xs text-marvel-red mt-1.5">{errors.email.message}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn-marvel w-full justify-between mt-2">
            {loading ? <><Loader2 size={16} className="animate-spin" />Sending Reset Link...</> : <>Send Reset Link <ArrowRight size={16} /></>}
          </button>
        </form>
      )}

      <div className="mt-8 pt-8 border-t border-marvel-black-border text-center">
        <Link href="/login" className="font-sans text-xs text-marvel-white-muted hover:text-marvel-white">
          Back to Login
        </Link>
      </div>
    </div>
  );
}
