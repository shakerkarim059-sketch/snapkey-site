"use client";

import Link from "next/link";

export default function HomePage() {
  const demoEventLink = "/event/demo";
  const youtubeVideoUrl = "https://www.youtube.com/";
const createEventLink = "/event";

  return (
    <main style={styles.page}>
      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>Familienfotos neu gedacht</div>

          <h1 style={styles.heroTitle}>
            Eure Familienmomente an einem Ort.
            <br />
            Einfach hochladen, teilen und bestellen.
          </h1>

          <p style={styles.heroText}>
            Ob Urlaub, Geburtstag, Hochzeit oder Familienfeier: Jeder kann von
            überall Fotos hochladen, die Bilder bleiben sauber nach Ereignissen
            geordnet und die Familie hat alles gesammelt an einem Ort.
          </p>

          <div style={styles.heroButtonRow}>
            <Link href={createEventLink} style={styles.primaryButton}>
              Event erstellen
            </Link>

            <Link href={demoEventLink} style={styles.secondaryButton}>
              Demo ansehen
            </Link>
          </div>

          <div style={styles.heroInfoRow}>
            <div style={styles.heroInfoCard}>
              <div style={styles.heroInfoNumber}>Einfach</div>
              <div style={styles.heroInfoText}>
                Link teilen und sofort gemeinsam starten
              </div>
            </div>

            <div style={styles.heroInfoCard}>
              <div style={styles.heroInfoNumber}>Geordnet</div>
              <div style={styles.heroInfoText}>
                Fotos nach Event, Ort und Zeitraum statt Chaos
              </div>
            </div>

            <div style={styles.heroInfoCard}>
              <div style={styles.heroInfoNumber}>Direkt</div>
              <div style={styles.heroInfoText}>
                Lieblingsbilder auswählen und als Druck bestellen
              </div>
            </div>
          </div>
        </div>

        <div style={styles.heroVisual}>
          <div style={styles.visualCardLarge}>
            <div style={styles.visualCardLabel}>Beispiel-Event</div>
            <div style={styles.visualCardTitle}>Sommerurlaub 2026</div>
            <div style={styles.visualCardMeta}>Ägypten • 248 Fotos</div>

            <div style={styles.visualGrid}>
              <div style={{ ...styles.visualImage, ...styles.visualImageTall }} />
              <div style={{ ...styles.visualImage, ...styles.visualImageWide }} />
              <div style={styles.visualImage} />
              <div style={styles.visualImage} />
            </div>
          </div>
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionBadge}>So funktioniert es</div>
          <h2 style={styles.sectionTitle}>
            Von der Familienfeier bis zur fertigen Fotoauswahl
          </h2>
          <p style={styles.sectionText}>
            Die Idee ist einfach: Ein Event anlegen, den Link an Familie oder
            Freunde schicken und alle können ihre Bilder gesammelt hochladen.
          </p>
        </div>

        <div style={styles.stepsGrid}>
          <div style={styles.stepCard}>
            <div style={styles.stepNumber}>1</div>
            <h3 style={styles.stepTitle}>Event anlegen</h3>
            <p style={styles.stepText}>
              Erstelle ein Ereignis mit Titel, Ort, Datum und optionalem
              Passwortschutz.
            </p>
          </div>

          <div style={styles.stepCard}>
            <div style={styles.stepNumber}>2</div>
            <h3 style={styles.stepTitle}>Link teilen</h3>
            <p style={styles.stepText}>
              Schicke den Event-Link an Familie und Freunde, damit jeder seine
              Bilder hochladen kann.
            </p>
          </div>

          <div style={styles.stepCard}>
            <div style={styles.stepNumber}>3</div>
            <h3 style={styles.stepTitle}>Fotos sammeln</h3>
            <p style={styles.stepText}>
              Alle Bilder landen sauber in einem gemeinsamen Event statt verteilt
              in WhatsApp, AirDrop oder alten Galerien.
            </p>
          </div>

          <div style={styles.stepCard}>
            <div style={styles.stepNumber}>4</div>
            <h3 style={styles.stepTitle}>Auswählen & bestellen</h3>
            <p style={styles.stepText}>
              Lieblingsfotos markieren, Formate wählen und später bequem als
              Druck bestellen.
            </p>
          </div>
        </div>
      </section>

      <section style={styles.sectionAlt}>
        <div style={styles.demoLayout}>
          <div style={styles.demoTextWrap}>
            <div style={styles.sectionBadge}>Warum das besser ist</div>
            <h2 style={styles.sectionTitle}>
              Keine wilden Fotos mehr an fünf verschiedenen Stellen
            </h2>
            <p style={styles.sectionText}>
              Gerade in Familien geht schnell alles durcheinander: manche Bilder
              sind auf einem Handy, andere in einer WhatsApp-Gruppe, wieder
              andere gehen ganz verloren. Diese Seite bringt Ordnung rein.
            </p>

            <div style={styles.bulletList}>
              <div style={styles.bulletItem}>Fotos nach Ereignissen bündeln</div>
              <div style={styles.bulletItem}>Von überall hochladen</div>
              <div style={styles.bulletItem}>Gefällt-mir und Kommentare möglich</div>
              <div style={styles.bulletItem}>
                Spätere Druckbestellung direkt im Event
              </div>
              <div style={styles.bulletItem}>
                Einfach genug für die ganze Familie
              </div>
            </div>

            <div style={styles.heroButtonRow}>
              <Link href={demoEventLink} style={styles.primaryButton}>
                Demo-Event öffnen
              </Link>
            </div>
          </div>

          <div style={styles.demoCard}>
            <div style={styles.demoCardTop}>
              <div style={styles.demoDotRow}>
                <span style={styles.demoDot} />
                <span style={styles.demoDot} />
                <span style={styles.demoDot} />
              </div>
              <span style={styles.demoTopText}>Event-Ansicht</span>
            </div>

            <div style={styles.demoPreviewCard}>
              <div style={styles.demoPreviewHeader}>
                <div>
                  <div style={styles.demoPreviewTitle}>Geburtstag Oma</div>
                  <div style={styles.demoPreviewMeta}>
                    Familie • Kommentare • Likes • Bestellung
                  </div>
                </div>
                <div style={styles.demoPreviewChip}>Passwort geschützt</div>
              </div>

              <div style={styles.demoPreviewGrid}>
                <div style={{ ...styles.demoPreviewImage, height: "170px" }} />
                <div style={{ ...styles.demoPreviewImage, height: "170px" }} />
                <div style={{ ...styles.demoPreviewImage, height: "220px" }} />
                <div style={{ ...styles.demoPreviewImage, height: "220px" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.videoSection}>
          <div style={styles.videoText}>
            <div style={styles.sectionBadge}>Video / Demo</div>
            <h2 style={styles.sectionTitle}>
              Zeig die Idee direkt mit einem kurzen Video
            </h2>
            <p style={styles.sectionText}>
              Hier kannst du dein YouTube-Video einbinden oder verlinken, damit
              Besucher sofort verstehen, wie das Ganze funktioniert.
            </p>

            <a
              href={youtubeVideoUrl}
              target="_blank"
              rel="noreferrer"
              style={styles.primaryButton}
            >
              YouTube-Video öffnen
            </a>
          </div>

          <div style={styles.videoCard}>
            <div style={styles.videoPlaceholder}>
              <div style={styles.playButton}>▶</div>
              <div style={styles.videoPlaceholderTitle}>Produkt-Demo</div>
              <div style={styles.videoPlaceholderText}>
                Hier später Thumbnail oder eingebettetes Video einsetzen
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.sectionAlt}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionBadge}>Preise</div>
          <h2 style={styles.sectionTitle}>
            Einfach starten und später erweitern
          </h2>
          <p style={styles.sectionText}>
            Du kannst die Preisstruktur schlank halten und später ausbauen.
          </p>
        </div>

        <div style={styles.pricingGrid}>
          <div style={styles.priceCard}>
            <div style={styles.priceTag}>Basis</div>
            <h3 style={styles.priceTitle}>Familien-Event</h3>
            <div style={styles.priceValue}>Kostenlos / Einstieg</div>
            <p style={styles.priceText}>
              Ideal, um das Konzept zu zeigen und erste Familienevents
              anzulegen.
            </p>
            <div style={styles.priceList}>
              <div style={styles.priceListItem}>Event-Link teilen</div>
              <div style={styles.priceListItem}>Fotos hochladen</div>
              <div style={styles.priceListItem}>Passwortschutz</div>
            </div>
          </div>

          <div style={{ ...styles.priceCard, ...styles.priceCardFeatured }}>
            <div style={styles.priceTagDark}>Empfohlen</div>
            <h3 style={styles.priceTitle}>Event mit Druckbestellung</h3>
            <div style={styles.priceValue}>ab 9,99 €</div>
            <p style={styles.priceText}>
              Für echte Nutzung mit schöner Eventseite, Auswahl und späterer
              Fotobestellung.
            </p>
            <div style={styles.priceList}>
              <div style={styles.priceListItem}>Alles aus Basis</div>
              <div style={styles.priceListItem}>Likes und Kommentare</div>
              <div style={styles.priceListItem}>Bestellfunktion für Bilder</div>
              <div style={styles.priceListItem}>Mehr Premium-Auftritt</div>
            </div>
          </div>

          <div style={styles.priceCard}>
            <div style={styles.priceTag}>Später möglich</div>
            <h3 style={styles.priceTitle}>Große Events</h3>
            <div style={styles.priceValue}>individuell</div>
            <p style={styles.priceText}>
              Für Hochzeiten, große Familienfeiern oder besondere Eventpakete.
            </p>
            <div style={styles.priceList}>
              <div style={styles.priceListItem}>Individuelle Gestaltung</div>
              <div style={styles.priceListItem}>Mehr Speicher / mehr Gäste</div>
              <div style={styles.priceListItem}>Erweiterte Bestelloptionen</div>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.ctaSection}>
        <div style={styles.ctaCard}>
          <div>
            <div style={styles.sectionBadge}>Bereit zum Start?</div>
            <h2 style={styles.ctaTitle}>
              Erstelle dein erstes Familien-Event und probiere es direkt aus
            </h2>
            <p style={styles.ctaText}>
              Der beste nächste Schritt ist nicht mehr reden, sondern ein echtes
              Event anlegen und testen.
            </p>
          </div>

          <div style={styles.heroButtonRow}>
            <Link href={createEventLink} style={styles.primaryButton}>
              Jetzt Event erstellen
            </Link>

            <Link href={demoEventLink} style={styles.secondaryButton}>
              Erst Demo ansehen
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

