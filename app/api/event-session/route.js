import { NextResponse } from "next/server";
import crypto from "crypto";

function verifySession(token) {
  const secret = process.env.SESSION_SECRET;
  if (!token || !secret) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payload, signature] = parts;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");

  if (signature !== expectedSignature) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));

    if (!data?.exp || Date.now() > data.exp) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

export async function GET(request) {
  const adminSession = request.cookies.get("admin_session")?.value;

  if (adminSession === "authenticated") {
    return NextResponse.json({
      authenticated: true,
      role: "admin",
      slug: null,
      eventId: null,
      globalAdmin: true,
    });
  }

  const token = request.cookies.get("event_session")?.value;
  const session = verifySession(token);

  if (!session) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    role: session.role,
    slug: session.slug,
    eventId: session.eventId,
    globalAdmin: false,
  });
}
