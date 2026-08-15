// ─────────────────────────────────────────────────────────
// API Route — Profile Sync & Update
// Syncs profile changes (avatar, name, phone, address) to Database
// ─────────────────────────────────────────────────────────
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, email, name, avatarUrl, phone } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    // 1. Update Supabase Auth user metadata using service role client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (supabaseUrl && serviceRoleKey) {
      const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
      
      // Get user by email to get user ID if missing
      const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
      const authUser = userList?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());

      if (authUser) {
        await supabaseAdmin.auth.admin.updateUserById(authUser.id, {
          user_metadata: {
            ...authUser.user_metadata,
            name: name || authUser.user_metadata?.name,
            full_name: name || authUser.user_metadata?.full_name,
            avatar_url: avatarUrl !== undefined ? avatarUrl : authUser.user_metadata?.avatar_url,
            phone: phone !== undefined ? phone : authUser.user_metadata?.phone,
          },
        });
      }
    }

    // 2. Upsert into public.users table in PostgreSQL
    if (userId) {
      const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (existing.length > 0) {
        await db
          .update(users)
          .set({
            name: name || existing[0].name,
            avatarUrl: avatarUrl !== undefined ? avatarUrl : existing[0].avatarUrl,
            phone: phone !== undefined ? phone : existing[0].phone,
            updatedAt: new Date(),
          })
          .where(eq(users.email, email));
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[API Profile Update Error]:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
