# ⚡ MARVEL MerchStore — Official Collector's Drop House

> A ruthlessly premium, production-grade release engine and luxury collector vault built for MARVEL drops, event exclusives, and high-status merchandise.

---

## 🌟 Architectural & Design Highlights

- **Ultra-Luxury Neo-Brutalism Design System**: Heavy contrast framing, monumental typography (`Bebas Neue` + `Inter`), custom micro-animations with Framer Motion, and color palette (`#0A0A0A` Deep Black, `#E23636` MARVEL Red, `#F0B429` Gold).
- **18-Table PostgreSQL Schema (Supabase & Drizzle ORM)**: Products, product variants, inventory, limited drops, event campaigns, QR access pass records, wishlists, cart items, coupons, orders, order items, and analytics events.
- **Limited Drop Engine**: Real-time countdown clocks, stock progress allocation meters, and urgency signals.
- **VIP Event QR Gate System**: Pass token authentication system for physical event exclusive merchandise releases.
- **Admin Command Console**: Operations dashboard for revenue metrics, live drop scheduling, order fulfillment, coupon creation, and QR pass gate management.
- **Docker Containerization**: Multi-stage Dockerfile (`output: "standalone"`) and docker-compose environment.

---

## 🚀 Quick Start (Local Setup)

### 1. Prerequisites

- Node.js `>= 20`
- npm `>= 10`
- Docker (optional for containerized deployment)

### 2. Environment Variables Setup

Create a `.env.local` file in the root directory:

```bash
# ═══════════════════════════════════════════════════════════
# MARVEL MerchStore — Environment Variables EXAMPLE
# Copy this to .env.local and fill in your values
# ═══════════════════════════════════════════════════════════

# ── Supabase (Database & Realtime Subscriptions) ─────────
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
DATABASE_URL=postgresql://postgres:your_password@db.your-project-ref.supabase.co:5432/postgres

# ── ImageKit CDN Storage (Replaces Supabase Storage) ─────
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_your_imagekit_key
IMAGEKIT_PRIVATE_KEY=private_your_imagekit_key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/marvelmerch

# ── Better-Auth (Replaces Supabase Auth) ────────────────
BETTER_AUTH_SECRET=your_better_auth_secret_key_here
BETTER_AUTH_URL=http://localhost:3000

# ── App Config ────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="MARVEL"

# ── Stripe ────────────────────────────────────────────────
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

```

### 3. Install Dependencies & Run Development Server

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Default Admin Credentials

Access the Admin Operations Console at **`http://localhost:3000/admin`**:

| Field        | Credential              |
| ------------ | ----------------------- |
| **Email**    | `admin@marvelmerch.com` |
| **Password** | `AdminPassword2025!`    |
| **Role**     | `admin`                 |

---

## 📍 Route Directory (33 Built Pages)

### Storefront

- `/` — Flagship Homepage (Hero, Live Drops, Collections, Best Sellers, VIP Events)
- `/shop` — Product Catalog (Search, Universe Filters, Price Sorting)
- `/product/[slug]` — Product Detail (Photo Gallery, Size/Color Selectors, Stock Meter)
- `/drops` — Limited Drop Stage (Live Countdowns & Allocation Meters)
- `/events` — Event Campaign Directory
- `/events/[eventId]` — VIP QR Pass Token Unlock Portal
- `/cart` — Cart Manager & Order Summary
- `/checkout` — Address Validation, Promo Coupon Engine, Order Confirmation
- `/wishlist` — Collector Vault
- `/profile` — User Account & Order History
- `/orders` — Customer Order History

### Auth & Legal

- `/login` & `/register` & `/forgot-password` — Supabase Auth Suite
- `/faq`, `/shipping`, `/returns`, `/size-guide`, `/contact`, `/terms`, `/privacy`, `/cookies`

### Admin Operations Suite

- `/admin` — Overview Command Center
- `/admin/products` — Product Catalog & Stock Controls
- `/admin/drops` — Limited Drop Orchestration
- `/admin/orders` — Order Fulfillment Tracking
- `/admin/events` — Event Gate & QR Pass Analytics
- `/admin/coupons` — Promo Discount Manager
- `/admin/users` — User Directory & Role Assignments
- `/admin/analytics` & `/admin/settings`

---

## 🐳 Docker Deployment

To build and run the production stack in Docker:

```bash
# Build and launch Next.js container + PostgreSQL mirror
docker compose up --build
```

---

## 🛠️ Verification & Build Commands

```bash
# Type check TypeScript codebase
npx tsc --noEmit

# Run Next.js production build
npm run build
```
