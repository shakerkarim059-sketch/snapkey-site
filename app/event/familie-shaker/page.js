export default function EventPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center px-6 py-12">
      
      <h1 className="text-3xl font-semibold mb-2">
        Familien Erinnerungen 📸
      </h1>

      <p className="text-zinc-600 mb-8 text-center max-w-md">
        Teile deine schönsten Momente mit der Familie. Lade Fotos hoch und schau dir alle Erinnerungen an einem Ort an.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        
        <button className="bg-black text-white py-3 rounded-xl">
          Fotos hochladen
        </button>

        <button className="border py-3 rounded-xl">
          Galerie ansehen
        </button>

      </div>

    </div>
  );
}
