"use client";
// ─────────────────────────────────────────────────────────
// Shared Skeleton Components
// Consistent loading states across the platform
// ─────────────────────────────────────────────────────────
import { cn } from "@/lib/utils";

// ── Base Skeleton ─────────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse bg-marvel-black-card",
        className
      )}
      style={{
        background:
          "linear-gradient(90deg, #161616 0%, #1e1e1e 50%, #161616 100%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 2s linear infinite",
      }}
    />
  );
}

// ── Product Card Skeleton ─────────────────────────────────
export function ProductCardSkeleton() {
  return (
    <div className="bg-marvel-black-card border border-marvel-black-border overflow-hidden">
      {/* Image */}
      <Skeleton className="aspect-square w-full" />
      {/* Content */}
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}

// ── Product Grid Skeleton ─────────────────────────────────
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ── Product Detail Skeleton ───────────────────────────────
export function ProductDetailSkeleton() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-3">
          <Skeleton className="aspect-square w-full" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square" />
            ))}
          </div>
        </div>
        {/* Details */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-20 w-full" />
          <div className="grid grid-cols-4 gap-2 py-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10" />
            ))}
          </div>
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}

// ── Drop Card Skeleton ────────────────────────────────────
export function DropCardSkeleton() {
  return (
    <div className="bg-marvel-black-card border border-marvel-black-border p-6 space-y-4">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1">
            <Skeleton className="h-10 w-12" />
            <Skeleton className="h-3 w-10" />
          </div>
        ))}
      </div>
      <Skeleton className="h-2 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}

// ── Order Item Skeleton ───────────────────────────────────
export function OrderItemSkeleton() {
  return (
    <div className="flex gap-4 py-4 border-b border-marvel-black-border">
      <Skeleton className="w-16 h-16 shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

// ── Admin Stats Skeleton ──────────────────────────────────
export function AdminStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="admin-stat space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

// ── Table Skeleton ────────────────────────────────────────
export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="space-y-0">
      <div className="flex gap-4 px-4 py-3 border-b border-marvel-black-border">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-3 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 px-4 py-4 border-b border-marvel-black-border">
          {Array.from({ length: 5 }).map((_, j) => (
            <Skeleton key={j} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Page Hero Skeleton ────────────────────────────────────
export function PageHeroSkeleton() {
  return (
    <div className="min-h-[40vh] border-b border-marvel-black-border">
      <Skeleton className="w-full h-full min-h-[40vh]" />
    </div>
  );
}
