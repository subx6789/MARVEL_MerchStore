// ─────────────────────────────────────────────────────────
// Next.js Proxy — Route Protection (Next.js 16)
// Protects /admin routes using session cookies
// ─────────────────────────────────────────────────────────
import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for session cookie
  const hasAuthCookie =
    request.cookies.has("better-auth.session_token") ||
    request.cookies.has("marvel_auth_session") ||
    request.cookies.has("better-auth.session");

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    if (!hasAuthCookie) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/";
      loginUrl.searchParams.set("login", "true");
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
