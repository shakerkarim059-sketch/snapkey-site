import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function signSession(data) {
  const secret = process.env.SESSION_SECRET;
  const payload = Buffer.from(JSON.stringify(data)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");

  return `${payload}.${signature}`;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const slug = body?.slug?.trim();
    const password = body?.password?.trim();

    if (!slug || !password) {
      return NextResponse.json(
        { error: "Slug und Passwort sind erforderlich." },
        { status: 400 }
      );
    }

    const { data: event, error } = await supabase
      .from("events")
      .select("id, slug, access_password, admin_password")
      .eq("slug", slug)
      .single();

    if (error || !event) {
      return NextResponse.json(
        { error: "Event nicht gefunden." },
        { status: 404 }
      );
    }

    let role = null;

    if (password === String(event.admin_password).trim()) {
      role = "admin";
    } else if (password === String(event.access_password).trim()) {
      role = "guest";
    } else {
      return NextResponse.json(
        { error: "Falsches Passwort." },
        { status: 401 }
      );
    }

    const token = signSession({
      eventId: event.id,
      slug: event.slug,
      role,
      exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
    });

    const response = NextResponse.json({
      success: true,
      role,
    });

    response.cookies.set("event_session", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Fehler bei event-login API:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler." },
      { status: 500 }
    );
  }
}
