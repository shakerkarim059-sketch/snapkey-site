"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

const VIEW_PASSWORD = "familie2026"; // Passwort zum Ansehen + Hochladen
const ADMIN_PASSWORD = "admin2026"; // Passwort nur für Admin/Löschen

export default function EventPage() {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [imageError, setImageError] = useState("");

  const [hasAccess, setHasAccess] = useState(false);
  const [viewPasswordInput, setViewPasswordInput] = useState("");

  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");

  const loadImages = async () => {
    setLoadingImages(true);
    setImageError("");

    try {
      const { data, error } = await supabase.storage.from("photos").list("", {
        limit: 100,
        sortBy: { column: "created_at", order: "desc" },
      });

      if (error) throw error;

      if (!data) {
        setImages([]);
        return;
      }

      const validFiles = data.filter((file) => {
        if (!file?.name) return false;

        const lower = file.name.toLowerCase();
        return (
          lower.endsWith(".jpg") ||
          lower.endsWith(".jpeg") ||
          lower.endsWith(".png") ||
          lower.endsWith(".webp") ||
          lower.endsWith(".gif")
        );
      });

      const imageUrls = validFiles.map((file) => {
        const { data: publicUrlData } = supabase.storage
          .from("photos")
          .getPublicUrl(file.name);

        return {
          name: file.name,
          url: publicUrlData.publicUrl,
        };
      });

      setImages(imageUrls);
    } catch (error) {
      console.error("Fehler beim Laden der Bilder:", error);
      setImageError("Bilder konnten nicht geladen werden.");
      setImages([]);
    } finally {
      setLoadingImages(false);
    }
  };

  const handleViewLogin = async () => {
    if (viewPasswordInput === VIEW_PASSWORD) {
      setHasAccess(true);
      sessionStorage.setItem("eventViewAccess", "true");
      setViewPasswordInput("");
      await loadImages();
    } else {
      alert("Falsches Passwort");
    }
  };

  const handleLogout = () => {
    setHasAccess(false);
    setAdminMode(false);
    setShowAdminLogin(false);
    sessionStorage.removeItem("eventViewAccess");
    sessionStorage.removeItem("eventAdminAccess");
    setSelectedImageIndex(null);
  };

  const handleAdminLogin = () => {
    if (adminPasswordInput === ADMIN_PASSWORD) {
      setAdminMode(true);
      sessionStorage.setItem("eventAdminAccess", "true");
      setAdminPasswordInput("");
      setShowAdminLogin(false);
    } else {
      alert("Falsches Admin-Passwort");
    }
  };

  const handleAdminLogout = () => {
    setAdminMode(false);
    sessionStorage.removeItem("eventAdminAccess");
    setShowAdminLogin(false);
  };

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const fileName = `${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("photos")
        .upload(fileName, file);

      if (error) throw error;

      alert("Upload erfolgreich!");
      await loadImages();
    } catch (error) {
      console.error("Fehler beim Upload:", error);
      alert("Fehler beim Upload");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleDelete = async (fileName) => {
    if (!adminMode) return;

    const confirmed = window.confirm("Willst du dieses Bild wirklich löschen?");
    if (!confirmed) return;

    setDeleting(true);

    try {
      const { error } = await supabase.storage.from("photos").remove([fileName]);

      if (error) throw error;

      alert("Bild gelöscht.");

      if (
        selectedImageIndex !== null &&
        images[selectedImageIndex] &&
        images[selectedImageIndex].name === fileName
      ) {
        setSelectedImageIndex(null);
      }

      await loadImages();
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
      alert("Fehler beim Löschen");
    } finally {
      setDeleting(false);
    }
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  const showPrevImage = (e) => {
    if (e) e.stopPropagation();
    setSelectedImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const showNextImage = (e) => {
    if (e) e.stopPropagation();
    setSelectedImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
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
    const savedViewAccess = sessionStorage.getItem("eventViewAccess");
    const savedAdminAccess = sessionStorage.getItem("eventAdminAccess");

    if (savedViewAccess === "true") {
      setHasAccess(true);
      loadImages();
    }

    if (savedAdminAccess === "true") {
      setAdminMode(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 inline-flex rounded-full border border-zinc-200 bg-white/80 px-4 py-2 text-sm shadow-sm backdrop-blur">
          SnapKey • Familien Erinnerungen
        </div>

        <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
          Familie Shaker 📸
        </h1>

        <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-600">
          Alle Erinnerungen an einem Ort. Lade Fotos hoch und schaut euch gemeinsam
          die schönsten Momente an.
        </p>

        {!hasAccess ? (
          <div className="mt-10 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Geschützter Bereich</h2>
            <p className="mt-3 text-zinc-600">
              Bitte Passwort eingeben, um Fotos anzusehen und hochzuladen.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <input
                type="password"
                placeholder="Passwort"
                value={viewPasswordInput}
                onChange={(e) => setViewPasswordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleViewLogin();
                }}
                className="w-full rounded-2xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500"
              />
              <button
                onClick={handleViewLogin}
                className="rounded-2xl bg-zinc-900 px-5 py-3 font-medium text-white"
              >
                Öffnen
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <label className="inline-block cursor-pointer rounded-2xl bg-zinc-900 px-6 py-4 text-base font-medium text-white shadow-lg shadow-zinc-900/10">
                {uploading ? "Wird hochgeladen..." : "Fotos hochladen"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>

              <button
                onClick={handleLogout}
                className="rounded-2xl border border-zinc-300 px-5 py-4 font-medium text-zinc-700"
              >
                Abmelden
              </button>
            </div>

            <div className="mt-4 flex items-center justify-end">
              {!adminMode ? (
                <button
                  onClick={() => setShowAdminLogin((prev) => !prev)}
                  className="text-sm text-zinc-400 underline underline-offset-4"
                >
                  Admin-Zugang
                </button>
              ) : (
                <button
                  onClick={handleAdminLogout}
                  className="text-sm text-red-600 underline underline-offset-4"
                >
                  Admin-Modus beenden
                </button>
              )}
            </div>

            {showAdminLogin && !adminMode && (
              <div className="mt-4 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
                <h3 className="text-base font-semibold">Admin-Zugang</h3>
                <p className="mt-2 text-sm text-zinc-600">
                  Nur hierüber werden Löschrechte freigeschaltet.
                </p>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <input
                    type="password"
                    placeholder="Admin-Passwort"
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAdminLogin();
                    }}
                    className="w-full rounded-2xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500"
                  />
                  <button
                    onClick={handleAdminLogin}
                    className="rounded-2xl bg-zinc-900 px-5 py-3 font-medium text-white"
                  >
                    Freischalten
                  </button>
                </div>
              </div>
            )}

            <div className="mt-12 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Galerie</h2>

              {loadingImages ? (
                <p className="mt-4 text-zinc-600">Lade Bilder...</p>
              ) : imageError ? (
                <p className="mt-4 text-red-600">{imageError}</p>
              ) : images.length === 0 ? (
                <p className="mt-4 text-zinc-600">Noch keine Bilder vorhanden.</p>
              ) : (
                <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
                  {images.map((img, index) => (
                    <div key={img.name} className="relative">
                      <img
                        src={img.url}
                        alt=""
                        loading="lazy"
                        onClick={() => setSelectedImageIndex(index)}
                        className="aspect-square w-full cursor-pointer rounded-2xl object-cover transition hover:scale-[1.02]"
                      />

                      {adminMode && (
                        <button
                          onClick={() => handleDelete(img.name)}
                          disabled={deleting}
                          className="absolute right-2 top-2 rounded-full bg-red-600/90 px-3 py-1 text-sm font-medium text-white shadow"
                        >
                          Löschen
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {hasAccess && selectedImageIndex !== null && images[selectedImageIndex] && (
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
                src={images[selectedImageIndex].url}
                alt=""
                className="max-h-[95%] max-w-[95%] rounded-xl"
              />

              <button
                onClick={closeLightbox}
                className="absolute right-4 top-4 rounded-full bg-black/40 px-3 py-1 text-2xl text-white"
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

              {adminMode && (
                <button
                  onClick={() => handleDelete(images[selectedImageIndex].name)}
                  disabled={deleting}
                  className="absolute bottom-4 rounded-full bg-red-600/90 px-5 py-2 text-sm font-medium text-white"
                >
                  Bild löschen
                </button>
              )}
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
