export default function Page() {
  return (
    <div className="min-h-screen bg-stone-50 text-zinc-900">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.12),transparent_35%),radial-gradient(circle_at_left,rgba(16,185,129,0.10),transparent_30%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex rounded-full border border-zinc-200 bg-white/80 px-4 py-2 text-sm shadow-sm backdrop-blur">
                SnapKey • Erinnerungen mit einem Tap teilen
              </div>

              <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
                Alle Fotos deines Events.{" "}
                <span className="text-blue-600">Einfach an einem Ort.</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600">
                Mit SnapKey laden deine Gäste ihre Bilder direkt hoch. Keine
                WhatsApp-Gruppen, kein Chaos, keine verlorenen Erinnerungen.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="mailto:karim.shaker@outlook.de?subject=SnapKey%20Event%20anfragen&body=Name:%0D%0ATelefonnummer:%0D%0AEventdatum:%0D%0AEventart:%0D%0AAnzahl%20Personen:%0D%0AOrt:%0D%0ABesondere%20Wuensche:"
                  className="rounded-2xl bg-zinc-900 px-6 py-4 text-base font-medium text-white shadow-lg shadow-zinc-900/10 transition hover:-translate-y-0.5 inline-block text-center"
                >
                  Event anfragen
                </a>

                <a
                  href="https://www.youtube.com/shorts/4_KiFcRlExM"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-zinc-300 bg-white px-6 py-4 text-base font-medium text-zinc-900 transition hover:bg-zinc-50 inline-block text-center"
                >
                  Demo ansehen
                </a>
              </div>

              <div className="mt-6 flex flex-wrap gap-4 text-sm text-zinc-500">
                <span>Keine App nötig</span>
                <span>Private Galerie</span>
                <span>Upload in Sekunden</span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-6 top-10 hidden rounded-2xl bg-white px-4 py-3 shadow-xl md:block">
                <p className="text-sm font-medium">NFC-Key</p>
                <p className="text-sm text-zinc-500">Tippen. Öffnen. Teilen.</p>
              </div>

              <div className="mx-auto max-w-sm rounded-[2rem] border border-zinc-200 bg-white p-4 shadow-2xl shadow-zinc-300/30">
                <div className="overflow-hidden rounded-[1.5rem] bg-zinc-100">
                  <div className="aspect-[4/5] bg-[url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center" />
                  <div className="space-y-4 p-5">
                    <div>
                      <p className="text-2xl font-semibold">
                        Karim&apos;s Geburtstag 🎉
                      </p>
                      <p className="mt-1 text-sm text-zinc-500">
                        15. April 2026
                      </p>
                    </div>

                    <p className="text-sm leading-6 text-zinc-600">
                      Schön, dass du dabei bist. Lade hier deine Fotos hoch und
                      schau dir die gemeinsamen Erinnerungen an.
                    </p>

                    <div className="space-y-3">
                      <button className="w-full rounded-2xl bg-blue-600 px-4 py-3.5 text-sm font-medium text-white shadow-lg shadow-blue-600/20">
                        Fotos hochladen
                      </button>
                      <button className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3.5 text-sm font-medium text-zinc-900">
                        Galerie ansehen
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 bottom-10 hidden rounded-2xl bg-white px-4 py-3 shadow-xl md:block">
                <p className="text-sm font-medium">Für Familien & Events</p>
                <p className="text-sm text-zinc-500">
                  Geburtstag, Hochzeit, Urlaub
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-6 md:px-10 md:py-10">
        <div className="grid gap-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm md:grid-cols-3">
          <div className="rounded-2xl bg-zinc-50 p-5">
            <p className="text-sm font-medium text-blue-600">1. Tippen</p>
            <h3 className="mt-2 text-lg font-semibold">
              SnapKey ans Handy halten
            </h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Die private Event-Seite öffnet sich direkt im Browser.
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-50 p-5">
            <p className="text-sm font-medium text-blue-600">2. Hochladen</p>
            <h3 className="mt-2 text-lg font-semibold">
              Bilder von allen sammeln
            </h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Jeder Gast kann eigene Fotos in wenigen Sekunden hinzufügen.
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-50 p-5">
            <p className="text-sm font-medium text-blue-600">3. Erinnern</p>
            <h3 className="mt-2 text-lg font-semibold">
              Gemeinsam ansehen & behalten
            </h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Alle Erinnerungen bleiben gesammelt an einem Ort statt im
              Gruppenchat zu verschwinden.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 md:px-10 md:py-20">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">
              Warum SnapKey
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Besser als Fotos im Gruppenchat.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-8 text-zinc-600">
              Fotos gehen nicht verloren, niemand muss Dateien zusammensuchen
              und auch Familienmitglieder, die nicht dabei waren, können alles
              direkt ansehen.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                "Alle Bilder an einem Ort",
                "Ohne App nutzbar",
                "Privater Zugang für Familie & Freunde",
                "Später als Collage oder Print bestellbar",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
                >
                  <p className="text-sm font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">
              Starter-Paket
            </p>
            <h3 className="mt-3 text-3xl font-semibold">Event Memory Key</h3>
            <p className="mt-3 text-zinc-600">
              Ideal für Geburtstage, Hochzeiten, Familienfeiern und Reisen.
            </p>

            <div className="mt-8 rounded-2xl bg-zinc-50 p-5">
              <p className="text-4xl font-semibold">29 €</p>
              <p className="mt-2 text-sm text-zinc-500">
                inkl. NFC-Key, privater Event-Seite und Galerie für 30 Tage
              </p>
            </div>

            <ul className="mt-6 space-y-3 text-sm text-zinc-700">
              <li>• 1 SnapKey für dein Event</li>
              <li>• private Galerie mit Upload-Funktion</li>
              <li>• Zugriff für Familie und Freunde</li>
              <li>• optional verlängerbar</li>
            </ul>

            <button className="mt-8 w-full rounded-2xl bg-zinc-900 px-6 py-4 text-base font-medium text-white shadow-lg shadow-zinc-900/10">
              Jetzt testen
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16 md:px-10 md:pb-24">
        <div className="rounded-[2rem] bg-zinc-900 px-6 py-10 text-white md:px-10 md:py-14">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-300">
                Für besondere Momente
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                Die besten Fotos entstehen auf vielen Handys. SnapKey bringt sie
                zusammen.
              </h2>
            </div>

            <div className="md:text-right">
              <button className="rounded-2xl bg-white px-6 py-4 text-base font-medium text-zinc-900 shadow-lg">
                Erste Demo erstellen
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center text-sm text-zinc-500">
          <a href="/impressum" className="mr-4 underline">
            Impressum
          </a>
          <a href="/datenschutz" className="underline">
            Datenschutz
          </a>
        </div>
      </section>
    </div>
  );
}
