"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/motion/variants";

// Demo products — replace with DB query
const BEST_SELLERS = [
  { id: "1", slug: "iron-man-repulsor-tee", name: "Iron Man Repulsor Tech Tee", price: 1799, comparePrice: 2499, imageUrl: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600", badge: "limited" as const, stockCount: 45, variantId: "v1", variantLabel: "L / Black" },
  { id: "2", slug: "spider-man-web-hoodie", name: "Spider-Man Web Shooter Hoodie", price: 3299, imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600", badge: "new" as const, stockCount: 120, variantId: "v2", variantLabel: "M / Red" },
  { id: "3", slug: "avengers-logo-cap", name: "Avengers Logo Cap — Limited Run", price: 899, imageUrl: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600", badge: "exclusive" as const, stockCount: 8, variantId: "v3", variantLabel: "One Size" },
  { id: "4", slug: "black-panther-wakanda-jacket", name: "Wakanda Forever Bomber Jacket", price: 5999, comparePrice: 7999, imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600", badge: "limited" as const, stockCount: 22, variantId: "v4", variantLabel: "L / Purple" },
];

export default function BestSellers() {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      {BEST_SELLERS.map((product) => (
        <motion.div key={product.id} variants={staggerItemVariants}>
          <ProductCard {...product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
