export default function Page() {
  return (
    <div className="min-h-screen bg-stone-50 px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
          Alle Fotos deines Events.{" "}
          <span className="text-blue-600">Einfach an einem Ort.</span>
        </h1>

        <p className="mt-6 max-w-xl text-lg text-zinc-600">
          Mit SnapKey laden deine Gäste ihre Bilder direkt hoch. Keine WhatsApp-Gruppen,
          kein Chaos.
        </p>

        <div className="mt-8 flex gap-4">
          <a
            href="mailto:karim.shaker@outlook.de?subject=SnapKey%20Event%20anfragen"
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

        <div className="mt-12 flex h-64 items-center justify-center rounded-2xl bg-zinc-200">
          Demo Video
        </div>

        <div className="mt-20 text-center text-sm text-zinc-500">
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
