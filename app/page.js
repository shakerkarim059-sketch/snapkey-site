"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Page() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [createdEventLink, setCreatedEventLink] = useState("");

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [accessPassword, setAccessPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  async function handleCreateEvent(e) {
    e.preventDefault();
    setCreatingEvent(true);
    setCreatedEventLink("");

    const finalSlug =
      slug.trim() ||
      title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

    const { error } = await supabase.from("events").insert([
      {
        title,
        location,
        category,
        start_date: startDate || null,
        end_date: endDate || null,
        description,
        slug: finalSlug,
        access_password: accessPassword || "familie123",
        admin_password: adminPassword || "admin123",
      },
    ]);

    if (error) {
      alert(error.message);
    } else {
      setCreatedEventLink(`/event/${finalSlug}`);
      setShowCreateForm(false);
    }

    setCreatingEvent(false);
  }

  return (
    <div className="min-h-screen bg-stone-50 text-zinc-900">
      
      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h1 className="text-4xl md:text-6xl font-bold">
          Alle Event-Fotos. <span className="text-blue-600">Ein Ort.</span>
        </h1>

        <p className="mt-6 text-lg text-zinc-600 max-w-xl">
          SnapKey sammelt alle Bilder von deinem Event – direkt von den Handys deiner Gäste.
        </p>

        <div className="mt-8 flex gap-4 flex-wrap">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-black text-white px-6 py-4 rounded-2xl"
          >
            {showCreateForm ? "Schließen" : "Event erstellen"}
          </button>

          <a
            href="https://www.youtube.com/shorts/4_KiFcRlExM"
            target="_blank"
            className="border px-6 py-4 rounded-2xl"
          >
            Demo ansehen
          </a>
        </div>

        {/* CREATE FORM */}
        {showCreateForm && (
          <form onSubmit={handleCreateEvent} className="mt-8 grid gap-3 max-w-md">
            <input placeholder="Titel" value={title} onChange={(e)=>setTitle(e.target.value)} className="border p-3 rounded"/>
            <input placeholder="Ort" value={location} onChange={(e)=>setLocation(e.target.value)} className="border p-3 rounded"/>
            <input placeholder="Kategorie" value={category} onChange={(e)=>setCategory(e.target.value)} className="border p-3 rounded"/>
            <input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} className="border p-3 rounded"/>
            <input type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} className="border p-3 rounded"/>
            <input placeholder="Slug" value={slug} onChange={(e)=>setSlug(e.target.value)} className="border p-3 rounded"/>
            <input placeholder="User Passwort" value={accessPassword} onChange={(e)=>setAccessPassword(e.target.value)} className="border p-3 rounded"/>
            <input placeholder="Admin Passwort" value={adminPassword} onChange={(e)=>setAdminPassword(e.target.value)} className="border p-3 rounded"/>

            <button className="bg-blue-600 text-white p-4 rounded">
              {creatingEvent ? "..." : "Event speichern"}
            </button>
          </form>
        )}

        {createdEventLink && (
          <div className="mt-6 bg-green-100 p-4 rounded">
            <a href={createdEventLink}>{createdEventLink}</a>
          </div>
        )}
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-6 py-10 grid md:grid-cols-3 gap-6">
        <div>1. NFC tippen</div>
        <div>2. Fotos hochladen</div>
        <div>3. Erinnerungen behalten</div>
      </section>

      {/* BUSINESS IDEA */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold">Warum SnapKey?</h2>
        <p className="mt-4 text-zinc-600 max-w-xl">
          Fotos gehen nicht verloren. Alles an einem Ort. Keine WhatsApp-Gruppen mehr.
        </p>
      </section>

      {/* PRICING */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="border p-6 rounded-2xl">
          <h3 className="text-2xl font-bold">Event Memory Key</h3>
          <p className="mt-2">29 €</p>
          <ul className="mt-4 text-sm text-zinc-600">
            <li>• NFC Key</li>
            <li>• Event Seite</li>
            <li>• Foto Upload</li>
          </ul>
        </div>
      </section>

    </div>
  );
}
