// ─────────────────────────────────────────────────────────
// Health Check API Route — Used by Docker healthcheck
// ─────────────────────────────────────────────────────────
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    app: "MARVEL MerchStore",
    timestamp: new Date().toISOString(),
  });
}
