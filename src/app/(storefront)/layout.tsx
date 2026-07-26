// ─────────────────────────────────────────────────────────
// Storefront Layout — wraps all public pages
// Includes Navbar, CartDrawer, and Footer
// ─────────────────────────────────────────────────────────
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[calc(2rem+4rem)]">
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
