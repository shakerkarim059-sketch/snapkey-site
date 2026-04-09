import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { stripe } from "../../../../lib/stripe";
import { createGelatoOrder } from "../../../../lib/gelato";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new NextResponse("Keine Stripe-Signatur", { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook Fehler:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.order_id;

      if (!orderId) {
        return NextResponse.json({ received: true });
      }

      if (session.payment_status !== "paid") {
        return NextResponse.json({ received: true });
      }

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (orderError || !order) {
        console.error("Order nicht gefunden:", orderError);
        return new NextResponse("Order nicht gefunden", { status: 404 });
      }

      if (
        order.payment_status === "paid" &&
        order.fulfillment_status === "submitted"
      ) {
        return NextResponse.json({ received: true, skipped: true });
      }

      const { error: paymentUpdateError } = await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          paid_at: new Date().toISOString(),
          stripe_payment_intent_id:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : null,
        })
        .eq("id", orderId);

      if (paymentUpdateError) {
        console.error("Fehler beim Payment-Update:", paymentUpdateError);
        return new NextResponse("Payment-Update fehlgeschlagen", {
          status: 500,
        });
      }

      if (order.fulfillment_status === "submitted") {
        return NextResponse.json({ received: true, skipped: true });
      }

const { error: batchUpdateError } = await supabase
  .from("orders")
  .update({
    fulfillment_status: "waiting_for_batch",
    fulfillment_error: null,
    partner_name: null,
    gelato_order_id: null,
    gelato_status: null,
    gelato_response: null,
  })
  .eq("id", orderId);

if (batchUpdateError) {
  console.error("Fehler beim Setzen von waiting_for_batch:", batchUpdateError);
  return new NextResponse("Batch-Status konnte nicht gespeichert werden", {
    status: 500,
  });
}

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook Verarbeitung Fehler:", err);

    try {
const eventObj = stripe.webhooks.constructEvent(
  body,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET!
);
const session = eventObj.data.object as Stripe.Checkout.Session;
const orderId = session.metadata?.order_id;

      if (orderId) {
        await supabase
          .from("orders")
          .update({
            fulfillment_status: "failed",
            fulfillment_error:
              err instanceof Error ? err.message : "Unbekannter Gelato-Fehler",
          })
          .eq("id", orderId);
      }
    } catch (innerErr) {
      console.error("Zusätzlicher Fehler beim Fehler-Handling:", innerErr);
    }

    return new NextResponse("Webhook Verarbeitung fehlgeschlagen", {
      status: 500,
    });
  }
}
