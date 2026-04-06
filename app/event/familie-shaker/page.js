"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function EventPage() {
  const [events, setEvents] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [openEventId, setOpenEventId] = useState(null);
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
  const [caption, setCaption] = useState("");

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [lightboxPhotos, setLightboxPhotos] = useState([]);

  const fileInputRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    fetchEvents();
    fetchAllPhotos();

    if (typeof document !== "undefined") {
      document.documentElement.style.overflowX = "hidden";
      document.body.style.overflowX = "hidden";
      document.body.style.margin = "0";
    }
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (!lightboxOpen) return;

      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowRight") {
        showNextPhoto();
      } else if (e.key === "ArrowLeft") {
        showPrevPhoto();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, selectedPhotoIndex, lightboxPhotos]);

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

  async function fetchAllPhotos() {
    setLoadingPhotos(true);

    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .order("created_at", { ascending: true });

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
      alert("Bitte zuerst ein Foto auswählen.");
      return;
    }

    setUploadingPhoto(true);

    const fileExt = selectedFile.name.split(".").pop();
    const generatedFileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;
    const filePath = `event-photos/${generatedFileName}`;

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

    const publicUrl = publicUrlData.publicUrl;

    const { data: insertData, error: insertError } = await supabase
      .from("photos")
      .insert([
        {
          event_id: selectedEvent,
          file_name: generatedFileName,
          file_path: filePath,
          public_url: publicUrl,
          caption: caption || null,
        },
      ])
      .select();

    if (insertError) {
      console.error("Fehler beim Speichern in DB:", insertError);
      console.error("Gesendete Daten:", {
        event_id: selectedEvent,
        file_name: generatedFileName,
        file_path: filePath,
        public_url: publicUrl,
        caption: caption || null,
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
      setCaption("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await fetchAllPhotos();
    }

    setUploadingPhoto(false);
  }

  function formatDate(dateString) {
    if (!dateString) return "Kein Datum";
    return new Date(dateString).toLocaleDateString("de-DE");
  }

  function getSelectedEventData() {
    return events.find((event) => event.id === selectedEvent) || null;
  }

  function getPhotosForEvent(eventId) {
    return photos.filter((photo) => photo.event_id === eventId);
  }

  function getCoverPhotoForEvent(eventId) {
    const eventPhotos = getPhotosForEvent(eventId);
    return eventPhotos.length > 0 ? eventPhotos[0] : null;
  }

  function handleToggleEvent(eventId) {
    setOpenEventId((prev) => (prev === eventId ? null : eventId));
    setSelectedEvent(eventId);
    setSelectedFile(null);
    setCaption("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function openLightbox(index, eventPhotos) {
    setLightboxPhotos(eventPhotos);
    setSelectedPhotoIndex(index);
    setLightboxOpen(true);

    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }
  }

  function closeLightbox() {
    setLightboxOpen(false);
    setLightboxPhotos([]);

    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
  }

  function showNextPhoto() {
    if (!lightboxPhotos.length) return;
    setSelectedPhotoIndex((prev) => (prev + 1) % lightboxPhotos.length);
  }

  function showPrevPhoto() {
    if (!lightboxPhotos.length) return;
    setSelectedPhotoIndex(
      (prev) => (prev - 1 + lightboxPhotos.length) % lightboxPhotos.length
    );
  }

  function handleTouchStart(e) {
    touchStartX.current = e.changedTouches[0].clientX;
  }

  function handleTouchEnd(e) {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;

    if (diff > 50) {
      showNextPhoto();
    } else if (diff < -50) {
      showPrevPhoto();
    }
  }

  const currentPhoto = lightboxPhotos[selectedPhotoIndex];
  const selectedEventData = getSelectedEventData();

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Familien-Ereignisse</h1>
          <p style={styles.subtitle}>
            Fotos nach Urlauben, Feiern und besonderen Momenten geordnet.
          </p>
        </div>

        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={styles.primaryButton}
        >
          {showCreateForm ? "Formular schließen" : "Ereignis erstellen"}
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateEvent} style={styles.formCard}>
          <h2 style={styles.formTitle}>Neues Ereignis</h2>

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

          <div style={styles.twoCol}>
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
          </div>

          <textarea
            placeholder="Beschreibung"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            style={{ ...styles.input, resize: "vertical" }}
          />

          <button
            type="submit"
            disabled={creatingEvent}
            style={styles.primaryButton}
          >
            {creatingEvent ? "Ereignis wird erstellt..." : "Ereignis speichern"}
          </button>
        </form>
      )}

      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>Alle Ereignisse</h2>
      </div>

      {loadingEvents ? (
        <p>Events werden geladen...</p>
      ) : events.length === 0 ? (
        <div style={styles.emptyBox}>Noch keine Ereignisse vorhanden.</div>
      ) : (
        <div style={styles.eventGrid}>
          {events.map((event) => {
            const eventPhotos = getPhotosForEvent(event.id);
            const coverPhoto = getCoverPhotoForEvent(event.id);
            const isOpen = openEventId === event.id;

            return (
              <div key={event.id} style={styles.eventColumn}>
                <div
                  onClick={() => handleToggleEvent(event.id)}
                  style={{
                    ...styles.eventCard,
                    ...(isOpen ? styles.eventCardActive : {}),
                  }}
                >
                  <div
                    style={{
                      ...styles.eventCover,
                      ...(coverPhoto
                        ? {
                            backgroundImage: `url(${coverPhoto.public_url || coverPhoto.image_url})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                          }
                        : {}),
                    }}
                  >
                    <div style={styles.eventCoverShade} />
                    <div style={styles.eventCoverOverlay}>
                      <span style={styles.eventChip}>
                        {event.category || "Ereignis"}
                      </span>
                    </div>
                  </div>

                  <div style={styles.eventContent}>
                    <div style={styles.eventTopRow}>
                      <h3 style={styles.eventTitle}>{event.title}</h3>
                      <span style={styles.eventArrow}>{isOpen ? "−" : "+"}</span>
                    </div>

                    <div style={styles.metaList}>
                      <p style={styles.metaText}>
                        <strong>Ort:</strong> {event.location || "Kein Ort"}
                      </p>
                      <p style={styles.metaText}>
                        <strong>Datum:</strong> {formatDate(event.start_date)}
                        {event.end_date ? ` - ${formatDate(event.end_date)}` : ""}
                      </p>
                      <p style={styles.metaText}>
                        <strong>Bilder:</strong> {eventPhotos.length}
                      </p>
                    </div>

                    {event.description && (
                      <p style={styles.eventDescription}>{event.description}</p>
                    )}
                  </div>
                </div>

                {isOpen && (
                  <div style={styles.inlineGallerySection}>
                    <div style={styles.galleryHeader}>
                      <div>
                        <h2 style={styles.sectionTitle}>
                          {selectedEventData?.title || event.title}
                        </h2>
                        <p style={styles.selectedEventSub}>
                          {event.location || "Kein Ort"} • {formatDate(event.start_date)}
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handlePhotoUpload} style={styles.uploadCard}>
                      <h3 style={styles.formTitle}>Foto hinzufügen</h3>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        style={{ display: "none" }}
                      />

                      <div style={styles.uploadRow}>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          style={styles.secondaryButton}
                        >
                          Datei auswählen
                        </button>

                        <div style={styles.fileNameBox}>
                          {selectedFile
                            ? selectedFile.name
                            : "Noch keine Datei ausgewählt"}
                        </div>
                      </div>

                      <input
                        type="text"
                        placeholder="Bildbeschreibung (optional)"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        style={styles.input}
                      />

                      <button
                        type="submit"
                        disabled={uploadingPhoto}
                        style={styles.primaryButton}
                      >
                        {uploadingPhoto
                          ? "Foto wird hochgeladen..."
                          : "Foto hochladen"}
                      </button>
                    </form>

                    {loadingPhotos ? (
                      <p>Fotos werden geladen...</p>
                    ) : eventPhotos.length === 0 ? (
                      <div style={styles.emptyBox}>
                        Noch keine Fotos in diesem Ereignis.
                      </div>
                    ) : (
                      <div style={styles.photoGrid}>
                        {eventPhotos.map((photo, index) => (
                          <div
                            key={photo.id}
                            style={styles.photoCard}
                            onClick={() => openLightbox(index, eventPhotos)}
                          >
                            <img
                              src={photo.public_url || photo.image_url}
                              alt={photo.caption || photo.file_name || "Foto"}
                              style={styles.photo}
                            />
                            <div style={styles.photoOverlay}>
                              <span style={styles.photoOverlayText}>
                                Vergrößern
                              </span>
                            </div>
                            {photo.caption && (
                              <div style={styles.photoCaption}>{photo.caption}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {lightboxOpen && currentPhoto && (
        <div style={styles.lightboxBackdrop} onClick={closeLightbox}>
          <div
            style={styles.lightboxContent}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <button style={styles.closeButton} onClick={closeLightbox}>
              ✕
            </button>

            {lightboxPhotos.length > 1 && (
              <>
                <button
                  style={{ ...styles.navButton, left: "16px" }}
                  onClick={showPrevPhoto}
                >
                  ‹
                </button>

                <button
                  style={{ ...styles.navButton, right: "16px" }}
                  onClick={showNextPhoto}
                >
                  ›
                </button>
              </>
            )}

            <img
              src={currentPhoto.public_url || currentPhoto.image_url}
              alt={currentPhoto.caption || currentPhoto.file_name || "Foto"}
              style={styles.lightboxImage}
            />

            <div style={styles.lightboxFooter}>
              <div style={styles.lightboxCounter}>
                {selectedPhotoIndex + 1} / {lightboxPhotos.length}
              </div>
              {currentPhoto.caption && (
                <div style={styles.lightboxCaption}>{currentPhoto.caption}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: "24px",
    maxWidth: "1280px",
    margin: "0 auto",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    overflowX: "hidden",
    width: "100%",
    boxSizing: "border-box",
    touchAction: "pan-y",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "28px",
  },
  title: {
    fontSize: "34px",
    fontWeight: "800",
    margin: 0,
    color: "#0f172a",
  },
  subtitle: {
    marginTop: "8px",
    marginBottom: 0,
    color: "#475569",
    fontSize: "15px",
  },
  sectionHeader: {
    marginBottom: "16px",
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "700",
    margin: 0,
    color: "#0f172a",
  },
  selectedEventSub: {
    marginTop: "6px",
    color: "#64748b",
    fontSize: "14px",
  },
  formTitle: {
    margin: 0,
    marginBottom: "6px",
    fontSize: "20px",
    fontWeight: "700",
    color: "#0f172a",
  },
  formCard: {
    display: "grid",
    gap: "12px",
    background: "#ffffff",
    padding: "22px",
    borderRadius: "20px",
    marginBottom: "32px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
  },
  uploadCard: {
    display: "grid",
    gap: "14px",
    background: "#ffffff",
    padding: "22px",
    borderRadius: "20px",
    marginBottom: "28px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
  },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    outline: "none",
    backgroundColor: "#fff",
    boxSizing: "border-box",
  },
  primaryButton: {
    backgroundColor: "#0f172a",
    color: "white",
    border: "none",
    padding: "14px 18px",
    borderRadius: "14px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "700",
    boxShadow: "0 8px 20px rgba(15, 23, 42, 0.18)",
  },
  secondaryButton: {
    backgroundColor: "#1e293b",
    color: "#fff",
    border: "none",
    padding: "14px 18px",
    borderRadius: "14px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "700",
    minWidth: "170px",
    boxShadow: "0 8px 20px rgba(15, 23, 42, 0.12)",
  },
  uploadRow: {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    gap: "12px",
    alignItems: "center",
  },
  fileNameBox: {
    minHeight: "50px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    backgroundColor: "#f8fafc",
    display: "flex",
    alignItems: "center",
    padding: "0 14px",
    color: "#475569",
    fontSize: "14px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  eventGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "22px",
    marginBottom: "36px",
    overflowX: "hidden",
  },
  eventColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    minWidth: 0,
  },
  eventCard: {
    background: "#fff",
    borderRadius: "22px",
    overflow: "hidden",
    cursor: "pointer",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
    transition: "all 0.2s ease",
  },
  eventCardActive: {
    border: "2px solid #0f172a",
    transform: "translateY(-2px)",
  },
  eventCover: {
    height: "170px",
    background:
      "linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #334155 100%)",
    position: "relative",
  },
  eventCoverShade: {
    position: "absolute",
    inset: 0,
    background: "rgba(15, 23, 42, 0.28)",
  },
  eventCoverOverlay: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    padding: "14px",
  },
  eventChip: {
    backgroundColor: "rgba(255,255,255,0.15)",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "700",
    backdropFilter: "blur(4px)",
  },
  eventContent: {
    padding: "18px",
  },
  eventTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
  },
  eventTitle: {
    fontSize: "21px",
    fontWeight: "800",
    margin: 0,
    marginBottom: "10px",
    color: "#0f172a",
    flex: 1,
  },
  eventArrow: {
    fontSize: "28px",
    fontWeight: "400",
    color: "#0f172a",
    lineHeight: 1,
    marginTop: "-2px",
  },
  metaList: {
    display: "grid",
    gap: "6px",
  },
  metaText: {
    margin: 0,
    color: "#334155",
    fontSize: "14px",
    lineHeight: "1.5",
  },
  eventDescription: {
    marginTop: "12px",
    color: "#64748b",
    fontSize: "14px",
    lineHeight: "1.6",
  },
  inlineGallerySection: {
    marginTop: "-2px",
    marginBottom: "12px",
  },
  galleryHeader: {
    marginBottom: "16px",
  },
  photoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
  },
  photoCard: {
    position: "relative",
    borderRadius: "18px",
    overflow: "hidden",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.10)",
    background: "#fff",
    cursor: "pointer",
  },
  photo: {
    width: "100%",
    height: "260px",
    objectFit: "cover",
    display: "block",
  },
  photoOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(15, 23, 42, 0.22)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    transition: "0.2s ease",
    pointerEvents: "none",
  },
  photoOverlayText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: "15px",
  },
  photoCaption: {
    padding: "12px 14px",
    fontSize: "14px",
    color: "#334155",
    background: "#fff",
  },
  emptyBox: {
    backgroundColor: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "22px",
    color: "#64748b",
  },
  lightboxBackdrop: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(2, 6, 23, 0.92)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "20px",
    touchAction: "none",
  },
  lightboxContent: {
    position: "relative",
    width: "100%",
    maxWidth: "1100px",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  lightboxImage: {
    maxWidth: "100%",
    maxHeight: "75vh",
    objectFit: "contain",
    borderRadius: "18px",
  },
  closeButton: {
    position: "absolute",
    top: "-8px",
    right: "0",
    backgroundColor: "rgba(255,255,255,0.12)",
    color: "#fff",
    border: "none",
    width: "44px",
    height: "44px",
    borderRadius: "999px",
    fontSize: "22px",
    cursor: "pointer",
  },
  navButton: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "rgba(255,255,255,0.14)",
    color: "#fff",
    border: "none",
    width: "52px",
    height: "52px",
    borderRadius: "999px",
    fontSize: "34px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  lightboxFooter: {
    marginTop: "14px",
    textAlign: "center",
    color: "#fff",
  },
  lightboxCounter: {
    fontSize: "13px",
    opacity: 0.8,
    marginBottom: "6px",
  },
  lightboxCaption: {
    fontSize: "15px",
    lineHeight: "1.5",
  },
};
