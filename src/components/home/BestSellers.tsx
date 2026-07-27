"use client";

// ─────────────────────────────────────────────────────────
// BestSellers — Dynamic Product Highlights
// Powered by useProductStore — No static hardcoded mock data
// ─────────────────────────────────────────────────────────
import { motion } from "framer-motion";
import ProductCard from "@/components/product/ProductCard";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/motion/variants";
import { useProductStore } from "@/stores/productStore";

export default function BestSellers() {
  const { products } = useProductStore();

  if (products.length === 0) {
    return (
      <div className="py-12 text-center border border-dashed border-[#1e1e2a] p-8 text-gray-500 text-xs font-mono">
        No featured products active in catalog. Add products via the Admin Dashboard to feature them here!
      </div>
    );
  }

  const itemsToDisplay = products.slice(0, 4);

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      {itemsToDisplay.map((product) => (
        <motion.div key={product.id} variants={staggerItemVariants}>
          <ProductCard
            id={product.id}
            slug={product.slug}
            name={product.name}
            price={product.price}
            comparePrice={product.comparePrice}
            imageUrl={product.imageUrl}
            badge={product.badge}
            stockCount={product.stockCount}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
