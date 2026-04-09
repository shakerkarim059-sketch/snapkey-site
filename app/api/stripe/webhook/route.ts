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

  // 🔐 Stripe Webhook verifizieren
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
    // ✅ Nur auf erfolgreiche Zahlung reagieren
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const orderId = session.metadata?.order_id;

      if (!orderId) {
        console.error("Keine order_id in Stripe Metadata gefunden");
        return new NextResponse("order_id fehlt", { status: 400 });
      }

      // 👉 Order auf bezahlt setzen + in Batch-Queue schieben
      const { error } = await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          paid_at: new Date().toISOString(),

          // 🔥 WICHTIG: kein automatisches Gelato mehr
          fulfillment_status: "waiting_for_batch",
          fulfillment_error: null,

          stripe_payment_intent_id:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : null,
        })
        .eq("id", orderId);

      if (error) {
        console.error("Fehler beim Updaten der Bestellung:", error);
        return new NextResponse("DB Update Fehler", { status: 500 });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook Verarbeitung Fehler:", err);
    return new NextResponse("Webhook Verarbeitung fehlgeschlagen", {
      status: 500,
    });
  }
}
