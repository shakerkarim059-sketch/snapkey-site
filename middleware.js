import { NextResponse } from "next/server";

function verifySession(token) {
  const secret = process.env.SESSION_SECRET;

  if (!token || !secret) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payload, signature] = parts;

  const encoder = new TextEncoder();

  async function verify() {
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const expectedSignatureBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(payload)
    );

    const expectedSignature = Buffer.from(expectedSignatureBuffer).toString(
      "base64url"
    );

    if (signature !== expectedSignature) return null;

    try {
      const data = JSON.parse(
        Buffer.from(payload, "base64url").toString("utf8")
      );

      if (!data?.exp || Date.now() > data.exp) return null;
      return data;
    } catch {
      return null;
    }
  }

  return verify();
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminLoginRoute = pathname.startsWith("/admin-login");

  if (!isAdminRoute || isAdminLoginRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get("admin_session")?.value;
  const session = await verifySession(token);

  if (!session || session.role !== "super_admin") {
    const loginUrl = new URL("/admin-login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
