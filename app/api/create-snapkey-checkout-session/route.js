import { NextResponse } from "next/server";
import { stripe } from "../../../lib/stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const EVENT_BASE_PRICE = 29;

const KEY_TYPE_LABELS = {
  basic: "Karte / NFC Key",
  standard: "Snapkey Anhänger",
  premium: "Premium Holz-Snapkey",
};

export async function POST(req) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "orderId fehlt" }, { status: 400 });
    }

    const { data: order, error: orderError } = await supabase
      .from("snapkey_orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: "Bestellung nicht gefunden" },
        { status: 404 }
      );
    }

    if (order.payment_status === "paid") {
      return NextResponse.json(
        { error: "Bestellung wurde bereits bezahlt" },
        { status: 400 }
      );
    }

    const line_items = [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          product_data: {
            name: "Eventseite Aktivierung",
            description: "Aktivierung deiner Snapkey Eventseite",
          },
          unit_amount: EVENT_BASE_PRICE * 100,
        },
      },
      {
        quantity: Number(order.quantity || 1),
        price_data: {
          currency: "eur",
          product_data: {
            name: KEY_TYPE_LABELS[order.key_type] || "Snapkey",
            description: order.design_variant
              ? `Variante: ${order.design_variant}`
              : "Individuell konfigurierter Snapkey",
          },
          unit_amount: Number(order.unit_price || 0),
        },
      },
    ];
const { data: eventData, error: eventError } = await supabase
  .from("events")
  .select("slug")
  .eq("id", order.event_id)
  .single();

if (eventError || !eventData?.slug) {
  console.error("Event-Slug konnte nicht geladen werden:", eventError);
  return NextResponse.json(
    { error: "Event-Link konnte nicht erstellt werden" },
    { status: 500 }
  );
}
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
     success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?event=${eventData.slug}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
      customer_email: order.customer_email || undefined,
      metadata: {
        snapkey_order_id: String(order.id),
        event_id: String(order.event_id),
        order_type: "snapkey",
      },
    });

    const { error: updateError } = await supabase
      .from("snapkey_orders")
      .update({
        stripe_checkout_session_id: session.id,
      })
      .eq("id", order.id);

    if (updateError) {
      console.error("Fehler beim Speichern der Stripe Session ID:", updateError);
      return NextResponse.json(
        { error: "Stripe Session konnte nicht gespeichert werden" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("create-snapkey-checkout-session Fehler:", err);
    return NextResponse.json({ error: "Server Fehler" }, { status: 500 });
  }
}
