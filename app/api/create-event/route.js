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
          subject: "Dein Snapkey Event wurde erstellt",
          html: `
            <h2>Dein Event wurde erstellt 🎉</h2>
            <p>Du kannst dein Event jederzeit über diesen Link öffnen:</p>
            <p><a href="${eventUrl}">${eventUrl}</a></p>
            <p><strong>Wichtig:</strong> Speichere diesen Link gut ab.</p>
            <p>Mit deinem Admin-Passwort kannst du dein Event verwalten.</p>
            <br />
            <p>Viele Grüße<br />Snapkey</p>
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
