// ─────────────────────────────────────────────────────────
// Zod Validation Schemas — Checkout
// ─────────────────────────────────────────────────────────
import { z } from "zod";

export const addressSchema = z.object({
  name: z.string().min(2, "Full name required").max(100),
  line1: z.string().min(5, "Address line 1 is required").max(255),
  line2: z.string().max(255).optional(),
  city: z.string().min(2, "City is required").max(100),
  state: z.string().min(2, "State is required").max(100),
  postalCode: z
    .string()
    .regex(/^\d{6}$/, "Enter a valid 6-digit PIN code"),
  country: z.string().min(1, "Country is required"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number")
    .optional(),
});

export const checkoutSchema = z.object({
  addressId: z.string().uuid().optional(),
  newAddress: addressSchema.optional(),
  couponCode: z.string().max(50).optional(),
  notes: z.string().max(500).optional(),
  saveAddress: z.boolean().optional(),
}).refine(
  (data) => data.addressId || data.newAddress,
  "Please select or add a delivery address"
);

export const couponSchema = z.object({
  code: z.string().min(1, "Enter a coupon code").max(50).trim().toUpperCase(),
});

export type AddressFormData = z.infer<typeof addressSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
export type CouponFormData = z.infer<typeof couponSchema>;
