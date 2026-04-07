"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

const LOCAL_LIKE_STORAGE_KEY = "family-photo-liked-map";

const PRINT_OPTIONS = [
  { value: "10x15-portrait", label: "10x15 Hochformat", price: 3 },
  { value: "15x10-landscape", label: "15x10 Querformat", price: 3 },
  { value: "20x30-portrait", label: "20x30 Hochformat", price: 12 },
  { value: "30x20-landscape", label: "30x20 Querformat", price: 12 },
  { value: "30x40-portrait", label: "30x40 Hochformat", price: 19 },
  { value: "40x30-landscape", label: "40x30 Querformat", price: 19 },
];

const FRAME_OPTIONS = [
  { value: "none", label: "Kein Rahmen", price: 0 },
  { value: "black", label: "Schwarz", price: 15 },
  { value: "white", label: "Weiß", price: 15 },
  { value: "wood", label: "Holz", price: 18 },
];

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
  const [submittingCommentPhotoId, setSubmittingCommentPhotoId] =
    useState(null);

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
  const [cartOpen, setCartOpen] = useState(false);

  const [selectedPrintOption, setSelectedPrintOption] =
    useState("10x15-portrait");
  const [selectedFrameOption, setSelectedFrameOption] = useState("none");

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [street, setStreet] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Deutschland");
  const [orderNote, setOrderNote] = useState("");
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  
  const fileInputRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (!slug) return;
    fetchEventBySlug();
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    checkExistingSession();
  }, [slug]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (cartOpen && e.key === "Escape") {
        setCartOpen(false);
        return;
      }

      if (!lightboxOpen) return;

      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowRight") {
        showNextPhoto();
      } else if (e.key === "ArrowLeft") {
        showPrevPhoto();
      }
    }
