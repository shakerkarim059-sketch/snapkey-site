"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import {
  SIZE_OPTIONS,
  FRAME_OPTIONS,
  getProductPrice,
  formatEuroFromCent,
} from "../../../lib/pricing";

const LOCAL_LIKE_STORAGE_KEY = "family-photo-liked-map";

const EVENT_BASE_PRICE = 29;

const KEY_TYPES = {
  basic: {
    name: "Karte / NFC Key",
    description: "Günstiger Einstieg für viele Gäste",
    price: 2.5,
  },
  standard: {
    name: "Snapkey Anhänger",
    description: "Beliebte Wahl für Events und Hochzeiten",
    price: 4,
  },
  premium: {
    name: "Premium Holz-Snapkey",
    description: "Hochwertiges Erinnerungsstück",
    price: 6,
  },
};

const PACKAGE_OPTIONS = [10, 25, 50, 100];

export default function EventPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const isSetupMode = searchParams.get("setup") === "true";
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  const [eventData, setEventData] = useState(null);
  const [eventNotFound, setEventNotFound] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

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

  const [selectedKeyType, setSelectedKeyType] = useState("standard");
  const [selectedQuantity, setSelectedQuantity] = useState(25);
  const [customQuantity, setCustomQuantity] = useState("");

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

  const [photoOrderOptions, setPhotoOrderOptions] = useState({});

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [street, setStreet] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Deutschland");
  const [orderNote, setOrderNote] = useState("");
  const [submittingOrder, setSubmittingOrder] = useState(false);

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

      if (!result.globalAdmin && result.slug !== slug) return;

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

  async function handleLogin() {
    if (!eventData || !slug) return;
    setLoginError("");

    try {
      const response = await fetch("/api/event-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, password: passwordInput }),
      });

      const result = await response.json();

      if (!response.ok) {
        setLoginError(
          result.error || "Falsches Passwort. Bitte erneut versuchen."
        );
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

      setLoginError("Unbekannte Login-Antwort.");
    } catch (error) {
      console.error("Fehler beim Login:", error);
      setLoginError("Login fehlgeschlagen. Bitte später erneut versuchen.");
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
    const newFiles = Array.from(files || []);

    setSelectedFiles((prev) => {
      const merged = [...prev, ...newFiles];

      const uniqueFiles = merged.filter(
        (file, index, self) =>
          index ===
          self.findIndex(
            (f) =>
              f.name === file.name &&
              f.size === file.size &&
              f.lastModified === file.lastModified
          )
      );

      return uniqueFiles;
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function removeSelectedFile(indexToRemove) {
    setSelectedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
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

    const currentScrollY = typeof window !== "undefined" ? window.scrollY : 0;

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
          return;
        }

        delete likeMap[photoId];
        setStoredLikeMap(likeMap);

        setPhotoLikes((prev) =>
          prev.filter((like) => like.id !== existingLikeId)
        );
      } else {
        const { data, error } = await supabase
          .from("photo_likes")
          .insert([{ photo_id: photoId }])
          .select()
          .single();

        if (error) {
          console.error("Fehler beim Liken:", error);
          alert("Like konnte nicht gespeichert werden: " + error.message);
          return;
        }

        likeMap[photoId] = data.id;
        setStoredLikeMap(likeMap);

        setPhotoLikes((prev) => [...prev, data]);
      }
    } finally {
      setLikingPhotoId(null);

      if (typeof window !== "undefined") {
        window.requestAnimationFrame(() => {
          window.scrollTo({ top: currentScrollY, behavior: "auto" });
        });
      }
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

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

    if (!isValidEmail(customerEmail)) {
      alert("Bitte eine gültige E-Mail-Adresse eingeben.");
      return;
    }

    if (!street.trim() || !postalCode.trim() || !city.trim()) {
      alert("Bitte die vollständige Adresse eingeben.");
      return;
    }

    setSubmittingOrder(true);

    try {
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
          items: selectedPhotos.map((photo) => {
            const options = photoOrderOptions[photo.id] || {
              printOption: "13x18",
              frameOption: "none",
            };

            return {
              photoId: photo.id,
              printOption: options.printOption,
              frameOption: options.frameOption,
            };
          }),
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
        alert(
          checkoutResult.error || "Stripe Checkout konnte nicht gestartet werden."
        );
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
    setSelectedPhotoIds((prev) => {
      const isSelected = prev.includes(photoId);

      if (isSelected) {
        setPhotoOrderOptions((current) => {
          const updated = { ...current };
          delete updated[photoId];
          return updated;
        });

        return prev.filter((id) => id !== photoId);
      }

      setPhotoOrderOptions((current) => ({
        ...current,
        [photoId]: {
          printOption: "13x18",
          frameOption: "none",
        },
      }));

      return [...prev, photoId];
    });
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

  const finalQuantity = customQuantity
    ? Number(customQuantity)
    : selectedQuantity;

  const selectedKey = KEY_TYPES[selectedKeyType];

  const setupTotalPrice = EVENT_BASE_PRICE + finalQuantity * selectedKey.price;

  const selectedPhotos = filteredPhotos.filter((photo) =>
    selectedPhotoIds.includes(photo.id)
  );

  const totalPriceInCent = selectedPhotos.reduce((sum, photo) => {
    const options = photoOrderOptions[photo.id] || {
      printOption: "13x18",
      frameOption: "none",
    };

    return (
      sum + (getProductPrice(options.printOption, options.frameOption) || 0)
    );
  }, 0);

  const totalPrice = totalPriceInCent / 100;

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
            onChange={(e) => {
              setPasswordInput(e.target.value);
              setLoginError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin();
            }}
            style={{
              ...styles.input,
              ...(loginError
                ? { borderColor: "#dc2626", backgroundColor: "#fef2f2" }
                : {}),
            }}
          />

          {loginError && (
            <p
              style={{
                color: "#dc2626",
                fontSize: "14px",
                margin: "4px 0 0 0",
                fontWeight: "600",
              }}
            >
              {loginError}
            </p>
          )}

          <button onClick={handleLogin} style={styles.primaryButton}>
            Einloggen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.newHeroCard}>
        <div style={styles.newHeroTop}>
          <div style={styles.newHeroBrand}>NFC Familien-Key</div>
          <div style={styles.newHeroBadge}>
            {isAdmin ? "Event geöffnet" : "Gastansicht"}
          </div>
        </div>

        <h1 style={styles.newHeroTitle}>{eventData.title}</h1>
        <p style={styles.newHeroSubtitle}>
          {eventData.location || "Kein Ort"} • {formatDate(eventData.start_date)}
        </p>

        <div style={styles.newHeroImage}>
          <img
            src={coverPhoto?.signed_url || ""}
            alt="Event Cover"
            style={styles.newHeroImageTag}
          />
        </div>

        <p style={styles.newHeroDescription}>
          {eventData.description ||
            "Fotos hochladen, ansehen und gemeinsam an einem Ort sammeln."}
        </p>

        {filteredPhotos.length > 0 && (
          <div style={styles.newHeroPreviewRow}>
            {filteredPhotos.map((p, i) => (
              <img
                key={p.id}
                src={p.signed_url}
                alt={p.caption || `Vorschaubild ${i + 1}`}
                style={styles.newHeroPreviewImg}
                onClick={() => {
                  const el = document.getElementById(`photo-${i}`);
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>

      {isSetupMode && (
        <div style={styles.setupCard}>
          <h2 style={styles.setupTitle}>Dein Event aktivieren</h2>

          <div style={styles.setupSection}>
            <div style={styles.setupLabel}>Snapkey auswählen</div>

            <div style={styles.keyGrid}>
              {Object.entries(KEY_TYPES).map(([key, item]) => (
                <div
                  key={key}
                  onClick={() => setSelectedKeyType(key)}
                  style={{
                    ...styles.keyCard,
                    ...(selectedKeyType === key ? styles.keyCardActive : {}),
                  }}
                >
                  <div style={styles.keyName}>{item.name}</div>
                  <div style={styles.keyDesc}>{item.description}</div>
                  <div style={styles.keyPrice}>
                    {item.price.toFixed(2)}€ / Stück
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.setupSection}>
            <div style={styles.setupLabel}>Menge wählen</div>

            <div style={styles.quantityRow}>
              {PACKAGE_OPTIONS.map((qty) => (
                <button
                  key={qty}
                  type="button"
                  onClick={() => {
                    setSelectedQuantity(qty);
                    setCustomQuantity("");
                  }}
                  style={{
                    ...styles.qtyButton,
                    ...(selectedQuantity === qty && !customQuantity
                      ? styles.qtyButtonActive
                      : {}),
                  }}
                >
                  {qty}
                </button>
              ))}
            </div>

            <input
              type="number"
              placeholder="Eigene Menge"
              value={customQuantity}
              onChange={(e) => setCustomQuantity(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.priceBox}>
            <div>Eventseite: {EVENT_BASE_PRICE.toFixed(2)}€</div>
            <div>
              {finalQuantity} × {selectedKey.price.toFixed(2)}€
            </div>
            <div style={styles.setupTotalPrice}>
              Gesamt: {setupTotalPrice.toFixed(2)}€
            </div>
          </div>

          <button
  type="button"
  style={styles.primaryButton}
  onClick={async () => {
    try {
      if (!eventData?.id) {
        alert("Event nicht gefunden.");
        return;
      }

      const parsedQuantity = customQuantity
        ? Number(customQuantity)
        : selectedQuantity;

      if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
        alert("Bitte eine gültige Menge wählen.");
        return;
      }

      const customerName = window.prompt("Vor- und Nachname");
      if (!customerName?.trim()) {
        alert("Bitte deinen Namen eingeben.");
        return;
      }

      const customerEmail = window.prompt("E-Mail-Adresse");
      if (!customerEmail?.trim()) {
        alert("Bitte deine E-Mail eingeben.");
        return;
      }

      const street = window.prompt("Straße und Hausnummer");
      if (!street?.trim()) {
        alert("Bitte Straße und Hausnummer eingeben.");
        return;
      }

      const postalCode = window.prompt("PLZ");
      if (!postalCode?.trim()) {
        alert("Bitte die PLZ eingeben.");
        return;
      }

      const city = window.prompt("Ort");
      if (!city?.trim()) {
        alert("Bitte den Ort eingeben.");
        return;
      }

      const createOrderResponse = await fetch("/api/create-snapkey-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: eventData.id,
          keyType: selectedKeyType,
          quantity: parsedQuantity,
          designVariant: eventData.category || null,
          customerName,
          customerEmail,
          customerPhone: "",
          street,
          postalCode,
          city,
          country: "Deutschland",
          orderNote: "",
        }),
      });

      const createOrderResult = await createOrderResponse.json();

      if (!createOrderResponse.ok) {
        alert(
          createOrderResult.error ||
            "Snapkey-Bestellung konnte nicht gespeichert werden."
        );
        return;
      }

      const orderId = createOrderResult?.order?.id;

      if (!orderId) {
        alert("Keine Bestell-ID erhalten.");
        return;
      }

      const checkoutResponse = await fetch(
        "/api/create-snapkey-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId }),
        }
      );

      const checkoutResult = await checkoutResponse.json();

      if (!checkoutResponse.ok) {
        alert(
          checkoutResult.error ||
            "Stripe Checkout konnte nicht gestartet werden."
        );
        return;
      }

      if (!checkoutResult.url) {
        alert("Keine Checkout-URL erhalten.");
        return;
      }

      window.location.href = checkoutResult.url;
    } catch (error) {
      console.error("Fehler beim Starten der Snapkey-Bestellung:", error);
      alert("Es gab ein Problem beim Starten der Zahlung.");
    }
  }}
>
  Event aktivieren & Snapkeys bestellen
</button>
        </div>
      )}

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

          <div style={{ display: "grid", gap: "4px" }}>
            <label style={styles.label}>Kategorie</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={styles.input}
            >
              <option value="">Bitte auswählen</option>
              <option value="Hochzeit">Hochzeit</option>
              <option value="Geburtstag">Geburtstag</option>
              <option value="Familienalbum">Familienalbum</option>
              <option value="Urlaub">Urlaub</option>
              <option value="Baby / Taufe">Baby / Taufe</option>
              <option value="Jubiläum">Jubiläum</option>
              <option value="Rückblick">Rückblick</option>
              <option value="Sonstiges">Sonstiges</option>
            </select>
          </div>

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

      {["familienalbum", "album", "rückblick"].includes(
        (eventData.category || "").toLowerCase()
      ) && (
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
      )}

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
              <div
                key={`${file.name}-${file.lastModified}-${index}`}
                style={styles.fileChip}
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  style={styles.fileChipPreview}
                />

                <div style={styles.fileChipInfo}>
                  <span style={styles.fileChipName}>{file.name}</span>
                  <span style={styles.fileChipSize}>
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => removeSelectedFile(index)}
                  style={styles.fileChipRemove}
                >
                  ✕
                </button>
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
                id={`photo-${index}`}
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
                </div>

                <div
                  style={styles.photoInfoArea}
                  onClick={(e) => e.stopPropagation()}
                >
                  {photo.caption && (
                    <div style={styles.photoCaption}>{photo.caption}</div>
                  )}

                  <div style={styles.photoActionRow}>
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

                    <button
                      type="button"
                      onClick={() => openLightbox(index)}
                      style={styles.previewButton}
                    >
                      Ansehen
                    </button>
                  </div>

                  {eventData.likes_enabled !== false && (
                    <div style={styles.likeRow}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleLike(photo.id);
                        }}
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

      {cartOpen && (
        <div style={styles.cartBackdrop} onClick={() => setCartOpen(false)}>
          <div style={styles.cartPanel} onClick={(e) => e.stopPropagation()}>
            <div style={styles.cartHandleWrap}>
              <div style={styles.cartHandle} />
            </div>

            <div style={styles.cartHeader}>
              <h3 style={styles.cartTitle}>Ausgewählte Bilder</h3>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                style={styles.cartCloseButton}
              >
                ✕
              </button>
            </div>

            {selectedPhotos.length === 0 ? (
              <div style={styles.emptyBox}>Keine Bilder ausgewählt.</div>
            ) : (
              <>
                <div style={styles.cartInfo}>
                  {selectedPhotos.length} Bild
                  {selectedPhotos.length === 1 ? "" : "er"} im Warenkorb
                </div>

                <div style={styles.cartGrid}>
                  {selectedPhotos.map((photo) => {
                    const options = photoOrderOptions[photo.id] || {
                      printOption: "13x18",
                      frameOption: "none",
                    };

                    const itemPriceInCent =
                      getProductPrice(
                        options.printOption,
                        options.frameOption
                      ) || 0;

                    return (
                      <div key={photo.id} style={styles.cartPhotoCard}>
                        <img
                          src={photo.signed_url || ""}
                          alt={photo.caption || photo.file_name || "Foto"}
                          style={styles.cartPhoto}
                        />

                        <div style={styles.cartPhotoInfo}>
                          <div style={styles.cartPhotoName}>
                            {photo.caption ||
                              photo.file_name ||
                              "Ausgewähltes Foto"}
                          </div>

                          <div style={styles.cartItemOptions}>
                            <div style={styles.cartItemOptionBlock}>
                              <label style={styles.orderLabel}>Format</label>
                              <select
                                value={options.printOption}
                                onChange={(e) =>
                                  setPhotoOrderOptions((prev) => ({
                                    ...prev,
                                    [photo.id]: {
                                      ...(prev[photo.id] || {}),
                                      printOption: e.target.value,
                                    },
                                  }))
                                }
                                style={styles.orderSelect}
                              >
                                {SIZE_OPTIONS.map((option) => {
                                  const price =
                                    getProductPrice(
                                      option.value,
                                      options.frameOption
                                    ) || 0;

                                  return (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label} •{" "}
                                      {formatEuroFromCent(price)} €
                                    </option>
                                  );
                                })}
                              </select>
                            </div>

                            <div style={styles.cartItemOptionBlock}>
                              <label style={styles.orderLabel}>Rahmen</label>
                              <select
                                value={options.frameOption}
                                onChange={(e) =>
                                  setPhotoOrderOptions((prev) => ({
                                    ...prev,
                                    [photo.id]: {
                                      ...(prev[photo.id] || {}),
                                      frameOption: e.target.value,
                                    },
                                  }))
                                }
                                style={styles.orderSelect}
                              >
                                {Object.entries(FRAME_OPTIONS).map(
                                  ([value, option]) => (
                                    <option key={value} value={value}>
                                      {option.label} •{" "}
                                      {formatEuroFromCent(option.price)} €
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                          </div>

                          <div style={styles.cartItemPrice}>
                            Preis für dieses Bild:{" "}
                            {(itemPriceInCent / 100).toFixed(2)} €
                          </div>

                          <button
                            type="button"
                            onClick={() => togglePhotoSelection(photo.id)}
                            style={styles.removeFromCartButton}
                          >
                            Entfernen
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={styles.priceSummaryCard}>
                  <div style={styles.priceRow}>
                    <span>Anzahl Bilder</span>
                    <span>{selectedPhotos.length}</span>
                  </div>
                  <div style={styles.totalRow}>
                    <span>Gesamt</span>
                    <span>{totalPrice.toFixed(2)} €</span>
                  </div>
                </div>

                <div style={styles.orderFormCard}>
                  <h4 style={styles.orderFormTitle}>Erinnerungen bestellen</h4>
                  <p style={styles.orderFormText}>
                    Gib hier deine Kontaktdaten und Lieferadresse ein. Deine
                    ausgewählten Bilder aus diesem Event werden mit ihren
                    individuellen Format- und Rahmenoptionen gespeichert.
                  </p>

                  <div style={styles.orderFormGrid}>
                    <input
                      type="text"
                      placeholder="Vor- und Nachname"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      style={styles.orderInput}
                    />

                    <input
                      type="email"
                      placeholder="E-Mail"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      style={styles.orderInput}
                    />

                    <input
                      type="text"
                      placeholder="Telefon (optional)"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      style={styles.orderInput}
                    />

                    <input
                      type="text"
                      placeholder="Straße und Hausnummer"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      style={styles.orderInput}
                    />

                    <input
                      type="text"
                      placeholder="PLZ"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      style={styles.orderInput}
                    />

                    <input
                      type="text"
                      placeholder="Ort"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      style={styles.orderInput}
                    />

                    <input
                      type="text"
                      placeholder="Land"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      style={styles.orderInput}
                    />
                  </div>

                  <textarea
                    placeholder="Notiz zur Bestellung (optional)"
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    rows={4}
                    style={styles.orderTextarea}
                  />
                </div>

                <div style={styles.cartFooter}>
                  <div style={styles.cartFooterSummary}>
                    <div style={styles.cartFooterSmall}>
                      {selectedPhotos.length} Bild
                      {selectedPhotos.length === 1 ? "" : "er"} individuell
                      konfiguriert
                    </div>
                    <div style={styles.cartFooterTotal}>
                      {totalPrice.toFixed(2)} €
                    </div>
                  </div>

                  <button
                    type="button"
                    style={{
                      ...styles.checkoutButton,
                      ...(submittingOrder ? styles.buttonDisabled : {}),
                    }}
                    onClick={handleSubmitOrder}
                    disabled={submittingOrder}
                  >
                    {submittingOrder
                      ? "Bestellung wird gespeichert..."
                      : "Erinnerungen bestellen"}
                  </button>
                </div>
              </>
            )}
          </div>
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
  setupCard: {
  background: "#fff",
  borderRadius: "24px",
  padding: "20px",
  marginBottom: "24px",
  border: "1px solid #e8ebf2",
  display: "grid",
  gap: "16px",
},

setupTitle: {
  margin: 0,
  fontSize: "22px",
  fontWeight: "800",
  color: "#111827",
},

setupSection: {
  display: "grid",
  gap: "10px",
},

setupLabel: {
  fontWeight: "700",
  color: "#111827",
  fontSize: "15px",
},

keyGrid: {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "10px",
},

keyCard: {
  border: "1px solid #d7deea",
  borderRadius: "14px",
  padding: "12px",
  cursor: "pointer",
  background: "#fff",
  display: "grid",
  gap: "6px",
},

keyCardActive: {
  border: "2px solid #111827",
  boxShadow: "0 8px 18px rgba(17, 24, 39, 0.08)",
},

keyName: {
  fontWeight: "700",
  color: "#111827",
  fontSize: "15px",
},

keyDesc: {
  fontSize: "13px",
  color: "#667085",
  lineHeight: "1.5",
},

keyPrice: {
  marginTop: "4px",
  fontWeight: "700",
  color: "#111827",
  fontSize: "14px",
},

quantityRow: {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
},

qtyButton: {
  padding: "10px 14px",
  borderRadius: "10px",
  border: "1px solid #d7deea",
  cursor: "pointer",
  background: "#fff",
  color: "#111827",
  fontWeight: "700",
},

qtyButtonActive: {
  background: "#111827",
  color: "#fff",
  border: "1px solid #111827",
},

priceBox: {
  background: "#f8fafc",
  padding: "14px",
  borderRadius: "14px",
  display: "grid",
  gap: "6px",
  border: "1px solid #e8ebf2",
},
  setupTotalPrice: {
  fontWeight: "800",
  fontSize: "18px",
  color: "#111827",
},
  page: {
    position: "relative",
    width: "100%",
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "14px",
    paddingBottom: "120px",
    backgroundColor: "#f6f7fb",
    minHeight: "100vh",
    boxSizing: "border-box",
    overflowX: "hidden",
    touchAction: "pan-y",
  },

  loginBox: {
    maxWidth: "420px",
    margin: "120px auto",
    display: "grid",
    gap: "14px",
    background: "#ffffff",
    padding: "24px",
    borderRadius: "24px",
    border: "1px solid #e8ebf2",
    boxShadow: "0 12px 32px rgba(15, 23, 42, 0.06)",
  },

  title: {
    fontSize: "32px",
    fontWeight: "800",
    margin: 0,
    color: "#111827",
    lineHeight: "1.15",
  },

  subtitle: {
    marginTop: "8px",
    marginBottom: 0,
    color: "#667085",
    fontSize: "15px",
    lineHeight: "1.5",
  },

  accessInfo: {
    marginTop: "10px",
    marginBottom: 0,
    color: "#111827",
    fontSize: "14px",
    fontWeight: "700",
  },

  formTitle: {
    margin: 0,
    marginBottom: "4px",
    fontSize: "19px",
    fontWeight: "800",
    color: "#111827",
    lineHeight: "1.2",
  },

  label: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#111827",
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
    padding: "18px",
    borderRadius: "22px",
    marginBottom: "24px",
    border: "1px solid #e8ebf2",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
    width: "100%",
    boxSizing: "border-box",
  },

  filterCard: {
    display: "grid",
    gap: "14px",
    background: "#ffffff",
    padding: "18px",
    borderRadius: "22px",
    marginBottom: "24px",
    border: "1px solid #e8ebf2",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
  },

  filterGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(0, 1fr))",
    gap: "12px",
    width: "100%",
  },

  filterInfo: {
    color: "#667085",
    fontSize: "14px",
    fontWeight: "600",
  },

  uploadCard: {
    display: "grid",
    gap: "16px",
    background: "#ffffff",
    padding: "18px",
    borderRadius: "24px",
    marginBottom: "24px",
    border: "1px solid #e8ebf2",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
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
    color: "#667085",
    fontSize: "14px",
    lineHeight: "1.5",
  },

  uploadBadge: {
    background: "#eef2f7",
    color: "#111827",
    borderRadius: "999px",
    padding: "10px 14px",
    fontSize: "13px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  uploadPickerBox: {
    border: "1.5px dashed #cdd5df",
    borderRadius: "22px",
    padding: "24px 18px",
    background: "#fafbfc",
    display: "grid",
    justifyItems: "center",
    textAlign: "center",
    gap: "10px",
    cursor: "pointer",
  },

  uploadIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "16px",
    background: "#111827",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "800",
    boxShadow: "0 10px 20px rgba(17, 24, 39, 0.16)",
  },

  uploadPickerTitle: {
    fontSize: "19px",
    fontWeight: "800",
    color: "#111827",
  },

  uploadPickerText: {
    color: "#667085",
    fontSize: "14px",
    lineHeight: "1.5",
    maxWidth: "460px",
  },

  uploadPickerButton: {
    backgroundColor: "#111827",
    color: "#fff",
    border: "none",
    padding: "13px 18px",
    borderRadius: "14px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
    minWidth: "170px",
    boxShadow: "0 8px 18px rgba(17, 24, 39, 0.14)",
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
  justifyContent: "space-between",
  gap: "10px",
  padding: "10px 12px",
  borderRadius: "14px",
  background: "#f4f6fa",
  border: "1px solid #e8ebf2",
  maxWidth: "100%",
},
fileChipPreview: {
  width: "52px",
  height: "52px",
  borderRadius: "12px",
  objectFit: "cover",
  flex: "0 0 auto",
  border: "1px solid #e8ebf2",
  backgroundColor: "#e5e7eb",
},

fileChipInfo: {
  display: "grid",
  gap: "2px",
  minWidth: 0,
},

fileChipRemove: {
  width: "28px",
  height: "28px",
  borderRadius: "999px",
  border: "none",
  background: "#111827",
  color: "#fff",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "700",
  flex: "0 0 auto",
},

  fileChipName: {
    color: "#111827",
    fontSize: "13px",
    fontWeight: "700",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "220px",
  },

  fileChipSize: {
    color: "#667085",
    fontSize: "12px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },

  twoCol: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(0, 1fr))",
    gap: "12px",
    width: "100%",
  },

  input: {
    width: "100%",
    padding: "14px 15px",
    borderRadius: "14px",
    border: "1px solid #d7deea",
    fontSize: "15px",
    outline: "none",
    backgroundColor: "#fff",
    boxSizing: "border-box",
    color: "#111827",
  },

  primaryButton: {
    backgroundColor: "#111827",
    color: "white",
    border: "none",
    padding: "14px 18px",
    borderRadius: "14px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "700",
    boxShadow: "0 10px 22px rgba(17, 24, 39, 0.16)",
  },

  secondaryButton: {
    backgroundColor: "#1f2937",
    color: "#fff",
    border: "none",
    padding: "14px 18px",
    borderRadius: "14px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "700",
    minWidth: "170px",
    boxShadow: "0 8px 18px rgba(17, 24, 39, 0.12)",
  },

  buttonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
  },

  cancelButton: {
    backgroundColor: "#eef2f7",
    color: "#111827",
    border: "none",
    padding: "11px 15px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
  },

  deleteButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "rgba(220, 38, 38, 0.95)",
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
    left: "12px",
    right: "12px",
    bottom: "12px",
    zIndex: 999,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    background: "rgba(255,255,255,0.94)",
    border: "1px solid #e8ebf2",
    borderRadius: "20px",
    padding: "14px 16px",
    boxShadow: "0 16px 38px rgba(15, 23, 42, 0.12)",
    backdropFilter: "blur(12px)",
    boxSizing: "border-box",
  },

  selectionInfo: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#111827",
  },

  orderButton: {
    backgroundColor: "#111827",
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
    backgroundColor: "#98a2b3",
  },

  photoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "16px",
    alignItems: "start",
  },

  photoCard: {
    position: "relative",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 8px 22px rgba(15, 23, 42, 0.06)",
    background: "#fff",
    cursor: "pointer",
    border: "1px solid #e8ebf2",
  },

  photoMediaWrap: {
    position: "relative",
    width: "100%",
    background: "#e5e7eb",
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
      "linear-gradient(to top, rgba(15,23,42,0.22), rgba(15,23,42,0.04))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  },

  photoOverlayText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: "14px",
    padding: "8px 12px",
    borderRadius: "999px",
    background: "rgba(15,23,42,0.38)",
    backdropFilter: "blur(4px)",
  },

  photoInfoArea: {
    padding: "14px",
    display: "grid",
    gap: "12px",
    background: "#fff",
  },

  photoCaption: {
    fontSize: "14px",
    color: "#475467",
    lineHeight: "1.5",
  },

  photoActionRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },

  selectPhotoButton: {
    backgroundColor: "#eef2f7",
    color: "#111827",
    border: "none",
    padding: "10px 14px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
  },

  selectPhotoButtonActive: {
    backgroundColor: "#111827",
    color: "#ffffff",
  },

  previewButton: {
    backgroundColor: "#ffffff",
    color: "#111827",
    border: "1px solid #d7deea",
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
    backgroundColor: "#eef2f7",
    color: "#111827",
    border: "none",
    padding: "10px 14px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
  },

  likeButtonActive: {
    backgroundColor: "#fee4e2",
    color: "#b42318",
  },

  likeCount: {
    color: "#667085",
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
    border: "1px solid #d7deea",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "#fff",
    boxSizing: "border-box",
  },

  commentTextarea: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #d7deea",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "#fff",
    boxSizing: "border-box",
    resize: "vertical",
    fontFamily: "inherit",
  },

  commentButton: {
    backgroundColor: "#111827",
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
    color: "#667085",
    fontSize: "14px",
  },

  commentItem: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e8ebf2",
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
    color: "#111827",
    fontSize: "14px",
  },

  commentDate: {
    color: "#667085",
    fontSize: "12px",
  },

  commentText: {
    color: "#475467",
    fontSize: "14px",
    lineHeight: "1.5",
    whiteSpace: "pre-wrap",
  },

cartBackdrop: {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(15, 23, 42, 0.42)",
  zIndex: 9999,
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-end",
  padding: "0",
  overflow: "hidden",
},

cartPanel: {
  width: "100%",
  maxWidth: "920px",
  height: "min(88vh, 920px)",
  overflowY: "auto",
  overflowX: "hidden",
  background: "#ffffff",
  borderTopLeftRadius: "28px",
  borderTopRightRadius: "28px",
  borderBottomLeftRadius: "0",
  borderBottomRightRadius: "0",
  padding: "12px 16px calc(24px + env(safe-area-inset-bottom)) 16px",
  boxShadow: "0 -12px 40px rgba(15, 23, 42, 0.18)",
  boxSizing: "border-box",
  overscrollBehavior: "contain",
  touchAction: "pan-y",
},

cartHeader: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  marginBottom: "14px",
  position: "sticky",
  top: 0,
  background: "rgba(255,255,255,0.96)",
  backdropFilter: "blur(10px)",
  paddingBottom: "10px",
  zIndex: 5,
},

cartTitle: {
  margin: 0,
  fontSize: "22px",
  fontWeight: "800",
  color: "#111827",
  lineHeight: "1.2",
},

cartCloseButton: {
  width: "42px",
  height: "42px",
  borderRadius: "999px",
  border: "none",
  background: "#111827",
  color: "#fff",
  fontSize: "18px",
  cursor: "pointer",
  fontWeight: "700",
  flex: "0 0 auto",
},

  cartInfo: {
    marginBottom: "16px",
    fontSize: "15px",
    fontWeight: "700",
    color: "#475467",
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
    border: "1px solid #e8ebf2",
    borderRadius: "18px",
    padding: "14px",
  },

  orderLabel: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "700",
    color: "#111827",
  },

  orderSelect: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #d7deea",
    fontSize: "14px",
    backgroundColor: "#fff",
    boxSizing: "border-box",
  },

  priceSummaryCard: {
    background: "#ffffff",
    border: "1px solid #e8ebf2",
    borderRadius: "20px",
    padding: "16px",
    marginBottom: "18px",
    boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)",
  },

  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    padding: "6px 0",
    color: "#475467",
    fontSize: "14px",
  },

  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    paddingTop: "12px",
    marginTop: "8px",
    borderTop: "1px solid #e8ebf2",
    color: "#111827",
    fontSize: "18px",
    fontWeight: "800",
  },

  cartGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "16px",
    width: "100%",
    overflowX: "hidden",
    marginBottom: "18px",
  },

  cartPhotoCard: {
    background: "#fff",
    border: "1px solid #e8ebf2",
    borderRadius: "20px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 8px 18px rgba(15, 23, 42, 0.04)",
  },

  cartPhoto: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    display: "block",
    backgroundColor: "#e5e7eb",
  },

  cartPhotoInfo: {
    display: "grid",
    gap: "12px",
    padding: "14px",
  },

  cartPhotoName: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#111827",
    lineHeight: "1.4",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
  },

  cartItemOptions: {
    display: "grid",
    gap: "10px",
  },

  cartItemOptionBlock: {
    display: "grid",
    gap: "6px",
  },

  cartItemPrice: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#111827",
  },

  removeFromCartButton: {
    width: "100%",
    border: "none",
    background: "#fee4e2",
    color: "#b42318",
    padding: "10px 12px",
    fontWeight: "700",
    cursor: "pointer",
    borderRadius: "12px",
    fontSize: "13px",
  },

  orderFormCard: {
    background: "#f8fafc",
    border: "1px solid #e8ebf2",
    borderRadius: "20px",
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
    color: "#111827",
  },

  orderFormText: {
    margin: 0,
    fontSize: "14px",
    lineHeight: "1.7",
    color: "#667085",
  },

