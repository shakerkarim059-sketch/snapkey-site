import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId fehlt" },
        { status: 400 }
      );
    }

    // Order holen
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: "Order nicht gefunden" },
        { status: 404 }
      );
    }

    // Order Items holen
    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);

    if (itemsError || !items) {
      return NextResponse.json(
        { error: "Order Items nicht gefunden" },
        { status: 500 }
      );
    }

    try {
      const gelatoOrder = await createGelatoOrder(order, items);

      await supabase
        .from("orders")
        .update({
          fulfillment_status: "submitted",
          gelato_order_id: gelatoOrder.id,
          fulfillment_error: null,
        })
        .eq("id", orderId);

      return NextResponse.json({
        success: true,
        gelatoOrderId: gelatoOrder.id,
      });
    } catch (error) {
      console.error("Retry Gelato Fehler:", error);

      await supabase
        .from("orders")
        .update({
          fulfillment_status: "failed",
          fulfillment_error: String(error.message || error),
        })
        .eq("id", orderId);

      return NextResponse.json(
        {
          error: "Gelato Retry fehlgeschlagen",
          details: String(error.message || error),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Retry API Fehler:", error);

    return NextResponse.json(
      { error: "Interner Fehler" },
      { status: 500 }
    );
  }
}
