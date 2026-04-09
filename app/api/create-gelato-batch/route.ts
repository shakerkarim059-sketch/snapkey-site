import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createGelatoOrder } from "../../../lib/gelato";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  try {
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .eq("fulfillment_status", "waiting_for_batch");

    if (ordersError || !orders || orders.length === 0) {
      return NextResponse.json(
        { error: "Keine offenen Bestellungen" },
        { status: 400 }
      );
    }

    const orderIds = orders.map((o) => o.id);

    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .in("order_id", orderIds);

    if (itemsError || !items) {
      return NextResponse.json(
        { error: "Items konnten nicht geladen werden" },
        { status: 500 }
      );
    }

    const firstOrder = orders[0];

    const gelatoResult = await createGelatoOrder(firstOrder, items);

    await supabase
      .from("orders")
      .update({
        fulfillment_status: "submitted",
        gelato_order_id: gelatoResult?.id || null,
        gelato_status: gelatoResult?.status || "created",
      })
      .in("id", orderIds);

    return NextResponse.json({
      success: true,
      orders: orderIds.length,
    });
  } catch (error) {
    console.error("Batch Fehler:", error);
    return NextResponse.json(
      { error: "Batch fehlgeschlagen" },
      { status: 500 }
    );
  }
}
