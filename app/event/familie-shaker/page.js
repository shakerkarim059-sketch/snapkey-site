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

  const [selectedFile, setSelectedFile] = useState(null);

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
      alert("Fehler beim Laden der Events: " + error.message);
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
      .eq("event_id", eventId);

    if (error) {
      console.error("Fehler beim Laden der Fotos:", error);
      alert("Fehler beim Laden der Fotos: " + error.message);
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
        start_date: startDate || null,
        end_date: endDate || null,
        description,
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
      setShowCreateForm(false);
      fetchEvents();
    }

    setCreatingEvent(false);
  }

  async function handlePhotoUpload(e) {
    e.preventDefault();

    if (!selectedEvent) {
      alert("Bitte zuerst ein Ereignis auswählen.");
      return;
    }

    if (!selectedFile) {
      alert("Bitte eine Datei auswählen.");
      return;
    }

    setUploadingPhoto(true);

    const fileExt = selectedFile.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;
    const filePath = `event-photos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("photos")
      .upload(filePath, selectedFile);

    if (uploadError) {
      console.error("Fehler beim Hochladen:", uploadError);
      alert("Foto konnte nicht hochgeladen werden: " + uploadError.message);
      setUploadingPhoto(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("photos")
      .getPublicUrl(filePath);

    const imageUrl = publicUrlData.publicUrl;

    const { data: insertData, error: insertError } = await supabase
      .from("photos")
      .insert([
        {
          event_id: selectedEvent,
          image_url: imageUrl,
        },
      ])
      .select();

    if (insertError) {
      console.error("Fehler beim Speichern in DB:", insertError);
      console.error("Gesendete Daten:", {
        event_id: selectedEvent,
        image_url: imageUrl,
      });

      alert(
        "DB-Fehler: " +
          (insertError.message || "Unbekannter Fehler") +
          (insertError.details ? " | Details: " + insertError.details : "") +
          (insertError.hint ? " | Hinweis: " + insertError.hint : "")
      );
    } else {
      console.log("Erfolgreich gespeichert:", insertData);
      alert("Foto erfolgreich hochgeladen.");
      setSelectedFile(null);
      fetchPhotos(selectedEvent);
    }

    setUploadingPhoto(false);
  }

  function formatDate(dateString) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("de-DE");
  }

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.title}>Familien-Ereignisse</h1>

      <button
        onClick={() => setShowCreateForm(!showCreateForm)}
        style={styles.darkButton}
      >
        {showCreateForm ? "Schließen" : "Ereignis erstellen"}
      </button>

      {showCreateForm && (
        <form onSubmit={handleCreateEvent} style={styles.form}>
          <input
            type="text"
            placeholder="Titel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={styles.input}
          />

          <input
            type="text"
            placeholder="Ort"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={styles.input}
          />

          <input
            type="text"
            placeholder="Kategorie"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={styles.input}
          />

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={styles.input}
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={styles.input}
          />

          <textarea
            placeholder="Beschreibung"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            style={{ ...styles.input, resize: "vertical" }}
          />

          <button type="submit" disabled={creatingEvent} style={styles.blueButton}>
            {creatingEvent ? "Erstelle..." : "Speichern"}
          </button>
        </form>
      )}

      <h2 style={styles.sectionTitle}>Alle Ereignisse</h2>

      {loadingEvents ? (
        <p>Events werden geladen...</p>
      ) : events.length === 0 ? (
        <p>Noch keine Ereignisse vorhanden.</p>
      ) : (
        <div style={styles.grid}>
          {events.map((event) => (
            <div
              key={event.id}
              onClick={() => fetchPhotos(event.id)}
              style={{
                ...styles.card,
                border:
                  selectedEvent === event.id
                    ? "2px solid #2563eb"
                    : "1px solid #e5e7eb",
              }}
            >
              <div style={styles.cardImage}>📸</div>

              <h3 style={styles.cardTitle}>{event.title}</h3>

              <p style={styles.cardText}>
                <strong>Ort:</strong> {event.location || "Kein Ort"}
              </p>

              <p style={styles.cardText}>
                <strong>Kategorie:</strong> {event.category || "Keine Kategorie"}
              </p>

              <p style={styles.cardText}>
                <strong>Datum:</strong> {formatDate(event.start_date)}
                {event.end_date ? ` - ${formatDate(event.end_date)}` : ""}
              </p>

              {event.description && (
                <p style={styles.cardDescription}>{event.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedEvent && (
        <div style={{ marginTop: "30px" }}>
          <h2 style={styles.sectionTitle}>Fotos zum Ereignis</h2>

          <form onSubmit={handlePhotoUpload} style={styles.form}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              style={styles.input}
            />

            <button
              type="submit"
              disabled={uploadingPhoto}
              style={styles.greenButton}
            >
              {uploadingPhoto ? "Lade hoch..." : "Foto hochladen"}
            </button>
          </form>

          {loadingPhotos ? (
            <p>Fotos werden geladen...</p>
          ) : photos.length === 0 ? (
            <p>Noch keine Fotos in diesem Ereignis.</p>
          ) : (
            <div style={styles.photoGrid}>
              {photos.map((photo) => (
                <div key={photo.id} style={styles.photoCard}>
                  <img
                    src={photo.image_url}
                    alt="Foto"
                    style={styles.photo}
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

const styles = {
  wrapper: {
    padding: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "16px",
  },
  form: {
    display: "grid",
    gap: "12px",
    background: "#f9fafb",
    padding: "20px",
    borderRadius: "14px",
    marginBottom: "32px",
    border: "1px solid #e5e7eb",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
    outline: "none",
  },
  darkButton: {
    backgroundColor: "#111827",
    color: "white",
    border: "none",
    padding: "12px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    marginBottom: "24px",
    fontSize: "15px",
    fontWeight: "600",
  },
  blueButton: {
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    padding: "12px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },
  greenButton: {
    backgroundColor: "#16a34a",
    color: "white",
    border: "none",
    padding: "12px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  },
  card: {
    background: "white",
    borderRadius: "16px",
    padding: "18px",
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
    transition: "0.2s ease",
  },
  cardImage: {
    width: "100%",
    height: "140px",
    background: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
    borderRadius: "12px",
    marginBottom: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "36px",
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "700",
    marginBottom: "8px",
  },
  cardText: {
    margin: "4px 0",
    color: "#374151",
  },
  cardDescription: {
    marginTop: "10px",
    color: "#6b7280",
    fontSize: "14px",
    lineHeight: "1.5",
  },
  photoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
  },
  photoCard: {
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    background: "#fff",
  },
  photo: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    display: "block",
  },
};
