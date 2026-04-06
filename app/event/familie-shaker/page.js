"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function EventPage() {
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [creatingEvent, setCreatingEvent] = useState(false);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  const loadEvents = async () => {
    setLoadingEvents(true);

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("start_date", { ascending: false });

    if (!error && data) {
      setEvents(data);
    }

    setLoadingEvents(false);
  };

  const handleCreateEvent = async () => {
    if (!title.trim()) {
      alert("Bitte gib einen Titel ein.");
      return;
    }

    setCreatingEvent(true);

    const { error } = await supabase.from("events").insert([
      {
        title,
        location,
        category,
        start_date: startDate || null,
        end_date: endDate || null,
        description,
      },
    ]);

    setCreatingEvent(false);

    if (error) {
      console.error(error);
      alert("Fehler beim Erstellen des Ereignisses");
      return;
    }

    setTitle("");
    setLocation("");
    setCategory("");
    setStartDate("");
    setEndDate("");
    setDescription("");

    await loadEvents();
    alert("Ereignis erstellt!");
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-semibold md:text-5xl">
          Familien Erinnerungen 📸
        </h1>

        <p className="mt-4 text-zinc-600">
          Alle Ereignisse und Momente auf einen Blick.
        </p>

        <div className="mt-10 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Neues Ereignis erstellen</h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Titel des Ereignisses"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-2xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500"
            />

            <input
              type="text"
              placeholder="Ort"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="rounded-2xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500"
            />

            <input
              type="text"
              placeholder="Kategorie (z. B. Urlaub, Geburtstag)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-2xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500"
            />

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-2xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500"
            />

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-2xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500"
            />

            <div></div>
          </div>

          <textarea
            placeholder="Beschreibung (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-4 min-h-[120px] w-full rounded-2xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500"
          />

          <button
            onClick={handleCreateEvent}
            disabled={creatingEvent}
            className="mt-4 rounded-2xl bg-zinc-900 px-6 py-3 font-medium text-white"
          >
            {creatingEvent ? "Wird erstellt..." : "Ereignis erstellen"}
          </button>
        </div>

        <div className="mt-10 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Ereignisse</h2>

          {loadingEvents ? (
            <p className="mt-4 text-zinc-600">Lade Ereignisse...</p>
          ) : events.length === 0 ? (
            <p className="mt-4 text-zinc-600">
              Noch keine Ereignisse vorhanden.
            </p>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="rounded-2xl border border-zinc-200 p-5 transition hover:shadow-md"
                >
                  <h3 className="text-lg font-semibold">{event.title}</h3>

                  {event.location && (
                    <p className="mt-1 text-sm text-zinc-500">
                      📍 {event.location}
                    </p>
                  )}

                  {event.start_date && (
                    <p className="mt-1 text-sm text-zinc-500">
                      📅 {event.start_date}
                      {event.end_date ? ` bis ${event.end_date}` : ""}
                    </p>
                  )}

                  {event.category && (
                    <p className="mt-2 inline-block rounded-full bg-zinc-100 px-3 py-1 text-xs">
                      {event.category}
                    </p>
                  )}

                  {event.description && (
                    <p className="mt-3 text-sm text-zinc-600">
                      {event.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-16 text-center text-sm text-zinc-500">
          <a href="/impressum" className="mr-4 underline">
            Impressum
          </a>
          <a href="/datenschutz" className="underline">
            Datenschutz
          </a>
        </div>
      </div>
    </div>
  );
}
