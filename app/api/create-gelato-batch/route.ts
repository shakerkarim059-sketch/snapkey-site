import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createGelatoOrder } from "../../../lib/gelato";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function runBatch() {
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("*")
    .eq("fulfillment_status", "waiting_for_batch");

  if (ordersError || !orders || orders.length === 0) {
    return {
      ok: false,
      status: 400,
      body: { error: "Keine offenen Bestellungen" },
    };
  }

  const orderIds = orders.map((o) => o.id);

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("*")
    .in("order_id", orderIds);

  if (itemsError || !items) {
    return {
      ok: false,
      status: 500,
      body: { error: "Items konnten nicht geladen werden" },
    };
  }

  const firstOrder = orders[0];

  const gelatoResult = await createGelatoOrder(firstOrder, items);

  const { error: updateError } = await supabase
    .from("orders")
    .update({
      fulfillment_status: "submitted",
      gelato_order_id: gelatoResult?.id || null,
      gelato_status: gelatoResult?.status || "created",
      partner_name: "gelato",
      fulfillment_error: null,
    })
    .in("id", orderIds);

  if (updateError) {
    return {
      ok: false,
      status: 500,
      body: { error: "Orders konnten nicht aktualisiert werden" },
    };
  }

  return {
    ok: true,
    status: 200,
    body: {
      success: true,
      orders: orderIds.length,
      gelato_order_id: gelatoResult?.id || null,
    },
  };
}

export async function POST() {
  try {
    const result = await runBatch();
    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    console.error("Batch Fehler:", error);
    return NextResponse.json(
      { error: "Batch fehlgeschlagen" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await runBatch();
    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    console.error("Batch Fehler:", error);
    return NextResponse.json(
      { error: "Batch fehlgeschlagen" },
      { status: 500 }
    );
  }
}
