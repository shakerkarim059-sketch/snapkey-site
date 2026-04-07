import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !event) {
      return NextResponse.json(
        {
          error: "Event nicht gefunden.",
          debug: {
            slug,
            supabaseError: error?.message || null,
          },
        },
        { status: 404 }
      );
    }

    if (password === String(event.admin_password).trim()) {
      return NextResponse.json({
        success: true,
        role: "admin",
      });
    }

    if (password === String(event.access_password).trim()) {
      return NextResponse.json({
        success: true,
        role: "guest",
      });
    }

    return NextResponse.json(
      {
        error: "Falsches Passwort.",
        debug: {
          slug,
          access_password_exists: event.access_password !== null,
          admin_password_exists: event.admin_password !== null,
          access_password_type: typeof event.access_password,
          admin_password_type: typeof event.admin_password,
          received_password: password,
          db_access_password: event.access_password,
          db_admin_password: event.admin_password,
        },
      },
      { status: 401 }
    );
  } catch (error) {
    console.error("Fehler bei event-login API:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler.", debug: String(error) },
      { status: 500 }
    );
  }
}
