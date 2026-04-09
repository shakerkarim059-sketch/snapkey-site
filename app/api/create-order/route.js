import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import {
  getProductPrice,
  calculateTotalPrice,
} from "../../../lib/pricing";

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

    const {
      eventId,
      customerName,
      customerEmail,
      customerPhone,
      street,
      postalCode,
      city,
      country,
      orderNote,
      photoIds,
      printOption,
      frameOption,
    } = body || {};

    if (!eventId) {
      return NextResponse.json({ error: "Event fehlt." }, { status: 400 });
    }

    if (!customerName?.trim()) {
      return NextResponse.json(
        { error: "Bitte deinen Namen eingeben." },
        { status: 400 }
      );
    }

    if (!customerEmail?.trim()) {
      return NextResponse.json(
        { error: "Bitte deine E-Mail eingeben." },
        { status: 400 }
      );
    }

    if (!street?.trim() || !postalCode?.trim() || !city?.trim()) {
      return NextResponse.json(
        { error: "Bitte die vollständige Adresse eingeben." },
        { status: 400 }
      );
    }

    if (!Array.isArray(photoIds) || photoIds.length === 0) {
      return NextResponse.json(
        { error: "Bitte zuerst Bilder auswählen." },
        { status: 400 }
      );
    }

    if (!printOption) {
      return NextResponse.json(
        { error: "Bitte ein Format auswählen." },
        { status: 400 }
      );
    }

    if (!frameOption) {
      return NextResponse.json(
        { error: "Bitte eine Rahmenoption auswählen." },
        { status: 400 }
      );
    }

    if (String(session.eventId) !== String(eventId)) {
      return NextResponse.json(
        { error: "Session passt nicht zu diesem Event." },
        { status: 403 }
      );
    }

    const unitPrice = getProductPrice(printOption, frameOption);

    if (unitPrice === null) {
      return NextResponse.json(
        { error: "Ungültige Produktauswahl." },
        { status: 400 }
      );
    }

    const uniquePhotoIds = [...new Set(photoIds)];

    const totalPrice = calculateTotalPrice(
      printOption,
      frameOption,
      uniquePhotoIds.length
    );

    if (totalPrice === null) {
      return NextResponse.json(
        { error: "Gesamtpreis konnte nicht berechnet werden." },
        { status: 400 }
      );
    }

    const { data: photoRows, error: photosError } = await supabase
      .from("photos")
      .select("id, event_id, file_name, file_path, caption")
      .eq("event_id", eventId)
      .in("id", uniquePhotoIds);

    if (photosError) {
      console.error("Fehler beim Laden der Fotos:", photosError);
      return NextResponse.json(
        { error: "Fotos konnten nicht geprüft werden." },
        { status: 500 }
      );
    }

    if (!photoRows || photoRows.length !== uniquePhotoIds.length) {
      return NextResponse.json(
        { error: "Ein oder mehrere Fotos gehören nicht zu diesem Event." },
        { status: 400 }
      );
    }

    const { data: createdOrder, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          event_id: eventId,
          customer_name: customerName.trim(),
          customer_email: customerEmail.trim(),
          customer_phone: customerPhone?.trim() || null,
          street: street.trim(),
          postal_code: postalCode.trim(),
          city: city.trim(),
          country: country?.trim() || "Deutschland",
          note: orderNote?.trim() || null,
          print_option: printOption,
          frame_option: frameOption,
          item_count: uniquePhotoIds.length,
          total_price: totalPrice,
          payment_status: "pending",
          status: "neu",
          fulfillment_status: "not_started",
        },
      ])
      .select()
      .single();

    if (orderError) {
      console.error("Fehler beim Speichern der Bestellung:", orderError);
      return NextResponse.json(
        { error: "Bestellung konnte nicht gespeichert werden." },
        { status: 500 }
      );
    }

    const photoMap = new Map(
      photoRows.map((photo) => [String(photo.id), photo])
    );

    const orderItemsPayload = uniquePhotoIds.map((photoId) => {
      const photo = photoMap.get(String(photoId));

      if (!photo) {
        throw new Error(`Foto ${photoId} konnte nicht gefunden werden.`);
      }

      return {
        order_id: createdOrder.id,
        photo_id: photo.id,
        photo_url: null,
        photo_path: photo.file_path,
        photo_caption: photo.caption || photo.file_name || "Foto",
        print_option: printOption,
        frame_option: frameOption,
        unit_price: unitPrice,
      };
    });

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsPayload);

    if (itemsError) {
      console.error("Fehler beim Speichern der Bestellpositionen:", itemsError);

      await supabase.from("orders").delete().eq("id", createdOrder.id);

      return NextResponse.json(
        { error: "Bestellpositionen konnten nicht gespeichert werden." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order: createdOrder,
    });
  } catch (error) {
    console.error("Fehler bei create-order API:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler." },
      { status: 500 }
    );
  }
}
