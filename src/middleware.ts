import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET is required in production");
    }
    console.warn("WARNING: Using dev fallback JWT_SECRET. Set JWT_SECRET!");
    return new TextEncoder().encode("dr-etshoooo-dev-secret-do-not-use-in-production");
  }
  return new TextEncoder().encode(secret);
}

const ADMIN_ROUTES = ["/admin"];
const AUTH_ROUTES = ["/dashboard", "/profile", "/favorites", "/bookmarks"];

function pathnameStartsWith(pathname: string, routes: string[]): boolean {
  return routes.some((route) => pathname === route || pathname.startsWith(route + "/"));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const needsAuth = pathnameStartsWith(pathname, AUTH_ROUTES);
  const needsAdmin = pathnameStartsWith(pathname, ADMIN_ROUTES);

  if (!needsAuth && !needsAdmin) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, getSecret(), { issuer: "dr-etshoooo" });

    if (needsAdmin && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("token");
    return response;
  }
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard", "/dashboard/:path*", "/profile", "/profile/:path*", "/favorites", "/favorites/:path*", "/bookmarks", "/bookmarks/:path*"],
};