"use client";
// ─────────────────────────────────────────────────────────
// Login Page
// ─────────────────────────────────────────────────────────
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error("Login failed", { description: error.message });
      setLoading(false);
      return;
    }

    toast.success("Welcome back to the universe!");
    router.push("/");
    router.refresh();
  }

  return (
    <div>
      <h1 className="font-display text-4xl text-marvel-white tracking-wide mb-2">SIGN IN</h1>
      <p className="font-sans text-sm text-marvel-white-muted mb-8">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-marvel-red hover:underline">Register here</Link>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email */}
        <div>
          <label className="label-marvel block mb-2">Email</label>
          <input
            {...register("email")}
            type="email"
            placeholder="your@email.com"
            className="input-marvel"
            autoComplete="email"
          />
          {errors.email && (
            <p className="font-sans text-xs text-marvel-red mt-1.5">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="label-marvel">Password</label>
            <Link href="/forgot-password" className="font-sans text-xs text-marvel-white-muted hover:text-marvel-red transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="input-marvel pr-10"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-marvel-white-muted hover:text-marvel-white"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="font-sans text-xs text-marvel-red mt-1.5">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-marvel w-full justify-between mt-2"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-8 border-t border-marvel-black-border text-center">
        <p className="font-sans text-xs text-marvel-white-muted">
          By signing in you agree to our{" "}
          <Link href="/terms" className="hover:text-marvel-white">Terms</Link>
          {" "}and{" "}
          <Link href="/privacy" className="hover:text-marvel-white">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
