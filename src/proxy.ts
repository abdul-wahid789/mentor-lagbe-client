import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function hasBetterAuthSessionCookie(request: NextRequest): boolean {
  const cookies = request.cookies.getAll();

  return cookies.some(
    (cookie) =>
      Boolean(cookie.value) &&
      (cookie.name === "better-auth.session_token" ||
        cookie.name === "__Secure-better-auth.session_token" ||
        cookie.name === "_Secure-better-auth.session_token" ||
        cookie.name.endsWith(".session_token"))
  );
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isProtectedRoute =
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/payment" ||
    pathname.startsWith("/payment/");

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  if (!hasBetterAuthSessionCookie(request)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/payment/:path*"],
};