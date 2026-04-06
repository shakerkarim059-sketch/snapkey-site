"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Page() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creatingEvent, setCreatingEvent] = useState(false);

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
      console.error("Fehler beim Erstellen:", error);
      alert("Ereignis konnte nicht erstellt werden: " + error.message);
    } else {
      alert("Ereignis erstellt.");
      setTitle("");
      setLocation("");
      setCategory("");
      setStartDate("");
      setEndDate("");
      setDescription("");
      setSlug("");
      setAccessPassword("");
      setAdminPassword("");
      setShowCreateForm(false);
    }

    setCreatingEvent(false);
  }

  return (
    <div className="min-h-screen bg-stone-50 text-zinc-900">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.12),transparent_35%),radial-gradient(circle_at_left,rgba(16,185,129,0.10),transparent_30%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex rounded-full border border-zinc-200 bg-white/80 px-4 py-2 text-sm shadow-sm backdrop-blur">
                SnapKey • Erinnerungen mit einem Tap teilen
              </div>

              <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
                Alle Fotos deines Events.{" "}
                <span className="text-blue-600">Einfach an einem Ort.</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600">
                Mit SnapKey laden deine Gäste ihre Bilder direkt hoch. Keine
                WhatsApp-Gruppen, kein Chaos, keine verlorenen Erinnerungen.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => setShowCreateForm((prev) => !prev)}
                  className="rounded-2xl bg-zinc-900 px-6 py-4 text-base font-medium text-white shadow-lg shadow-zinc-900/10 transition hover:-translate-y-0.5 inline-block text-center"
                >
                  {showCreateForm ? "Formular schließen" : "Event erstellen"}
                </button>

                <a
                  href="https://www.youtube.com/shorts/4_KiFcRlExM"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-zinc-300 bg-white px-6 py-4 text-base font-medium text-zinc-900 transition hover:bg-zinc-50 inline-block text-center"
                >
                  Demo ansehen
                </a>
              </div>

              {showCreateForm && (
                <form
                  onSubmit={handleCreateEvent}
                  className="mt-6 grid gap-3 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm"
                >
                  <input
                    type="text"
                    placeholder="Eventname"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="rounded-2xl border border-zinc-300 px-4 py-3"
                  />

                  <input
                    type="text"
                    placeholder="Ort"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="rounded-2xl border border-zinc-300 px-4 py-3"
                  />

                  <input
                    type="text"
                    placeholder="Kategorie"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="rounded-2xl border border-zinc-300 px-4 py-3"
                  />

                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="rounded-2xl border border-zinc-300 px-4 py-3"
                    />

                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="rounded-2xl border border-zinc-300 px-4 py-3"
                    />
                  </div>

                  <textarea
                    placeholder="Beschreibung"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="rounded-2xl border border-zinc-300 px-4 py-3"
                  />

                  <input
                    type="text"
                    placeholder="Slug (z. B. hochzeit-lisa-tom)"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="rounded-2xl border border-zinc-300 px-4 py-3"
                  />

                  <input
                    type="text"
                    placeholder="Zugangspasswort"
                    value={accessPassword}
                    onChange={(e) => setAccessPassword(e.target.value)}
                    className="rounded-2xl border border-zinc-300 px-4 py-3"
                  />

                  <input
                    type="text"
                    placeholder="Admin-Passwort"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="rounded-2xl border border-zinc-300 px-4 py-3"
                  />

                  <button
                    type="submit"
                    disabled={creatingEvent}
                    className="rounded-2xl bg-blue-600 px-6 py-4 text-base font-medium text-white shadow-lg shadow-blue-600/20"
                  >
                    {creatingEvent ? "Event wird erstellt..." : "Event speichern"}
                  </button>
                </form>
              )}

              <div className="mt-6 flex flex-wrap gap-4 text-sm text-zinc-500">
                <span>Keine App nötig</span>
                <span>Private Galerie</span>
                <span>Upload in Sekunden</span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-6 top-10 hidden rounded-2xl bg-white px-4 py-3 shadow-xl md:block">
                <p className="text-sm font-medium">NFC-Key</p>
                <p className="text-sm text-zinc-500">Tippen. Öffnen. Teilen.</p>
              </div>

              <div className="mx-auto max-w-sm rounded-[2rem] border border-zinc-200 bg-white p-4 shadow-2xl shadow-zinc-300/30">
                <div className="overflow-hidden rounded-[1.5rem] bg-zinc-100">
                  <div className="aspect-[4/5] bg-[url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center" />
                  <div className="space-y-4 p-5">
                    <div>
                      <p className="text-2xl font-semibold">
                        Karim&apos;s Geburtstag 🎉
                      </p>
                      <p className="mt-1 text-sm text-zinc-500">
                        15. April 2026
                      </p>
                    </div>

                    <p className="text-sm leading-6 text-zinc-600">
                      Schön, dass du dabei bist. Lade hier deine Fotos hoch und
                      schau dir die gemeinsamen Erinnerungen an.
                    </p>

                    <div className="space-y-3">
                      <button className="w-full rounded-2xl bg-blue-600 px-4 py-3.5 text-sm font-medium text-white shadow-lg shadow-blue-600/20">
                        Fotos hochladen
                      </button>
                      <button className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3.5 text-sm font-medium text-zinc-900">
                        Galerie ansehen
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 bottom-10 hidden rounded-2xl bg-white px-4 py-3 shadow-xl md:block">
                <p className="text-sm font-medium">Für Familien & Events</p>
                <p className="text-sm text-zinc-500">
                  Geburtstag, Hochzeit, Urlaub
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
