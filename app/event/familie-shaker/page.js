"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function EventPage() {
  const [events, setEvents] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  const loadEvents = async () => {
    setLoadingEvents(true);

    const { data: eventsData, error: eventsError } = await supabase
      .from("events")
      .select("*")
      .order("start_date", { ascending: false });

    if (eventsError) {
      console.error(eventsError);
      setEvents([]);
      setLoadingEvents(false);
      return;
    }

    const { data: photosData, error: photosError } = await supabase
      .from("photos")
      .select("event_id");

    if (photosError) {
      console.error(photosError);
    }

    const photoCounts = {};
    (photosData || []).forEach((photo) => {
      photoCounts[photo.event_id] = (photoCounts[photo.event_id] || 0) + 1;
    });

    const eventsWithCounts = (eventsData || []).map((event) => ({
      ...event,
      photo_count: photoCounts[event.id] || 0,
    }));

    setEvents(eventsWithCounts);
    setLoadingEvents(false);
  };

  const loadPhotos = async (eventId) => {
    setLoadingPhotos(true);

    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .eq("event_id", eventId)
      .order("uploaded_at", { ascending: false });

    if (!error && data) {
      setPhotos(data);
    } else {
      console.error(error);
      setPhotos([]);
    }

    setLoadingPhotos(false);
  };

  const resetCreateForm = () => {
    setTitle("");
    setLocation("");
    setCategory("");
    setStartDate("");
    setEndDate("");
    setDescription("");
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

    resetCreateForm();
    setShowCreateForm(false);
    await loadEvents();
    alert("Ereignis erstellt!");
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !selectedEvent) return;

    setUploadingPhoto(true);

    try {
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("photos")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      const { error: insertError } = await supabase.from("photos").insert([
        {
          event_id: selectedEvent.id,
          file_name: file.name,
          file_path: filePath,
          public_url: publicUrl,
        },
      ]);

      if (insertError) throw insertError;

      await loadPhotos(selectedEvent.id);
      await loadEvents();
      alert("Bild hochgeladen!");
    } catch (error) {
      console.error(error);
      alert("Fehler beim Hochladen");
    } finally {
      setUploadingPhoto(false);
      event.target.value = "";
    }
  };

  const openEvent = async (eventItem) => {
    setSelectedEvent(eventItem);
    setSelectedImageIndex(null);
    await loadPhotos(eventItem.id);
  };

  const closeEvent = () => {
    setSelectedEvent(null);
    setPhotos([]);
    setSelectedImageIndex(null);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  const showPrevImage = (e) => {
    if (e) e.stopPropagation();
    setSelectedImageIndex((prev) =>
      prev === 0 ? photos.length - 1 : prev - 1
    );
  };

  const showNextImage = (e) => {
    if (e) e.stopPropagation();
    setSelectedImageIndex((prev) =>
      prev === photos.length - 1 ? 0 : prev + 1
    );
  };

  const handleTouchStart = (e) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;

    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      showNextImage();
    } else if (distance < -minSwipeDistance) {
      showPrevImage();
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-semibold md:text-5xl">
          Familien Erinnerungen 📸
        </h1>

        <p className="mt-4 text-zinc-600">
          Alle Ereignisse und Momente auf einen Blick.
        </p>

        {!selectedEvent ? (
          <>
            <div className="mt-10 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold">Ereignisse</h2>

              <button
                onClick={() => setShowCreateForm((prev) => !prev)}
                className="rounded-2xl bg-zinc-900 px-5 py-3 font-medium text-white"
              >
                {showCreateForm ? "Schließen" : "Ereignis erstellen"}
              </button>
            </div>

            {showCreateForm && (
              <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold">Neues Ereignis erstellen</h3>

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

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={handleCreateEvent}
                    disabled={creatingEvent}
                    className="rounded-2xl bg-zinc-900 px-6 py-3 font-medium text-white"
                  >
                    {creatingEvent ? "Wird erstellt..." : "Speichern"}
                  </button>

                  <button
                    onClick={() => {
                      resetCreateForm();
                      setShowCreateForm(false);
                    }}
                    className="rounded-2xl border border-zinc-300 px-6 py-3 font-medium text-zinc-700"
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              {loadingEvents ? (
                <p className="text-zinc-600">Lade Ereignisse...</p>
              ) : events.length === 0 ? (
                <p className="text-zinc-600">Noch keine Ereignisse vorhanden.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {events.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => openEvent(event)}
                      className="rounded-2xl border border-zinc-200 p-5 text-left transition hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-semibold">{event.title}</h3>
                        <span className="shrink-0 rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600">
                          {event.photo_count === 0
                            ? "Noch keine Bilder"
                            : `${event.photo_count} ${
                                event.photo_count === 1 ? "Bild" : "Bilder"
                              }`}
                        </span>
                      </div>

                      {event.location && (
                        <p className="mt-2 text-sm text-zinc-500">
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
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="mt-10 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <button
                  onClick={closeEvent}
                  className="mb-3 text-sm text-zinc-500 underline"
                >
                  ← Zurück zu den Ereignissen
                </button>

                <h2 className="text-2xl font-semibold">{selectedEvent.title}</h2>

                {selectedEvent.location && (
                  <p className="mt-1 text-sm text-zinc-500">
                    📍 {selectedEvent.location}
                  </p>
                )}

                {selectedEvent.start_date && (
                  <p className="mt-1 text-sm text-zinc-500">
                    📅 {selectedEvent.start_date}
                    {selectedEvent.end_date ? ` bis ${selectedEvent.end_date}` : ""}
                  </p>
                )}
              </div>

              <label className="inline-block cursor-pointer rounded-2xl bg-zinc-900 px-6 py-4 text-base font-medium text-white shadow-lg shadow-zinc-900/10">
                {uploadingPhoto ? "Wird hochgeladen..." : "Bild hochladen"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={uploadingPhoto}
                />
              </label>
            </div>

            {selectedEvent.description && (
              <p className="mt-4 text-zinc-600">{selectedEvent.description}</p>
            )}

            {loadingPhotos ? (
              <p className="mt-6 text-zinc-600">Lade Bilder...</p>
            ) : photos.length === 0 ? (
              <p className="mt-6 text-zinc-600">
                Noch keine Bilder in diesem Ereignis.
              </p>
            ) : (
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
                {photos.map((photo, index) => (
                  <img
                    key={photo.id}
                    src={photo.public_url}
                    alt=""
                    onClick={() => setSelectedImageIndex(index)}
                    className="aspect-square cursor-pointer rounded-2xl object-cover transition hover:scale-105"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {selectedImageIndex !== null && photos[selectedImageIndex] && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            onClick={closeLightbox}
          >
            <div
              className="relative flex h-full w-full items-center justify-center"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={photos[selectedImageIndex].public_url}
                alt=""
                className="max-h-[95%] max-w-[95%] rounded-xl"
              />

              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 rounded-full bg-black/40 px-3 py-1 text-2xl text-white"
              >
                ×
              </button>

              <button
                onClick={showPrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 px-3 py-2 text-3xl text-white"
              >
                ‹
              </button>

              <button
                onClick={showNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 px-3 py-2 text-3xl text-white"
              >
                ›
              </button>
            </div>
          </div>
        )}

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
