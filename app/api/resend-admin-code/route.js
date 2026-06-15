import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();

    const slug = body?.slug?.trim();
    const email = body?.email?.trim().toLowerCase();

    if (!slug || !email) {
      return NextResponse.json(
        { error: "Event und E-Mail sind erforderlich." },
        { status: 400 }
      );
    }

    const { data: event, error } = await supabase
      .from("events")
      .select("title, slug, creator_email, admin_password")
      .eq("slug", slug)
      .single();

    if (error || !event) {
      return NextResponse.json({
        success: true,
        message:
          "Falls diese E-Mail zum Event passt, wurde der Admin-Code erneut versendet.",
      });
    }

    const creatorEmail = String(event.creator_email || "").trim().toLowerCase();

    if (creatorEmail !== email) {
      return NextResponse.json({
        success: true,
        message:
          "Falls diese E-Mail zum Event passt, wurde der Admin-Code erneut versendet.",
      });
    }

    const eventUrl = `https://getsnapkey.de/event/${event.slug}`;

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "getsnapkey <info@mail.getsnapkey.de>",
        to: event.creator_email,
        subject: "Dein Admin-Code für dein Snapkey Album",
        html: `
          <div style="margin:0;padding:0;background:#faf8f5;font-family:Arial,sans-serif;color:#1a1612;">
            <div style="max-width:620px;margin:0 auto;padding:32px 18px;">
              <div style="background:#ffffff;border:1px solid #ebe5dd;border-radius:28px;padding:32px;box-shadow:0 18px 50px rgba(26,22,18,0.08);">
                <div style="font-size:28px;font-weight:800;letter-spacing:-0.04em;color:#1a1612;margin-bottom:24px;">
                  getsnapkey
                </div>

                <div style="display:inline-block;padding:8px 14px;background:#f5efe7;border:1px solid #ebe5dd;border-radius:999px;font-size:13px;font-weight:700;color:#6b5f54;margin-bottom:18px;">
                  Admin-Code angefordert
                </div>

                <h1 style="margin:0;font-size:32px;line-height:1.1;letter-spacing:-0.05em;color:#1a1612;">
                  Hier ist dein Admin-Code.
                </h1>

                <p style="margin:18px 0 0;font-size:16px;line-height:1.7;color:#6b5f54;">
                  Für dein Album <strong style="color:#1a1612;">${event.title}</strong> wurde der Admin-Code erneut angefordert.
                </p>

                <div style="padding:20px;background:#f5efe7;border:1px solid #ebe5dd;border-radius:20px;margin:24px 0;">
                  <div style="font-size:12px;font-weight:700;color:#9a8d82;text-transform:uppercase;">
                    Admin-Code
                  </div>

                  <div style="margin-top:6px;font-size:22px;font-weight:800;color:#1a1612;">
                    ${event.admin_password}
                  </div>
                </div>

                <a href="${eventUrl}" style="display:block;text-align:center;background:#1a1612;color:#ffffff;text-decoration:none;font-size:16px;font-weight:800;padding:16px 22px;border-radius:999px;margin:24px 0;">
                  Album öffnen
                </a>

                <p style="margin:0;font-size:13px;line-height:1.6;color:#9a8d82;">
                  Wichtig: Teile diesen Admin-Code nicht mit Gästen. Gäste benötigen nur den Gäste-Zugangscode.
                </p>

                <div style="height:1px;background:#ebe5dd;margin:26px 0;"></div>

                <p style="margin:0;font-size:14px;line-height:1.6;color:#6b5f54;">
                  Viele Grüße<br />
                  <strong style="color:#1a1612;">Dein Snapkey Team</strong>
                </p>
              </div>
            </div>
          </div>
        `,
      }),
    });

    return NextResponse.json({
      success: true,
      message:
        "Falls diese E-Mail zum Event passt, wurde der Admin-Code erneut versendet.",
    });
  } catch (error) {
    console.error("Fehler bei resend-admin-code:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler." },
      { status: 500 }
    );
  }
}
