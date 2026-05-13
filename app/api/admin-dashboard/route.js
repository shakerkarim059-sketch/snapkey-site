import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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
    const data = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    );

    if (!data?.exp || Date.now() > data.exp) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

export async function GET(request) {
  try {
    const token = request.cookies.get("admin_session")?.value;

    const session = verifySession(token);

    if (!session || session.role !== "super_admin") {
      return NextResponse.json(
        { error: "Nicht autorisiert." },
        { status: 401 }
      );
    }

    const { data: events, error: eventsError } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (eventsError) {
      console.error("Fehler beim Laden der Events:", eventsError);

      return NextResponse.json(
        { error: "Events konnten nicht geladen werden." },
        { status: 500 }
      );
    }

    const { data: failedOrders, error: failedOrdersError } = await supabase
      .from("orders")
      .select("*")
      .eq("fulfillment_status", "failed")
      .order("created_at", { ascending: false });

    if (failedOrdersError) {
      console.error(
        "Fehler beim Laden der fehlgeschlagenen Bestellungen:",
        failedOrdersError
      );

      return NextResponse.json(
        { error: "Bestellungen konnten nicht geladen werden." },
        { status: 500 }
      );
    }

    const { count: batchCount, error: batchCountError } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("fulfillment_status", "waiting_for_batch");

    if (batchCountError) {
      console.error(
        "Fehler beim Laden der Batch-Anzahl:",
        batchCountError
      );

      return NextResponse.json(
        { error: "Batch-Anzahl konnte nicht geladen werden." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      events: events || [],
      failedOrders: failedOrders || [],
      batchCount: batchCount || 0,
    });
  } catch (error) {
    console.error("Fehler bei admin-dashboard API:", error);

    return NextResponse.json(
      { error: "Interner Serverfehler." },
      { status: 500 }
    );
  }
}
