import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { stripe } from "../../../../lib/stripe";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new NextResponse("Keine Stripe-Signatur", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook Fehler:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, {
      status: 400,
    });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.payment_status !== "paid") {
        return NextResponse.json({ received: true, skipped: true });
      }

      const snapkeyOrderId = session.metadata?.snapkey_order_id;
      const orderId = session.metadata?.order_id;

      if (snapkeyOrderId) {
        const { data: snapkeyOrder, error: snapkeyOrderError } = await supabase
          .from("snapkey_orders")
          .select("*")
          .eq("id", snapkeyOrderId)
          .single();

        if (snapkeyOrderError || !snapkeyOrder) {
          console.error("Snapkey Order nicht gefunden:", snapkeyOrderError);
          return new NextResponse("Snapkey Order nicht gefunden", {
            status: 404,
          });
        }

        if (snapkeyOrder.payment_status === "paid") {
          return NextResponse.json({ received: true, skipped: true });
        }

        const { error: snapkeyUpdateError } = await supabase
          .from("snapkey_orders")
          .update({
            payment_status: "paid",
            stripe_checkout_session_id: session.id,
          })
          .eq("id", snapkeyOrderId);

        if (snapkeyUpdateError) {
          console.error(
            "Fehler beim Updaten der Snapkey-Bestellung:",
            snapkeyUpdateError
          );
          return new NextResponse("Snapkey DB Update Fehler", {
            status: 500,
          });
        }

        const { error: eventUpdateError } = await supabase
          .from("events")
          .update({
            setup_completed: true,
          })
          .eq("id", snapkeyOrder.event_id);

        if (eventUpdateError) {
          console.error("Fehler beim Freischalten des Events:", eventUpdateError);
          return new NextResponse("Event konnte nicht freigeschaltet werden", {
            status: 500,
          });
        }

        return NextResponse.json({ received: true, type: "snapkey" });
      }

      if (orderId) {
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
          order.fulfillment_status === "waiting_for_batch"
        ) {
          return NextResponse.json({ received: true, skipped: true });
        }

        const { error: updateError } = await supabase
          .from("orders")
          .update({
            payment_status: "paid",
            paid_at: new Date().toISOString(),
            fulfillment_status: "waiting_for_batch",
            fulfillment_error: null,
            stripe_payment_intent_id:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : null,
          })
          .eq("id", orderId);

        if (updateError) {
          console.error("Fehler beim Updaten der Bestellung:", updateError);
          return new NextResponse("DB Update Fehler", { status: 500 });
        }

        return NextResponse.json({ received: true, type: "photo" });
      }

      console.error("Weder order_id noch snapkey_order_id in Metadata gefunden");
      return new NextResponse("Keine passende Bestell-ID in Metadata", {
        status: 400,
      });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook Verarbeitung Fehler:", err);
    return new NextResponse("Webhook Verarbeitung fehlgeschlagen", {
      status: 500,
    });
  }
}
