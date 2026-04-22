import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminLoginRoute = pathname.startsWith("/admin-login");

  if (!isAdminRoute || isAdminLoginRoute) {
    return NextResponse.next();
  }

  const adminSession = request.cookies.get("admin_session")?.value;

  if (adminSession !== "authenticated") {
    const loginUrl = new URL("/admin-login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
