import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
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

    // Bestellung laden
    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: "Bestellung nicht gefunden" }, { status: 404 });
    }

    if (order.payment_status === "paid") {
      return NextResponse.json({ error: "Schon bezahlt" }, { status: 400 });
    }

    const items = order.items || [];

    if (!items.length) {
      return NextResponse.json({ error: "Keine Items" }, { status: 400 });
    }

    const line_items = items.map((item: any, i: number) => ({
      quantity: item.quantity || 1,
      price_data: {
        currency: "eur",
        product_data: {
          name: item.title || `Foto ${i + 1}`,
        },
        unit_amount: item.unitPrice,
      },
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
      metadata: {
        order_id: order.id.toString(),
      },
    });

    // speichern
    await supabase
      .from("orders")
      .update({
        stripe_checkout_session_id: session.id,
      })
      .eq("id", order.id);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server Fehler" }, { status: 500 });
  }
}
