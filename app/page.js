export default function Page() {
  return (
    <div className="min-h-screen bg-stone-50 px-6 py-16">
      <div className="mx-auto max-w-4xl">

        <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
          Alle Fotos deines Events.{" "}
          <span className="text-blue-600">Einfach an einem Ort.</span>
        </h1>

        <p className="mt-6 text-lg text-zinc-600 max-w-xl">
          Mit SnapKey laden deine Gäste ihre Bilder direkt hoch. Keine WhatsApp-Gruppen, kein Chaos.
        </p>

        <div className="mt-8 flex gap-4">
          <a
            href="mailto:karim.shaker@outlook.de"
            className="rounded-2xl bg-black px-6 py-4 text-white"
          >
            Event anfragen
          </a>

          <a
            href="#"
            className="rounded-2xl border px-6 py-4"
          >
            Demo ansehen
          </a>
        </div>

        <div className="mt-12 bg-zinc-200 h-64 rounded-2xl flex items-center justify-center">
          Demo Video
        </div>

        {/* 🔥 FOOTER – JETZT SICHER SICHTBAR */}
        <div className="mt-20 text-sm text-zinc-500 text-center">
          <a href="/impressum" className="underline mr-4">Impressum</a>
          <a href="/datenschutz" className="underline">Datenschutz</a>
        </div>

      </div>
    </div>
  );
}
