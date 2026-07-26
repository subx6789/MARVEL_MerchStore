"use client";
// ─────────────────────────────────────────────────────────
// MarvelBadge — Status and type badges
// Used throughout product cards, detail pages, admin
// ─────────────────────────────────────────────────────────
import { Zap, Crown, AlertTriangle, X, Star, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BadgeVariant } from "@/types/database";

interface MarvelBadgeProps {
  variant: BadgeVariant;
  className?: string;
  showIcon?: boolean;
}

const badgeConfig: Record<
  BadgeVariant,
  { label: string; className: string; icon: React.ReactNode }
> = {
  live: {
    label: "LIVE",
    className: "badge-live",
    icon: <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />,
  },
  limited: {
    label: "LIMITED",
    className: "badge-limited",
    icon: <Zap size={8} />,
  },
  vip: {
    label: "VIP ACCESS",
    className: "badge-vip",
    icon: <Crown size={8} />,
  },
  "sold-out": {
    label: "SOLD OUT",
    className: "badge-sold-out",
    icon: <X size={8} />,
  },
  "low-stock": {
    label: "LOW STOCK",
    className: "badge-low-stock",
    icon: <AlertTriangle size={8} />,
  },
  "event-only": {
    label: "EVENT ONLY",
    className: "badge-event-only",
    icon: <Lock size={8} />,
  },
  exclusive: {
    label: "EXCLUSIVE",
    className: "badge-exclusive",
    icon: <Star size={8} />,
  },
  new: {
    label: "NEW",
    className:
      "inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-sans font-700 tracking-widest uppercase px-2.5 py-1 border border-emerald-500/30",
    icon: <Star size={8} />,
  },
};

export default function MarvelBadge({
  variant,
  className,
  showIcon = true,
}: MarvelBadgeProps) {
  const config = badgeConfig[variant];
  return (
    <span className={cn(config.className, className)}>
      {showIcon && config.icon}
      {config.label}
    </span>
  );
}
