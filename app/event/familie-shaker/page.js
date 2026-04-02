"use client";
import { useState } from "react";

export default function EventPage() {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const fileName = `${Date.now()}-${file.name}`;

    const res = await fetch(
      "https://vbzecunsigkxeupyntyb.supabase.co/storage/v1/object/photos/" +
        fileName,
      {
        method: "POST",
        headers: {
          Authorization:
            "Bearer sb_publishable_JW8-6w5S05WboeDhl_nr_A_ndzS6...",
        },
        body: file,
      }
    );

    setUploading(false);

    if (res.ok) {
      alert("Upload erfolgreich!");
    } else {
      alert("Fehler beim Upload");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold">Familie Shaker 📸</h1>

        <p className="mt-4 text-zinc-600">
          Lade Fotos hoch und teile Erinnerungen mit deiner Familie.
        </p>

        <div className="mt-8">
          <label className="rounded-2xl bg-black text-white px-6 py-4 cursor-pointer inline-block">
            {uploading ? "Wird hochgeladen..." : "Fotos hochladen"}
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
