import { NextResponse } from "next/server";
import { stripe } from "../../../lib/stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "orderId fehlt" }, { status: 400 });
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
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

    const { data: orderItems, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: true });

    if (itemsError) {
      console.error("Fehler beim Laden der Bestellpositionen:", itemsError);
      return NextResponse.json(
        { error: "Bestellpositionen konnten nicht geladen werden" },
        { status: 500 }
      );
    }

    if (!orderItems || orderItems.length === 0) {
      return NextResponse.json(
        { error: "Keine Bestellpositionen gefunden" },
        { status: 400 }
      );
    }

    const line_items = orderItems.map((item: any, index: number) => ({
      quantity: 1,
      price_data: {
        currency: "eur",
        product_data: {
          name: item.photo_caption || `Foto ${index + 1}`,
          description: [
            item.print_option ? `Format: ${item.print_option}` : null,
            item.frame_option && item.frame_option !== "none"
              ? `Rahmen: ${item.frame_option}`
              : "Kein Rahmen",
          ]
            .filter(Boolean)
            .join(" • "),
        },
        unit_amount: Number(item.unit_price || 0),
      },
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
      customer_email: order.customer_email || undefined,
      metadata: {
        order_id: String(order.id),
        event_id: String(order.event_id),
      },
    });

    const { error: updateError } = await supabase
      .from("orders")
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
    console.error("create-checkout-session Fehler:", err);
    return NextResponse.json({ error: "Server Fehler" }, { status: 500 });
  }
}
