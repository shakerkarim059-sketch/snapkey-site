"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../../../lib/supabase";

const FAMILY_PASSWORD = "familie123";
const ADMIN_PASSWORD = "admin123";
const LOCAL_LIKE_STORAGE_KEY = "family-photo-liked-map";

export default function EventPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const [events, setEvents] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [photoLikes, setPhotoLikes] = useState([]);
  const [photoComments, setPhotoComments] = useState([]);

  const [openEventId, setOpenEventId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [loadingLikes, setLoadingLikes] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  const [creatingEvent, setCreatingEvent] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [editingEventId, setEditingEventId] = useState(null);
  const [updatingEvent, setUpdatingEvent] = useState(false);

  const [likingPhotoId, setLikingPhotoId] = useState(null);
  const [submittingCommentPhotoId, setSubmittingCommentPhotoId] = useState(null);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [caption, setCaption] = useState("");

  const [commentDrafts, setCommentDrafts] = useState({});
  const [commentNames, setCommentNames] = useState({});

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYearFilter, setSelectedYearFilter] = useState("all");
  const [selectedMonthFilter, setSelectedMonthFilter] = useState("all");

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [lightboxPhotos, setLightboxPhotos] = useState([]);

  const fileInputRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (!isAuthenticated) return;

    fetchEvents();
    fetchAllPhotos();
    fetchAllLikes();
    fetchAllComments();

    if (typeof document !== "undefined") {
      document.documentElement.style.overflowX = "hidden";
      document.body.style.overflowX = "hidden";
      document.body.style.margin = "0";
    }
  }, [isAuthenticated]);

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

  function handleLogin() {
    if (passwordInput === FAMILY_PASSWORD) {
      setIsAuthenticated(true);
      setIsAdmin(false);
      return;
    }

    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setIsAdmin(true);
      return;
    }

    alert("Falsches Passwort.");
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setPasswordInput("");
    setOpenEventId(null);
    setSelectedEvent(null);
    setEditingEventId(null);
    setShowCreateForm(false);
    setLightboxOpen(false);
  }

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

  async function fetchAllLikes() {
    setLoadingLikes(true);

    const { data, error } = await supabase
      .from("photo_likes")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Fehler beim Laden der Likes:", error);
      alert("Fehler beim Laden der Likes: " + error.message);
    } else {
      setPhotoLikes(data || []);
    }

    setLoadingLikes(false);
  }

  async function fetchAllComments() {
    setLoadingComments(true);

    const { data, error } = await supabase
      .from("photo_comments")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Fehler beim Laden der Kommentare:", error);
      alert("Fehler beim Laden der Kommentare: " + error.message);
    } else {
      setPhotoComments(data || []);
    }

    setLoadingComments(false);
  }

  function resetEventForm() {
    setTitle("");
    setLocation("");
    setCategory("");
    setStartDate("");
    setEndDate("");
    setDescription("");
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
      resetEventForm();
      setShowCreateForm(false);
      fetchEvents();
    }

    setCreatingEvent(false);
  }

  function startEditingEvent(event) {
    setEditingEventId(event.id);
    setTitle(event.title || "");
    setLocation(event.location || "");
    setCategory(event.category || "");
    setStartDate(event.start_date ? event.start_date.slice(0, 10) : "");
    setEndDate(event.end_date ? event.end_date.slice(0, 10) : "");
    setDescription(event.description || "");
    setShowCreateForm(false);

    if (openEventId !== event.id) {
      setOpenEventId(event.id);
      setSelectedEvent(event.id);
    }
  }

  function cancelEditingEvent() {
    setEditingEventId(null);
    resetEventForm();
  }

  async function handleUpdateEvent(e) {
    e.preventDefault();

    if (!editingEventId) return;

    setUpdatingEvent(true);

    const { error } = await supabase
      .from("events")
      .update({
        title,
        location,
        category,
        start_date: startDate || null,
        end_date: endDate || null,
        description,
      })
      .eq("id", editingEventId);

    if (error) {
      console.error("Fehler beim Aktualisieren:", error);
      alert("Ereignis konnte nicht aktualisiert werden: " + error.message);
    } else {
      alert("Ereignis aktualisiert.");
      setEditingEventId(null);
      resetEventForm();
      fetchEvents();
    }

    setUpdatingEvent(false);
  }

  async function handlePhotoUpload(e) {
    e.preventDefault();

    if (!selectedEvent) {
      alert("Bitte zuerst ein Ereignis auswählen.");
      return;
    }

    if (!selectedFiles.length) {
      alert("Bitte zuerst ein oder mehrere Fotos auswählen.");
      return;
    }

    setUploadingPhoto(true);

    let uploadErrorFound = false;

    for (const file of selectedFiles) {
      const fileExt = file.name.split(".").pop();
      const generatedFileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const filePath = `event-photos/${generatedFileName}`;

      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Fehler beim Hochladen:", uploadError);
        alert(`Foto "${file.name}" konnte nicht hochgeladen werden: ${uploadError.message}`);
        uploadErrorFound = true;
        continue;
      }

      const { data: publicUrlData } = supabase.storage
        .from("photos")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      const { error: insertError } = await supabase.from("photos").insert([
        {
          event_id: selectedEvent,
          file_name: generatedFileName,
          file_path: filePath,
          public_url: publicUrl,
          caption: caption || null,
        },
      ]);

      if (insertError) {
        console.error("Fehler beim Speichern in DB:", insertError);
        alert(
          `DB-Fehler bei "${file.name}": ` +
            (insertError.message || "Unbekannter Fehler")
        );
        uploadErrorFound = true;
      }
    }

    if (!uploadErrorFound) {
      alert(
        selectedFiles.length === 1
          ? "Foto erfolgreich hochgeladen."
          : `${selectedFiles.length} Fotos erfolgreich hochgeladen.`
      );
    }

    setSelectedFiles([]);
    setCaption("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    await fetchAllPhotos();
    setUploadingPhoto(false);
  }

  async function handleDeletePhoto(photo) {
    if (!isAdmin) return;

    const confirmDelete = window.confirm("Foto wirklich löschen?");
    if (!confirmDelete) return;

    if (photo.file_path) {
      const { error: storageError } = await supabase.storage
        .from("photos")
        .remove([photo.file_path]);

      if (storageError) {
        console.error("Fehler beim Löschen aus Storage:", storageError);
      }
    }

    const { error } = await supabase.from("photos").delete().eq("id", photo.id);

    if (error) {
      console.error("Fehler beim Löschen aus DB:", error);
      alert("Fehler beim Löschen: " + error.message);
    } else {
      await fetchAllPhotos();
      await fetchAllLikes();
      await fetchAllComments();
      alert("Foto gelöscht.");
    }
  }

  function getStoredLikeMap() {
    if (typeof window === "undefined") return {};
    try {
      const raw = window.localStorage.getItem(LOCAL_LIKE_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  function setStoredLikeMap(map) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(LOCAL_LIKE_STORAGE_KEY, JSON.stringify(map));
  }

  function isPhotoLikedByThisBrowser(photoId) {
    const likeMap = getStoredLikeMap();
    return Boolean(likeMap[photoId]);
  }

  async function handleToggleLike(photoId) {
    setLikingPhotoId(photoId);

    try {
      const likeMap = getStoredLikeMap();
      const existingLikeId = likeMap[photoId];

      if (existingLikeId) {
        const { error } = await supabase
          .from("photo_likes")
          .delete()
          .eq("id", existingLikeId);

        if (error) {
          console.error("Fehler beim Entfernen des Likes:", error);
          alert("Like konnte nicht entfernt werden: " + error.message);
          setLikingPhotoId(null);
          return;
        }

        delete likeMap[photoId];
        setStoredLikeMap(likeMap);
      } else {
        const { data, error } = await supabase
          .from("photo_likes")
          .insert([{ photo_id: photoId }])
          .select()
          .single();

        if (error) {
          console.error("Fehler beim Liken:", error);
          alert("Like konnte nicht gespeichert werden: " + error.message);
          setLikingPhotoId(null);
          return;
        }

        likeMap[photoId] = data.id;
        setStoredLikeMap(likeMap);
      }

      await fetchAllLikes();
    } finally {
      setLikingPhotoId(null);
    }
  }

  async function handleSubmitComment(photoId) {
    const commentText = (commentDrafts[photoId] || "").trim();
    const authorName = (commentNames[photoId] || "").trim();

    if (!commentText) {
      alert("Bitte zuerst einen Kommentar eingeben.");
      return;
    }

    setSubmittingCommentPhotoId(photoId);

    const { error } = await supabase.from("photo_comments").insert([
      {
        photo_id: photoId,
        author_name: authorName || "Unbekannt",
        comment_text: commentText,
      },
    ]);

    if (error) {
      console.error("Fehler beim Speichern des Kommentars:", error);
      alert("Kommentar konnte nicht gespeichert werden: " + error.message);
    } else {
      setCommentDrafts((prev) => ({
        ...prev,
        [photoId]: "",
      }));
      await fetchAllComments();
    }

    setSubmittingCommentPhotoId(null);
  }

  function formatDate(dateString) {
    if (!dateString) return "Kein Datum";
    return new Date(dateString).toLocaleDateString("de-DE");
  }

  function formatDateTime(dateString) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("de-DE");
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

  function getLikesForPhoto(photoId) {
    return photoLikes.filter((like) => like.photo_id === photoId);
  }

  function getCommentsForPhoto(photoId) {
    return photoComments.filter((comment) => comment.photo_id === photoId);
  }

  function handleToggleEvent(eventId) {
    setOpenEventId((prev) => (prev === eventId ? null : eventId));
    setSelectedEvent(eventId);
    setSelectedFiles([]);
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

  const availableYears = useMemo(() => {
    const years = events
      .map((event) => {
        if (!event.start_date) return null;
        return new Date(event.start_date).getFullYear();
      })
      .filter(Boolean);

    return [...new Set(years)].sort((a, b) => b - a);
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const searchValue = searchTerm.trim().toLowerCase();
      const searchableText = [
        event.title,
        event.location,
        event.category,
        event.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !searchValue || searchableText.includes(searchValue);

      const eventDate = event.start_date ? new Date(event.start_date) : null;
      const eventYear = eventDate ? String(eventDate.getFullYear()) : "";
      const eventMonth = eventDate ? String(eventDate.getMonth() + 1) : "";

      const matchesYear =
        selectedYearFilter === "all" || eventYear === selectedYearFilter;

      const matchesMonth =
        selectedMonthFilter === "all" || eventMonth === selectedMonthFilter;

      return matchesSearch && matchesYear && matchesMonth;
    });
  }, [events, searchTerm, selectedYearFilter, selectedMonthFilter]);

  const currentPhoto = lightboxPhotos[selectedPhotoIndex];
  const selectedEventData = getSelectedEventData();

  if (!isAuthenticated) {
    return (
      <div style={styles.page}>
        <div style={styles.loginBox}>
          <h1 style={styles.title}>Familien-Ereignisse</h1>
          <p style={styles.subtitle}>
            Bitte Passwort eingeben, um die Familienfotos zu sehen.
          </p>

          <input
            type="password"
            placeholder="Passwort eingeben"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin();
            }}
            style={styles.input}
          />

          <button onClick={handleLogin} style={styles.primaryButton}>
            Einloggen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Familien-Ereignisse</h1>
          <p style={styles.subtitle}>
            Fotos nach Urlauben, Feiern und besonderen Momenten geordnet.
          </p>
          <p style={styles.accessInfo}>
            Zugang: {isAdmin ? "Admin" : "Familie"}
          </p>
        </div>

        <div style={styles.headerButtons}>
          {!editingEventId && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              style={styles.primaryButton}
            >
              {showCreateForm ? "Formular schließen" : "Ereignis erstellen"}
            </button>
          )}

          <button onClick={handleLogout} style={styles.secondaryButton}>
            Abmelden
          </button>
        </div>
      </div>

      {showCreateForm && !editingEventId && (
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

      {editingEventId && (
        <form onSubmit={handleUpdateEvent} style={styles.formCard}>
          <div style={styles.editHeader}>
            <h2 style={styles.formTitle}>Ereignis bearbeiten</h2>
            <button
              type="button"
              onClick={cancelEditingEvent}
              style={styles.cancelButton}
            >
              Abbrechen
            </button>
          </div>

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
            disabled={updatingEvent}
            style={styles.primaryButton}
          >
            {updatingEvent ? "Ereignis wird gespeichert..." : "Änderungen speichern"}
          </button>
        </form>
      )}

      <div style={styles.filterCard}>
        <h2 style={styles.formTitle}>Filter</h2>

        <div style={styles.filterGrid}>
          <input
            type="text"
            placeholder="Nach Titel, Ort, Kategorie suchen"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.input}
          />

          <select
            value={selectedYearFilter}
            onChange={(e) => setSelectedYearFilter(e.target.value)}
            style={styles.input}
          >
            <option value="all">Alle Jahre</option>
            {availableYears.map((year) => (
              <option key={year} value={String(year)}>
                {year}
              </option>
            ))}
          </select>

          <select
            value={selectedMonthFilter}
            onChange={(e) => setSelectedMonthFilter(e.target.value)}
            style={styles.input}
          >
            <option value="all">Alle Monate</option>
            <option value="1">Januar</option>
            <option value="2">Februar</option>
            <option value="3">März</option>
            <option value="4">April</option>
            <option value="5">Mai</option>
            <option value="6">Juni</option>
            <option value="7">Juli</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">Oktober</option>
            <option value="11">November</option>
            <option value="12">Dezember</option>
          </select>
        </div>

        <div style={styles.filterInfo}>
          Gefundene Ereignisse: {filteredEvents.length}
        </div>
      </div>

      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>Alle Ereignisse</h2>
      </div>

      {loadingEvents ? (
        <p>Events werden geladen...</p>
      ) : filteredEvents.length === 0 ? (
        <div style={styles.emptyBox}>Keine Ereignisse für diesen Filter gefunden.</div>
      ) : (
        <div style={styles.eventGrid}>
          {filteredEvents.map((event) => {
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

                    <div
                      style={styles.eventActionRow}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => startEditingEvent(event)}
                        style={styles.editButton}
                      >
                        Bearbeiten
                      </button>
                    </div>
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
                      <h3 style={styles.formTitle}>Fotos hinzufügen</h3>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) =>
                          setSelectedFiles(Array.from(e.target.files || []))
                        }
                        style={{ display: "none" }}
                      />

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        style={styles.secondaryButton}
                      >
                        Bilder auswählen
                      </button>

                      {selectedFiles.length > 0 && (
                        <div style={styles.selectedFilesInfo}>
                          {selectedFiles.length} Bild
                          {selectedFiles.length > 1 ? "er" : ""} ausgewählt
                        </div>
                      )}

                      <input
                        type="text"
                        placeholder="Gemeinsame Bildbeschreibung (optional)"
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
                          ? "Fotos werden hochgeladen..."
                          : "Fotos hochladen"}
                      </button>
                    </form>

                    {loadingPhotos || loadingLikes || loadingComments ? (
                      <p>Inhalte werden geladen...</p>
                    ) : eventPhotos.length === 0 ? (
                      <div style={styles.emptyBox}>
                        Noch keine Fotos in diesem Ereignis.
                      </div>
                    ) : (
                      <div style={styles.photoGrid}>
                        {eventPhotos.map((photo, index) => {
                          const likesForPhoto = getLikesForPhoto(photo.id);
                          const commentsForPhoto = getCommentsForPhoto(photo.id);
                          const likedByThisBrowser = isPhotoLikedByThisBrowser(photo.id);

                          return (
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

                              {isAdmin && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeletePhoto(photo);
                                  }}
                                  style={styles.deleteButton}
                                >
                                  Löschen
                                </button>
                              )}

                              <div
                                style={styles.photoInfoArea}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {photo.caption && (
                                  <div style={styles.photoCaption}>{photo.caption}</div>
                                )}

                                <div style={styles.likeRow}>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleLike(photo.id)}
                                    disabled={likingPhotoId === photo.id}
                                    style={{
                                      ...styles.likeButton,
                                      ...(likedByThisBrowser
                                        ? styles.likeButtonActive
                                        : {}),
                                    }}
                                  >
                                    {likedByThisBrowser ? "♥ Gelikt" : "♡ Liken"}
                                  </button>

                                  <span style={styles.likeCount}>
                                    {likesForPhoto.length} Like
                                    {likesForPhoto.length === 1 ? "" : "s"}
                                  </span>
                                </div>

                                <div style={styles.commentForm}>
                                  <input
                                    type="text"
                                    placeholder="Dein Name"
                                    value={commentNames[photo.id] || ""}
                                    onChange={(e) =>
                                      setCommentNames((prev) => ({
                                        ...prev,
                                        [photo.id]: e.target.value,
                                      }))
                                    }
                                    style={styles.commentInput}
                                  />

                                  <textarea
                                    placeholder="Kommentar schreiben"
                                    value={commentDrafts[photo.id] || ""}
                                    onChange={(e) =>
                                      setCommentDrafts((prev) => ({
                                        ...prev,
                                        [photo.id]: e.target.value,
                                      }))
                                    }
                                    rows={3}
                                    style={styles.commentTextarea}
                                  />

                                  <button
                                    type="button"
                                    onClick={() => handleSubmitComment(photo.id)}
                                    disabled={submittingCommentPhotoId === photo.id}
                                    style={styles.commentButton}
                                  >
                                    {submittingCommentPhotoId === photo.id
                                      ? "Speichert..."
                                      : "Kommentieren"}
                                  </button>
                                </div>

                                <div style={styles.commentList}>
                                  {commentsForPhoto.length === 0 ? (
                                    <div style={styles.noCommentsText}>
                                      Noch keine Kommentare.
                                    </div>
                                  ) : (
                                    commentsForPhoto.map((comment) => (
                                      <div key={comment.id} style={styles.commentItem}>
                                        <div style={styles.commentAuthorRow}>
                                          <span style={styles.commentAuthor}>
                                            {comment.author_name || "Unbekannt"}
                                          </span>
                                          <span style={styles.commentDate}>
                                            {formatDateTime(comment.created_at)}
                                          </span>
                                        </div>
                                        <div style={styles.commentText}>
                                          {comment.comment_text}
                                        </div>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
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
            <button type="button" style={styles.closeButton} onClick={closeLightbox}>
              ✕
            </button>

            {lightboxPhotos.length > 1 && (
              <>
                <button
                  type="button"
                  style={{ ...styles.navButton, left: "16px" }}
                  onClick={showPrevPhoto}
                >
                  ‹
                </button>

                <button
                  type="button"
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
  loginBox: {
    maxWidth: "420px",
    margin: "120px auto",
    display: "grid",
    gap: "14px",
    background: "#fff",
    padding: "24px",
    borderRadius: "20px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "28px",
  },
  headerButtons: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
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
  accessInfo: {
    marginTop: "10px",
    marginBottom: 0,
    color: "#0f172a",
    fontSize: "14px",
    fontWeight: "700",
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
  editHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
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
  filterCard: {
    display: "grid",
    gap: "14px",
    background: "#ffffff",
    padding: "22px",
    borderRadius: "20px",
    marginBottom: "28px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
  },
  filterGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
  },
  filterInfo: {
    color: "#475569",
    fontSize: "14px",
    fontWeight: "600",
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
  cancelButton: {
    backgroundColor: "#e2e8f0",
    color: "#0f172a",
    border: "none",
    padding: "12px 16px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
  },
  editButton: {
    backgroundColor: "#e2e8f0",
    color: "#0f172a",
    border: "none",
    padding: "10px 14px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
  },
  deleteButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "rgba(220, 38, 38, 0.92)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "8px 10px",
    fontSize: "12px",
    cursor: "pointer",
    fontWeight: "700",
    zIndex: 2,
  },
  selectedFilesInfo: {
    color: "#475569",
    fontSize: "14px",
    fontWeight: "600",
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
    justifyContent: "space-between",
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
  eventActionRow: {
    marginTop: "14px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
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
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
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
  photoInfoArea: {
    padding: "14px",
    display: "grid",
    gap: "14px",
    background: "#fff",
  },
  photoCaption: {
    fontSize: "14px",
    color: "#334155",
    lineHeight: "1.5",
  },
  likeRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
  },
  likeButton: {
    backgroundColor: "#e2e8f0",
    color: "#0f172a",
    border: "none",
    padding: "10px 14px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
  },
  likeButtonActive: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
  },
  likeCount: {
    color: "#475569",
    fontSize: "14px",
    fontWeight: "600",
  },
  commentForm: {
    display: "grid",
    gap: "10px",
  },
  commentInput: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "#fff",
    boxSizing: "border-box",
  },
  commentTextarea: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "#fff",
    boxSizing: "border-box",
    resize: "vertical",
    fontFamily: "inherit",
  },
  commentButton: {
    backgroundColor: "#0f172a",
    color: "#fff",
    border: "none",
    padding: "12px 14px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
  },
  commentList: {
    display: "grid",
    gap: "10px",
  },
  noCommentsText: {
    color: "#64748b",
    fontSize: "14px",
  },
  commentItem: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "12px",
  },
  commentAuthorRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px",
    marginBottom: "6px",
    flexWrap: "wrap",
  },
  commentAuthor: {
    fontWeight: "700",
    color: "#0f172a",
    fontSize: "14px",
  },
  commentDate: {
    color: "#64748b",
    fontSize: "12px",
  },
  commentText: {
    color: "#334155",
    fontSize: "14px",
    lineHeight: "1.5",
    whiteSpace: "pre-wrap",
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
