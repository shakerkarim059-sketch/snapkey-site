"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function EventPage() {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [imageError, setImageError] = useState("");

  const loadImages = async () => {
    setLoadingImages(true);
    setImageError("");

    try {
      const { data, error } = await supabase.storage.from("photos").list("", {
        limit: 100,
        sortBy: { column: "created_at", order: "desc" },
      });

      if (error) {
        throw error;
      }

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

      if (error) {
        throw error;
      }

      alert("Upload erfolgreich!");
      loadImages();
    } catch (error) {
      console.error("Fehler beim Upload:", error);
      alert("Fehler beim Upload");
    } finally {
      setUploading(false);
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
    loadImages();
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

        <div className="mt-8">
          <label className="inline-block cursor-pointer rounded-2xl bg-zinc-900 px-6 py-4 text-base font-medium text-white shadow-lg shadow-zinc-900/10">
            {uploading ? "Wird hochgeladen..." : "Fotos hochladen"}
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
          </label>
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
                <img
                  key={img.name}
                  src={img.url}
                  alt=""
                  loading="lazy"
                  onClick={() => setSelectedImageIndex(index)}
                  className="aspect-square cursor-pointer rounded-2xl object-cover transition hover:scale-105"
                />
              ))}
            </div>
          )}
        </div>

        {selectedImageIndex !== null && images[selectedImageIndex] && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute right-6 top-6 z-50 text-4xl font-bold text-white"
            >
              ×
            </button>

            <button
              onClick={showPrevImage}
              className="absolute left-4 z-50 hidden text-4xl font-bold text-white md:block"
            >
              ‹
            </button>

            <div
              className="flex h-full w-full items-center justify-center"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={images[selectedImageIndex].url}
                alt=""
                className="max-h-[90%] max-w-[90%] rounded-xl"
              />
            </div>

            <button
              onClick={showNextImage}
              className="absolute right-4 z-50 hidden text-4xl font-bold text-white md:block"
            >
              ›
            </button>
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
