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
        { error: "Nur Admins dürfen Fotos löschen." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const photoId = body?.photoId;

    if (!photoId) {
      return NextResponse.json(
        { error: "Foto-ID fehlt." },
        { status: 400 }
      );
    }

    const { data: photo, error: photoError } = await supabase
      .from("photos")
      .select("id, event_id, file_path")
      .eq("id", photoId)
      .single();

    if (photoError || !photo) {
      return NextResponse.json(
        { error: "Foto nicht gefunden." },
        { status: 404 }
      );
    }

    if (String(photo.event_id) !== String(session.eventId)) {
      return NextResponse.json(
        { error: "Dieses Foto gehört nicht zu deinem Event." },
        { status: 403 }
      );
    }

    if (photo.file_path) {
      const { error: storageError } = await supabase.storage
        .from("photos")
        .remove([photo.file_path]);

      if (storageError) {
        console.error("Fehler beim Löschen aus Storage:", storageError);
      }
    }

    const { error: deleteError } = await supabase
      .from("photos")
      .delete()
      .eq("id", photoId);

    if (deleteError) {
      console.error("Fehler beim Löschen aus DB:", deleteError);
      return NextResponse.json(
        { error: "Foto konnte nicht gelöscht werden." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Fehler bei delete-photo API:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler." },
      { status: 500 }
    );
  }
}
