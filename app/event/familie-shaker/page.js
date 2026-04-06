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

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setLoadingEvents(true);

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("start_date", { ascending: false });

    if (error) {
      console.error("Fehler beim Laden der Events:", error);
    } else {
      setEvents(data || []);
    }

    setLoadingEvents(false);
  }

  async function fetchPhotos(eventId) {
    setLoadingPhotos(true);
    setSelectedEvent(eventId);

    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fehler beim Laden der Fotos:", error);
    } else {
      setPhotos(data || []);
    }

    setLoadingPhotos(false);
  }

  async function handleCreateEvent(e) {
    e.preventDefault();
    setCreatingEvent(true);

    const { error } = await supabase.from("events").insert([
      {
        title,
        location,
        category,
        start_date: startDate,
        end_date: endDate,
        description,
      },
    ]);

    if (error) {
      console.error("Fehler beim Erstellen:", error);
      alert("Ereignis konnte nicht erstellt werden.");
    } else {
      alert("Ereignis erstellt.");
      setTitle("");
      setLocation("");
      setCategory("");
      setStartDate("");
      setEndDate("");
      setDescription("");
      setShowCreateForm(false);
      fetchEvents();
    }

    setCreatingEvent(false);
  }

  function formatDate(dateString) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("de-DE");
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "20px" }}>
        Familien-Ereignisse
      </h1>

      <button
        onClick={() => setShowCreateForm(!showCreateForm)}
        style={{
          backgroundColor: "#111827",
          color: "white",
          border: "none",
          padding: "12px 18px",
          borderRadius: "10px",
          cursor: "pointer",
          marginBottom: "24px",
          fontSize: "15px",
          fontWeight: "600",
        }}
      >
        {showCreateForm ? "Schließen" : "Ereignis erstellen"}
      </button>

      {showCreateForm && (
        <form
          onSubmit={handleCreateEvent}
          style={{
            display: "grid",
            gap: "12px",
            background: "#f9fafb",
            padding: "20px",
            borderRadius: "14px",
            marginBottom: "32px",
            border: "1px solid #e5e7eb",
          }}
        >
          <input
            type="text"
            placeholder="Titel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Ort"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Kategorie"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={inputStyle}
          />

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={inputStyle}
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={inputStyle}
          />

          <textarea
            placeholder="Beschreibung"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            style={{ ...inputStyle, resize: "vertical" }}
          />

          <button
            type="submit"
            disabled={creatingEvent}
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              padding: "12px 18px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            {creatingEvent ? "Erstelle..." : "Speichern"}
          </button>
        </form>
      )}

      <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>
        Alle Ereignisse
      </h2>

      {loadingEvents ? (
        <p>Events werden geladen...</p>
      ) : events.length === 0 ? (
        <p>Noch keine Ereignisse vorhanden.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          {events.map((event) => (
            <div
              key={event.id}
              onClick={() => fetchPhotos(event.id)}
              style={{
                background: "white",
                border: selectedEvent === event.id ? "2px solid #2563eb" : "1px solid #e5e7eb",
                borderRadius: "16px",
                padding: "18px",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                transition: "0.2s ease",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "140px",
                  background: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
                  borderRadius: "12px",
                  marginBottom: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "36px",
                }}
              >
                📸
              </div>

              <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>
                {event.title}
              </h3>

              <p style={{ margin: "4px 0", color: "#374151" }}>
                <strong>Ort:</strong> {event.location || "Kein Ort"}
              </p>

              <p style={{ margin: "4px 0", color: "#374151" }}>
                <strong>Kategorie:</strong> {event.category || "Keine Kategorie"}
              </p>

              <p style={{ margin: "4px 0", color: "#374151" }}>
                <strong>Datum:</strong>{" "}
                {formatDate(event.start_date)}
                {event.end_date ? ` - ${formatDate(event.end_date)}` : ""}
              </p>

              {event.description && (
                <p
                  style={{
                    marginTop: "10px",
                    color: "#6b7280",
                    fontSize: "14px",
                    lineHeight: "1.5",
                  }}
                >
                  {event.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedEvent && (
        <div style={{ marginTop: "20px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>
            Fotos zum Ereignis
          </h2>

          {loadingPhotos ? (
            <p>Fotos werden geladen...</p>
          ) : photos.length === 0 ? (
            <p>Noch keine Fotos in diesem Ereignis.</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "16px",
              }}
            >
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  style={{
                    borderRadius: "14px",
                    overflow: "hidden",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    background: "#fff",
                  }}
                >
                  <img
                    src={photo.image_url}
                    alt={photo.caption || "Foto"}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  fontSize: "15px",
  outline: "none",
};
