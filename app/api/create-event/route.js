import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      title,
      location,
      category,
      date,
      description,
      creatorEmail,
      password,
      adminPassword,
    } = body || {};

    if (!title?.trim()) {
      return NextResponse.json(
        { error: "Bitte Titel eingeben." },
        { status: 400 }
      );
    }

    if (!creatorEmail?.trim()) {
      return NextResponse.json(
        { error: "Bitte E-Mail eingeben." },
        { status: 400 }
      );
    }

    if (!password?.trim()) {
      return NextResponse.json(
        { error: "Bitte Zugangspasswort eingeben." },
        { status: 400 }
      );
    }

    if (!adminPassword?.trim()) {
      return NextResponse.json(
        { error: "Bitte Admin Passwort eingeben." },
        { status: 400 }
      );
    }

    const slug = `${generateSlug(title)}-${Date.now()}`;

    const { data, error } = await supabase
      .from("events")
      .insert([
        {
          title,
          location: location || null,
          category: category || null,
          start_date: date || null,
          description: description || null,
          creator_email: creatorEmail,
          access_password: password,
          admin_password: adminPassword,
          slug,
        },
      ])
      .select("id, slug, title, creator_email")
      .single();

    if (error) {
      console.error("Fehler beim Erstellen des Events:", error);
      return NextResponse.json(
        { error: error.message || "Event konnte nicht erstellt werden." },
        { status: 500 }
      );
    }

    const eventUrl = `https://getsnapkey.de/event/${data.slug}`;

    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Snapkey <info@mail.getsnapkey.de>",
          to: data.creator_email,
          subject: "Dein Snapkey Album ist startklar 🎉",
          html: `
            <div style="margin:0;padding:0;background:#faf8f5;font-family:Arial,sans-serif;color:#1a1612;">
              <div style="max-width:620px;margin:0 auto;padding:32px 18px;">
                <div style="background:#ffffff;border:1px solid #ebe5dd;border-radius:28px;padding:32px;box-shadow:0 18px 50px rgba(26,22,18,0.08);">
                  <div style="font-size:28px;font-weight:800;letter-spacing:-0.04em;color:#1a1612;margin-bottom:24px;">
                    snapkey
                  </div>

                  <div style="display:inline-block;padding:8px 14px;background:#f5efe7;border:1px solid #ebe5dd;border-radius:999px;font-size:13px;font-weight:700;color:#6b5f54;margin-bottom:18px;">
                    Dein Album wurde erstellt
                  </div>

                  <h1 style="margin:0;font-size:34px;line-height:1.08;letter-spacing:-0.05em;color:#1a1612;">
                    Dein gemeinsames Album ist startklar.
                  </h1>

                  <p style="margin:18px 0 0;font-size:16px;line-height:1.7;color:#6b5f54;">
                    Dein Album wurde erfolgreich erstellt. Du kannst den Link jetzt mit Familie,
                    Freunden oder Gästen teilen, damit alle Fotos & Videos an einem gemeinsamen Ort
                    gesammelt werden.
                  </p>

                  <a href="${eventUrl}" style="display:block;text-align:center;background:#1a1612;color:#ffffff;text-decoration:none;font-size:16px;font-weight:800;padding:16px 22px;border-radius:999px;margin:28px 0;">
                    Album öffnen
                  </a>

                  <div style="padding:20px;background:#f5efe7;border:1px solid #ebe5dd;border-radius:20px;margin-bottom:24px;">
                    <div style="font-size:14px;font-weight:800;color:#1a1612;margin-bottom:16px;">
                      Deine Zugangsdaten
                    </div>

                    <div style="margin-bottom:16px;">
                      <div style="font-size:12px;font-weight:700;color:#9a8d82;text-transform:uppercase;">
                        Album-Link
                      </div>
                      <a href="${eventUrl}" style="display:block;margin-top:4px;color:#1a1612;text-decoration:none;font-size:14px;line-height:1.5;word-break:break-all;">
                        ${eventUrl}
                      </a>
                    </div>

                    <div style="margin-bottom:16px;">
                      <div style="font-size:12px;font-weight:700;color:#9a8d82;text-transform:uppercase;">
                        Zugangscode für Gäste
                      </div>
                      <div style="margin-top:4px;font-size:16px;font-weight:700;color:#1a1612;">
                        ${password}
                      </div>
                    </div>

                    <div>
                      <div style="font-size:12px;font-weight:700;color:#9a8d82;text-transform:uppercase;">
                        Admin-Code
                      </div>
                      <div style="margin-top:4px;font-size:16px;font-weight:700;color:#1a1612;">
                        ${adminPassword}
                      </div>
                    </div>
                  </div>

                  <div style="display:grid;gap:12px;">
                    <div style="padding:16px;border:1px solid #ebe5dd;border-radius:18px;">
                      <div style="font-size:14px;font-weight:800;color:#1a1612;margin-bottom:4px;">
                        1. Link teilen
                      </div>
                      <div style="font-size:14px;line-height:1.55;color:#6b5f54;">
                        Teile den Album-Link per WhatsApp, Einladung, QR-Code oder Snapkey mit deinen Gästen.
                      </div>
                    </div>

                    <div style="padding:16px;border:1px solid #ebe5dd;border-radius:18px;">
                      <div style="font-size:14px;font-weight:800;color:#1a1612;margin-bottom:4px;">
                        2. Gäste einladen
                      </div>
                      <div style="font-size:14px;line-height:1.55;color:#6b5f54;">
                        Deine Gäste können Fotos und Videos direkt über den Browser hochladen.
                      </div>
                    </div>

                    <div style="padding:16px;border:1px solid #ebe5dd;border-radius:18px;">
                      <div style="font-size:14px;font-weight:800;color:#1a1612;margin-bottom:4px;">
                        3. Erinnerungen sammeln
                      </div>
                      <div style="font-size:14px;line-height:1.55;color:#6b5f54;">
                        Alle Inhalte landen automatisch in deinem gemeinsamen Album.
                      </div>
                    </div>
                  </div>

                  <div style="margin:24px 0 0;padding:16px;background:#f5efe7;border:1px solid #ebe5dd;border-radius:18px;">
                    <div style="font-size:14px;font-weight:800;color:#1a1612;margin-bottom:6px;">
                      Speicherdauer
                    </div>
                    <div style="font-size:14px;line-height:1.6;color:#6b5f54;">
                      Fotos und Videos werden standardmäßig für 1 Monat gespeichert.
                      Wer das Album länger nutzen möchte, kann die Speicherzeit für 4,99 € pro Monat verlängern.
                    </div>
                  </div>

                  <p style="margin:26px 0 0;font-size:13px;line-height:1.6;color:#9a8d82;">
                    Wichtig: Bewahre diese E-Mail gut auf. Sie enthält deinen Album-Link,
                    den Gäste-Zugangscode und deinen Admin-Code.
                  </p>

                  <div style="height:1px;background:#ebe5dd;margin:26px 0;"></div>

                  <p style="margin:0;font-size:14px;line-height:1.6;color:#6b5f54;">
                    Viele Grüße<br />
                    <strong style="color:#1a1612;">Dein Snapkey Team</strong>
                  </p>
                </div>

                <p style="margin:18px 0 0;text-align:center;font-size:12px;color:#9a8d82;">
                  Diese E-Mail wurde automatisch versendet, weil ein Snapkey Album
                  mit deiner E-Mail-Adresse erstellt wurde.
                </p>
              </div>
            </div>
          `,
        }),
      });
    } catch (mailError) {
      console.error("Fehler beim Senden der E-Mail:", mailError);
    }

    return NextResponse.json({
      success: true,
      event: data,
    });
  } catch (error) {
    console.error("Fehler in create-event API:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler." },
      { status: 500 }
    );
  }
}
