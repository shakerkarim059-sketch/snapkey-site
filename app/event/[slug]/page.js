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
    name: "Snapkey Mini",
    label: "Für viele Gäste",
    description:
      "Der leichte Einstieg für große Feiern. Klein, praktisch und perfekt, damit jeder Gast Erinnerungen teilen kann.",
    price: 1.9,
    image: "/nfc-chip.jpg",
    points: ["Tap + QR-Code", "Für viele Gäste", "Günstigste Variante"],
  },
  standard: {
    name: "Snapkey Card",
    label: "Am beliebtesten",
    description:
      "Eine elegante Karte mit persönlichem Design. Perfekt für Tische, Einladungen oder als hochwertiges Gastgeschenk.",
    price: 2.9,
    image: "/pvc-cards.jpg",
    points: ["Premium Kartenlook", "Persönliches Design", "Für jeden Anlass"],
    featured: true,
  },
  premium: {
    name: "Snapkey Wood",
    label: "Als Erinnerung",
    description:
      "Ein natürlicher Holz-Snapkey, der nach dem Event bleibt. Emotional, hochwertig und besonders persönlich.",
    price: 7.9,
    image: "/wood-keychain.jpg",
    points: ["Natürliches Holz", "Sehr emotional", "Zum Mitnehmen"],
  },
};

