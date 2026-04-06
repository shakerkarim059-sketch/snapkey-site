"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

const ADMIN_PASSWORD = "FAMILIE1234"; // <-- HIER DEIN PASSWORT ÄNDERN

export default function EventPage() {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [imageError, setImageError] = useState("");

  const [adminMode, setAdminMode] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

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

  const handleLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setAdminMode(true);
      sessionStorage.setItem("eventAdminMode", "true");
      setPasswordInput("");
    } else {
      alert("Falsches Passwort");
    }
  };

  const handleLogout = () => {
    setAdminMode(false);
    sessionStorage.removeItem("eventAdminMode");
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
    loadImages();

    const savedAdminMode = sessionStorage.getItem("eventAdminMode");
    if (savedAdminMode === "true") {
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

        <div className="mt-8 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Bearbeiten</h2>

          {!adminMode ? (
            <div className="mt-4">
              <p className="mb-3 text-sm text-zinc-600">
                Upload und Löschen sind geschützt.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="password"
                  placeholder="Passwort eingeben"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500"
                />
                <button
                  onClick={handleLogin}
                  className="rounded-2xl bg-zinc-900 px-5 py-3 font-medium text-white"
                >
                  Freischalten
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <div className="mb-4 flex flex-wrap items-center gap-3">
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
                  Sperren
                </button>
              </div>

              <p className="text-sm text-zinc-600">
                Admin-Modus aktiv. Du kannst jetzt Bilder hochladen und löschen.
              </p>
            </div>
          )}
        </div>

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

        {selectedImageIndex !== null && images[selectedImageIndex] && (
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
