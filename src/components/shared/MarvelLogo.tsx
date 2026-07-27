"use client";

// ─────────────────────────────────────────────────────────
// Pure CSS/Tailwind Official MARVEL Logo Component
// Iconic White Heavy Typography inside Red Rectangular Block
// ─────────────────────────────────────────────────────────
import Link from "next/link";
import { soundFx } from "@/lib/sound";

interface MarvelLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  subtext?: string;
  href?: string;
  className?: string;
}

export default function MarvelLogo({
  size = "md",
  subtext = "",
  href = "/",
  className = "",
}: MarvelLogoProps) {
  const sizeMap = {
    sm: {
      box: "px-2.5 py-0.5 border border-red-500/40",
      text: "text-lg tracking-[-0.04em]",
      sub: "text-[7px] tracking-[0.25em]",
    },
    md: {
      box: "px-3.5 py-1 border border-red-500/50 shadow-[0_0_15px_rgba(226,54,54,0.4)]",
      text: "text-2xl md:text-3xl tracking-[-0.04em]",
      sub: "text-[8px] md:text-[9px] tracking-[0.3em]",
    },
    lg: {
      box: "px-5 py-1.5 border-2 border-red-500/60 shadow-[0_0_25px_rgba(226,54,54,0.5)]",
      text: "text-4xl md:text-5xl tracking-[-0.05em]",
      sub: "text-[10px] md:text-[11px] tracking-[0.35em]",
    },
    xl: {
      box: "px-7 py-2 border-2 border-red-500/70 shadow-[0_0_35px_rgba(226,54,54,0.6)]",
      text: "text-6xl md:text-7xl tracking-[-0.06em]",
      sub: "text-[12px] md:text-[14px] tracking-[0.4em]",
    },
  };

  const currentSize = sizeMap[size];

  const logoContent = (
    <div
      className={`inline-flex flex-col items-center select-none group cursor-pointer ${className}`}
      onMouseEnter={() => soundFx.playHover()}
    >
      {/* Official Red Rectangular MARVEL Box */}
      <div
        className={`bg-[#e23636] group-hover:bg-[#ff2828] transition-all duration-300 transform group-hover:scale-105 ${currentSize.box} relative overflow-hidden`}
      >
        {/* Subtle sheen highlight */}
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

        <span
          className={`font-display text-white font-black leading-none block uppercase ${currentSize.text}`}
          style={{
            fontFamily: "'Bebas Neue', 'Impact', sans-serif",
            textShadow: "0 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          MARVEL
        </span>
      </div>

      {/* Subtitle (Only rendered if explicitly specified) */}
      {subtext && (
        <span
          className={`font-sans font-extrabold uppercase text-gray-300 group-hover:text-white transition-colors mt-1 leading-none ${currentSize.sub}`}
        >
          {subtext}
        </span>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{logoContent}</Link>;
  }

  return logoContent;
}
