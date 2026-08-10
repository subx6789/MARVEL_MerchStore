import { NextResponse } from "next/server";

// Fallback catch-all API route handler for /api/auth/* endpoints
export async function GET() {
  return NextResponse.json({ success: true, message: "Auth endpoint handled" });
}

export async function POST() {
  return NextResponse.json({ success: true, message: "Auth endpoint handled" });
}

export async function PUT() {
  return NextResponse.json({ success: true, message: "Auth endpoint handled" });
}

export async function DELETE() {
  return NextResponse.json({ success: true, message: "Auth endpoint handled" });
}
