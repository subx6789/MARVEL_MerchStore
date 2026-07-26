// ─────────────────────────────────────────────────────────
// Utility Functions
// ─────────────────────────────────────────────────────────
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

/**
 * Merge Tailwind class names safely (handles conflicts)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency in INR
 */
export function formatPrice(
  price: number | string,
  currency = "INR"
): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
  return format(new Date(date), "dd MMM yyyy");
}

/**
 * Format datetime for display
 */
export function formatDateTime(date: Date | string): string {
  return format(new Date(date), "dd MMM yyyy, hh:mm a");
}

/**
 * Generate a URL-friendly slug from a string
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Generate a unique order number
 */
export function generateOrderNumber(): string {
  const prefix = "MVL";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Calculate time remaining for a drop countdown
 */
export function getTimeRemaining(targetDate: Date | string) {
  const target = new Date(targetDate).getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    isExpired: false,
  };
}

/**
 * Get stock status label and variant
 */
export function getStockStatus(stock: number, threshold = 10) {
  if (stock === 0) return { label: "SOLD OUT", variant: "sold-out" as const };
  if (stock <= threshold) return { label: "LOW STOCK", variant: "low-stock" as const };
  return { label: "IN STOCK", variant: "in-stock" as const };
}

/**
 * Truncate text to a max length
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
}

/**
 * Safely parse JSON with a fallback
 */
export function safeParseJson<T>(json: unknown, fallback: T): T {
  try {
    if (typeof json === "string") return JSON.parse(json);
    if (json && typeof json === "object") return json as T;
    return fallback;
  } catch {
    return fallback;
  }
}

/**
 * Delay helper for animations and testing
 */
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get the primary image URL for a product
 */
export function getPrimaryImage(
  images: Array<{ url: string; isPrimary: boolean }> | undefined
): string {
  if (!images || images.length === 0) {
    return "/images/placeholder-product.jpg";
  }
  const primary = images.find((img) => img.isPrimary);
  return primary?.url ?? images[0].url;
}

/**
 * Calculate discount percentage
 */
export function getDiscountPercent(
  price: number | string,
  comparePrice: number | string
): number {
  const p = typeof price === "string" ? parseFloat(price) : price;
  const cp =
    typeof comparePrice === "string" ? parseFloat(comparePrice) : comparePrice;
  if (!cp || cp <= p) return 0;
  return Math.round(((cp - p) / cp) * 100);
}
