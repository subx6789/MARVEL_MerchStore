import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products, limitedDrops } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const dbProducts = await db.select().from(products).orderBy(desc(products.createdAt));
    const dbDrops = await db.select().from(limitedDrops).orderBy(desc(limitedDrops.createdAt));

    return NextResponse.json({
      products: dbProducts,
      drops: dbDrops,
    });
  } catch (error: any) {
    console.error("Error fetching catalog from Supabase:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, price, category, stockCount, sku, imageUrl, origins, families, status, slug } = body;

    const [inserted] = await db
      .insert(products)
      .values({
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        price: price.toString(),
        status: status || "active",
        tags: [...(origins || []), ...(families || [])],
        metadata: { category, origins, families, sku, imageUrl },
      })
      .returning();

    return NextResponse.json({ success: true, product: inserted });
  } catch (error: any) {
    console.error("Error creating product in Supabase DB:", error);
    return NextResponse.json({ error: error.message || "Failed to save product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type") || "product";

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    if (type === "drop") {
      const { eq } = await import("drizzle-orm");
      await db.delete(limitedDrops).where(eq(limitedDrops.id, id));
    } else {
      const { eq } = await import("drizzle-orm");
      await db.delete(products).where(eq(products.id, id));
    }

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error("Error deleting item from database:", error);
    return NextResponse.json({ error: error.message || "Failed to delete" }, { status: 500 });
  }
}
