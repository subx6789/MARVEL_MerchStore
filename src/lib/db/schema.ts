// ─────────────────────────────────────────────────────────
// MARVEL MerchStore — Complete Database Schema
// Drizzle ORM + PostgreSQL (Supabase)
// 18 tables covering all platform entities
// ─────────────────────────────────────────────────────────

import {
  pgTable,
  pgEnum,
  text,
  varchar,
  integer,
  numeric,
  boolean,
  timestamp,
  jsonb,
  uuid,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ────────────────────────────────────────────────────────
// ENUMS
// ────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum("user_role", ["user", "vip", "admin"]);

export const productTypeEnum = pgEnum("product_type", [
  "standard",
  "limited",
  "event_only",
]);

export const productStatusEnum = pgEnum("product_status", [
  "draft",
  "active",
  "archived",
]);

export const dropStatusEnum = pgEnum("drop_status", [
  "scheduled",
  "live",
  "ended",
  "cancelled",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
]);

export const couponTypeEnum = pgEnum("coupon_type", ["percent", "fixed"]);

export const deliveryTypeEnum = pgEnum("delivery_type", [
  "flat_fee",
  "free_above",
  "free",
]);

// ────────────────────────────────────────────────────────
// TABLE 1: Users (extends Supabase Auth)
// ────────────────────────────────────────────────────────
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey(), // Same as auth.users.id
    email: varchar("email", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }),
    avatarUrl: text("avatar_url"),
    role: userRoleEnum("role").default("user").notNull(),
    phone: varchar("phone", { length: 20 }),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [uniqueIndex("users_email_idx").on(t.email)]
);

// ────────────────────────────────────────────────────────
// TABLE 2: Addresses
// ────────────────────────────────────────────────────────
export const addresses = pgTable("addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  line1: text("line1").notNull(),
  line2: text("line2"),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  postalCode: varchar("postal_code", { length: 20 }).notNull(),
  country: varchar("country", { length: 100 }).default("India").notNull(),
  phone: varchar("phone", { length: 20 }),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ────────────────────────────────────────────────────────
// TABLE 3: Categories
// ────────────────────────────────────────────────────────
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
  displayOrder: integer("display_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ────────────────────────────────────────────────────────
// TABLE 4: Products
// ────────────────────────────────────────────────────────
export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    shortDescription: text("short_description"),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    comparePrice: numeric("compare_price", { precision: 10, scale: 2 }),
    categoryId: uuid("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    type: productTypeEnum("type").default("standard").notNull(),
    status: productStatusEnum("status").default("draft").notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),
    isNew: boolean("is_new").default(false).notNull(),
    tags: text("tags").array().default([]),
    metadata: jsonb("metadata").default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    uniqueIndex("products_slug_idx").on(t.slug),
    index("products_status_idx").on(t.status),
    index("products_type_idx").on(t.type),
    index("products_category_idx").on(t.categoryId),
  ]
);

// ────────────────────────────────────────────────────────
// TABLE 5: Product Images
// ────────────────────────────────────────────────────────
export const productImages = pgTable("product_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  alt: varchar("alt", { length: 255 }),
  displayOrder: integer("display_order").default(0).notNull(),
  isPrimary: boolean("is_primary").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ────────────────────────────────────────────────────────
// TABLE 6: Product Variants (size + color combos)
// ────────────────────────────────────────────────────────
export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    size: varchar("size", { length: 20 }),
    color: varchar("color", { length: 50 }),
    colorHex: varchar("color_hex", { length: 7 }),
    sku: varchar("sku", { length: 100 }).unique(),
    priceModifier: numeric("price_modifier", { precision: 10, scale: 2 }).default("0"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("variants_product_idx").on(t.productId)]
);

// ────────────────────────────────────────────────────────
// TABLE 7: Inventory
// ────────────────────────────────────────────────────────
export const inventory = pgTable("inventory", {
  id: uuid("id").primaryKey().defaultRandom(),
  variantId: uuid("variant_id")
    .notNull()
    .unique()
    .references(() => productVariants.id, { onDelete: "cascade" }),
  stockCount: integer("stock_count").default(0).notNull(),
  reservedCount: integer("reserved_count").default(0).notNull(),
  lowStockThreshold: integer("low_stock_threshold").default(10).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ────────────────────────────────────────────────────────
// TABLE 8: Limited Drops
// ────────────────────────────────────────────────────────
export const limitedDrops = pgTable(
  "limited_drops",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }),
    dropStock: integer("drop_stock").notNull(),
    soldCount: integer("sold_count").default(0).notNull(),
    status: dropStatusEnum("status").default("scheduled").notNull(),
    bannerImageUrl: text("banner_image_url"),
    isFeatured: boolean("is_featured").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("drops_status_idx").on(t.status)]
);

