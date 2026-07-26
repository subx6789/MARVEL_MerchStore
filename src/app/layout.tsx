// ─────────────────────────────────────────────────────────
// Root Layout — MARVEL MerchStore
// ─────────────────────────────────────────────────────────
import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

// ── Google Fonts ─────────────────────────────────────────
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
  display: "swap",
});

// ── Site Metadata ─────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: "MARVEL MerchStore — Official Collector's Edition",
    template: "%s | MARVEL MerchStore",
  },
  description:
    "The official MARVEL luxury merch platform. Limited drops, event exclusives, and collector-grade gear for true fans. Shop rare, wear rare.",
  keywords: [
    "Marvel merch",
    "Marvel collectibles",
    "limited drops",
    "Marvel apparel",
    "Marvel accessories",
    "MARVEL MerchStore",
  ],
  authors: [{ name: "MARVEL MerchStore" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "MARVEL MerchStore",
    title: "MARVEL MerchStore — Official Collector's Edition",
    description:
      "Limited drops, event exclusives, and collector-grade gear. Shop rare, wear rare.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MARVEL MerchStore",
    description: "Limited drops. Event exclusives. Collector-grade gear.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bebasNeue.variable}`}
      suppressHydrationWarning
    >
      <body
        className="font-sans bg-marvel-black text-marvel-white antialiased"
        suppressHydrationWarning
      >
        {children}

        {/* Global Toast Notifications */}
        <Toaster
          position="top-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "#161616",
              border: "1px solid #1E1E1E",
              color: "#F5F5F0",
              borderRadius: "2px",
              fontSize: "14px",
            },
          }}
        />
      </body>
    </html>
  );
}
