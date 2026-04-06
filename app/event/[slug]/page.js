"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

const LOCAL_LIKE_STORAGE_KEY = "family-photo-liked-map";

export default function EventPage() {
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  const [eventData, setEventData] = useState(null);
  const [eventNotFound, setEventNotFound] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const [photos, setPhotos] = useState([]);
  const [photoLikes, setPhotoLikes] = useState([]);
  const [photoComments, setPhotoComments] = useState([]);

  const [loadingEvent, setLoadingEvent] = useState(true);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [loadingLikes, setLoadingLikes] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  const [uploadingPhoto, setUploadingPhoto] = useState(false);

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

  const [selectedYearFilter, setSelectedYearFilter] = useState("all");
  const [selectedMonthFilter, setSelectedMonthFilter] = useState("all");

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState([]);

  const fileInputRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (!slug) return;
    fetchEventBySlug();
  }, [slug]);

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
  }, [lightboxOpen, selectedPhotoIndex, photos]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.overflowX = "hidden";
      document.body.style.overflowX = "hidden";
      document.body.style.margin = "0";
    }
  }, []);

  async function fetchEventBySlug() {
    setLoadingEvent(true);
    setEventNotFound(false);

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      console.error("Fehler beim Laden des Events:", error);
      setEventData(null);
      setEventNotFound(true);
      setLoadingEvent(false);
      return;
    }

    setEventData(data);
    fillEditForm(data);

    await Promise.all([
      fetchPhotosForEvent(data.id),
      fetchAllLikes(),
      fetchAllComments(),
    ]);

    setLoadingEvent(false);
  }

  async function fetchPhotosForEvent(eventId) {
    setLoadingPhotos(true);

    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .eq("event_id", eventId)
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

  function handleLogin() {
    if (!eventData) return;

    if (passwordInput === eventData.access_password) {
      setIsAuthenticated(true);
      setIsAdmin(false);
      return;
    }

    if (passwordInput === eventData.admin_password) {
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
    setEditingEventId(null);
    setLightboxOpen(false);
  }

  function fillEditForm(event) {
    setTitle(event.title || "");
    setLocation(event.location || "");
    setCategory(event.category || "");
    setStartDate(event.start_date ? event.start_date.slice(0, 10) : "");
    setEndDate(event.end_date ? event.end_date.slice(0, 10) : "");
    setDescription(event.description || "");
  }

  function startEditingEvent() {
    if (!eventData) return;
    setEditingEventId(eventData.id);
    fillEditForm(eventData);
  }

  function cancelEditingEvent() {
    setEditingEventId(null);
    if (eventData) fillEditForm(eventData);
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
      await fetchEventBySlug();
    }

    setUpdatingEvent(false);
  }

  async function handlePhotoUpload(e) {
    e.preventDefault();

    if (!eventData?.id) {
      alert("Kein Event gefunden.");
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
        alert(
          `Foto "${file.name}" konnte nicht hochgeladen werden: ${uploadError.message}`
        );
        uploadErrorFound = true;
        continue;
      }

      const { data: publicUrlData } = supabase.storage
        .from("photos")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      const { error: insertError } = await supabase.from("photos").insert([
        {
          event_id: eventData.id,
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

    await fetchPhotosForEvent(eventData.id);
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
      await fetchPhotosForEvent(eventData.id);
      await fetchAllLikes();
      await fetchAllComments();
      setSelectedPhotoIds((prev) => prev.filter((id) => id !== photo.id));
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
    if (eventData?.likes_enabled === false) return;

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
    if (eventData?.comments_enabled === false) return;

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

  function getLikesForPhoto(photoId) {
    return photoLikes.filter((like) => like.photo_id === photoId);
  }

  function getCommentsForPhoto(photoId) {
    return photoComments.filter((comment) => comment.photo_id === photoId);
  }

  function togglePhotoSelection(photoId) {
    setSelectedPhotoIds((prev) =>
      prev.includes(photoId)
        ? prev.filter((id) => id !== photoId)
        : [...prev, photoId]
    );
  }

  function openLightbox(index) {
    setSelectedPhotoIndex(index);
    setLightboxOpen(true);

    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }
  }

  function closeLightbox() {
    setLightboxOpen(false);

    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
  }

  function showNextPhoto() {
    if (!photos.length) return;
    setSelectedPhotoIndex((prev) => (prev + 1) % photos.length);
  }

  function showPrevPhoto() {
    if (!photos.length) return;
    setSelectedPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
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
    const years = photos
      .map((photo) => {
        if (!photo.created_at) return null;
        return new Date(photo.created_at).getFullYear();
      })
      .filter(Boolean);

    return [...new Set(years)].sort((a, b) => b - a);
  }, [photos]);

  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      const photoDate = photo.created_at ? new Date(photo.created_at) : null;
      const photoYear = photoDate ? String(photoDate.getFullYear()) : "";
      const photoMonth = photoDate ? String(photoDate.getMonth() + 1) : "";

      const matchesYear =
        selectedYearFilter === "all" || photoYear === selectedYearFilter;

      const matchesMonth =
        selectedMonthFilter === "all" || photoMonth === selectedMonthFilter;

      return matchesYear && matchesMonth;
    });
  }, [photos, selectedYearFilter, selectedMonthFilter]);

  const coverPhoto = photos.length > 0 ? photos[0] : null;
  const currentPhoto =
    filteredPhotos[selectedPhotoIndex] || photos[selectedPhotoIndex];

  if (loadingEvent) {
    return (
      <div style={styles.page}>
        <div style={styles.emptyBox}>Event wird geladen...</div>
      </div>
    );
  }

  if (eventNotFound || !eventData) {
    return (
      <div style={styles.page}>
        <div style={styles.emptyBox}>Dieses Event wurde nicht gefunden.</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={styles.page}>
        <div style={styles.loginBox}>
          <h1 style={styles.title}>{eventData.title || "Event"}</h1>
          <p style={styles.subtitle}>
            Bitte Passwort eingeben, um dieses Event zu öffnen.
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
          <h1 style={styles.title}>{eventData.title}</h1>
          <p style={styles.subtitle}>
            {eventData.description ||
              "Fotos dieses Ereignisses ansehen, liken und kommentieren."}
          </p>
          <p style={styles.accessInfo}>
            Zugang: {isAdmin ? "Admin" : "Gast"}
          </p>
        </div>

        <div style={styles.headerButtons}>
          {isAdmin && !editingEventId && (
            <button onClick={startEditingEvent} style={styles.primaryButton}>
              Ereignis bearbeiten
            </button>
          )}

          <button onClick={handleLogout} style={styles.secondaryButton}>
            Abmelden
          </button>
        </div>
      </div>

      <div
        style={{
          ...styles.heroCard,
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
        <div style={styles.heroShade} />
        <div style={styles.heroContent}>
          <span style={styles.eventChip}>
            {eventData.category || "Ereignis"}
          </span>
          <h2 style={styles.heroTitle}>{eventData.title}</h2>
          <p style={styles.heroMeta}>
            {eventData.location || "Kein Ort"} • {formatDate(eventData.start_date)}
            {eventData.end_date ? ` - ${formatDate(eventData.end_date)}` : ""}
          </p>
        </div>
      </div>

      {editingEventId && isAdmin && (
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
            {updatingEvent
              ? "Ereignis wird gespeichert..."
              : "Änderungen speichern"}
          </button>
        </form>
      )}

      <div style={styles.filterCard}>
        <h2 style={styles.formTitle}>Filter</h2>

        <div style={styles.filterGrid}>
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
          Gefundene Fotos: {filteredPhotos.length}
        </div>
      </div>

      <form onSubmit={handlePhotoUpload} style={styles.uploadCard}>
        <h3 style={styles.formTitle}>Fotos hinzufügen</h3>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
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
          {uploadingPhoto ? "Fotos werden hochgeladen..." : "Fotos hochladen"}
        </button>
      </form>

      <div style={styles.selectionBar}>
        <div style={styles.selectionInfo}>
          {selectedPhotoIds.length} Bild
          {selectedPhotoIds.length === 1 ? "" : "er"} ausgewählt
        </div>

        <button
          type="button"
          style={{
            ...styles.orderButton,
            ...(selectedPhotoIds.length === 0 ? styles.orderButtonDisabled : {}),
          }}
          onClick={() => {
            if (selectedPhotoIds.length === 0) {
              alert("Bitte zuerst Bilder auswählen.");
              return;
            }

            alert(
              `${selectedPhotoIds.length} Bild` +
                (selectedPhotoIds.length === 1 ? "" : "er") +
                " wurden zur Bestellung vorgemerkt."
            );
          }}
        >
          Ausgewählte Bilder bestellen
        </button>
      </div>

      {loadingPhotos || loadingLikes || loadingComments ? (
        <div style={styles.emptyBox}>Inhalte werden geladen...</div>
      ) : filteredPhotos.length === 0 ? (
        <div style={styles.emptyBox}>Noch keine Fotos in diesem Ereignis.</div>
      ) : (
        <div style={styles.photoGrid}>
          {filteredPhotos.map((photo, index) => {
            const likesForPhoto = getLikesForPhoto(photo.id);
            const commentsForPhoto = getCommentsForPhoto(photo.id);
            const likedByThisBrowser = isPhotoLikedByThisBrowser(photo.id);
            const isSelected = selectedPhotoIds.includes(photo.id);

            return (
              <div
                key={photo.id}
                style={styles.photoCard}
                onClick={() => openLightbox(index)}
              >
                <img
                  src={photo.public_url || photo.image_url}
                  alt={photo.caption || photo.file_name || "Foto"}
                  style={styles.photo}
                />

                <div style={styles.photoOverlay}>
                  <span style={styles.photoOverlayText}>Vergrößern</span>
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

                  <button
                    type="button"
                    onClick={() => togglePhotoSelection(photo.id)}
                    style={{
                      ...styles.selectPhotoButton,
                      ...(isSelected ? styles.selectPhotoButtonActive : {}),
                    }}
                  >
                    {isSelected ? "Ausgewählt ✓" : "Auswählen"}
                  </button>

                  {eventData.likes_enabled !== false && (
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
                  )}

                  {eventData.comments_enabled !== false && (
                    <>
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
                    </>
                  )}
                </div>
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
            <button
              type="button"
              style={styles.closeButton}
              onClick={closeLightbox}
            >
              ✕
            </button>

            {filteredPhotos.length > 1 && (
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
                {selectedPhotoIndex + 1} / {filteredPhotos.length}
              </div>
              {currentPhoto.caption && (
                <div style={styles.lightboxCaption}>
                  {currentPhoto.caption}
                </div>
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
  paddingBottom: "140px",
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
  heroCard: {
    minHeight: "240px",
    borderRadius: "24px",
    overflow: "hidden",
    position: "relative",
    marginBottom: "28px",
    background:
      "linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #334155 100%)",
  },
  heroShade: {
    position: "absolute",
    inset: 0,
    background: "rgba(15, 23, 42, 0.35)",
  },
  heroContent: {
    position: "relative",
    zIndex: 1,
    padding: "24px",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    minHeight: "240px",
  },
  heroTitle: {
    fontSize: "32px",
    fontWeight: "800",
    margin: "14px 0 8px 0",
  },
  heroMeta: {
    margin: 0,
    fontSize: "15px",
    color: "rgba(255,255,255,0.92)",
  },
  eventChip: {
    backgroundColor: "rgba(255,255,255,0.15)",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "700",
    backdropFilter: "blur(4px)",
    width: "fit-content",
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
selectionBar: {
  position: "sticky",
  bottom: "16px",
  zIndex: 50,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
  background: "rgba(255,255,255,0.96)",
  border: "1px solid #e2e8f0",
  borderRadius: "20px",
  padding: "18px 20px",
  marginBottom: "28px",
  boxShadow: "0 12px 32px rgba(15, 23, 42, 0.12)",
  backdropFilter: "blur(10px)",
},
  selectionInfo: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#0f172a",
  },
  orderButton: {
    backgroundColor: "#0f172a",
    color: "#fff",
    border: "none",
    padding: "12px 16px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
  },
  orderButtonDisabled: {
    backgroundColor: "#94a3b8",
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
  selectPhotoButton: {
    backgroundColor: "#e2e8f0",
    color: "#0f172a",
    border: "none",
    padding: "10px 14px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
  },
  selectPhotoButtonActive: {
    backgroundColor: "#dcfce7",
    color: "#166534",
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