useEffect(() => {
  if (isAdmin) {
    fetchOrders();
  }
}, [isAdmin]);
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, selectedPhotoIndex, cartOpen, photos]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.overflowX = "hidden";
      document.body.style.overflowX = "hidden";
      document.body.style.margin = "0";
    }
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;

    if (cartOpen || lightboxOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [cartOpen, lightboxOpen]);

  async function fetchEventBySlug() {
    setLoadingEvent(true);
    setEventNotFound(false);

    const { data, error } = await supabase
      .from("events")
      .select(`
        id,
        title,
        location,
        category,
        start_date,
        end_date,
        description,
        slug,
        likes_enabled,
        comments_enabled,
        created_at
      `)
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

  async function checkExistingSession() {
    try {
      const response = await fetch("/api/event-session");
      const result = await response.json();

      if (!response.ok || !result?.authenticated) return;
      if (result.slug !== slug) return;

      setIsAuthenticated(true);
      setIsAdmin(result.role === "admin");
    } catch (error) {
      console.error("Fehler beim Prüfen der Session:", error);
    }
  }

  async function attachSignedUrls(photoRows) {
    const mapped = await Promise.all(
      (photoRows || []).map(async (photo) => {
        if (!photo.file_path) {
          return {
            ...photo,
            signed_url: null,
          };
        }

        const { data, error } = await supabase.storage
          .from("photos")
          .createSignedUrl(photo.file_path, 60 * 60);

        if (error) {
          console.error("Fehler beim Erzeugen der Signed URL:", error);
          return {
            ...photo,
            signed_url: null,
          };
        }

        return {
          ...photo,
          signed_url: data?.signedUrl || null,
        };
      })
    );

    return mapped;
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
      setLoadingPhotos(false);
      return;
    }

    const photosWithSignedUrls = await attachSignedUrls(data || []);
    setPhotos(photosWithSignedUrls);

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
  async function fetchOrders() {
  setLoadingOrders(true);

  try {
    const res = await fetch("/api/get-orders");
    const data = await res.json();

    if (!res.ok) {
      console.error(data.error);
      return;
    }

    setOrders(data.orders || []);
  } catch (err) {
    console.error("Fehler beim Laden der Bestellungen:", err);
  }

  setLoadingOrders(false);
}

  async function handleLogin() {
    if (!eventData || !slug) return;

    try {
      const response = await fetch("/api/event-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug,
          password: passwordInput,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Login fehlgeschlagen.");
        return;
      }

      if (result.role === "admin") {
        setIsAuthenticated(true);
        setIsAdmin(true);
        return;
      }

      if (result.role === "guest") {
        setIsAuthenticated(true);
        setIsAdmin(false);
        return;
      }

      alert("Unbekannte Login-Antwort.");
    } catch (error) {
      console.error("Fehler beim Login:", error);
      alert("Login fehlgeschlagen.");
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/event-logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Fehler beim Logout:", error);
    }

    setIsAuthenticated(false);
    setIsAdmin(false);
    setPasswordInput("");
    setEditingEventId(null);
    setLightboxOpen(false);
    setCartOpen(false);
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

  try {
    const response = await fetch("/api/update-event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventId: editingEventId,
        title,
        location,
        category,
        startDate,
        endDate,
        description,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error || "Ereignis konnte nicht aktualisiert werden.");
      setUpdatingEvent(false);
      return;
    }

    alert("Ereignis aktualisiert.");
    setEditingEventId(null);
    await fetchEventBySlug();
  } catch (error) {
    console.error("Fehler beim Aktualisieren:", error);
    alert("Ereignis konnte nicht aktualisiert werden.");
  }

  setUpdatingEvent(false);
}

  function handleFileSelection(files) {
    setSelectedFiles(Array.from(files || []));
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

      const { error: insertError } = await supabase.from("photos").insert([
        {
          event_id: eventData.id,
          file_name: generatedFileName,
          file_path: filePath,
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

  try {
    const response = await fetch("/api/delete-photo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        photoId: photo.id,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error || "Foto konnte nicht gelöscht werden.");
      return;
    }

    await fetchPhotosForEvent(eventData.id);
    await fetchAllLikes();
    await fetchAllComments();
    setSelectedPhotoIds((prev) => prev.filter((id) => id !== photo.id));
    alert("Foto gelöscht.");
  } catch (error) {
    console.error("Fehler beim Löschen:", error);
    alert("Foto konnte nicht gelöscht werden.");
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

async function handleSubmitOrder() {
  if (!eventData?.id) {
    alert("Event nicht gefunden.");
    return;
  }

  if (selectedPhotos.length === 0) {
    alert("Bitte zuerst Bilder auswählen.");
    return;
  }

  if (!customerName.trim()) {
    alert("Bitte deinen Namen eingeben.");
    return;
  }

  if (!customerEmail.trim()) {
    alert("Bitte deine E-Mail eingeben.");
    return;
  }

  if (!street.trim() || !postalCode.trim() || !city.trim()) {
    alert("Bitte die vollständige Adresse eingeben.");
    return;
  }

  setSubmittingOrder(true);

  try {
    const orderItems = selectedPhotos.map((photo) => ({
      photoId: photo.id,
      photoUrl: photo.signed_url || null,
      title: photo.caption || photo.file_name || "Foto",
      quantity: 1,
      printSize: selectedPrintOption,
      frame: selectedFrameOption,
      unitPrice: Math.round(pricePerPhoto * 100),
    }));

    const orderResponse = await fetch("/api/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventId: eventData.id,
        customerName,
        customerEmail,
        customerPhone,
        street,
        postalCode,
        city,
        country,
        orderNote,
        items: orderItems,
        totalPrice: Math.round(totalPrice * 100),
      }),
    });

    const orderResult = await orderResponse.json();

    if (!orderResponse.ok) {
      alert(orderResult.error || "Bestellung konnte nicht gespeichert werden.");
      setSubmittingOrder(false);
      return;
    }

    const orderId = orderResult?.order?.id;

    if (!orderId) {
      alert("Bestellung wurde gespeichert, aber keine Bestell-ID gefunden.");
      setSubmittingOrder(false);
      return;
    }

    const checkoutResponse = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId,
      }),
    });

    const checkoutResult = await checkoutResponse.json();

    if (!checkoutResponse.ok) {
      alert(checkoutResult.error || "Stripe Checkout konnte nicht gestartet werden.");
      setSubmittingOrder(false);
      return;
    }

    if (!checkoutResult.url) {
      alert("Keine Stripe-URL erhalten.");
      setSubmittingOrder(false);
      return;
    }

    window.location.href = checkoutResult.url;
  } catch (error) {
    console.error("Unbekannter Fehler bei der Bestellung:", error);
    alert("Es gab ein Problem beim Starten der Zahlung.");
    setSubmittingOrder(false);
  }
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
  }

  function closeLightbox() {
    setLightboxOpen(false);
  }

  function showNextPhoto() {
    if (!filteredPhotos.length) return;
    setSelectedPhotoIndex((prev) => (prev + 1) % filteredPhotos.length);
  }

  function showPrevPhoto() {
    if (!filteredPhotos.length) return;
    setSelectedPhotoIndex(
      (prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length
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

  const selectedPhotos = filteredPhotos.filter((photo) =>
    selectedPhotoIds.includes(photo.id)
  );

  const selectedPrint = PRINT_OPTIONS.find(
    (option) => option.value === selectedPrintOption
  );
  const selectedFrame = FRAME_OPTIONS.find(
    (option) => option.value === selectedFrameOption
  );

  const pricePerPhoto =
    (selectedPrint?.price || 0) + (selectedFrame?.price || 0);
  const totalPrice = pricePerPhoto * selectedPhotos.length;

  const coverPhoto = photos.length > 0 ? photos[0] : null;
  const currentPhoto = filteredPhotos[selectedPhotoIndex];

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
          ...(coverPhoto?.signed_url
            ? {
                backgroundImage: `url(${coverPhoto.signed_url})`,
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
            {eventData.location || "Kein Ort"} •{" "}
            {formatDate(eventData.start_date)}
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
        <div style={styles.uploadTopRow}>
          <div>
            <h3 style={styles.formTitle}>Fotos hinzufügen</h3>
            <p style={styles.uploadSubtitle}>
              Mehrere Bilder auswählen und gesammelt hochladen.
            </p>
          </div>

          <div style={styles.uploadBadge}>
            {selectedFiles.length} Datei{selectedFiles.length === 1 ? "" : "en"}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFileSelection(e.target.files)}
          style={{ display: "none" }}
        />

        <div
          style={styles.uploadPickerBox}
          onClick={() => fileInputRef.current?.click()}
        >
          <div style={styles.uploadIcon}>↑</div>
          <div style={styles.uploadPickerTitle}>Bilder auswählen</div>
          <div style={styles.uploadPickerText}>
            Tippe hier, um Fotos vom Handy oder Computer auszuwählen.
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            style={styles.uploadPickerButton}
          >
            Dateien öffnen
          </button>
        </div>

        {selectedFiles.length > 0 && (
          <div style={styles.selectedFilesWrap}>
            {selectedFiles.map((file, index) => (
              <div key={`${file.name}-${index}`} style={styles.fileChip}>
                <span style={styles.fileChipName}>{file.name}</span>
                <span style={styles.fileChipSize}>
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </span>
              </div>
            ))}
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
          style={{
            ...styles.primaryButton,
            ...(uploadingPhoto ? styles.buttonDisabled : {}),
          }}
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
            setCartOpen(true);
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
            const mediaHeight = "280px";

            return (
              <div
                key={photo.id}
                style={styles.photoCard}
                onClick={() => openLightbox(index)}
              >
                <div style={{ ...styles.photoMediaWrap, height: mediaHeight }}>
                  <img
                    src={photo.signed_url || ""}
                    alt={photo.caption || photo.file_name || "Foto"}
                    style={styles.photo}
                  />

                  <div style={styles.photoOverlay}>
                    <span style={styles.photoOverlayText}>Vergrößern</span>
                  </div>


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
              src={currentPhoto?.signed_url || ""}
              alt={currentPhoto.caption || currentPhoto.file_name || "Foto"}
              style={styles.lightboxImage}
            />

            <div style={styles.lightboxFooter}>
              <div style={styles.lightboxCounter}>
                {selectedPhotoIndex + 1} / {filteredPhotos.length}
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
    gap: "16px",
    background: "#ffffff",
    padding: "22px",
    borderRadius: "24px",
    marginBottom: "28px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
  },
  uploadTopRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  uploadSubtitle: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
    lineHeight: "1.5",
  },
  uploadBadge: {
    background: "#e2e8f0",
    color: "#0f172a",
    borderRadius: "999px",
    padding: "10px 14px",
    fontSize: "13px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },
  uploadPickerBox: {
    border: "1.5px dashed #94a3b8",
    borderRadius: "22px",
    padding: "28px 20px",
    background:
      "linear-gradient(180deg, rgba(15,23,42,0.03) 0%, rgba(15,23,42,0.01) 100%)",
    display: "grid",
    justifyItems: "center",
    textAlign: "center",
    gap: "10px",
    cursor: "pointer",
  },
  uploadIcon: {
    width: "56px",
    height: "56px",
    borderRadius: "18px",
    background: "#0f172a",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "26px",
    fontWeight: "800",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.18)",
  },
  uploadPickerTitle: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#0f172a",
  },
  uploadPickerText: {
    color: "#64748b",
    fontSize: "14px",
    lineHeight: "1.5",
    maxWidth: "460px",
  },
  uploadPickerButton: {
    backgroundColor: "#1e293b",
    color: "#fff",
    border: "none",
    padding: "14px 18px",
    borderRadius: "14px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "700",
    minWidth: "180px",
    boxShadow: "0 8px 20px rgba(15, 23, 42, 0.14)",
    marginTop: "6px",
  },
  selectedFilesWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  fileChip: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 12px",
    borderRadius: "14px",
    background: "#f1f5f9",
    border: "1px solid #e2e8f0",
    maxWidth: "100%",
  },
  fileChipName: {
    color: "#0f172a",
    fontSize: "13px",
    fontWeight: "700",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "220px",
  },
  fileChipSize: {
    color: "#64748b",
    fontSize: "12px",
    fontWeight: "600",
    whiteSpace: "nowrap",
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
  buttonDisabled: {
    opacity: 0.72,
    cursor: "not-allowed",
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
    zIndex: 3,
  },
  selectionBar: {
    position: "fixed",
    left: "50%",
    bottom: "16px",
    transform: "translateX(-50%)",
    zIndex: 999,
    width: "calc(100% - 32px)",
    maxWidth: "1232px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    background: "rgba(255,255,255,0.96)",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    padding: "18px 20px",
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
    minWidth: "220px",
  },
  orderButtonDisabled: {
    backgroundColor: "#94a3b8",
  },
  photoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "18px",
    alignItems: "start",
  },
  photoCard: {
    position: "relative",
    borderRadius: "22px",
    overflow: "hidden",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.10)",
    background: "#fff",
    cursor: "pointer",
    border: "1px solid #e2e8f0",
  },
  photoMediaWrap: {
    position: "relative",
    width: "100%",
    background: "#e2e8f0",
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  photoOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(15,23,42,0.26), rgba(15,23,42,0.05))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  },
  photoOverlayText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: "15px",
    padding: "8px 12px",
    borderRadius: "999px",
    background: "rgba(15,23,42,0.45)",
    backdropFilter: "blur(4px)",
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
  photoActionRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
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
    backgroundColor: "#0f172a",
    color: "#ffffff",
  },
  previewButton: {
    backgroundColor: "#f8fafc",
    color: "#0f172a",
    border: "1px solid #cbd5e1",
    padding: "10px 14px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
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
  cartBackdrop: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    zIndex: 1200,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    padding: "16px",
    overflowX: "hidden",
    overflowY: "auto",
    overscrollBehavior: "contain",
  },
  cartPanel: {
    width: "100%",
    maxWidth: "900px",
    maxHeight: "85vh",
    overflowY: "auto",
    overflowX: "hidden",
    background: "#ffffff",
    borderRadius: "24px",
    padding: "20px",
    boxShadow: "0 20px 60px rgba(15, 23, 42, 0.25)",
    boxSizing: "border-box",
    overscrollBehavior: "contain",
    touchAction: "pan-y",
  },
  cartHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
  },
  cartTitle: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "800",
    color: "#0f172a",
  },
  cartCloseButton: {
    width: "40px",
    height: "40px",
    borderRadius: "999px",
    border: "none",
    background: "#e2e8f0",
    color: "#0f172a",
    fontSize: "18px",
    cursor: "pointer",
    fontWeight: "700",
  },
  cartInfo: {
    marginBottom: "16px",
    fontSize: "15px",
    fontWeight: "700",
    color: "#334155",
  },
  orderOptionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "14px",
    marginBottom: "18px",
    width: "100%",
  },
  orderOptionCard: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "14px",
  },
  orderLabel: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "700",
    color: "#0f172a",
  },
  orderSelect: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    backgroundColor: "#fff",
    boxSizing: "border-box",
  },
  priceSummaryCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "16px",
    marginBottom: "18px",
    boxShadow: "0 6px 20px rgba(15, 23, 42, 0.04)",
  },
  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    padding: "6px 0",
    color: "#334155",
    fontSize: "14px",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    paddingTop: "12px",
    marginTop: "8px",
    borderTop: "1px solid #e2e8f0",
    color: "#0f172a",
    fontSize: "18px",
    fontWeight: "800",
  },
  cartGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
    gap: "16px",
    width: "100%",
    overflowX: "hidden",
    marginBottom: "18px",
  },
  cartPhotoCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
  },
  cartPhoto: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    display: "block",
    backgroundColor: "#e2e8f0",
  },
  cartPhotoInfo: {
    display: "grid",
    gap: "10px",
    padding: "12px",
  },
  cartPhotoName: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#0f172a",
    lineHeight: "1.4",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
  },
  removeFromCartButton: {
    width: "100%",
    border: "none",
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "10px 12px",
    fontWeight: "700",
    cursor: "pointer",
    borderRadius: "12px",
    fontSize: "13px",
  },
  orderFormCard: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "18px",
    marginTop: "18px",
    marginBottom: "18px",
    display: "grid",
    gap: "14px",
  },
  orderFormTitle: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "800",
    color: "#0f172a",
  },
  orderFormText: {
    margin: 0,
    fontSize: "14px",
    lineHeight: "1.7",
    color: "#475569",
  },
  orderFormGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
  },
  orderInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    backgroundColor: "#fff",
    outline: "none",
  },
  orderTextarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    backgroundColor: "#fff",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
  },
  cartFooter: {
    position: "sticky",
    bottom: 0,
    marginTop: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "14px",
    flexWrap: "wrap",
    background: "rgba(255,255,255,0.96)",
    borderTop: "1px solid #e2e8f0",
    paddingTop: "16px",
    paddingBottom: "4px",
    backdropFilter: "blur(10px)",
  },
  cartFooterSummary: {
    display: "grid",
    gap: "4px",
  },
  cartFooterSmall: {
    fontSize: "13px",
    color: "#64748b",
    fontWeight: "600",
  },
  cartFooterTotal: {
    fontSize: "26px",
    fontWeight: "800",
    color: "#0f172a",
  },
  checkoutButton: {
    backgroundColor: "#0f172a",
    color: "#fff",
    border: "none",
    padding: "14px 20px",
    borderRadius: "14px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "700",
    minWidth: "220px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.18)",
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
