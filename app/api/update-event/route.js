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

    if (session.role !== "admin") {
      return NextResponse.json(
        { error: "Nur Admins dürfen Events bearbeiten." },
        { status: 403 }
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

    if (String(event.id) !== String(session.eventId)) {
      return NextResponse.json(
        { error: "Dieses Event gehört nicht zu deiner Session." },
        { status: 403 }
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
