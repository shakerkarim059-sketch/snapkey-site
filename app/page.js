"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type EventItem = {
  id: string | number;
  title: string | null;
  location: string | null;
  category: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  slug: string;
  created_at?: string;
};

export default function Page() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [createdEventLink, setCreatedEventLink] = useState("");

  const [events, setEvents] = useState<EventItem[]>([]);
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
      setEvents((data as EventItem[]) || []);
    }

    setLoadingEvents(false);
  }

  async function handleCreateEvent(e: React.FormEvent<HTMLFormElement>) {
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

  async function handleCopyLink(slugValue: string) {
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

  function formatDate(dateString: string | null) {
    if (!dateString) return "Kein Datum";
    return new Date(dateString).toLocaleDateString("de-DE");
  }

  return (
    <div className="min-h-screen bg-[#f8f5ef] text-zinc-900">
      <section className="relative overflow-hidden border-b border-black/5 bg-gradient-to-b from-[#f8f5ef] via-white to-[#f8f5ef]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_28%),radial-gradient(circle_at_left,rgba(0,0,0,0.03),transparent_30%)]" />

        <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="mb-6 inline-flex items-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-600 shadow-sm">
            SnapKey · Event-Fotos an einem Ort
          </div>

          <div className="grid items-start gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
                Alle Event-Fotos.{" "}
                <span className="text-blue-600">Ein Ort.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
                SnapKey sammelt Bilder von Events in einer geschützten Galerie.
                Gäste können Fotos ansehen, liken, kommentieren, auswählen und
                später bequem bestellen – statt alles mühsam über WhatsApp,
                AirDrop oder einzelne Links zu verteilen.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="rounded-2xl bg-black px-6 py-4 text-white shadow-sm transition hover:bg-zinc-800"
                >
                  {showCreateForm ? "Erstellung schließen" : "Event erstellen"}
                </button>

                <a
                  href="https://www.youtube.com/shorts/4_KiFcRlExM"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-zinc-300 bg-white px-6 py-4 text-zinc-900 transition hover:bg-zinc-50"
                >
                  Demo ansehen
                </a>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                  <div className="text-sm font-semibold">Private Events</div>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    Jede Galerie hat ihren eigenen Link und ihr eigenes Passwort.
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                  <div className="text-sm font-semibold">Interaktion</div>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    Likes, Kommentare und Bildauswahl direkt in der Galerie.
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                  <div className="text-sm font-semibold">Print-Vorbereitung</div>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    Perfekte Basis für Checkout, Bestellung und Print-Partner.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-xl shadow-black/5">
              <div className="rounded-[22px] border border-zinc-100 bg-zinc-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-500">Beispiel-Galerie</p>
                    <h3 className="text-xl font-semibold">
                      Sommerfest 2026
                    </h3>
                  </div>
                  <div className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    Live Auswahl
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="aspect-[4/5] rounded-2xl bg-zinc-200" />
                  <div className="aspect-[4/5] rounded-2xl bg-zinc-300" />
                  <div className="aspect-[4/5] rounded-2xl bg-zinc-200" />
                  <div className="aspect-[4/5] rounded-2xl bg-zinc-300" />
                  <div className="aspect-[4/5] rounded-2xl bg-zinc-200" />
                  <div className="aspect-[4/5] rounded-2xl bg-zinc-300" />
                </div>

                <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-zinc-500">Ausgewählte Bilder</p>
                      <p className="text-lg font-semibold">12 Fotos markiert</p>
                    </div>
                    <div className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white">
                      Bestellung
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showCreateForm && (
            <div className="mt-14 max-w-4xl rounded-[28px] border border-zinc-200 bg-white p-6 shadow-xl shadow-black/5 md:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold md:text-3xl">
                  Neues Event erstellen
                </h2>
                <p className="mt-2 text-zinc-600">
                  Erstelle hier eine neue Event-Seite mit eigenem Slug und
                  Passwortschutz.
                </p>
              </div>

              <form
                onSubmit={handleCreateEvent}
                className="grid gap-4 md:grid-cols-2"
              >
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    Titel
                  </label>
                  <input
                    placeholder="z. B. Hochzeit Anna & Leon"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 bg-white p-3 outline-none transition focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    Ort
                  </label>
                  <input
                    placeholder="z. B. Köln"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 bg-white p-3 outline-none transition focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    Kategorie
                  </label>
                  <input
                    placeholder="z. B. Hochzeit"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 bg-white p-3 outline-none transition focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    Startdatum
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 bg-white p-3 outline-none transition focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    Enddatum
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 bg-white p-3 outline-none transition focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    Beschreibung
                  </label>
                  <textarea
                    placeholder="Kurze Beschreibung des Events"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[120px] w-full rounded-xl border border-zinc-300 bg-white p-3 outline-none transition focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    Slug
                  </label>
                  <input
                    placeholder="z. B. hochzeit-anna-leon"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 bg-white p-3 outline-none transition focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    User Passwort
                  </label>
                  <input
                    placeholder="Passwort für Gäste"
                    value={accessPassword}
                    onChange={(e) => setAccessPassword(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 bg-white p-3 outline-none transition focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    Admin Passwort
                  </label>
                  <input
                    placeholder="Passwort für Admin-Zugang"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 bg-white p-3 outline-none transition focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2 pt-2">
                  <button
                    className="w-full rounded-2xl bg-blue-600 p-4 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={creatingEvent}
                  >
                    {creatingEvent ? "Event wird gespeichert..." : "Event speichern"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {createdEventLink && (
            <div className="mt-8 max-w-3xl rounded-2xl border border-green-200 bg-green-50 p-5">
              <p className="font-semibold text-green-900">
                Event erfolgreich erstellt
              </p>
              <p className="mt-1 text-sm text-green-800">
                Dein Event ist jetzt erreichbar unter:
              </p>
              <a
                href={createdEventLink}
                className="mt-3 block break-all text-sm font-medium text-green-900 underline"
              >
                {createdEventLink}
              </a>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Warum SnapKey?</h3>
            <p className="mt-3 text-sm leading-7 text-zinc-600">
              Weil Event-Fotos oft verstreut sind. SnapKey macht daraus eine
              zentrale, saubere und teilbare Galerie.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Für wen?</h3>
            <p className="mt-3 text-sm leading-7 text-zinc-600">
              Für Hochzeiten, Geburtstage, Firmenfeiern, Partys und alle Events,
              bei denen viele Menschen Fotos machen.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Was kommt als Nächstes?</h3>
            <p className="mt-3 text-sm leading-7 text-zinc-600">
              Checkout, Adressdaten, Bestellabwicklung und Integration mit
              Print-Anbietern wie Gelato oder Printify.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-6">
          <h2 className="text-2xl font-bold md:text-3xl">Deine Events</h2>
          <p className="mt-2 text-zinc-600">
            Hier siehst du alle bereits erstellten Events.
          </p>
        </div>

        {loadingEvents ? (
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            Events werden geladen...
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            Noch keine Events vorhanden.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {event.title || "Ohne Titel"}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-500">
                      {event.location || "Kein Ort"} • {formatDate(event.start_date)}
                    </p>
                  </div>

                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                    {event.category || "Ereignis"}
                  </span>
                </div>

                {event.description && (
                  <p className="mt-4 text-sm leading-7 text-zinc-600">
                    {event.description}
                  </p>
                )}

                <div className="mt-5 rounded-2xl bg-zinc-50 px-4 py-3 text-sm text-zinc-500 break-all">
                  /event/{event.slug}
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={`/event/${event.slug}`}
                    className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-black"
                  >
                    Öffnen
                  </a>

                  <button
                    onClick={() => handleCopyLink(event.slug)}
                    className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-zinc-50"
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
