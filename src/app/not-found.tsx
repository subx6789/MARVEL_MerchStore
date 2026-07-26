// ─────────────────────────────────────────────────────────
// 404 Page — Premium Error State
// ─────────────────────────────────────────────────────────
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "404 — Page Not Found" };

export default function NotFound() {
  return (
    <div className="min-h-screen bg-marvel-black flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="font-display text-[180px] text-marvel-red/10 leading-none select-none">
          404
        </div>
        <div className="-mt-8 relative z-10">
          <h1 className="font-display text-5xl text-marvel-white tracking-wide mb-4">
            LOST IN THE MULTIVERSE
          </h1>
          <p className="font-sans text-marvel-white-dim mb-8 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist in this universe. Even Doctor Strange can&apos;t find it.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-marvel">Back to Home</Link>
            <Link href="/shop" className="btn-outline">Browse Shop</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