// ────────────────────────────────────────────────────────
// TABLE 9: Event Campaigns
// ────────────────────────────────────────────────────────
export const eventCampaigns = pgTable("event_campaigns", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  venue: varchar("venue", { length: 255 }),
  eventDate: timestamp("event_date", { withTimezone: true }),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  isActive: boolean("is_active").default(true).notNull(),
  bannerImageUrl: text("banner_image_url"),
  accessInstructions: text("access_instructions"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ────────────────────────────────────────────────────────
// TABLE 10: Event Products (join table)
// ────────────────────────────────────────────────────────
export const eventProducts = pgTable("event_products", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id")
    .notNull()
    .references(() => eventCampaigns.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  displayOrder: integer("display_order").default(0),
});

// ────────────────────────────────────────────────────────
// TABLE 11: QR Access Records
// ────────────────────────────────────────────────────────
export const qrAccessRecords = pgTable("qr_access_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  campaignId: uuid("campaign_id")
    .notNull()
    .references(() => eventCampaigns.id, { onDelete: "cascade" }),
  token: uuid("token").notNull().unique().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  isUsed: boolean("is_used").default(false).notNull(),
  scannedAt: timestamp("scanned_at", { withTimezone: true }),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ────────────────────────────────────────────────────────
// TABLE 12: Wishlists
// ────────────────────────────────────────────────────────
export const wishlists = pgTable(
  "wishlists",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    uniqueIndex("wishlist_user_product_idx").on(t.userId, t.productId),
  ]
);

// ────────────────────────────────────────────────────────
// TABLE 13: Cart Items
// ────────────────────────────────────────────────────────
export const cartItems = pgTable(
  "cart_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    sessionId: varchar("session_id", { length: 255 }), // For guest cart
    variantId: uuid("variant_id")
      .notNull()
      .references(() => productVariants.id, { onDelete: "cascade" }),
    quantity: integer("quantity").default(1).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("cart_user_idx").on(t.userId)]
);

// ────────────────────────────────────────────────────────
// TABLE 14: Coupons
// ────────────────────────────────────────────────────────
export const coupons = pgTable("coupons", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  type: couponTypeEnum("type").notNull(),
  value: numeric("value", { precision: 10, scale: 2 }).notNull(),
  minOrderAmount: numeric("min_order_amount", { precision: 10, scale: 2 }),
  maxUses: integer("max_uses"),
  usedCount: integer("used_count").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ────────────────────────────────────────────────────────
// TABLE 15: Delivery Rules
// ────────────────────────────────────────────────────────
export const deliveryRules = pgTable("delivery_rules", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  type: deliveryTypeEnum("type").notNull(),
  flatFee: numeric("flat_fee", { precision: 10, scale: 2 }).default("0"),
  freeAboveAmount: numeric("free_above_amount", { precision: 10, scale: 2 }),
  estimatedDays: varchar("estimated_days", { length: 50 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ────────────────────────────────────────────────────────
// TABLE 16: Orders
// ────────────────────────────────────────────────────────
export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderNumber: varchar("order_number", { length: 20 }).notNull().unique(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    addressId: uuid("address_id").references(() => addresses.id, {
      onDelete: "set null",
    }),
    status: orderStatusEnum("status").default("pending").notNull(),
    subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
    discountAmount: numeric("discount_amount", { precision: 10, scale: 2 }).default("0"),
    deliveryFee: numeric("delivery_fee", { precision: 10, scale: 2 }).default("0"),
    total: numeric("total", { precision: 10, scale: 2 }).notNull(),
    couponCode: varchar("coupon_code", { length: 50 }),
    couponId: uuid("coupon_id").references(() => coupons.id, {
      onDelete: "set null",
    }),
    stripePaymentIntentId: text("stripe_payment_intent_id"),
    notes: text("notes"),
    shippingAddress: jsonb("shipping_address"), // Snapshot at order time
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("orders_user_idx").on(t.userId),
    index("orders_status_idx").on(t.status),
  ]
);

// ────────────────────────────────────────────────────────
// TABLE 17: Order Items
// ────────────────────────────────────────────────────────
export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  variantId: uuid("variant_id").references(() => productVariants.id, {
    onDelete: "set null",
  }),
  productId: uuid("product_id").references(() => products.id, {
    onDelete: "set null",
  }),
  productName: varchar("product_name", { length: 255 }).notNull(), // Snapshot
  variantLabel: varchar("variant_label", { length: 100 }), // e.g. "L / Black"
  imageUrl: text("image_url"),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ────────────────────────────────────────────────────────
// TABLE 18: Analytics Events
// ────────────────────────────────────────────────────────
export const analyticsEvents = pgTable(
  "analytics_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventType: varchar("event_type", { length: 100 }).notNull(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    sessionId: varchar("session_id", { length: 255 }),
    metadata: jsonb("metadata").default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("analytics_event_type_idx").on(t.eventType),
    index("analytics_created_idx").on(t.createdAt),
  ]
);

// ────────────────────────────────────────────────────────
// RELATIONS (for Drizzle query builder)
// ────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  addresses: many(addresses),
  wishlists: many(wishlists),
  cartItems: many(cartItems),
  orders: many(orders),
  qrRecords: many(qrAccessRecords),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  images: many(productImages),
  variants: many(productVariants),
  drops: many(limitedDrops),
  eventProducts: many(eventProducts),
  wishlists: many(wishlists),
  orderItems: many(orderItems),
}));

export const productVariantsRelations = relations(
  productVariants,
  ({ one }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
    inventory: one(inventory, {
      fields: [productVariants.id],
      references: [inventory.variantId],
    }),
  })
);

export const limitedDropsRelations = relations(limitedDrops, ({ one }) => ({
  product: one(products, {
    fields: [limitedDrops.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  address: one(addresses, {
    fields: [orders.addressId],
    references: [addresses.id],
  }),
  items: many(orderItems),
}));

export const eventCampaignsRelations = relations(
  eventCampaigns,
  ({ many }) => ({
    products: many(eventProducts),
    qrRecords: many(qrAccessRecords),
  })
);
