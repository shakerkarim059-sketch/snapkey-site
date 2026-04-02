"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function EventPage() {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("photos")
      .upload(fileName, file);

    setUploading(false);

    if (error) {
      console.error(error);
      alert("Fehler beim Upload");
    } else {
      alert("Upload erfolgreich!");
    }
  };

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
          <p className="mt-2 text-zinc-600">
            Hier werden im nächsten Schritt alle hochgeladenen Bilder angezeigt.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
            <div className="aspect-square rounded-2xl bg-zinc-100" />
            <div className="aspect-square rounded-2xl bg-zinc-100" />
            <div className="aspect-square rounded-2xl bg-zinc-100" />
          </div>
        </div>
      </div>
    </div>
  );
}
