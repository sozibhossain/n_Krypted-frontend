import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get user token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const publicRoutes = ["/login", "/register", "/verify", "/forgot-password"];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If not logged in and accessing protected route
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If logged in and trying to access auth pages
  if (token && isPublicRoute) {
    // Redirect based on role
    if (token.role === "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else if (token.role === "seller") {
      return NextResponse.redirect(new URL("/seller-dashboard", request.url));
    } else if (token.role === "bidder") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Protect role-based pages
  if (pathname.startsWith("/dashboard")) {
    if (token?.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/seller-dashboard")) {
    if (token?.role !== "seller") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/account")) {
    if (token?.role !== "bidder") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// Protect these routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/seller-dashboard/:path*",
    "/account/:path*",
    "/login",
    "/register",
    "/verify",
    "/forgot-password",
  ],
};
