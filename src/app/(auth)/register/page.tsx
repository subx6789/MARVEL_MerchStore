"use client";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormData) {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { name: data.name, role: "user" },
      },
    });

    if (error) {
      toast.error("Registration failed", { description: error.message });
      setLoading(false);
      return;
    }

    toast.success("Welcome to the universe!", {
      description: "Please check your email to confirm your account.",
    });
    router.push("/");
  }

  return (
    <div>
      <h1 className="font-display text-4xl text-marvel-white tracking-wide mb-2">JOIN THE UNIVERSE</h1>
      <p className="font-sans text-sm text-marvel-white-muted mb-8">
        Already a member?{" "}
        <Link href="/login" className="text-marvel-red hover:underline">Sign in</Link>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="label-marvel block mb-2">Full Name</label>
          <input {...register("name")} type="text" placeholder="Tony Stark" className="input-marvel" />
          {errors.name && <p className="font-sans text-xs text-marvel-red mt-1.5">{errors.name.message}</p>}
        </div>

        <div>
          <label className="label-marvel block mb-2">Email</label>
          <input {...register("email")} type="email" placeholder="your@email.com" className="input-marvel" />
          {errors.email && <p className="font-sans text-xs text-marvel-red mt-1.5">{errors.email.message}</p>}
        </div>

        <div>
          <label className="label-marvel block mb-2">Password</label>
          <div className="relative">
            <input {...register("password")} type={showPassword ? "text" : "password"} placeholder="Min 8 chars, 1 uppercase, 1 number" className="input-marvel pr-10" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-marvel-white-muted">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="font-sans text-xs text-marvel-red mt-1.5">{errors.password.message}</p>}
        </div>

        <div>
          <label className="label-marvel block mb-2">Confirm Password</label>
          <input {...register("confirmPassword")} type="password" placeholder="••••••••" className="input-marvel" />
          {errors.confirmPassword && <p className="font-sans text-xs text-marvel-red mt-1.5">{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" disabled={loading} className="btn-marvel w-full justify-between mt-2">
          {loading ? <><Loader2 size={16} className="animate-spin" />Creating Account...</> : <>Create Account <ArrowRight size={16} /></>}
        </button>
      </form>
    </div>
  );
}
