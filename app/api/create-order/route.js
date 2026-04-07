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
      items,
      totalPrice,
    } = body || {};

    if (!eventId) {
      return NextResponse.json(
        { error: "Event fehlt." },
        { status: 400 }
      );
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

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Bitte zuerst Bilder auswählen." },
        { status: 400 }
      );
    }

    if (String(session.eventId) !== String(eventId)) {
      return NextResponse.json(
        { error: "Session passt nicht zu diesem Event." },
        { status: 403 }
      );
    }

    const firstItem = items[0] || {};
    const printOption = firstItem.printSize || null;
    const frameOption = firstItem.frame || null;
    const unitPriceInCent = Number(firstItem.unitPrice || 0);

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
          item_count: items.length,
          total_price: Number(totalPrice || 0),
          payment_status: "pending",
          status: "neu",
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

    const orderItemsPayload = items.map((item) => ({
      order_id: createdOrder.id,
      photo_id: item.photoId,
      photo_url: item.photoUrl || null,
      photo_caption: item.title || null,
      print_option: item.printSize || null,
      frame_option: item.frame || null,
      unit_price: Number(item.unitPrice || 0),
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsPayload);

    if (itemsError) {
      console.error("Fehler beim Speichern der Bestellpositionen:", itemsError);
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