const styles = {
  page: {
    background:
      "linear-gradient(180deg, #f8fafc 0%, #ffffff 35%, #f8fafc 100%)",
    minHeight: "100vh",
    color: "#0f172a",
  },
  heroSection: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "64px 24px 48px",
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    gap: "32px",
    alignItems: "center",
  },
  heroContent: {
    display: "grid",
    gap: "20px",
  },
  heroBadge: {
    width: "fit-content",
    background: "#e2e8f0",
    color: "#0f172a",
    padding: "9px 14px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "700",
  },
  heroTitle: {
    margin: 0,
    fontSize: "56px",
    lineHeight: "1.05",
    fontWeight: "800",
    letterSpacing: "-1.5px",
  },
  heroText: {
    margin: 0,
    fontSize: "18px",
    lineHeight: "1.7",
    color: "#475569",
    maxWidth: "720px",
  },
  heroButtonRow: {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    backgroundColor: "#0f172a",
    color: "#fff",
    border: "none",
    padding: "15px 20px",
    borderRadius: "14px",
    fontSize: "15px",
    fontWeight: "700",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.18)",
    minWidth: "180px",
  },
  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    backgroundColor: "#ffffff",
    color: "#0f172a",
    border: "1px solid #cbd5e1",
    padding: "15px 20px",
    borderRadius: "14px",
    fontSize: "15px",
    fontWeight: "700",
    minWidth: "180px",
  },
  heroInfoRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "14px",
    marginTop: "10px",
  },
  heroInfoCard: {
    background: "rgba(255,255,255,0.8)",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "18px",
    boxShadow: "0 8px 22px rgba(15, 23, 42, 0.04)",
  },
  heroInfoNumber: {
    fontSize: "18px",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "8px",
  },
  heroInfoText: {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#475569",
  },
  heroVisual: {
    display: "flex",
    justifyContent: "center",
  },
  visualCardLarge: {
    width: "100%",
    maxWidth: "520px",
    background:
      "linear-gradient(180deg, rgba(15,23,42,1) 0%, rgba(30,41,59,1) 100%)",
    borderRadius: "28px",
    padding: "24px",
    boxShadow: "0 30px 60px rgba(15, 23, 42, 0.25)",
    color: "#fff",
  },
  visualCardLabel: {
    fontSize: "13px",
    fontWeight: "700",
    opacity: 0.8,
    marginBottom: "10px",
  },
  visualCardTitle: {
    fontSize: "30px",
    fontWeight: "800",
    marginBottom: "8px",
  },
  visualCardMeta: {
    fontSize: "15px",
    opacity: 0.85,
    marginBottom: "18px",
  },
  visualGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  visualImage: {
    borderRadius: "18px",
    background:
      "linear-gradient(135deg, rgba(148,163,184,0.5), rgba(255,255,255,0.15))",
    minHeight: "140px",
  },
  visualImageTall: {
    minHeight: "220px",
  },
  visualImageWide: {
    minHeight: "220px",
  },
  section: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "36px 24px 56px",
  },
  sectionAlt: {
    padding: "56px 24px",
    background:
      "linear-gradient(180deg, rgba(241,245,249,0.7) 0%, rgba(255,255,255,1) 100%)",
  },
  sectionHeader: {
    maxWidth: "820px",
    margin: "0 auto 28px",
    textAlign: "center",
    display: "grid",
    gap: "12px",
  },
  sectionBadge: {
    width: "fit-content",
    margin: "0 auto",
    background: "#e2e8f0",
    color: "#0f172a",
    padding: "8px 13px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "700",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "40px",
    lineHeight: "1.15",
    fontWeight: "800",
    color: "#0f172a",
  },
  sectionText: {
    margin: 0,
    fontSize: "17px",
    lineHeight: "1.7",
    color: "#475569",
  },
  stepsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "18px",
  },
  stepCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "22px",
    padding: "22px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
  },
  stepNumber: {
    width: "42px",
    height: "42px",
    borderRadius: "999px",
    background: "#0f172a",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    marginBottom: "16px",
  },
  stepTitle: {
    margin: "0 0 10px 0",
    fontSize: "20px",
    fontWeight: "800",
  },
  stepText: {
    margin: 0,
    fontSize: "15px",
    lineHeight: "1.7",
    color: "#475569",
  },
  demoLayout: {
    maxWidth: "1280px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "28px",
    alignItems: "center",
  },
  demoTextWrap: {
    display: "grid",
    gap: "16px",
  },
  bulletList: {
    display: "grid",
    gap: "12px",
    marginTop: "8px",
  },
  bulletItem: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "14px 16px",
    fontSize: "15px",
    fontWeight: "600",
    color: "#334155",
  },
  demoCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 18px 38px rgba(15, 23, 42, 0.08)",
  },
  demoCardTop: {
    padding: "14px 18px",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
  },
  demoDotRow: {
    display: "flex",
    gap: "8px",
  },
  demoDot: {
    width: "10px",
    height: "10px",
    borderRadius: "999px",
    background: "#cbd5e1",
    display: "inline-block",
  },
  demoTopText: {
    fontSize: "13px",
    color: "#64748b",
    fontWeight: "700",
  },
  demoPreviewCard: {
    padding: "18px",
    display: "grid",
    gap: "18px",
  },
  demoPreviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  demoPreviewTitle: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#0f172a",
  },
  demoPreviewMeta: {
    fontSize: "14px",
    color: "#64748b",
    marginTop: "6px",
  },
  demoPreviewChip: {
    background: "#e2e8f0",
    color: "#0f172a",
    borderRadius: "999px",
    padding: "8px 12px",
    fontSize: "12px",
    fontWeight: "700",
  },
  demoPreviewGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  demoPreviewImage: {
    borderRadius: "16px",
    background:
      "linear-gradient(135deg, rgba(148,163,184,0.38), rgba(241,245,249,1))",
  },
  videoSection: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "28px",
    alignItems: "center",
  },
  videoText: {
    display: "grid",
    gap: "16px",
  },
  videoCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "24px",
    overflow: "hidden",
    minHeight: "360px",
    boxShadow: "0 16px 34px rgba(15, 23, 42, 0.08)",
  },
  videoPlaceholder: {
    minHeight: "360px",
    display: "grid",
    placeItems: "center",
    textAlign: "center",
    padding: "24px",
    background:
      "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(51,65,85,1))",
    color: "#fff",
  },
  playButton: {
    width: "74px",
    height: "74px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    marginBottom: "14px",
  },
  videoPlaceholderTitle: {
    fontSize: "28px",
    fontWeight: "800",
    marginBottom: "8px",
  },
  videoPlaceholderText: {
    fontSize: "15px",
    color: "rgba(255,255,255,0.85)",
    lineHeight: "1.6",
  },
  pricingGrid: {
    maxWidth: "1280px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "18px",
  },
  priceCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 12px 26px rgba(15, 23, 42, 0.05)",
  },
  priceCardFeatured: {
    border: "1px solid #0f172a",
    boxShadow: "0 18px 36px rgba(15, 23, 42, 0.10)",
  },
  priceTag: {
    width: "fit-content",
    background: "#e2e8f0",
    color: "#0f172a",
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    marginBottom: "16px",
  },
  priceTagDark: {
    width: "fit-content",
    background: "#0f172a",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    marginBottom: "16px",
  },
  priceTitle: {
    margin: "0 0 10px 0",
    fontSize: "24px",
    fontWeight: "800",
  },
  priceValue: {
    fontSize: "30px",
    fontWeight: "800",
    marginBottom: "14px",
    color: "#0f172a",
  },
  priceText: {
    margin: "0 0 18px 0",
    fontSize: "15px",
    lineHeight: "1.7",
    color: "#475569",
  },
  priceList: {
    display: "grid",
    gap: "10px",
  },
  priceListItem: {
    fontSize: "15px",
    color: "#334155",
    fontWeight: "600",
  },
  ctaSection: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "24px 24px 72px",
  },
  ctaCard: {
    background:
      "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
    color: "#fff",
    borderRadius: "28px",
    padding: "32px",
    display: "grid",
    gap: "20px",
    boxShadow: "0 24px 56px rgba(15, 23, 42, 0.22)",
  },
  ctaTitle: {
    margin: "8px 0 10px 0",
    fontSize: "36px",
    lineHeight: "1.15",
    fontWeight: "800",
  },
  ctaText: {
    margin: 0,
    fontSize: "17px",
    lineHeight: "1.7",
    color: "rgba(255,255,255,0.82)",
    maxWidth: "760px",
  },
};
