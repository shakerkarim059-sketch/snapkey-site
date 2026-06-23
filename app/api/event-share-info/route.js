import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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
    if (!data?.exp || Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}

export async function POST(request) {
  try {
    const token = request.cookies.get("event_session")?.value;
    const session = verifySession(token);

    if (!session) {
      return NextResponse.json(
        { error: "Nicht autorisiert." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const slug = body?.slug?.trim();

    if (!slug) {
      return NextResponse.json(
        { error: "Event fehlt." },
        { status: 400 }
      );
    }

    if (session.slug !== slug) {
      return NextResponse.json(
        { error: "Session passt nicht zu diesem Event." },
        { status: 403 }
      );
    }

    const { data: event, error } = await supabase
      .from("events")
      .select("slug, access_password")
      .eq("slug", slug)
      .single();

    if (error || !event) {
      return NextResponse.json(
        { error: "Event nicht gefunden." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      eventUrl: `https://getsnapkey.de/event/${event.slug}`,
      guestCode: event.access_password,
    });
  } catch (error) {
    console.error("Fehler bei event-share-info:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler." },
      { status: 500 }
    );
  }
}
