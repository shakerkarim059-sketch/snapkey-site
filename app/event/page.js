"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function CreateEventPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [password, setPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const [loading, setLoading] = useState(false);

  function generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  }

  async function handleCreateEvent(e) {
    e.preventDefault();

    if (!title || !password || !adminPassword) {
      alert("Bitte alle Pflichtfelder ausfüllen.");
      return;
    }

    setLoading(true);

    const slug = generateSlug(title);

    const { error } = await supabase.from("events").insert([
      {
        title,
        location,
        category,
        start_date: date || null,
        access_password: password,
        admin_password: adminPassword,
        slug,
      },
    ]);

    if (error) {
      alert("Fehler: " + error.message);
      setLoading(false);
      return;
    }

    alert("Event erstellt!");

    // direkt zum Event weiterleiten
    router.push(`/event/${slug}`);
  }

  return (
    <div style={{ padding: "24px", maxWidth: "500px", margin: "0 auto" }}>
      <h1>Event erstellen</h1>

      <form onSubmit={handleCreateEvent} style={{ display: "grid", gap: "12px" }}>
        <input
          placeholder="Titel *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Ort"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          placeholder="Kategorie"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <input
          placeholder="Zugang Passwort *"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          placeholder="Admin Passwort *"
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Erstelle..." : "Event erstellen"}
        </button>
      </form>
    </div>
  );
}
