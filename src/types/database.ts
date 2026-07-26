// ─────────────────────────────────────────────────────────
// TypeScript Types — Inferred from DB schema
// ─────────────────────────────────────────────────────────
import type {
  users,
  addresses,
  categories,
  products,
  productImages,
  productVariants,
  inventory,
  limitedDrops,
  eventCampaigns,
  qrAccessRecords,
  wishlists,
  cartItems,
  coupons,
  deliveryRules,
  orders,
  orderItems,
} from "@/lib/db/schema";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

// ── Select Types (read from DB) ──────────────────────────
export type User = InferSelectModel<typeof users>;
export type Address = InferSelectModel<typeof addresses>;
export type Category = InferSelectModel<typeof categories>;
export type Product = InferSelectModel<typeof products>;
export type ProductImage = InferSelectModel<typeof productImages>;
export type ProductVariant = InferSelectModel<typeof productVariants>;
export type Inventory = InferSelectModel<typeof inventory>;
export type LimitedDrop = InferSelectModel<typeof limitedDrops>;
export type EventCampaign = InferSelectModel<typeof eventCampaigns>;
export type QrAccessRecord = InferSelectModel<typeof qrAccessRecords>;
export type Wishlist = InferSelectModel<typeof wishlists>;
export type CartItem = InferSelectModel<typeof cartItems>;
export type Coupon = InferSelectModel<typeof coupons>;
export type DeliveryRule = InferSelectModel<typeof deliveryRules>;
export type Order = InferSelectModel<typeof orders>;
export type OrderItem = InferSelectModel<typeof orderItems>;

// ── Insert Types (write to DB) ───────────────────────────
export type NewUser = InferInsertModel<typeof users>;
export type NewAddress = InferInsertModel<typeof addresses>;
export type NewProduct = InferInsertModel<typeof products>;
export type NewOrder = InferInsertModel<typeof orders>;

// ── Composite Types (for UI) ─────────────────────────────

/** Product with images, variants, inventory, and category */
export type ProductWithDetails = Product & {
  images: ProductImage[];
  variants: (ProductVariant & { inventory: Inventory | null })[];
  category: Category | null;
};

/** Cart item enriched with product data */
export type CartItemWithProduct = CartItem & {
  variant: ProductVariant & {
    product: Product & { images: ProductImage[] };
    inventory: Inventory | null;
  };
};

/** Order with all items */
export type OrderWithItems = Order & {
  items: OrderItem[];
  address: Address | null;
};

/** Drop with product */
export type DropWithProduct = LimitedDrop & {
  product: Product & { images: ProductImage[] };
};

/** Drop status derived at runtime */
export type DropStatus = "scheduled" | "live" | "ended" | "cancelled";

/** Badge variant type */
export type BadgeVariant =
  | "live"
  | "limited"
  | "vip"
  | "sold-out"
  | "low-stock"
  | "event-only"
  | "exclusive"
  | "new";

/** UI product card data (lightweight) */
export type ProductCard = {
  id: string;
  name: string;
  slug: string;
  price: string;
  comparePrice: string | null;
  type: Product["type"];
  status: Product["status"];
  isFeatured: boolean;
  isNew: boolean;
  image: string;
  badge?: BadgeVariant;
  stockStatus: "in-stock" | "low-stock" | "sold-out";
};

/** Checkout form data */
export type CheckoutFormData = {
  addressId?: string;
  newAddress?: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  couponCode?: string;
  notes?: string;
};

/** API Response wrapper */
export type ApiResponse<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string };
