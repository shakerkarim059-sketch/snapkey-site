export default function EventPage() {
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
          Alle Erinnerungen an einem Ort. Lade Fotos hoch und schaut euch gemeinsam die schönsten Momente an.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button className="rounded-2xl bg-zinc-900 px-6 py-4 text-base font-medium text-white shadow-lg shadow-zinc-900/10">
            Fotos hochladen
          </button>

          <button className="rounded-2xl border border-zinc-300 bg-white px-6 py-4 text-base font-medium text-zinc-900">
            Galerie ansehen
          </button>
        </div>

        <div className="mt-12 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Galerie</h2>
          <p className="mt-2 text-zinc-600">
            Hier werden später alle Familienfotos angezeigt.
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
