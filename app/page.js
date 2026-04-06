"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Page() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [createdEventLink, setCreatedEventLink] = useState("");

  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [accessPassword, setAccessPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setLoadingEvents(true);

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fehler beim Laden der Events:", error);
      alert("Events konnten nicht geladen werden: " + error.message);
    } else {
      setEvents(data || []);
    }

    setLoadingEvents(false);
  }

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
      const newLink = `/event/${finalSlug}`;
      setCreatedEventLink(newLink);
      setShowCreateForm(false);

      setTitle("");
      setLocation("");
      setCategory("");
      setStartDate("");
      setEndDate("");
      setDescription("");
      setSlug("");
      setAccessPassword("");
      setAdminPassword("");

      await fetchEvents();
    }

    setCreatingEvent(false);
  }

  async function handleCopyLink(slugValue) {
    const fullLink =
      typeof window !== "undefined"
        ? `${window.location.origin}/event/${slugValue}`
        : `/event/${slugValue}`;

    try {
      await navigator.clipboard.writeText(fullLink);
      alert("Link kopiert.");
    } catch (error) {
      console.error("Fehler beim Kopieren:", error);
      alert("Link konnte nicht kopiert werden.");
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "Kein Datum";
    return new Date(dateString).toLocaleDateString("de-DE");
  }

  return (
    <div className="min-h-screen bg-stone-50 text-zinc-900">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h1 className="text-4xl md:text-6xl font-bold">
          Alle Event-Fotos. <span className="text-blue-600">Ein Ort.</span>
        </h1>

        <p className="mt-6 text-lg text-zinc-600 max-w-xl">
          SnapKey sammelt alle Bilder von deinem Event – direkt von den Handys
          deiner Gäste.
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
            rel="noreferrer"
            className="border px-6 py-4 rounded-2xl"
          >
            Demo ansehen
          </a>
        </div>

        {showCreateForm && (
          <form onSubmit={handleCreateEvent} className="mt-8 grid gap-3 max-w-md">
            <input
              placeholder="Titel"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-3 rounded"
            />
            <input
              placeholder="Ort"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border p-3 rounded"
            />
            <input
              placeholder="Kategorie"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border p-3 rounded"
            />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border p-3 rounded"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-3 rounded"
            />
            <textarea
              placeholder="Beschreibung"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-3 rounded"
            />
            <input
              placeholder="Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="border p-3 rounded"
            />
            <input
              placeholder="User Passwort"
              value={accessPassword}
              onChange={(e) => setAccessPassword(e.target.value)}
              className="border p-3 rounded"
            />
            <input
              placeholder="Admin Passwort"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="border p-3 rounded"
            />

            <button className="bg-blue-600 text-white p-4 rounded">
              {creatingEvent ? "..." : "Event speichern"}
            </button>
          </form>
        )}

        {createdEventLink && (
          <div className="mt-6 bg-green-100 p-4 rounded">
            <p className="font-medium">Event erfolgreich erstellt</p>
            <a href={createdEventLink} className="underline break-all">
              {createdEventLink}
            </a>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Deine Events</h2>
          <p className="mt-2 text-zinc-600">
            Hier siehst du alle bereits erstellten Events.
          </p>
        </div>

        {loadingEvents ? (
          <div className="rounded-2xl border bg-white p-6">Events werden geladen...</div>
        ) : events.length === 0 ? (
          <div className="rounded-2xl border bg-white p-6">
            Noch keine Events vorhanden.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {events.map((event) => (
              <div
                key={event.id}
                className="rounded-2xl border bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {event.title || "Ohne Titel"}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500">
                      {event.location || "Kein Ort"} • {formatDate(event.start_date)}
                    </p>
                  </div>

                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                    {event.category || "Ereignis"}
                  </span>
                </div>

                {event.description && (
                  <p className="mt-4 text-sm leading-6 text-zinc-600">
                    {event.description}
                  </p>
                )}

                <div className="mt-4 text-sm text-zinc-500 break-all">
                  /event/{event.slug}
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={`/event/${event.slug}`}
                    className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
                  >
                    Öffnen
                  </a>

                  <button
                    onClick={() => handleCopyLink(event.slug)}
                    className="rounded-xl border px-4 py-2 text-sm font-medium"
                  >
                    Link kopieren
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
