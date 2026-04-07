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
      .select("id, access_password, admin_password")
      .eq("slug", slug)
      .single();

    if (error || !event) {
      return NextResponse.json(
        { error: "Event nicht gefunden." },
        { status: 404 }
      );
    }

    if (password === event.admin_password) {
      return NextResponse.json({
        success: true,
        role: "admin",
      });
    }

    if (password === event.access_password) {
      return NextResponse.json({
        success: true,
        role: "guest",
      });
    }

    return NextResponse.json(
      { error: "Falsches Passwort." },
      { status: 401 }
    );
  } catch (error) {
    console.error("Fehler bei event-login API:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler." },
      { status: 500 }
    );
  }
}
