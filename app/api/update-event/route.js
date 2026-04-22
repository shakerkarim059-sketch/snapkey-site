import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const adminSession = request.cookies.get("admin_session")?.value;

    if (adminSession !== "authenticated") {
      return NextResponse.json(
        { error: "Nicht autorisiert." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      eventId,
      title,
      location,
      category,
      startDate,
      endDate,
      description,
    } = body || {};

    if (!eventId) {
      return NextResponse.json(
        { error: "Event-ID fehlt." },
        { status: 400 }
      );
    }

    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id")
      .eq("id", eventId)
      .single();

    if (eventError || !event) {
      return NextResponse.json(
        { error: "Event nicht gefunden." },
        { status: 404 }
      );
    }

    const { error: updateError } = await supabase
      .from("events")
      .update({
        title: title || "",
        location: location || "",
        category: category || "",
        start_date: startDate || null,
        end_date: endDate || null,
        description: description || "",
      })
      .eq("id", eventId);

    if (updateError) {
      console.error("Fehler beim Aktualisieren:", updateError);
      return NextResponse.json(
        { error: "Event konnte nicht aktualisiert werden." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Fehler bei update-event API:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler." },
      { status: 500 }
    );
  }
}
