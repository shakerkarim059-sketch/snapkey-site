"use client";

export default function Impressum() {
return ( <div className="min-h-screen bg-stone-50 px-6 py-12"> <div className="mx-auto max-w-2xl"> <h1 className="text-3xl font-semibold mb-6">Impressum</h1>

    <p className="text-zinc-700 leading-7">
      Angaben gemäß § 5 TMG
    </p>

    <div className="mt-4 text-zinc-700 leading-7">
      <p>Karim Shaker</p>
      <p>Böblingerstraße 12</p>
      <p>71034 Böblingen</p>
      <p>Deutschland</p>
    </div>

    <div className="mt-6 text-zinc-700 leading-7">
      <p>E-Mail: karim.shaker@outlook.de</p>
    </div>

    <div className="mt-6 text-sm text-zinc-500">
      <p>
        Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV: Karim Shaker
      </p>
    </div>

    <div className="mt-10 text-sm text-zinc-500 leading-6">
      <p className="font-medium mb-2">Haftung für Inhalte</p>
      <p>
        Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt.
        Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte
        können wir jedoch keine Gewähr übernehmen.
      </p>

      <p className="font-medium mt-6 mb-2">Haftung für Links</p>
      <p>
        Unsere Website enthält Links zu externen Websites Dritter,
        auf deren Inhalte wir keinen Einfluss haben. Deshalb können
        wir für diese fremden Inhalte auch keine Gewähr übernehmen.
        Für die Inhalte der verlinkten Seiten ist stets der jeweilige
        Anbieter oder Betreiber der Seiten verantwortlich.
      </p>
    </div>
  </div>
</div>

);
}
