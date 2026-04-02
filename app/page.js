export default function SnapKeyLandingPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-zinc-900">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.12),transparent_35%),radial-gradient(circle_at_left,rgba(16,185,129,0.10),transparent_30%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex rounded-full border border-[#e4e4e7] bg-white/70 px-4 py-2 text-sm shadow-sm backdrop-blur">
                SnapKey • Erinnerungen gemeinsam erleben
              </div>
              <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
                Alle Erinnerungen an einem Ort. <span className="text-[#2563eb]">Einfach mit einem Tap.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600">
                Mit SnapKey sammeln Familie und Freunde alle Fotos eines besonderen Moments an einem Ort – einfach, privat und ohne Technikstress.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
<a
  href="mailto:karim.shaker@outlook.de?subject=SnapKey%20Event%20anfragen&body=Name:%0D%0ATelefonnummer:%0D%0AEventdatum:%0D%0AEventart:%0D%0AAnzahl%20Personen:%0D%0AOrt:%0D%0ABesondere%20Wuensche:"
  className="rounded-2xl bg-[#18181b] px-6 py-4 text-base font-medium text-white shadow-lg transition hover:-translate-y-0.5 inline-block text-center"
>
  Event starten
</a>
         <a
  href="https://www.youtube.com/shorts/4_KiFcRlExM"
  target="_blank"
  rel="noreferrer"
  className="rounded-2xl border border-[#d4d4d8] bg-white px-6 py-4 text-base font-medium text-zinc-900 transition hover:bg-[#f4f4f5] inline-block text-center"
>
  Demo ansehen
</a>
              </div>
            </div>

            <div className="mx-auto max-w-sm rounded-[2rem] border border-[#e4e4e7] bg-white p-4 shadow-xl">
              <div className="overflow-hidden rounded-[1.5rem] bg-[#f4f4f5]">
                <div className="aspect-[4/5] bg-[url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center" />
                <div className="space-y-4 p-5">
                  <div>
                    <p className="text-2xl font-semibold">Karim&apos;s Geburtstag </p>
                    <p className="mt-1 text-sm text-zinc-500">15. April 2026</p>
                  </div>
                  <p className="text-sm leading-6 text-zinc-600">
                    Schön, dass du dabei bist. Lade hier deine Fotos hoch und erlebe die Erinnerungen gemeinsam mit allen.
                  </p>
                  <div className="space-y-3">
                    <button className="w-full rounded-2xl bg-[#2563eb] px-4 py-3.5 text-sm font-medium text-white shadow">
                      Fotos hochladen
                    </button>
                    <button className="w-full rounded-2xl border border-[#d4d4d8] bg-white px-4 py-3.5 text-sm font-medium text-zinc-900">
                      Galerie ansehen
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 md:px-10 md:py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: 'Einfach tippen', text: 'Der SnapKey öffnet sofort die private Fotoseite.' },
            { title: 'Fotos teilen', text: 'Alle Gäste können ihre Bilder in Sekunden hochladen.' },
            { title: 'Erinnerungen behalten', text: 'Alle Momente bleiben an einem Ort gesammelt.' },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl bg-white p-6 shadow-sm border border-[#e4e4e7]">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-zinc-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16 md:px-10 md:pb-24">
        <div className="rounded-[2rem] bg-[#18181b] px-6 py-10 text-white md:px-10 md:py-14">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-semibold">Die schönsten Momente gehören zusammen.</h2>
              <p className="mt-2 text-white/70">SnapKey bringt alle Erinnerungen deiner Familie an einen Ort.</p>
            </div>
            <button className="rounded-2xl bg-white px-6 py-4 text-base font-medium text-[#18181b]">
              Jetzt starten
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