const DESIGN_OPTIONS = [
  { id: "elegant", name: "Elegant", icon: "✨", text: "Zeitlos, ruhig und hochwertig" },
  { id: "natural", name: "Natürlich", icon: "🌿", text: "Warm, weich und organisch" },
  { id: "modern", name: "Modern", icon: "◐", text: "Klar, reduziert und frisch" },
  { id: "festive", name: "Feierlich", icon: "🎉", text: "Emotional und besonders" },
  { id: "travel", name: "Reise", icon: "✈️", text: "Für Urlaub, Gruppen & Abenteuer" },
  { id: "custom", name: "Eigenes Design", icon: "🎨", text: "Bild hochladen oder Idee beschreiben" },
];

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
  const [submittingCommentPhotoId, setSubmittingCommentPhotoId] = useState(null);

  const [selectedKeyType, setSelectedKeyType] = useState("standard");
  const [selectedQuantity, setSelectedQuantity] = useState(25);
  const [customQuantity, setCustomQuantity] = useState("");

  const [selectedDesign, setSelectedDesign] = useState("modern");
  const [customDesignNote, setCustomDesignNote] = useState("");
  const [customDesignFile, setCustomDesignFile] = useState(null);
  const [wantsDesignConsulting, setWantsDesignConsulting] = useState(false);

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

  const [snapkeyCustomerName, setSnapkeyCustomerName] = useState("");
  const [snapkeyCustomerEmail, setSnapkeyCustomerEmail] = useState("");
  const [snapkeyCustomerPhone, setSnapkeyCustomerPhone] = useState("");
  const [snapkeyStreet, setSnapkeyStreet] = useState("");
  const [snapkeyPostalCode, setSnapkeyPostalCode] = useState("");
  const [snapkeyCity, setSnapkeyCity] = useState("");
  const [snapkeyCountry, setSnapkeyCountry] = useState("Deutschland");
  const [snapkeyOrderNote, setSnapkeyOrderNote] = useState("");
  const [submittingSnapkeyOrder, setSubmittingSnapkeyOrder] = useState(false);

  const fileInputRef = useRef(null);
  const customDesignInputRef = useRef(null);
  const galleryRef = useRef(null);
  const uploadRef = useRef(null);
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

      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNextPhoto();
      if (e.key === "ArrowLeft") showPrevPhoto();
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
        setup_completed,
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
    return await Promise.all(
      (photoRows || []).map(async (photo) => {
        if (!photo.file_path) return { ...photo, signed_url: null };

        const { data, error } = await supabase.storage
          .from("photos")
          .createSignedUrl(photo.file_path, 60 * 60);

        if (error) {
          console.error("Fehler beim Erzeugen der Signed URL:", error);
          return { ...photo, signed_url: null };
        }

        return { ...photo, signed_url: data?.signedUrl || null };
      })
    );
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
        setLoginError(result.error || "Falsches Passwort. Bitte erneut versuchen.");
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
      await fetch("/api/event-logout", { method: "POST" });
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
        headers: { "Content-Type": "application/json" },
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

      return merged.filter(
        (file, index, self) =>
          index ===
          self.findIndex(
            (f) =>
              f.name === file.name &&
              f.size === file.size &&
              f.lastModified === file.lastModified
          )
      );
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeSelectedFile(indexToRemove) {
    setSelectedFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
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
        alert(`Foto "${file.name}" konnte nicht hochgeladen werden: ${uploadError.message}`);
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
        alert(`DB-Fehler bei "${file.name}": ${insertError.message || "Unbekannter Fehler"}`);
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

    if (fileInputRef.current) fileInputRef.current.value = "";

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId: photo.id }),
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
        setPhotoLikes((prev) => prev.filter((like) => like.id !== existingLikeId));
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
      setCommentDrafts((prev) => ({ ...prev, [photoId]: "" }));
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
        headers: { "Content-Type": "application/json" },
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
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

  function getDesignVariantForOrder() {
    const selected = DESIGN_OPTIONS.find((item) => item.id === selectedDesign);
    const base = selected?.name || "Modern";

    if (selectedDesign !== "custom") {
      return base;
    }

    const parts = ["Eigenes Design"];

    if (customDesignNote.trim()) {
      parts.push(`Beschreibung: ${customDesignNote.trim()}`);
    }

    if (customDesignFile?.name) {
      parts.push(`Referenzbild: ${customDesignFile.name}`);
    }

    if (wantsDesignConsulting) {
      parts.push("Design gemeinsam entwickeln / Rücksprache gewünscht");
    }

    return parts.join(" | ");
  }

  function getSnapkeyOrderNote() {
    const notes = [];

    if (snapkeyOrderNote.trim()) {
      notes.push(snapkeyOrderNote.trim());
    }

    if (selectedDesign === "custom") {
      notes.push(`Designwunsch: ${getDesignVariantForOrder()}`);
    }

    if (wantsDesignConsulting) {
      notes.push("Bitte Kontakt zur Designabstimmung aufnehmen.");
    }

    return notes.join("\n\n");
  }

  async function handleSubmitSnapkeyOrder() {
    try {
      if (!eventData?.id) {
        alert("Event nicht gefunden.");
        return;
      }

      const parsedQuantity = customQuantity ? Number(customQuantity) : selectedQuantity;

      if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
        alert("Bitte eine gültige Menge wählen.");
        return;
      }

      if (!snapkeyCustomerName.trim()) {
        alert("Bitte deinen Namen eingeben.");
        return;
      }

      if (!snapkeyCustomerEmail.trim()) {
        alert("Bitte deine E-Mail eingeben.");
        return;
      }

      if (!snapkeyStreet.trim() || !snapkeyPostalCode.trim() || !snapkeyCity.trim()) {
        alert("Bitte die vollständige Adresse eingeben.");
        return;
      }

      setSubmittingSnapkeyOrder(true);

      const createOrderResponse = await fetch("/api/create-snapkey-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: eventData.id,
          keyType: selectedKeyType,
          quantity: parsedQuantity,
          designVariant: getDesignVariantForOrder(),
          customerName: snapkeyCustomerName,
          customerEmail: snapkeyCustomerEmail,
          customerPhone: snapkeyCustomerPhone,
          street: snapkeyStreet,
          postalCode: snapkeyPostalCode,
          city: snapkeyCity,
          country: snapkeyCountry,
          orderNote: getSnapkeyOrderNote(),
        }),
      });

      const createOrderResult = await createOrderResponse.json();

      if (!createOrderResponse.ok) {
        alert(
          createOrderResult.details ||
            createOrderResult.error ||
            "Snapkey-Bestellung konnte nicht gespeichert werden."
        );
        setSubmittingSnapkeyOrder(false);
        return;
      }

      const orderId = createOrderResult?.order?.id;

      if (!orderId) {
        alert("Keine Bestell-ID erhalten.");
        setSubmittingSnapkeyOrder(false);
        return;
      }

      const checkoutResponse = await fetch("/api/create-snapkey-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const checkoutResult = await checkoutResponse.json();

      if (!checkoutResponse.ok) {
        alert(checkoutResult.error || "Stripe Checkout konnte nicht gestartet werden.");
        setSubmittingSnapkeyOrder(false);
        return;
      }

      if (!checkoutResult.url) {
        alert("Keine Checkout-URL erhalten.");
        setSubmittingSnapkeyOrder(false);
        return;
      }

      window.location.href = checkoutResult.url;
    } catch (error) {
      console.error("Fehler beim Starten der Snapkey-Bestellung:", error);
      alert("Es gab ein Problem beim Starten der Zahlung.");
      setSubmittingSnapkeyOrder(false);
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
    setSelectedPhotoIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length);
  }

  function handleTouchStart(e) {
    touchStartX.current = e.changedTouches[0].clientX;
  }

  function handleTouchEnd(e) {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;

    if (diff > 50) showNextPhoto();
    if (diff < -50) showPrevPhoto();
  }

  function scrollToUpload() {
    uploadRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function scrollToGallery() {
    galleryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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

      const matchesYear = selectedYearFilter === "all" || photoYear === selectedYearFilter;
      const matchesMonth = selectedMonthFilter === "all" || photoMonth === selectedMonthFilter;

      return matchesYear && matchesMonth;
    });
  }, [photos, selectedYearFilter, selectedMonthFilter]);

  const finalQuantity = customQuantity ? Number(customQuantity) : selectedQuantity;
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

    return sum + (getProductPrice(options.printOption, options.frameOption) || 0);
  }, 0);

  const totalPrice = totalPriceInCent / 100;

  const coverPhoto = photos.length > 0 ? photos[0] : null;
  const currentPhoto = filteredPhotos[selectedPhotoIndex];

  if (loadingEvent) {
    return (
      <main className="event-page">
        <EventStyles />
        <div className="center-card">Album wird geladen...</div>
      </main>
    );
  }

  if (eventNotFound || !eventData) {
    return (
      <main className="event-page">
        <EventStyles />
        <div className="center-card">Dieses Album wurde nicht gefunden.</div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="event-page">
        <EventStyles />

        <section className="login-shell">
          <div className="login-card">
            <div className="brand">snapkey</div>
            <div className="eyebrow">Privates Album</div>

            <h1>{eventData.title || "Gemeinsames Album"}</h1>

            <p>
              Gib den Zugangscode ein, um Fotos und Videos dieses Albums zu sehen.
            </p>

            <input
              type="password"
              placeholder="Zugangscode eingeben"
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setLoginError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLogin();
              }}
              className={loginError ? "input input-error" : "input"}
            />

            {loginError && <div className="error-text">{loginError}</div>}

            <button onClick={handleLogin} className="primary-button">
              Album öffnen
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="event-page">
      <EventStyles />

      <section className="event-shell">
        <header className="album-hero">
          <div className="album-hero-content">
            <div className="brand-row">
              <div className="brand">snapkey</div>
              <button type="button" onClick={handleLogout} className="ghost-button">
                Abmelden
              </button>
            </div>

            <div className="hero-badge">
              {isAdmin ? "Adminansicht" : "Gemeinsames Album"}
            </div>

            <h1>
              Alle Erinnerungen.
              <span>Ein gemeinsamer Ort.</span>
            </h1>

            <p className="hero-event-name">{eventData.title}</p>

            <div className="hero-meta">
              <span>{eventData.location || "Kein Ort"}</span>
              <span>{formatDate(eventData.start_date)}</span>
              <span>{photos.length} Foto{photos.length === 1 ? "" : "s"}</span>
            </div>

            <p className="hero-description">
              {eventData.description ||
                "Fotos und Videos von Familie, Freunden und Gästen sammeln – automatisch an einem gemeinsamen Ort."}
            </p>

            {eventData?.setup_completed && (
              <div className="hero-actions">
                <button type="button" onClick={scrollToUpload} className="primary-button">
                  Fotos hochladen
                </button>

                <button type="button" onClick={scrollToGallery} className="secondary-button">
                  Galerie ansehen
                </button>
              </div>
            )}

            {isAdmin && (
              <div className="admin-actions">
                <button type="button" onClick={startEditingEvent} className="small-link-button">
                  Event bearbeiten
                </button>
              </div>
            )}
          </div>

          <div className="album-hero-visual">
            {coverPhoto?.signed_url ? (
              <img src={coverPhoto.signed_url} alt="Album Cover" />
            ) : (
              <div className="hero-placeholder">
                <span>📸</span>
                <strong>Noch keine Fotos</strong>
                <small>Nach der Freischaltung können Gäste Erinnerungen hochladen.</small>
              </div>
            )}
          </div>
        </header>

        {!eventData?.setup_completed && !isSetupMode && (
          <section className="locked-card">
            <div>
              <div className="eyebrow">Fast geschafft</div>
              <h2>Dein Album ist vorbereitet.</h2>
              <p>
                Bestelle jetzt deine Snapkeys und schalte das Album für deine Gäste frei.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                window.location.href = `/event/${eventData.slug}?setup=true`;
              }}
              className="primary-button"
            >
              Snapkeys auswählen
            </button>
          </section>
        )}

        {isSetupMode && (
          <section className="setup-card">
            <div className="setup-hero">
              <div className="eyebrow">Snapkey Setup</div>

              <h2>
                Dein Album ist bereit.
                <span>Jetzt fehlen nur noch deine Snapkeys.</span>
              </h2>

              <p>
                Jeder Snapkey führt direkt zu deinem privaten Album. Für deine Gäste ist er Zugang,
                Erinnerung und persönliches Detail in einem.
              </p>

              <div className="progress-row">
                <span>✓ Event erstellt</span>
                <span>✓ Album vorbereitet</span>
                <span className="active">Snapkeys wählen</span>
                <span>Zahlung</span>
              </div>
            </div>

            <div className="setup-layout">
              <div className="setup-main">
                <section className="setup-section">
                  <div className="section-label">1. Snapkey auswählen</div>

                  <div className="snapkey-grid">
                    {Object.entries(KEY_TYPES).map(([key, item]) => (
                      <button
                        type="button"
                        key={key}
                        onClick={() => setSelectedKeyType(key)}
                        className={`snapkey-card ${selectedKeyType === key ? "selected" : ""} ${
                          item.featured ? "featured" : ""
                        }`}
                      >
                        <div className="snapkey-image">
                          <img src={item.image} alt={item.name} />
                          <span>{item.label}</span>
                        </div>

                        <div className="snapkey-body">
                          <div className="snapkey-title-row">
                            <h3>{item.name}</h3>
                            <strong>{item.price.toFixed(2)} €</strong>
                          </div>

                          <p>{item.description}</p>

                          <div className="chip-row">
                            {item.points.map((point) => (
                              <span key={point}>{point}</span>
                            ))}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="setup-section">
                  <div className="section-label">2. Design auswählen</div>

                  <div className="design-grid">
                    {DESIGN_OPTIONS.map((design) => (
                      <button
                        type="button"
                        key={design.id}
                        onClick={() => setSelectedDesign(design.id)}
                        className={`design-card ${selectedDesign === design.id ? "selected" : ""}`}
                      >
                        <span>{design.icon}</span>
                        <strong>{design.name}</strong>
                        <small>{design.text}</small>
                      </button>
                    ))}
                  </div>

                  {selectedDesign === "custom" && (
                    <div className="custom-design-box">
                      <div className="custom-design-upload">
                        <input
                          ref={customDesignInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            setCustomDesignFile(file || null);
                          }}
                          style={{ display: "none" }}
                        />

                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => customDesignInputRef.current?.click()}
                        >
                          Bildvorschlag hochladen
                        </button>

                        <p>
                          {customDesignFile
                            ? `Ausgewählt: ${customDesignFile.name}`
                            : "Lade ein Beispielbild, Logo oder Designvorschlag hoch."}
                        </p>
                      </div>

                      <textarea
                        placeholder="Beschreibe dein Wunschdesign, z. B. goldene Schrift mit Eukalyptus, Firmenlogo auf schwarzem Hintergrund oder Boho-Stil mit Trockenblumen."
                        value={customDesignNote}
                        onChange={(e) => setCustomDesignNote(e.target.value)}
                        rows={4}
                        className="textarea"
                      />

                      <label className="checkbox-row">
                        <input
                          type="checkbox"
                          checked={wantsDesignConsulting}
                          onChange={(e) => setWantsDesignConsulting(e.target.checked)}
                        />
                        <span>
                          Ich möchte mein Design gemeinsam besprechen. Bitte kontaktiert mich zur Gestaltung.
                        </span>
                      </label>
                    </div>
                  )}
                </section>

                <section className="setup-section">
                  <div className="section-label">3. Menge wählen</div>

                  <div className="quantity-row">
                    {PACKAGE_OPTIONS.map((qty) => (
                      <button
                        key={qty}
                        type="button"
                        onClick={() => {
                          setSelectedQuantity(qty);
                          setCustomQuantity("");
                        }}
                        className={
                          selectedQuantity === qty && !customQuantity
                            ? "quantity-button active"
                            : "quantity-button"
                        }
                      >
                        {qty} Gäste
                        {qty === 25 && <small>Empfohlen</small>}
                      </button>
                    ))}
                  </div>

<div className="custom-quantity-wrap">
  <input
    type="number"
    placeholder="Eigene Menge eingeben"
    value={customQuantity}
    onChange={(e) => setCustomQuantity(e.target.value)}
    className="input"
  />
</div>
                </section>

                <section className="setup-section">
                  <div className="section-label">4. Kontakt & Lieferung</div>

                  <p className="section-help">
                    Gib hier deine Kontaktdaten und Lieferadresse ein. Danach wirst du sicher zur Zahlung weitergeleitet.
                  </p>

                  <div className="form-grid">
                    <input
                      type="text"
                      placeholder="Vor- und Nachname"
                      value={snapkeyCustomerName}
                      onChange={(e) => setSnapkeyCustomerName(e.target.value)}
                      className="input"
                    />

                    <input
                      type="email"
                      placeholder="E-Mail"
                      value={snapkeyCustomerEmail}
                      onChange={(e) => setSnapkeyCustomerEmail(e.target.value)}
                      className="input"
                    />

                    <input
                      type="text"
                      placeholder="Telefon optional"
                      value={snapkeyCustomerPhone}
                      onChange={(e) => setSnapkeyCustomerPhone(e.target.value)}
                      className="input"
                    />

                    <input
                      type="text"
                      placeholder="Straße und Hausnummer"
                      value={snapkeyStreet}
                      onChange={(e) => setSnapkeyStreet(e.target.value)}
                      className="input"
                    />

                    <input
                      type="text"
                      placeholder="PLZ"
                      value={snapkeyPostalCode}
                      onChange={(e) => setSnapkeyPostalCode(e.target.value)}
                      className="input"
                    />

                    <input
                      type="text"
                      placeholder="Ort"
                      value={snapkeyCity}
                      onChange={(e) => setSnapkeyCity(e.target.value)}
                      className="input"
                    />

                    <input
                      type="text"
                      placeholder="Land"
                      value={snapkeyCountry}
                      onChange={(e) => setSnapkeyCountry(e.target.value)}
                      className="input"
                    />
                  </div>

                  <textarea
                    placeholder="Notiz zur Bestellung optional"
                    value={snapkeyOrderNote}
                    onChange={(e) => setSnapkeyOrderNote(e.target.value)}
                    rows={4}
                    className="textarea"
                  />
                </section>
              </div>

              <aside className="summary-card">
                <div className="summary-title">Deine Bestellung</div>

                <div className="summary-line">
                  <span>Eventseite</span>
                  <strong>{EVENT_BASE_PRICE.toFixed(2)} €</strong>
                </div>

                <div className="summary-line">
                  <span>
                    {selectedKey.name} × {finalQuantity}
                  </span>
                  <strong>{(selectedKey.price * finalQuantity).toFixed(2)} €</strong>
                </div>

                <div className="summary-line">
                  <span>Design</span>
                  <strong>
                    {DESIGN_OPTIONS.find((d) => d.id === selectedDesign)?.name || "Modern"}
                  </strong>
                </div>

                <div className="summary-divider" />

                <div className="summary-total">
                  <span>Gesamt</span>
                  <strong>{setupTotalPrice.toFixed(2)} €</strong>
                </div>

                <div className="trust-box">
                  <div>✓ Snapkeys führen direkt zum privaten Album</div>
                  <div>✓ Gäste brauchen keine App</div>
                  <div>✓ Persönliches Design möglich</div>
                  <div>✓ Sichere Zahlung über Stripe</div>
                  <div>✓ 1 Monat Speicherung inklusive</div>
                </div>

                <div className="storage-note">
                  Fotos & Videos bleiben standardmäßig 1 Monat gespeichert.
                  Danach optional für 4,99 € pro Monat verlängerbar.
                </div>

                <button
                  type="button"
                  disabled={submittingSnapkeyOrder}
                  onClick={handleSubmitSnapkeyOrder}
                  className="primary-button full"
                >
                  {submittingSnapkeyOrder
                    ? "Bestellung wird vorbereitet..."
                    : "Jetzt bestellen & Event freischalten"}
                </button>
              </aside>
            </div>
          </section>
        )}

        {editingEventId && isAdmin && (
          <form onSubmit={handleUpdateEvent} className="admin-card">
            <div className="section-label">Event bearbeiten</div>

            <input
              type="text"
              placeholder="Titel"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="input"
            />

            <input
              type="text"
              placeholder="Ort"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input"
            />

            <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
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

            <div className="form-grid two">
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input" />
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input" />
            </div>

            <textarea
              placeholder="Beschreibung"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="textarea"
            />

            <div className="button-row">
              <button type="submit" disabled={updatingEvent} className="primary-button">
                {updatingEvent ? "Wird gespeichert..." : "Änderungen speichern"}
              </button>

              <button type="button" onClick={cancelEditingEvent} className="secondary-button">
                Abbrechen
              </button>
            </div>
          </form>
        )}

        {eventData?.setup_completed && (
          <>
            <section ref={uploadRef} className="upload-card">
              <div>
                <div className="eyebrow">Fotos & Videos sammeln</div>
                <h2>Erinnerungen hinzufügen</h2>
                <p>
                  Lade mehrere Bilder gesammelt hoch. Alles landet automatisch in diesem gemeinsamen Album.
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileSelection(e.target.files)}
                style={{ display: "none" }}
              />

              <div className="upload-picker" onClick={() => fileInputRef.current?.click()}>
                <div className="upload-icon">↑</div>
                <strong>Bilder auswählen</strong>
                <span>Tippe hier, um Fotos vom Handy oder Computer auszuwählen.</span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="secondary-button"
                >
                  Dateien öffnen
                </button>
              </div>

              {selectedFiles.length > 0 && (
                <div className="file-list">
                  {selectedFiles.map((file, index) => (
                    <div key={`${file.name}-${file.lastModified}-${index}`} className="file-chip">
                      <img src={URL.createObjectURL(file)} alt={file.name} />

                      <div>
                        <strong>{file.name}</strong>
                        <span>{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                      </div>

                      <button type="button" onClick={() => removeSelectedFile(index)}>
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <input
                type="text"
                placeholder="Gemeinsame Bildbeschreibung optional"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="input"
              />

              <button
                type="submit"
                onClick={handlePhotoUpload}
                disabled={uploadingPhoto}
                className="primary-button"
              >
                {uploadingPhoto ? "Fotos werden hochgeladen..." : "Fotos hochladen"}
              </button>
            </section>

            {["familienalbum", "album", "rückblick"].includes(
              (eventData.category || "").toLowerCase()
            ) && (
              <section className="filter-card">
                <div className="section-label">Filter</div>

                <div className="form-grid two">
                  <select value={selectedYearFilter} onChange={(e) => setSelectedYearFilter(e.target.value)} className="input">
                    <option value="all">Alle Jahre</option>
                    {availableYears.map((year) => (
                      <option key={year} value={String(year)}>
                        {year}
                      </option>
                    ))}
                  </select>

                  <select value={selectedMonthFilter} onChange={(e) => setSelectedMonthFilter(e.target.value)} className="input">
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

                <p>{filteredPhotos.length} Foto{filteredPhotos.length === 1 ? "" : "s"} gefunden</p>
              </section>
            )}

            <section ref={galleryRef} className="gallery-section">
              <div className="gallery-header">
                <div>
                  <div className="eyebrow">Gemeinsame Erinnerungen</div>
                  <h2>Galerie</h2>
                  <p>
                    Die besten Momente entstehen oft dann, wenn niemand darauf achtet.
                  </p>
                </div>

                <button
                  type="button"
                  className={selectedPhotoIds.length ? "primary-button" : "secondary-button disabled"}
                  onClick={() => {
                    if (selectedPhotoIds.length === 0) {
                      alert("Bitte zuerst Bilder auswählen.");
                      return;
                    }
                    setCartOpen(true);
                  }}
                >
                  {selectedPhotoIds.length} Bild{selectedPhotoIds.length === 1 ? "" : "er"} bestellen
                </button>
              </div>

              {loadingPhotos || loadingLikes || loadingComments ? (
                <div className="center-card">Inhalte werden geladen...</div>
              ) : filteredPhotos.length === 0 ? (
                <div className="center-card">Noch keine Fotos in diesem Album.</div>
              ) : (
                <div className="masonry-grid">
                  {filteredPhotos.map((photo, index) => {
                    const likesForPhoto = getLikesForPhoto(photo.id);
                    const commentsForPhoto = getCommentsForPhoto(photo.id);
                    const likedByThisBrowser = isPhotoLikedByThisBrowser(photo.id);
                    const isSelected = selectedPhotoIds.includes(photo.id);

                    return (
                      <article key={photo.id} className={isSelected ? "photo-item selected" : "photo-item"}>
                        <img
                          src={photo.signed_url}
                          alt={photo.caption || photo.file_name || "Foto"}
                          onClick={() => openLightbox(index)}
                        />

                        <div className="photo-overlay-actions">
                          <button type="button" onClick={() => togglePhotoSelection(photo.id)}>
                            {isSelected ? "Ausgewählt ✓" : "Auswählen"}
                          </button>

                          <button type="button" onClick={() => openLightbox(index)}>
                            Ansehen
                          </button>

                          {isAdmin && (
                            <button type="button" onClick={() => handleDeletePhoto(photo)}>
                              Löschen
                            </button>
                          )}
                        </div>

                        {(photo.caption || eventData.likes_enabled !== false || eventData.comments_enabled !== false) && (
                          <div className="photo-info">
                            {photo.caption && <p>{photo.caption}</p>}

                            {eventData.likes_enabled !== false && (
                              <button
                                type="button"
                                onClick={() => handleToggleLike(photo.id)}
                                disabled={likingPhotoId === photo.id}
                                className={likedByThisBrowser ? "like-button active" : "like-button"}
                              >
                                ♥ {likesForPhoto.length}
                              </button>
                            )}

                            {eventData.comments_enabled !== false && (
                              <details>
                                <summary>{commentsForPhoto.length} Kommentar{commentsForPhoto.length === 1 ? "" : "e"}</summary>

                                <div className="comment-list">
                                  {commentsForPhoto.map((comment) => (
                                    <div key={comment.id} className="comment-item">
                                      <strong>{comment.author_name || "Unbekannt"}</strong>
                                      <p>{comment.comment_text}</p>
                                      <small>{formatDateTime(comment.created_at)}</small>
                                    </div>
                                  ))}
                                </div>

                                <div className="comment-form">
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
                                    className="input"
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
                                    className="textarea"
                                    rows={3}
                                  />

                                  <button
                                    type="button"
                                    onClick={() => handleSubmitComment(photo.id)}
                                    disabled={submittingCommentPhotoId === photo.id}
                                    className="secondary-button"
                                  >
                                    Kommentieren
                                  </button>
                                </div>
                              </details>
                            )}
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </section>

      {cartOpen && (
        <div className="cart-backdrop" onClick={() => setCartOpen(false)}>
          <div className="cart-panel" onClick={(e) => e.stopPropagation()}>
            <div className="cart-handle" />

            <div className="cart-header">
              <h3>Ausgewählte Bilder</h3>
              <button type="button" onClick={() => setCartOpen(false)}>
                ✕
              </button>
            </div>

            {selectedPhotos.length === 0 ? (
              <div className="center-card">Keine Bilder ausgewählt.</div>
            ) : (
              <>
                <div className="cart-grid">
                  {selectedPhotos.map((photo) => {
                    const options = photoOrderOptions[photo.id] || {
                      printOption: "13x18",
                      frameOption: "none",
                    };

                    const itemPriceInCent =
                      getProductPrice(options.printOption, options.frameOption) || 0;

                    return (
                      <article key={photo.id} className="cart-photo-card">
                        <img
                          src={photo.signed_url || ""}
                          alt={photo.caption || photo.file_name || "Foto"}
                        />

                        <div>
                          <strong>{photo.caption || photo.file_name || "Ausgewähltes Foto"}</strong>

                          <label>Format</label>
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
                            className="input"
                          >
                            {SIZE_OPTIONS.map((option) => {
                              const price =
                                getProductPrice(option.value, options.frameOption) || 0;

                              return (
                                <option key={option.value} value={option.value}>
                                  {option.label} • {formatEuroFromCent(price)} €
                                </option>
                              );
                            })}
                          </select>

                          <label>Rahmen</label>
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
                            className="input"
                          >
                            {Object.entries(FRAME_OPTIONS).map(([value, option]) => (
                              <option key={value} value={value}>
                                {option.label} • {formatEuroFromCent(option.price)} €
                              </option>
                            ))}
                          </select>

                          <div className="cart-item-price">
                            {(itemPriceInCent / 100).toFixed(2)} €
                          </div>

                          <button type="button" onClick={() => togglePhotoSelection(photo.id)} className="danger-button">
                            Entfernen
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <section className="cart-order-card">
                  <h4>Erinnerungen bestellen</h4>
                  <p>
                    Gib hier deine Kontaktdaten und Lieferadresse ein. Deine ausgewählten Bilder werden mit Format- und Rahmenoptionen gespeichert.
                  </p>

                  <div className="form-grid">
                    <input type="text" placeholder="Vor- und Nachname" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="input" />
                    <input type="email" placeholder="E-Mail" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="input" />
                    <input type="text" placeholder="Telefon optional" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="input" />
                    <input type="text" placeholder="Straße und Hausnummer" value={street} onChange={(e) => setStreet(e.target.value)} className="input" />
                    <input type="text" placeholder="PLZ" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="input" />
                    <input type="text" placeholder="Ort" value={city} onChange={(e) => setCity(e.target.value)} className="input" />
                    <input type="text" placeholder="Land" value={country} onChange={(e) => setCountry(e.target.value)} className="input" />
                  </div>

                  <textarea
                    placeholder="Notiz zur Bestellung optional"
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    rows={4}
                    className="textarea"
                  />
                </section>

                <div className="cart-footer">
                  <div>
                    <small>{selectedPhotos.length} Bild{selectedPhotos.length === 1 ? "" : "er"} ausgewählt</small>
                    <strong>{totalPrice.toFixed(2)} €</strong>
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmitOrder}
                    disabled={submittingOrder}
                    className="primary-button"
                  >
                    {submittingOrder ? "Bestellung wird gespeichert..." : "Erinnerungen bestellen"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {lightboxOpen && currentPhoto && (
        <div className="lightbox-backdrop" onClick={closeLightbox}>
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <button type="button" className="lightbox-close" onClick={closeLightbox}>
              ✕
            </button>

            {filteredPhotos.length > 1 && (
              <>
                <button type="button" className="lightbox-nav left" onClick={showPrevPhoto}>
                  ‹
                </button>

                <button type="button" className="lightbox-nav right" onClick={showNextPhoto}>
                  ›
                </button>
              </>
            )}

            <img
              src={currentPhoto?.signed_url || ""}
              alt={currentPhoto.caption || currentPhoto.file_name || "Foto"}
            />

            <div className="lightbox-footer">
              <span>{selectedPhotoIndex + 1} / {filteredPhotos.length}</span>
              {currentPhoto.caption && <p>{currentPhoto.caption}</p>}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function EventStyles() {
  return (
    <style jsx global>{`
      @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");

      :root {
        --bg: #faf8f5;
        --surface: #ffffff;
        --surface-elevated: #fffefe;
        --accent: #1a1612;
        --accent-soft: #2d251f;
        --text: #1a1612;
        --text-secondary: #6b5f54;
        --text-muted: #9a8d82;
        --border: #ebe5dd;
        --border-hover: #d4cbc0;
        --warm: #f5efe7;
        --warm-deep: #ebe2d5;
        --gold: #c9a76c;
        --gold-soft: #e8d9bb;
        --danger: #b42318;
      }

      * {
        box-sizing: border-box;
      }

      html {
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
      }

      body {
        margin: 0;
        background: var(--bg);
        color: var(--text);
        font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        line-height: 1.6;
      }

      button,
      input,
      textarea,
      select {
        font: inherit;
      }

      button {
        cursor: pointer;
      }

      .event-page {
        min-height: 100vh;
        background:
          radial-gradient(circle at top right, rgba(201, 167, 108, 0.14), transparent 36%),
          linear-gradient(180deg, #faf8f5 0%, #ffffff 100%);
        padding: 24px 14px 120px;
      }

      .event-shell {
        width: min(1180px, 100%);
        margin: 0 auto;
        display: grid;
        gap: 28px;
      }

      .brand {
        font-size: 25px;
        font-weight: 800;
        letter-spacing: -0.04em;
        color: var(--accent);
      }

      .brand-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        margin-bottom: 30px;
      }

      .eyebrow,
      .section-label {
        display: inline-flex;
        width: fit-content;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--gold);
      }

      .album-hero {
        display: grid;
        gap: 22px;
        padding: 22px;
        border: 1px solid var(--border);
        border-radius: 34px;
        background: rgba(255, 255, 255, 0.88);
        box-shadow: 0 28px 80px rgba(26, 22, 18, 0.1);
        overflow: hidden;
      }

      .album-hero-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .hero-badge {
        display: inline-flex;
        width: fit-content;
        padding: 8px 14px;
        margin-bottom: 18px;
        border-radius: 999px;
        background: var(--warm);
        border: 1px solid var(--border);
        color: var(--text-secondary);
        font-size: 13px;
        font-weight: 800;
      }

      .album-hero h1 {
        margin: 0;
        font-size: clamp(40px, 7vw, 72px);
        line-height: 1.02;
        letter-spacing: -0.06em;
        font-weight: 800;
        color: var(--accent);
      }

      .album-hero h1 span {
        display: block;
        background: linear-gradient(135deg, var(--gold) 0%, #a88a4a 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .hero-event-name {
        margin: 20px 0 0;
        font-size: 20px;
        font-weight: 800;
        color: var(--accent);
      }

      .hero-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 16px;
      }

      .hero-meta span {
        padding: 8px 12px;
        border-radius: 999px;
        background: var(--warm);
        border: 1px solid var(--border);
        color: var(--text-secondary);
        font-size: 13px;
        font-weight: 700;
      }

      .hero-description {
        max-width: 600px;
        margin: 20px 0 0;
        color: var(--text-secondary);
        font-size: 16px;
        line-height: 1.75;
      }

      .hero-actions,
      .button-row,
      .admin-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 28px;
      }

      .album-hero-visual {
        min-height: 280px;
        border-radius: 28px;
        overflow: hidden;
        background: var(--warm);
        border: 1px solid var(--border);
      }

      .album-hero-visual img {
        width: 100%;
        height: 100%;
        min-height: 280px;
        display: block;
        object-fit: cover;
      }

      .hero-placeholder {
        height: 100%;
        min-height: 280px;
        display: grid;
        place-items: center;
        text-align: center;
        padding: 32px;
        color: var(--text-secondary);
      }

      .hero-placeholder span {
        font-size: 42px;
      }

      .hero-placeholder strong {
        display: block;
        margin-top: 8px;
        color: var(--accent);
        font-size: 20px;
      }

      .hero-placeholder small {
        display: block;
        max-width: 300px;
        margin-top: 4px;
      }

      .primary-button,
      .secondary-button,
      .ghost-button,
      .small-link-button,
      .danger-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 52px;
        padding: 0 22px;
        border-radius: 999px;
        border: none;
        font-size: 15px;
        font-weight: 800;
        text-decoration: none;
        transition: all 0.22s ease;
      }

      .primary-button {
        background: var(--accent);
        color: #fff;
        box-shadow: 0 12px 34px rgba(26, 22, 18, 0.18);
      }

      .primary-button:hover {
        background: var(--accent-soft);
        transform: translateY(-2px);
      }

      .primary-button:disabled {
        opacity: 0.65;
        cursor: not-allowed;
        transform: none;
      }

      .primary-button.full {
        width: 100%;
      }

      .secondary-button,
      .ghost-button,
      .small-link-button {
        background: #fff;
        color: var(--accent);
        border: 1px solid var(--border);
      }

      .secondary-button:hover,
      .ghost-button:hover,
      .small-link-button:hover {
        background: var(--warm);
      }

      .secondary-button.disabled {
        opacity: 0.55;
      }

      .danger-button {
        min-height: 42px;
        background: #fee4e2;
        color: var(--danger);
      }

      .locked-card,
      .admin-card,
      .upload-card,
      .filter-card,
      .gallery-section,
      .setup-card {
        border: 1px solid var(--border);
        border-radius: 30px;
        background: rgba(255, 255, 255, 0.92);
        box-shadow: 0 20px 60px rgba(26, 22, 18, 0.07);
      }

      .locked-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
        padding: 26px;
        flex-wrap: wrap;
      }

      .locked-card h2,
      .upload-card h2,
      .gallery-section h2 {
        margin: 8px 0 0;
        font-size: clamp(26px, 4vw, 38px);
        line-height: 1.1;
        letter-spacing: -0.045em;
        color: var(--accent);
      }

      .locked-card p,
      .upload-card p,
      .gallery-section p,
      .section-help {
        margin: 10px 0 0;
        color: var(--text-secondary);
      }

      .setup-card {
        padding: 18px;
        background:
          radial-gradient(circle at top right, rgba(201, 167, 108, 0.12), transparent 34%),
          rgba(255,255,255,0.92);
      }

      .setup-hero {
        padding: 28px;
        border-radius: 26px;
        background: var(--surface);
        border: 1px solid var(--border);
      }

      .setup-hero h2 {
        margin: 14px 0 0;
        font-size: clamp(34px, 6vw, 56px);
        line-height: 1.05;
        letter-spacing: -0.06em;
        color: var(--accent);
      }

      .setup-hero h2 span {
        display: block;
        background: linear-gradient(135deg, var(--gold) 0%, #a88a4a 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .setup-hero p {
        max-width: 760px;
        margin: 18px 0 0;
        color: var(--text-secondary);
        font-size: 16px;
        line-height: 1.75;
      }

      .progress-row {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 24px;
      }

      .progress-row span {
        padding: 9px 12px;
        border-radius: 999px;
        background: var(--warm);
        border: 1px solid var(--border);
        color: var(--text-secondary);
        font-size: 13px;
        font-weight: 800;
      }

      .progress-row span.active {
        background: var(--accent);
        color: #fff;
      }

      .setup-layout {
        display: grid;
        gap: 20px;
        margin-top: 20px;
      }

      .setup-main {
        display: grid;
        gap: 18px;
      }

      .setup-section,
      .summary-card {
        padding: 22px;
        border-radius: 26px;
        background: var(--surface);
        border: 1px solid var(--border);
      }

      .snapkey-grid,
      .design-grid {
        display: grid;
        gap: 14px;
        margin-top: 16px;
      }

      .snapkey-card {
        padding: 0;
        text-align: left;
        background: #fff;
        border: 1px solid var(--border);
        border-radius: 24px;
        overflow: hidden;
        transition: all 0.25s ease;
      }

      .snapkey-card:hover,
      .snapkey-card.selected {
        transform: translateY(-3px);
        border-color: var(--accent);
        box-shadow: 0 18px 48px rgba(26, 22, 18, 0.1);
      }

      .snapkey-card.featured {
        box-shadow: 0 0 0 1px var(--gold-soft);
      }

      .snapkey-image {
        position: relative;
        aspect-ratio: 4 / 3;
        background: var(--warm);
        overflow: hidden;
      }

      .snapkey-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .snapkey-image span {
        position: absolute;
        top: 14px;
        left: 14px;
        padding: 7px 12px;
        border-radius: 999px;
        background: var(--gold);
        color: #fff;
        font-size: 12px;
        font-weight: 800;
      }

      .snapkey-body {
        padding: 18px;
      }

      .snapkey-title-row {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        align-items: flex-start;
      }

      .snapkey-title-row h3 {
        margin: 0;
        font-size: 20px;
        letter-spacing: -0.03em;
      }

      .snapkey-title-row strong {
        padding: 6px 10px;
        border-radius: 999px;
        background: var(--warm);
        font-size: 13px;
      }

      .snapkey-body p {
        margin: 10px 0 0;
        color: var(--text-secondary);
        font-size: 14px;
        line-height: 1.65;
      }

      .chip-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 14px;
      }

      .chip-row span {
        padding: 6px 10px;
        border-radius: 999px;
        background: var(--warm);
        color: var(--text-secondary);
        font-size: 12px;
        font-weight: 700;
      }

      .design-card {
        display: grid;
        gap: 6px;
        text-align: left;
        padding: 16px;
        border-radius: 20px;
        background: #fff;
        border: 1px solid var(--border);
        transition: all 0.22s ease;
      }

      .design-card span {
        width: 44px;
        height: 44px;
        display: grid;
        place-items: center;
        border-radius: 16px;
        background: var(--warm);
        font-size: 22px;
      }

      .design-card strong {
        color: var(--accent);
      }

      .design-card small {
        color: var(--text-secondary);
        line-height: 1.4;
      }

      .design-card.selected {
        border-color: var(--accent);
        box-shadow: 0 12px 34px rgba(26,22,18,0.08);
        transform: translateY(-2px);
      }

      .custom-design-box {
        display: grid;
        gap: 14px;
        margin-top: 16px;
        padding: 18px;
        border-radius: 22px;
        background: var(--warm);
        border: 1px solid var(--border);
      }

      .custom-design-upload {
        display: grid;
        gap: 8px;
      }

      .custom-design-upload p {
        margin: 0;
        color: var(--text-secondary);
        font-size: 13px;
      }

      .checkbox-row {
        display: flex;
        gap: 10px;
        align-items: flex-start;
        color: var(--text-secondary);
        font-size: 14px;
        line-height: 1.5;
      }

      .checkbox-row input {
        margin-top: 4px;
      }

      .quantity-row {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 16px;
      }

      .quantity-button {
        min-width: 112px;
        min-height: 58px;
        padding: 10px 16px;
        border-radius: 18px;
        border: 1px solid var(--border);
        background: #fff;
        color: var(--accent);
        font-weight: 800;
      }

      .quantity-button small {
        display: block;
        color: var(--gold);
        font-size: 11px;
        margin-top: 2px;
      }

      .quantity-button.active {
        background: var(--accent);
        color: #fff;
        border-color: var(--accent);
      }

      .input,
      .textarea,
      select {
        width: 100%;
        padding: 15px 16px;
        border-radius: 16px;
        border: 1px solid var(--border);
        background: #fff;
        color: var(--text);
        font-size: 15px;
        outline: none;
        transition: all 0.2s ease;
      }

      .textarea {
        resize: vertical;
        min-height: 96px;
      }

      .input:focus,
      .textarea:focus,
      select:focus {
        border-color: var(--gold);
        box-shadow: 0 0 0 4px rgba(201, 167, 108, 0.14);
      }

      .input-error {
        border-color: #dc2626;
        background: #fef2f2;
      }

      .error-text {
        color: #dc2626;
        font-size: 14px;
        font-weight: 700;
      }

      .form-grid {
        display: grid;
        gap: 12px;
        margin-top: 16px;
      }

      .form-grid.two {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .summary-card {
        position: sticky;
        top: 20px;
        align-self: start;
        display: grid;
        gap: 14px;
        box-shadow: 0 22px 70px rgba(26, 22, 18, 0.09);
      }

      .summary-title {
        font-size: 22px;
        font-weight: 800;
        letter-spacing: -0.03em;
      }

      .summary-line {
        display: flex;
        justify-content: space-between;
        gap: 14px;
        color: var(--text-secondary);
        font-size: 14px;
      }

      .summary-line strong {
        color: var(--accent);
      }

      .summary-divider {
        height: 1px;
        background: var(--border);
        margin: 4px 0;
      }

      .summary-total {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 14px;
      }

      .summary-total span {
        font-weight: 800;
      }

      .summary-total strong {
        font-size: 34px;
        letter-spacing: -0.05em;
        color: var(--accent);
      }

      .trust-box {
        display: grid;
        gap: 8px;
        padding: 16px;
        border-radius: 20px;
        background: var(--warm);
        border: 1px solid var(--border);
      }

      .trust-box div {
        font-size: 13px;
        color: var(--accent);
        font-weight: 700;
      }

      .storage-note {
        color: var(--text-muted);
        font-size: 12px;
        line-height: 1.55;
        text-align: center;
      }

      .admin-card,
      .upload-card,
      .filter-card,
      .gallery-section {
        padding: 24px;
      }

      .upload-card {
        display: grid;
        gap: 16px;
      }

      .upload-picker {
        display: grid;
        justify-items: center;
        gap: 10px;
        padding: 30px 18px;
        border: 1.5px dashed var(--border-hover);
        border-radius: 26px;
        background: var(--warm);
        text-align: center;
        cursor: pointer;
      }

      .upload-icon {
        width: 58px;
        height: 58px;
        display: grid;
        place-items: center;
        border-radius: 18px;
        background: var(--accent);
        color: #fff;
        font-size: 28px;
        font-weight: 800;
        box-shadow: 0 12px 28px rgba(26, 22, 18, 0.16);
      }

      .upload-picker span {
        color: var(--text-secondary);
        font-size: 14px;
      }

      .file-list {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }

      .file-chip {
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 100%;
        padding: 10px;
        border-radius: 16px;
        background: var(--warm);
        border: 1px solid var(--border);
      }

      .file-chip img {
        width: 52px;
        height: 52px;
        object-fit: cover;
        border-radius: 12px;
      }

      .file-chip div {
        display: grid;
        min-width: 0;
      }

      .file-chip strong {
        max-width: 180px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 13px;
      }

      .file-chip span {
        color: var(--text-muted);
        font-size: 12px;
      }

      .file-chip button {
        width: 30px;
        height: 30px;
        border-radius: 999px;
        border: none;
        background: var(--accent);
        color: #fff;
        font-weight: 800;
      }

      .filter-card p {
        margin: 10px 0 0;
        color: var(--text-secondary);
      }

      .gallery-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 18px;
        flex-wrap: wrap;
        margin-bottom: 26px;
      }

      .masonry-grid {
        column-count: 1;
        column-gap: 16px;
      }

      .photo-item {
        display: inline-block;
        width: 100%;
        margin: 0 0 16px;
        position: relative;
        break-inside: avoid;
        border-radius: 24px;
        overflow: hidden;
        background: #fff;
        border: 1px solid var(--border);
        box-shadow: 0 8px 22px rgba(26, 22, 18, 0.05);
      }

      .photo-item.selected {
        box-shadow: 0 0 0 3px var(--gold), 0 12px 32px rgba(26, 22, 18, 0.08);
      }

      .photo-item > img {
        width: 100%;
        display: block;
        cursor: zoom-in;
      }

      .photo-overlay-actions {
        position: absolute;
        top: 12px;
        left: 12px;
        right: 12px;
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        opacity: 0;
        transform: translateY(6px);
        transition: all 0.2s ease;
      }

      .photo-item:hover .photo-overlay-actions {
        opacity: 1;
        transform: translateY(0);
      }

      .photo-overlay-actions button {
        min-height: 34px;
        padding: 0 10px;
        border-radius: 999px;
        border: none;
        background: rgba(255,255,255,0.92);
        color: var(--accent);
        font-size: 12px;
        font-weight: 800;
        box-shadow: 0 8px 22px rgba(26,22,18,0.12);
      }

      .photo-info {
        display: grid;
        gap: 10px;
        padding: 14px;
      }

      .photo-info p {
        margin: 0;
        color: var(--text-secondary);
        font-size: 14px;
      }

      .like-button {
        width: fit-content;
        border: none;
        border-radius: 999px;
        padding: 8px 12px;
        background: var(--warm);
        color: var(--text-secondary);
        font-weight: 800;
      }

      .like-button.active {
        background: #fee4e2;
        color: var(--danger);
      }

      details summary {
        cursor: pointer;
        color: var(--text-secondary);
        font-size: 13px;
        font-weight: 800;
      }

      .comment-list,
      .comment-form {
        display: grid;
        gap: 10px;
        margin-top: 10px;
      }

      .comment-item {
        padding: 10px;
        border-radius: 14px;
        background: var(--warm);
      }

      .comment-item strong {
        font-size: 13px;
      }

      .comment-item p {
        margin: 4px 0;
        font-size: 13px;
      }

      .comment-item small {
        color: var(--text-muted);
      }

      .center-card {
        max-width: 520px;
        margin: 80px auto;
        padding: 26px;
        border-radius: 24px;
        background: #fff;
        border: 1px solid var(--border);
        text-align: center;
        color: var(--text-secondary);
        box-shadow: 0 20px 60px rgba(26,22,18,0.08);
      }

      .login-shell {
        min-height: 100vh;
        display: grid;
        place-items: center;
      }

      .login-card {
        width: min(100%, 440px);
        padding: 30px;
        border-radius: 32px;
        background: rgba(255,255,255,0.94);
        border: 1px solid var(--border);
        box-shadow: 0 30px 90px rgba(26,22,18,0.12);
        display: grid;
        gap: 14px;
      }

      .login-card h1 {
        margin: 0;
        font-size: 34px;
        line-height: 1.08;
        letter-spacing: -0.05em;
      }

      .login-card p {
        margin: 0;
        color: var(--text-secondary);
      }

      .cart-backdrop {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        background: rgba(26, 22, 18, 0.5);
        padding: 0;
      }

      .cart-panel {
        width: min(100%, 980px);
        height: min(90vh, 920px);
        overflow: auto;
        background: #fff;
        border-radius: 32px 32px 0 0;
        padding: 14px 18px 24px;
        box-shadow: 0 -20px 70px rgba(26,22,18,0.22);
      }

      .cart-handle {
        width: 46px;
        height: 5px;
        margin: 0 auto 14px;
        border-radius: 999px;
        background: var(--border-hover);
      }

      .cart-header {
        position: sticky;
        top: 0;
        z-index: 2;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        padding-bottom: 14px;
        background: rgba(255,255,255,0.96);
        backdrop-filter: blur(12px);
      }

      .cart-header h3 {
        margin: 0;
        font-size: 24px;
        letter-spacing: -0.04em;
      }

      .cart-header button,
      .lightbox-close {
        width: 42px;
        height: 42px;
        border-radius: 999px;
        border: none;
        background: var(--accent);
        color: #fff;
        font-weight: 800;
      }

      .cart-grid {
        display: grid;
        gap: 16px;
      }

      .cart-photo-card {
        display: grid;
        gap: 14px;
        padding: 14px;
        border: 1px solid var(--border);
        border-radius: 24px;
        background: var(--surface);
      }

      .cart-photo-card img {
        width: 100%;
        height: 220px;
        object-fit: cover;
        border-radius: 18px;
      }

      .cart-photo-card > div {
        display: grid;
        gap: 10px;
      }

      .cart-photo-card label {
        font-size: 13px;
        font-weight: 800;
        color: var(--accent);
      }

      .cart-item-price {
        font-size: 18px;
        font-weight: 800;
        color: var(--accent);
      }

      .cart-order-card {
        display: grid;
        gap: 14px;
        margin-top: 18px;
        padding: 18px;
        border-radius: 24px;
        background: var(--warm);
        border: 1px solid var(--border);
      }

      .cart-order-card h4 {
        margin: 0;
        font-size: 22px;
      }

      .cart-order-card p {
        margin: 0;
        color: var(--text-secondary);
      }

      .cart-footer {
        position: sticky;
        bottom: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 14px;
        flex-wrap: wrap;
        margin-top: 20px;
        padding-top: 16px;
        background: rgba(255,255,255,0.96);
        border-top: 1px solid var(--border);
        backdrop-filter: blur(12px);
      }

      .cart-footer div {
        display: grid;
      }

      .cart-footer small {
        color: var(--text-secondary);
        font-weight: 700;
      }

      .cart-footer strong {
        font-size: 30px;
        color: var(--accent);
      }

      .lightbox-backdrop {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: grid;
        place-items: center;
        padding: 18px;
        background: rgba(2, 6, 23, 0.92);
      }

      .lightbox-content {
        position: relative;
        max-width: 1100px;
        width: 100%;
        max-height: 92vh;
        display: grid;
        place-items: center;
      }

      .lightbox-content img {
        max-width: 100%;
        max-height: 78vh;
        object-fit: contain;
        border-radius: 18px;
      }

      .lightbox-close {
        position: absolute;
        top: -10px;
        right: 0;
        z-index: 3;
        background: rgba(255,255,255,0.16);
      }

      .lightbox-nav {
        position: absolute;
        top: 50%;
        z-index: 3;
        transform: translateY(-50%);
        width: 52px;
        height: 52px;
        border-radius: 999px;
        border: none;
        background: rgba(255,255,255,0.16);
        color: #fff;
        font-size: 36px;
      }

      .lightbox-nav.left {
        left: 14px;
      }

      .lightbox-nav.right {
        right: 14px;
      }

      .lightbox-footer {
        margin-top: 12px;
        color: #fff;
        text-align: center;
      }

      .lightbox-footer p {
        margin: 4px 0 0;
      }
/* Mobile Premium Fixes */

.ghost-button {
  min-height: 42px;
  width: auto;
  min-width: 128px;
  padding: 0 18px;
  font-size: 14px;
  box-shadow: none;
}

.quantity-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 16px;
}

.quantity-button {
  width: 100%;
  min-height: 88px;
  padding: 14px 12px;
  border-radius: 22px;
  border: 1px solid var(--border);
  background: #fff;
  color: var(--accent);
  font-size: 18px;
  font-weight: 800;
  display: grid;
  place-items: center;
  gap: 3px;
}

.quantity-button small {
  display: block;
  color: var(--gold);
  font-size: 12px;
  font-weight: 800;
  margin-top: 2px;
}

.quantity-button.active {
  background: #fff;
  color: var(--accent);
  border: 2px solid var(--gold);
  box-shadow: 0 12px 28px rgba(201, 167, 108, 0.16);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  margin-top: 18px;
}

.input,
.textarea,
select {
  width: 100%;
  min-height: 64px;
  padding: 0 18px;
  border-radius: 18px;
  border: 1px solid var(--border);
  background: #fff;
  color: var(--text);
  font-size: 15px;
  outline: none;
  transition: all 0.2s ease;
}

.textarea {
  resize: vertical;
  min-height: 150px;
  padding-top: 18px;
  padding-bottom: 18px;
}

.summary-card {
  margin-top: 8px;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  color: var(--text-secondary);
  font-size: 15px;
  padding: 4px 0;
}
      @media (min-width: 680px) {
        .masonry-grid {
          column-count: 2;
        }

        .snapkey-grid,
        .design-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .form-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .cart-photo-card {
          grid-template-columns: 240px 1fr;
        }

        .cart-photo-card img {
          height: 100%;
          min-height: 240px;
        }
      }

      @media (min-width: 920px) {
        .event-page {
          padding: 32px 28px 140px;
        }

        .album-hero {
          grid-template-columns: minmax(0, 1fr) minmax(380px, 0.9fr);
          padding: 32px;
        }

        .album-hero-visual,
        .album-hero-visual img,
        .hero-placeholder {
          min-height: 520px;
        }

        .setup-layout {
          grid-template-columns: minmax(0, 1fr) 360px;
        }

        .snapkey-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .design-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .masonry-grid {
          column-count: 3;
        }
      }

      @media (min-width: 1180px) {
        .masonry-grid {
          column-count: 4;
        }
      }

      @media (max-width: 520px) {
        .event-page {
          padding: 16px 12px 120px;
        }

        .album-hero,
        .setup-card,
        .upload-card,
        .gallery-section,
        .locked-card,
        .admin-card,
        .filter-card {
          border-radius: 24px;
        }

        .album-hero {
          padding: 18px;
        }

        .brand-row {
          margin-bottom: 22px;
        }

.primary-button,
.secondary-button,
.small-link-button {
  width: 100%;
}

.ghost-button {
  width: auto;
  min-width: 128px;
}

        .gallery-header {
          display: grid;
        }

        .photo-overlay-actions {
          opacity: 1;
          transform: none;
        }

        .summary-total strong {
          font-size: 28px;
        }

        .cart-panel {
          border-radius: 26px 26px 0 0;
        }
      }
      /* Abstand-Fix für Menge und Formular */

.quantity-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
  margin-top: 22px;
}

.quantity-button {
  box-sizing: border-box;
  min-height: 92px;
}

.quantity-button.active {
  border: 2px solid var(--gold);
  outline: 6px solid #ffffff;
  box-shadow: 0 14px 34px rgba(201, 167, 108, 0.18);
}

.custom-quantity-input {
  margin-top: 22px;
}

.form-grid {
  gap: 22px;
}

.input,
.textarea,
select {
  margin: 0;
}

.textarea {
  margin-top: 22px;
}
    `}</style>
  );
}