orderFormGrid: {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "12px",
  width: "100%",
},
orderInput: {
  width: "100%",
  display: "block",
  boxSizing: "border-box",
  padding: "14px 14px",
  borderRadius: "14px",
  border: "1px solid #d7deea",
  fontSize: "14px",
  backgroundColor: "#fff",
  outline: "none",
},

orderTextarea: {
  width: "100%",
  display: "block",
  boxSizing: "border-box",
  padding: "14px 14px",
  borderRadius: "14px",
  border: "1px solid #d7deea",
  fontSize: "14px",
  backgroundColor: "#fff",
  outline: "none",
  resize: "vertical",
  fontFamily: "inherit",
  minHeight: "110px",
},

cartFooter: {
  position: "sticky",
  bottom: "calc(-12px - env(safe-area-inset-bottom))",
  marginTop: "12px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "14px",
  flexWrap: "wrap",
  background: "rgba(255,255,255,0.98)",
  borderTop: "1px solid #e8ebf2",
  paddingTop: "14px",
  paddingBottom: "calc(10px + env(safe-area-inset-bottom))",
  backdropFilter: "blur(12px)",
},
  
  cartFooterSummary: {
    display: "grid",
    gap: "4px",
  },

  cartFooterSmall: {
    fontSize: "13px",
    color: "#667085",
    fontWeight: "600",
  },

  cartFooterTotal: {
    fontSize: "26px",
    fontWeight: "800",
    color: "#111827",
  },

