"use client";

export default function Datenschutz() {
  return (
    <div className="min-h-screen bg-stone-50 px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-semibold mb-6">Datenschutzerklärung</h1>

        <p className="text-zinc-700 leading-7">
          Der Schutz deiner persönlichen Daten ist uns sehr wichtig. Nachfolgend
          informieren wir dich über die Verarbeitung personenbezogener Daten auf
          dieser Website.
        </p>

        <h2 className="mt-6 text-xl font-semibold">1. Verantwortlicher</h2>
        <p className="text-zinc-700 leading-7">
          Karim Shaker
          <br />
          Böblingerstraße 12
          <br />
          71034 Böblingen
          <br />
          Deutschland
          <br />
          E-Mail: karim.shaker@outlook.de
        </p>

        <h2 className="mt-6 text-xl font-semibold">2. Zugriffsdaten</h2>
        <p className="text-zinc-700 leading-7">
          Beim Aufrufen dieser Website werden automatisch Informationen durch den
          Browser übermittelt. Dazu gehören insbesondere IP-Adresse, Datum und
          Uhrzeit der Anfrage, Browsertyp sowie Informationen zum verwendeten
          Betriebssystem. Diese Daten werden ausschließlich zur technischen
          Bereitstellung, Stabilität und Sicherheit der Website verarbeitet.
        </p>

        <h2 className="mt-6 text-xl font-semibold">3. Nutzung der Eventseiten</h2>
        <p className="text-zinc-700 leading-7">
          Wenn du eine Eventseite besuchst oder nutzt, werden die dafür
          erforderlichen Daten verarbeitet, um Bilder, Inhalte und Funktionen der
          Seite bereitzustellen.
        </p>

        <h2 className="mt-6 text-xl font-semibold">4. Hochladen von Bildern</h2>
        <p className="text-zinc-700 leading-7">
          Nutzer können freiwillig Bilder hochladen. Diese Bilder werden
          gespeichert und innerhalb der jeweiligen Eventseite anderen berechtigten
          Teilnehmern zugänglich gemacht. Bitte lade nur Inhalte hoch, für die du
          die erforderlichen Rechte besitzt und deren Veröffentlichung zulässig ist.
        </p>

        <h2 className="mt-6 text-xl font-semibold">5. Speicherung über Supabase</h2>
        <p className="text-zinc-700 leading-7">
          Zur technischen Bereitstellung, Speicherung von Bildern, Eventdaten und
          weiteren Inhalten verwenden wir Supabase als technischen
          Infrastruktur- und Datenbankdienstleister.
        </p>

        <h2 className="mt-6 text-xl font-semibold">6. Bestellungen und Zahlungsabwicklung</h2>
        <p className="text-zinc-700 leading-7">
          Wenn du Bilder oder Produkte bestellst, verarbeiten wir die zur
          Bestellabwicklung notwendigen personenbezogenen Daten, insbesondere
          Name, E-Mail-Adresse, Lieferadresse, bestellte Produkte und
          auftragsbezogene Informationen.
        </p>
        <p className="text-zinc-700 leading-7 mt-3">
          Die Zahlungsabwicklung erfolgt über Stripe. Dabei können
          personenbezogene Daten, insbesondere Zahlungs- und Transaktionsdaten,
          an Stripe übermittelt und dort verarbeitet werden, soweit dies zur
          Durchführung der Zahlung erforderlich ist.
        </p>

        <h2 className="mt-6 text-xl font-semibold">7. Druck und Versand über Gelato</h2>
        <p className="text-zinc-700 leading-7">
          Für die Produktion und gegebenenfalls den Versand bestellter Produkte
          arbeiten wir mit Gelato zusammen. Hierfür können die zur
          Auftragsausführung erforderlichen Daten, insbesondere Name,
          Lieferadresse, Bestellinformationen und produktbezogene Inhalte, an
          Gelato übermittelt werden.
        </p>

        <h2 className="mt-6 text-xl font-semibold">8. Weitergabe von Daten</h2>
        <p className="text-zinc-700 leading-7">
          Eine Weitergabe personenbezogener Daten erfolgt nur, soweit dies zur
          Bereitstellung der Website, zur Zahlungsabwicklung, zur
          Bestellabwicklung oder zur Vertragserfüllung erforderlich ist oder eine
          gesetzliche Verpflichtung besteht.
        </p>

        <h2 className="mt-6 text-xl font-semibold">9. Speicherdauer</h2>
        <p className="text-zinc-700 leading-7">
          Personenbezogene Daten werden nur so lange gespeichert, wie dies für
          die jeweiligen Zwecke erforderlich ist oder gesetzliche
          Aufbewahrungspflichten bestehen.
        </p>

        <h2 className="mt-6 text-xl font-semibold">10. Deine Rechte</h2>
        <p className="text-zinc-700 leading-7">
          Du hast das Recht auf Auskunft über die bei uns gespeicherten
          personenbezogenen Daten sowie auf Berichtigung, Löschung,
          Einschränkung der Verarbeitung und Herausgabe deiner Daten nach Maßgabe
          der gesetzlichen Vorschriften. Außerdem hast du das Recht, dich bei
          einer zuständigen Datenschutzaufsichtsbehörde zu beschweren.
        </p>

        <h2 className="mt-6 text-xl font-semibold">11. Kontakt</h2>
        <p className="text-zinc-700 leading-7">
          Bei Fragen zum Datenschutz kannst du dich jederzeit an uns wenden:
          <br />
          karim.shaker@outlook.de
        </p>
      </div>
    </div>
  );
}
