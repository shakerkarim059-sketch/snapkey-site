export default function Datenschutz() {
  return (
    <div className="min-h-screen bg-stone-50 px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-semibold mb-6">Datenschutz</h1>

        <p className="text-zinc-700 leading-7">
          Der Schutz deiner persönlichen Daten ist uns wichtig. Nachfolgend informieren wir dich über die Verarbeitung personenbezogener Daten auf dieser Website.
        </p>

        <h2 className="mt-6 text-xl font-semibold">1. Verantwortlicher</h2>
        <p className="text-zinc-700">
          Karim Shaker, karim.shaker@outlook.de
        </p>

        <h2 className="mt-6 text-xl font-semibold">2. Nutzung der Website</h2>
        <p className="text-zinc-700">
          Beim Aufrufen dieser Website werden automatisch Informationen durch den Browser übermittelt. Diese Daten dienen ausschließlich der technischen Bereitstellung der Website.
        </p>

        <h2 className="mt-6 text-xl font-semibold">3. Hochladen von Bildern</h2>
        <p className="text-zinc-700">
          Nutzer können freiwillig Bilder hochladen. Diese werden gespeichert und sind für andere Teilnehmer der jeweiligen Event-Seite sichtbar.
        </p>

        <h2 className="mt-6 text-xl font-semibold">4. Speicherung</h2>
        <p className="text-zinc-700">
          Die Bilder werden über einen externen Dienstleister gespeichert (Supabase). Die Speicherung erfolgt ausschließlich zum Zweck der Bereitstellung der Galerie.
        </p>

        <h2 className="mt-6 text-xl font-semibold">5. Rechte</h2>
        <p className="text-zinc-700">
          Du hast das Recht auf Auskunft, Berichtigung und Löschung deiner Daten.
        </p>
      </div>
    </div>
  );
}