checkoutButton: {
  backgroundColor: "#111827",
  color: "#fff",
  border: "none",
  padding: "14px 20px",
  borderRadius: "16px",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: "700",
  minWidth: "220px",
  boxShadow: "0 10px 24px rgba(17, 24, 39, 0.16)",
},

  cartHandleWrap: {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  paddingTop: "2px",
  paddingBottom: "10px",
  position: "sticky",
  top: 0,
  background: "rgba(255,255,255,0.96)",
  zIndex: 6,
},

cartHandle: {
  width: "44px",
  height: "5px",
  borderRadius: "999px",
  background: "#d0d5dd",
},

  emptyBox: {
    backgroundColor: "#fff",
    border: "1px solid #e8ebf2",
    borderRadius: "20px",
    padding: "22px",
    color: "#667085",
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
    backgroundColor: "rgba(255,255,255,0.14)",
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

  newHeroCard: {
    width: "100%",
    maxWidth: "680px",
    margin: "0 auto 28px auto",
    background:
      "linear-gradient(135deg, #111827 0%, #1f2937 50%, #374151 100%)",
    color: "#fff",
    padding: "22px",
    borderRadius: "28px",
    boxShadow: "0 18px 42px rgba(17, 24, 39, 0.22)",
    position: "relative",
    boxSizing: "border-box",
    overflow: "hidden",
  },

  newHeroTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    gap: "10px",
  },

  newHeroBrand: {
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "1.2px",
    opacity: 0.78,
  },

  newHeroBadge: {
    background: "rgba(255,255,255,0.14)",
    padding: "6px 12px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  newHeroTitle: {
    fontSize: "28px",
    fontWeight: "800",
    margin: "10px 0 4px 0",
    lineHeight: "1.15",
  },

  newHeroSubtitle: {
    fontSize: "14px",
    opacity: 0.86,
    marginBottom: "16px",
    lineHeight: "1.5",
  },

  newHeroImage: {
    width: "100%",
    borderRadius: "20px",
    overflow: "hidden",
    marginBottom: "16px",
  },

  newHeroImageTag: {
    width: "100%",
    height: "230px",
    objectFit: "cover",
    display: "block",
  },

  newHeroDescription: {
    margin: "0 0 16px 0",
    fontSize: "14px",
    opacity: 0.9,
    lineHeight: "1.6",
  },

newHeroPreviewRow: {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "10px",
  marginTop: "10px",
  maxHeight: "256px",
  overflowY: "auto",
  overflowX: "hidden",
  paddingRight: "4px",
  alignContent: "start",
},

newHeroPreviewImg: {
  width: "100%",
  aspectRatio: "1 / 1",
  borderRadius: "14px",
  objectFit: "cover",
  cursor: "pointer",
  border: "1px solid rgba(255,255,255,0.12)",
  display: "block",
},

  newHeroMoreBox: {
    width: "72px",
    height: "72px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "18px",
    flex: "0 0 auto",
    scrollSnapAlign: "center",
  },
};
