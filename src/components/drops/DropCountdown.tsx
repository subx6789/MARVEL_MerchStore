"use client";
// ─────────────────────────────────────────────────────────
// Drop Countdown Timer
// Real-time countdown with dramatic visual styling
// ─────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getTimeRemaining } from "@/lib/utils";

interface DropCountdownProps {
  targetDate: Date | string;
  showLabels?: boolean;
  size?: "sm" | "md" | "lg";
  onExpire?: () => void;
}

export default function DropCountdown({
  targetDate,
  showLabels = true,
  size = "md",
  onExpire,
}: DropCountdownProps) {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    setMounted(true);
    setTime(getTimeRemaining(targetDate));

    const timer = setInterval(() => {
      const remaining = getTimeRemaining(targetDate);
      setTime(remaining);
      if (remaining.isExpired) {
        clearInterval(timer);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onExpire]);

  if (!mounted) {
    return (
      <div className="flex items-center gap-3 md:gap-5 min-h-[4rem]">
        <span className="font-display text-4xl text-marvel-white-muted animate-pulse">00:00:00:00</span>
      </div>
    );
  }

  if (time.isExpired) {
    return (
      <div className="flex items-center gap-2">
        <span className="badge-live">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          LIVE NOW
        </span>
      </div>
    );
  }

  const digitClass = {
    sm: "text-3xl md:text-4xl",
    md: "text-5xl md:text-6xl",
    lg: "text-6xl md:text-8xl",
  }[size];

  const labelClass = {
    sm: "text-[8px]",
    md: "text-[9px]",
    lg: "text-[10px]",
  }[size];

  const units = [
    { value: time.days, label: "DAYS" },
    { value: time.hours, label: "HRS" },
    { value: time.minutes, label: "MIN" },
    { value: time.seconds, label: "SEC" },
  ];

  return (
    <div className="flex items-center gap-3 md:gap-5" role="timer" aria-label="Drop countdown">
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-3 md:gap-5">
          <div className="flex flex-col items-center">
            <div className={`font-display ${digitClass} text-marvel-white leading-none tabular-nums min-w-[2ch] text-center`}>
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={unit.value}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="inline-block"
                >
                  {String(unit.value).padStart(2, "0")}
                </motion.span>
              </AnimatePresence>
            </div>
            {showLabels && (
              <span className={`${labelClass} font-sans font-700 tracking-[0.2em] text-marvel-white-muted mt-1`}>
                {unit.label}
              </span>
            )}
          </div>
          {/* Separator */}
          {i < 3 && (
            <span className={`font-display ${digitClass} text-marvel-red leading-none opacity-60 mb-4`}>
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
