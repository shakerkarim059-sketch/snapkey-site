import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const EVENT_BASE_PRICE = 29;

const KEY_TYPES = {
  basic: {
    name: "Karte / NFC Key",
    price: 250,
  },
  standard: {
    name: "Snapkey Anhänger",
    price: 400,
  },
  premium: {
    name: "Premium Holz-Snapkey",
    price: 600,
  },
};

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

function isGlobalAdmin(request) {
  const adminSession = request.cookies.get("admin_session")?.value;
  return adminSession === "authenticated";
}

export async function POST(request) {
  try {
    const admin = isGlobalAdmin(request);

    const token = request.cookies.get("event_session")?.value;
    const session = verifySession(token);

    if (!admin && !session) {
      return NextResponse.json(
        { error: "Nicht autorisiert." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      eventId,
      keyType,
      quantity,
      designVariant,
      customerName,
      customerEmail,
      customerPhone,
      street,
      postalCode,
      city,
      country,
      orderNote,
    } = body || {};

    if (!eventId) {
      return NextResponse.json({ error: "Event fehlt." }, { status: 400 });
    }

    if (!admin && String(session.eventId) !== String(eventId)) {
      return NextResponse.json(
        { error: "Session passt nicht zu diesem Event." },
        { status: 403 }
      );
    }

    if (!keyType || !KEY_TYPES[keyType]) {
      return NextResponse.json(
        { error: "Ungültiger Snapkey-Typ." },
        { status: 400 }
      );
    }

    const parsedQuantity = Number(quantity);

    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      return NextResponse.json(
        { error: "Ungültige Menge." },
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

    const keyConfig = KEY_TYPES[keyType];
    const unitPrice = keyConfig.price;
    const totalPrice = EVENT_BASE_PRICE * 100 + unitPrice * parsedQuantity;

    const { data: createdOrder, error: orderError } = await supabase
      .from("snapkey_orders")
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
          key_type: keyType,
          design_variant: designVariant || null,
          quantity: parsedQuantity,
          unit_price: unitPrice,
          total_price: totalPrice,
          payment_status: "pending",
          status: "neu",
          fulfillment_status: "not_started",
        },
      ])
      .select()
      .single();

    if (orderError) {
      console.error("Fehler beim Speichern der Snapkey-Bestellung:", orderError);
      return NextResponse.json(
        {
          error: "Snapkey-Bestellung konnte nicht gespeichert werden.",
          details: orderError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order: createdOrder,
    });
  } catch (error) {
    console.error("Fehler bei create-snapkey-order API:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler." },
      { status: 500 }
    );
  }
}
