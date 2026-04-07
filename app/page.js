"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

const imageUrls = {
  heroMain: "/images/family-trip-1.jpg",
  heroGallery1: "/images/family-trip-2.jpg",
  heroGallery2: "/images/family-party-1.jpg",
  heroGallery3: "/images/wedding-1.jpg",
  heroGallery4: "/images/demo-gallery-1.jpg",

  personalization: "/images/nfc-key-closeup.jpg",

  useCaseVacation: "/images/usecase-vacation.jpg",
  useCaseBirthday: "/images/usecase-birthday.jpg",
  useCaseWedding: "/images/usecase-wedding.jpg",
  useCaseFamily: "/images/usecase-family-dinner.jpg",

  demo1: "/images/demo-gallery-1.jpg",
  demo2: "/images/demo-gallery-2.jpg",
  demo3: "/images/demo-gallery-3.jpg",
  demo4: "/images/demo-gallery-4.jpg",

  videoThumb: "/images/video-thumb.jpg",
};

function SectionBadge({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div
      style={{
        ...styles.sectionBadge,
        ...(light ? styles.sectionBadgeLight : {}),
      }}
    >
      {children}
    </div>
  );
}

function ImageCard({
  src,
  alt,
  height = 220,
  priority = false,
  overlay = true,
}: {
  src: string;
  alt: string;
  height?: number;
  priority?: boolean;
  overlay?: boolean;
}) {
  return (
    <div style={{ ...styles.imageWrap, height }}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={styles.image as any}
      />
      {overlay && <div style={styles.imageOverlay} />}
    </div>
  );
}

export default function HomePage() {
  const demoEventLink = "/event/demo";
  const createEventLink = "/event";
  const youtubeVideoUrl = "https://www.youtube.com/";

  return (
    <main style={styles.page}>
      <section style={styles.heroSection}>
        <div style={styles.heroGlowA} />
        <div style={styles.heroGlowB} />

        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>Personalisierter NFC-Key für Familien & Events</div>

          <h1 style={styles.heroTitle}>
            Ein Tap genügt.
            <br />
            Fotos, Erinnerungen und euer gemeinsames Event sofort öffnen.
          </h1>

          <p style={styles.heroText}>
            Der personalisierte NFC-Key verbindet etwas Echtes mit etwas Digitalem:
            Ein kurzer Tap mit dem Smartphone und Familie oder Gäste landen direkt
            im passenden Event, können Bilder hochladen, Erinnerungen teilen und
            Lieblingsfotos gesammelt an einem Ort festhalten.
          </p>

          <div style={styles.heroButtonRow}>
            <Link href={createEventLink} style={styles.primaryButton}>
              Event erstellen
            </Link>

            <Link href={demoEventLink} style={styles.secondaryButton}>
              Demo ansehen
            </Link>
          </div>

          <div style={styles.heroMiniInfoRow}>
            <div style={styles.heroMiniInfo}>Persönlich statt beliebig</div>
            <div style={styles.heroMiniInfo}>Direkt per NFC erreichbar</div>
            <div style={styles.heroMiniInfo}>Perfekt für Familien & Feiern</div>
          </div>
        </div>

        <div style={styles.heroVisual}>
          <div style={styles.heroVisualCard}>
            <div style={styles.heroVisualTopRow}>
              <div>
                <div style={styles.nfcCardTop}>NFC Familien-Key</div>
                <div style={styles.nfcCardName}>Familie Schneider</div>
                <div style={styles.nfcCardSub}>Sommerurlaub 2026</div>
              </div>
              <div style={styles.heroChip}>Event geöffnet</div>
            </div>

            <div style={styles.heroVisualMainImage}>
              <Image
                src={imageUrls.heroMain}
                alt="Familienmoment mit Erinnerungscharakter"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                style={styles.image as any}
              />
              <div style={styles.heroVisualMainOverlay} />
              <div style={styles.heroVisualCaption}>
                <div style={styles.heroVisualCaptionBadge}>Gemeinsame Erinnerungen</div>
                <div style={styles.heroVisualCaptionTitle}>Sommerurlaub 2026</div>
                <div style={styles.heroVisualCaptionText}>
                  Fotos hochladen, ansehen und gemeinsam an einem Ort sammeln.
                </div>
              </div>
            </div>

            <div style={styles.heroThumbGrid}>
              <ImageCard src={imageUrls.heroGallery1} alt="Familienurlaub Galerie 1" height={130} />
              <ImageCard src={imageUrls.heroGallery2} alt="Familienfeier Galerie 2" height={130} />
              <ImageCard src={imageUrls.heroGallery3} alt="Hochzeit Galerie 3" height={130} />
              <ImageCard src={imageUrls.heroGallery4} alt="Eventgalerie Vorschau" height={130} />
            </div>
          </div>
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <SectionBadge>Die eigentliche Idee</SectionBadge>
          <h2 style={styles.sectionTitle}>
            Nicht nur ein Fotoalbum. Sondern ein persönlicher NFC-Zugang zu gemeinsamen Erinnerungen.
          </h2>
          <p style={styles.sectionText}>
            Der Unterschied ist nicht nur die Plattform, sondern der Einstieg:
            Ein personalisierter NFC-Key macht den Zugang sofort verständlich,
            greifbar und emotional. Kein Linkchaos, kein Suchen, kein „Schick
            mir nochmal den Zugang“.
          </p>
        </div>

        <div style={styles.coreGrid}>
          <div style={styles.coreCard}>
            <div style={styles.coreIcon}>◎</div>
            <h3 style={styles.coreTitle}>Physisches Produkt</h3>
            <p style={styles.coreText}>
              Der NFC-Key ist ein echtes Objekt, das man behält, verschenkt oder
              auf dem Tisch auslegt. Dadurch wirkt das Ganze persönlicher als ein
              normaler Link.
            </p>
          </div>

          <div style={styles.coreCard}>
            <div style={styles.coreIcon}>↗</div>
            <h3 style={styles.coreTitle}>Sofortiger Zugang</h3>
            <p style={styles.coreText}>
              Smartphone dranhalten, Event öffnen, Bilder hochladen. Genau diese
              Einfachheit ist der große Vorteil für Familien und Gäste.
            </p>
          </div>

          <div style={styles.coreCard}>
            <div style={styles.coreIcon}>♥</div>
            <h3 style={styles.coreTitle}>Erinnerung mit Bedeutung</h3>
            <p style={styles.coreText}>
              Der Key ist nicht nur Technik. Er steht für einen Anlass, eine
              Familie oder einen gemeinsamen Moment.
            </p>
          </div>
        </div>
      </section>

      <section style={styles.sectionAlt}>
        <div style={styles.contentSplit}>
          <div style={styles.contentText}>
            <SectionBadge>Was ist der NFC-Key?</SectionBadge>
            <h2 style={styles.sectionTitle}>
              Ein personalisierter Schlüssel zu eurem Familien- oder Eventalbum
            </h2>
            <p style={styles.sectionText}>
              Der NFC-Key kann individuell auf Familie, Anlass oder Event
              abgestimmt werden. Er dient als direkter Einstieg in eure digitale
              Eventseite und macht das Hochladen und Teilen von Bildern viel
              natürlicher.
            </p>

            <div style={styles.featureList}>
              <div style={styles.featureItem}>Mit Familie, Namen oder Anlass personalisierbar</div>
              <div style={styles.featureItem}>Ideal für Geburtstage, Urlaube, Hochzeiten oder Feiern</div>
              <div style={styles.featureItem}>Öffnet direkt das richtige Event per Smartphone</div>
              <div style={styles.featureItem}>Verbindet Erinnerungsstück und digitale Galerie</div>
            </div>
          </div>

          <div style={styles.imageStoryCard}>
            <div style={styles.imageStoryTop}>Personalisierung</div>
            <div style={styles.imageStoryMain}>
              <div style={styles.imageStoryLargeWrap}>
                <Image
                  src={imageUrls.personalization}
                  alt="Personalisierter NFC-Key als Produktaufnahme"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={styles.image as any}
                />
                <div style={styles.imageOverlayDark} />
              </div>
              <div style={styles.imageStoryTextBlock}>
                <div style={styles.imageStoryTitle}>Individuell statt Standard</div>
                <div style={styles.imageStoryText}>
                  Name, Anlass, Stil und Einsatzbereich machen aus dem NFC-Key
                  ein persönliches Produkt statt nur ein technisches Werkzeug.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <SectionBadge>So läuft es ab</SectionBadge>
          <h2 style={styles.sectionTitle}>Vom NFC-Tap bis zur gemeinsamen Fotosammlung</h2>
          <p style={styles.sectionText}>
            Der Ablauf muss leicht verständlich sein. Genau das sollte die Seite
            zeigen.
          </p>
        </div>

        <div style={styles.stepsGrid}>
          {[
            ["1", "NFC-Key bereitlegen", "Der personalisierte Key gehört zur Familie oder zum Anlass und ist sofort als Zugangspunkt erkennbar."],
            ["2", "Mit dem Handy antippen", "Gäste oder Familie öffnen direkt das passende Event, ohne lange nach einem Link zu suchen."],
            ["3", "Fotos hochladen & teilen", "Bilder werden gesammelt, kommentiert, gelikt und bleiben sauber an einem Ort statt in mehreren Chats."],
            ["4", "Lieblingsbilder auswählen", "Die besten Fotos können markiert und später direkt als Drucke bestellt werden."],
          ].map(([num, title, text]) => (
            <div key={num} style={styles.stepCard}>
              <div style={styles.stepNumber}>{num}</div>
              <h3 style={styles.stepTitle}>{title}</h3>
              <p style={styles.stepText}>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.sectionAlt}>
        <div style={styles.sectionHeader}>
          <SectionBadge>Warum nicht einfach WhatsApp?</SectionBadge>
          <h2 style={styles.sectionTitle}>
            Weil Fotos dort untergehen, komprimiert werden und niemand am Ende alles gesammelt hat
          </h2>
          <p style={styles.sectionText}>
            Genau hier zeigt der NFC-Key mit Eventseite seinen echten Nutzen.
          </p>
        </div>

        <div style={styles.compareGrid}>
          <div style={styles.compareBadCard}>
            <div style={styles.compareLabelBad}>Typisches Chaos</div>
            <h3 style={styles.compareTitle}>WhatsApp, AirDrop, einzelne Handygalerien</h3>
            <div style={styles.compareList}>
              <div style={styles.compareBadItem}>Links werden vergessen</div>
              <div style={styles.compareBadItem}>Bilder landen in verschiedenen Gruppen</div>
              <div style={styles.compareBadItem}>Dateien werden komprimiert</div>
              <div style={styles.compareBadItem}>Niemand hat später alles vollständig</div>
            </div>
          </div>

          <div style={styles.compareGoodCard}>
            <div style={styles.compareLabelGood}>Deine Lösung</div>
            <h3 style={styles.compareTitle}>NFC-Key + gemeinsame Eventseite</h3>
            <div style={styles.compareList}>
              <div style={styles.compareGoodItem}>Sofortiger Zugriff per Tap</div>
              <div style={styles.compareGoodItem}>Alle Bilder an einem Ort</div>
              <div style={styles.compareGoodItem}>Persönlicher und hochwertiger Eindruck</div>
              <div style={styles.compareGoodItem}>Auswahl, Kommentare und Bestellung möglich</div>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <SectionBadge>Einsatzbereiche</SectionBadge>
          <h2 style={styles.sectionTitle}>
            Für genau die Momente, in denen viele Erinnerungen zusammenkommen
          </h2>
          <p style={styles.sectionText}>
            Menschen müssen sofort sehen, wo dein Produkt im echten Leben
            eingesetzt wird.
          </p>
        </div>

        <div style={styles.useCaseGrid}>
          {[
            [imageUrls.useCaseVacation, "Familienurlaub", "Alle laden ihre schönsten Urlaubsbilder in ein gemeinsames Album."],
            [imageUrls.useCaseBirthday, "Geburtstag", "Gäste öffnen per Tap direkt die Eventseite und teilen ihre Bilder."],
            [imageUrls.useCaseWedding, "Hochzeit", "Stilvoller Zugang zu Erinnerungen statt chaotischer Fotolinks."],
            [imageUrls.useCaseFamily, "Familienfeier", "Ein gemeinsamer Ort für Bilder, Reaktionen und spätere Drucke."],
          ].map(([src, title, text]) => (
            <div key={title} style={styles.useCaseCard}>
              <ImageCard src={src} alt={title} height={240} />
              <div style={styles.useCaseBody}>
                <h3 style={styles.useCaseTitle}>{title}</h3>
                <p style={styles.useCaseText}>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.sectionAlt}>
        <div style={styles.demoLayout}>
          <div style={styles.demoTextWrap}>
            <SectionBadge>Demo & Einblick</SectionBadge>
            <h2 style={styles.sectionTitle}>So fühlt sich die Eventseite hinter dem NFC-Key an</h2>
            <p style={styles.sectionText}>
              Die Eventseite ist der digitale Teil deiner Idee: Uploads, Galerie,
              Likes, Kommentare und Bildauswahl für Drucke.
            </p>

            <div style={styles.featureList}>
              <div style={styles.featureItem}>Passwortgeschützter Zugang möglich</div>
              <div style={styles.featureItem}>Mehrere Fotos gleichzeitig hochladen</div>
              <div style={styles.featureItem}>Ausgewählte Bilder direkt markieren</div>
              <div style={styles.featureItem}>Kommentare und Likes für Familienmomente</div>
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
              <span style={styles.demoTopText}>Event-Vorschau</span>
            </div>

            <div style={styles.demoPreviewCard}>
              <div style={styles.demoPreviewHeader}>
                <div>
                  <div style={styles.demoPreviewTitle}>Sommerfest Familie Weber</div>
                  <div style={styles.demoPreviewMeta}>Galerie • Upload • Kommentare • Bestellung</div>
                </div>
                <div style={styles.demoPreviewChip}>NFC geöffnet</div>
              </div>

              <div style={styles.demoPreviewGrid}>
                <ImageCard src={imageUrls.demo1} alt="Demo Galerie 1" height={160} />
                <ImageCard src={imageUrls.demo2} alt="Demo Galerie 2" height={160} />
                <ImageCard src={imageUrls.demo3} alt="Demo Galerie 3" height={220} />
                <ImageCard src={imageUrls.demo4} alt="Demo Galerie 4" height={220} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.videoSection}>
          <div style={styles.videoText}>
            <SectionBadge>Video</SectionBadge>
            <h2 style={styles.sectionTitle}>Zeig den NFC-Moment am besten in einem kurzen Video</h2>
            <p style={styles.sectionText}>
              Ein kurzes Demo-Video kann in wenigen Sekunden zeigen, was die
              Idee besonders macht: NFC antippen, Event öffnen, Bilder teilen.
            </p>

            <a href={youtubeVideoUrl} target="_blank" rel="noreferrer" style={styles.primaryButton}>
              Video öffnen
            </a>
          </div>

          <div style={styles.videoCard}>
            <div style={styles.videoImageWrap}>
              <Image
                src={imageUrls.videoThumb}
                alt="Video-Vorschaubild für NFC-Demo"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={styles.image as any}
              />
              <div style={styles.videoOverlay} />
              <div style={styles.videoCenterContent}>
                <div style={styles.playButton}>▶</div>
                <div style={styles.videoPlaceholderTitle}>NFC-Demo</div>
                <div style={styles.videoPlaceholderText}>
                  Hier kannst du später ein echtes Video oder Thumbnail einsetzen,
                  das den Tap und die Eventseite zeigt.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.sectionAlt}>
        <div style={styles.sectionHeader}>
          <SectionBadge>Preise</SectionBadge>
          <h2 style={styles.sectionTitle}>Nicht nur Software, sondern ein personalisiertes Erlebnis</h2>
          <p style={styles.sectionText}>
            Preislich sollte sichtbar werden, dass dein Angebot Produkt,
            Personalisierung und digitale Nutzung verbindet.
          </p>
        </div>

        <div style={styles.pricingGrid}>
          <div style={styles.priceCard}>
            <div style={styles.priceTag}>Starter</div>
            <h3 style={styles.priceTitle}>NFC-Key Basis</h3>
            <div style={styles.priceValue}>ab 14,99 €</div>
            <p style={styles.priceText}>
              Einstieg in die Idee mit personalisiertem NFC-Key und Zugriff auf
              ein Event.
            </p>
            <div style={styles.priceList}>
              <div style={styles.priceListItem}>Personalisierter NFC-Key</div>
              <div style={styles.priceListItem}>Direkter Event-Zugang</div>
              <div style={styles.priceListItem}>Ideal für kleine Familienmomente</div>
            </div>
          </div>

          <div style={{ ...styles.priceCard, ...styles.priceCardFeatured }}>
            <div style={styles.priceTagDark}>Empfohlen</div>
            <h3 style={styles.priceTitle}>NFC-Key + Eventseite</h3>
            <div style={styles.priceValue}>ab 29,99 €</div>
            <p style={styles.priceText}>
              Die starke Hauptlösung mit persönlichem Zugang, Galerie, Upload und
              gemeinsamer Nutzung.
            </p>
            <div style={styles.priceList}>
              <div style={styles.priceListItem}>Individueller NFC-Key</div>
              <div style={styles.priceListItem}>Digitale Eventseite</div>
              <div style={styles.priceListItem}>Fotos hochladen und sammeln</div>
              <div style={styles.priceListItem}>Likes, Kommentare, Auswahl</div>
            </div>
          </div>

          <div style={styles.priceCard}>
            <div style={styles.priceTag}>Premium</div>
            <h3 style={styles.priceTitle}>Besondere Anlässe</h3>
            <div style={styles.priceValue}>individuell</div>
            <p style={styles.priceText}>
              Für Hochzeiten, größere Feiern oder hochwertigere, stärker
              personalisierte Varianten.
            </p>
            <div style={styles.priceList}>
              <div style={styles.priceListItem}>Erweiterte Gestaltung</div>
              <div style={styles.priceListItem}>Mehr Premium-Auftritt</div>
              <div style={styles.priceListItem}>Individuelle Anfrage möglich</div>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.ctaSection}>
        <div style={styles.ctaCard}>
          <div>
            <SectionBadge light>Bereit für den ersten echten Test?</SectionBadge>
            <h2 style={styles.ctaTitle}>Starte mit einem Event und bring die NFC-Idee direkt in die Praxis</h2>
            <p style={styles.ctaText}>
              Der beste Schritt ist jetzt, ein echtes Event anzulegen und zu
              testen, wie sich dein Konzept mit Familie oder Gästen anfühlt.
            </p>
          </div>

          <div style={styles.heroButtonRow}>
            <Link href={createEventLink} style={styles.primaryButtonLight}>
              Jetzt Event erstellen
            </Link>

            <Link href={demoEventLink} style={styles.secondaryButtonLight}>
              Demo ansehen
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 35%, #f8fafc 100%)",
    minHeight: "100vh",
    color: "#0f172a",
    overflowX: "hidden",
  },

  heroSection: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "72px 24px 56px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "40px",
    alignItems: "center",
    position: "relative",
  },
  heroGlowA: {
    position: "absolute",
    top: "-60px",
    left: "-80px",
    width: "240px",
    height: "240px",
    borderRadius: "999px",
    background: "rgba(59,130,246,0.10)",
    filter: "blur(40px)",
    pointerEvents: "none",
  },
  heroGlowB: {
    position: "absolute",
    right: "0px",
    top: "20px",
    width: "260px",
    height: "260px",
    borderRadius: "999px",
    background: "rgba(15,23,42,0.08)",
    filter: "blur(44px)",
    pointerEvents: "none",
  },
  heroContent: {
    display: "grid",
    gap: "20px",
    position: "relative",
    zIndex: 1,
  },
  heroBadge: {
    width: "fit-content",
    background: "#e2e8f0",
    color: "#0f172a",
    padding: "9px 14px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: 700,
  },
  heroTitle: {
    margin: 0,
    fontSize: "clamp(2.5rem, 5vw, 4.2rem)",
    lineHeight: 1.02,
    fontWeight: 800,
    letterSpacing: "-0.04em",
  },
  heroText: {
    margin: 0,
    fontSize: "18px",
    lineHeight: 1.75,
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
    border: "1px solid #0f172a",
    padding: "15px 20px",
    borderRadius: "14px",
    fontSize: "15px",
    fontWeight: 700,
    boxShadow: "0 14px 30px rgba(15, 23, 42, 0.16)",
    minWidth: "180px",
    transition: "transform 180ms ease, box-shadow 180ms ease",
  },
  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    backgroundColor: "rgba(255,255,255,0.78)",
    color: "#0f172a",
    border: "1px solid #cbd5e1",
    padding: "15px 20px",
    borderRadius: "14px",
    fontSize: "15px",
    fontWeight: 700,
    minWidth: "180px",
    backdropFilter: "blur(10px)",
  },
  heroMiniInfoRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "6px",
  },
  heroMiniInfo: {
    background: "rgba(255,255,255,0.82)",
    border: "1px solid #e2e8f0",
    borderRadius: "999px",
    padding: "10px 14px",
    fontSize: "13px",
    fontWeight: 700,
    color: "#334155",
    backdropFilter: "blur(12px)",
  },

  heroVisual: {
    display: "flex",
    justifyContent: "center",
    position: "relative",
    zIndex: 1,
  },
  heroVisualCard: {
    width: "100%",
    maxWidth: "600px",
    borderRadius: "32px",
    padding: "20px",
    background: "linear-gradient(145deg, #0f172a 0%, #1e293b 52%, #334155 100%)",
    boxShadow: "0 28px 70px rgba(15, 23, 42, 0.22)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  heroVisualTopRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "flex-start",
    flexWrap: "wrap",
    marginBottom: "18px",
  },
  heroChip: {
    background: "rgba(255,255,255,0.14)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#fff",
    padding: "9px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
    backdropFilter: "blur(8px)",
  },
  nfcCardTop: {
    fontSize: "13px",
    fontWeight: 700,
    opacity: 0.84,
    marginBottom: "10px",
  },
  nfcCardName: {
    fontSize: "34px",
    fontWeight: 800,
    lineHeight: 1.08,
    marginBottom: "8px",
  },
  nfcCardSub: {
    fontSize: "15px",
    color: "rgba(255,255,255,0.82)",
  },
  heroVisualMainImage: {
    position: "relative",
    height: "360px",
    borderRadius: "26px",
    overflow: "hidden",
    marginBottom: "14px",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  heroVisualMainOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, rgba(15,23,42,0.05) 0%, rgba(15,23,42,0.62) 100%)",
  },
  heroVisualCaption: {
    position: "absolute",
    left: "18px",
    right: "18px",
    bottom: "18px",
    display: "grid",
    gap: "6px",
  },
  heroVisualCaptionBadge: {
    width: "fit-content",
    background: "rgba(255,255,255,0.16)",
    color: "#fff",
    padding: "7px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
    backdropFilter: "blur(8px)",
  },
  heroVisualCaptionTitle: {
    fontSize: "28px",
    fontWeight: 800,
    lineHeight: 1.1,
  },
  heroVisualCaptionText: {
    fontSize: "14px",
    lineHeight: 1.6,
    color: "rgba(255,255,255,0.88)",
    maxWidth: "420px",
  },
  heroThumbGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "10px",
  },

  section: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "44px 24px 62px",
  },
  sectionAlt: {
    padding: "62px 24px",
    background: "linear-gradient(180deg, rgba(241,245,249,0.72) 0%, rgba(255,255,255,1) 100%)",
  },
  sectionHeader: {
    maxWidth: "860px",
    margin: "0 auto 34px",
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
    fontWeight: 700,
  },
  sectionBadgeLight: {
    background: "rgba(255,255,255,0.14)",
    color: "#fff",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "clamp(2rem, 4vw, 2.8rem)",
    lineHeight: 1.12,
    fontWeight: 800,
    color: "#0f172a",
    letterSpacing: "-0.03em",
  },
  sectionText: {
    margin: 0,
    fontSize: "17px",
    lineHeight: 1.75,
    color: "#475569",
  },

  coreGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "18px",
  },
  coreCard: {
    background: "rgba(255,255,255,0.88)",
    border: "1px solid #e2e8f0",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 12px 28px rgba(15, 23, 42, 0.05)",
    backdropFilter: "blur(10px)",
  },
  coreIcon: {
    width: "46px",
    height: "46px",
    borderRadius: "14px",
    background: "#0f172a",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: 800,
    marginBottom: "16px",
  },
  coreTitle: {
    margin: "0 0 10px 0",
    fontSize: "22px",
    fontWeight: 800,
  },
  coreText: {
    margin: 0,
    fontSize: "15px",
    lineHeight: 1.75,
    color: "#475569",
  },

  contentSplit: {
    maxWidth: "1280px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "30px",
    alignItems: "center",
  },
  contentText: {
    display: "grid",
    gap: "16px",
  },
  featureList: {
    display: "grid",
    gap: "12px",
    marginTop: "8px",
  },
  featureItem: {
    background: "rgba(255,255,255,0.86)",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "14px 16px",
    fontSize: "15px",
    fontWeight: 600,
    color: "#334155",
    boxShadow: "0 8px 18px rgba(15, 23, 42, 0.04)",
  },
  imageStoryCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "28px",
    overflow: "hidden",
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.07)",
  },
  imageStoryTop: {
    padding: "14px 18px",
    borderBottom: "1px solid #e2e8f0",
    fontSize: "13px",
    color: "#64748b",
    fontWeight: 700,
  },
  imageStoryMain: {
    padding: "18px",
    display: "grid",
    gap: "16px",
  },
  imageStoryLargeWrap: {
    position: "relative",
    borderRadius: "24px",
    minHeight: "320px",
    overflow: "hidden",
  },
  imageStoryTextBlock: {
    display: "grid",
    gap: "8px",
  },
  imageStoryTitle: {
    fontSize: "24px",
    fontWeight: 800,
    color: "#0f172a",
  },
  imageStoryText: {
    fontSize: "15px",
    lineHeight: 1.7,
    color: "#475569",
  },

  stepsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
  },
  stepCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "24px",
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
    fontWeight: 800,
    marginBottom: "16px",
  },
  stepTitle: {
    margin: "0 0 10px 0",
    fontSize: "20px",
    fontWeight: 800,
  },
  stepText: {
    margin: 0,
    fontSize: "15px",
    lineHeight: 1.75,
    color: "#475569",
  },

  compareGrid: {
    maxWidth: "1280px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "18px",
  },
  compareBadCard: {
    background: "#fff7f7",
    border: "1px solid #fecaca",
    borderRadius: "24px",
    padding: "24px",
  },
  compareGoodCard: {
    background: "#f8fafc",
    border: "1px solid #cbd5e1",
    borderRadius: "24px",
    padding: "24px",
  },
  compareLabelBad: {
    width: "fit-content",
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
    marginBottom: "16px",
  },
  compareLabelGood: {
    width: "fit-content",
    background: "#0f172a",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
    marginBottom: "16px",
  },
  compareTitle: {
    margin: "0 0 16px 0",
    fontSize: "24px",
    fontWeight: 800,
    lineHeight: 1.25,
  },
  compareList: {
    display: "grid",
    gap: "12px",
  },
  compareBadItem: {
    background: "#fff",
    border: "1px solid #fecaca",
    borderRadius: "14px",
    padding: "14px 16px",
    color: "#7f1d1d",
    fontSize: "15px",
    fontWeight: 600,
  },
  compareGoodItem: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "14px 16px",
    color: "#0f172a",
    fontSize: "15px",
    fontWeight: 600,
  },

  useCaseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "18px",
  },
  useCaseCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
  },
  useCaseBody: {
    padding: "18px",
  },
  useCaseTitle: {
    margin: "0 0 8px 0",
    fontSize: "20px",
    fontWeight: 800,
  },
  useCaseText: {
    margin: 0,
    fontSize: "15px",
    lineHeight: 1.7,
    color: "#475569",
  },

  demoLayout: {
    maxWidth: "1280px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "28px",
    alignItems: "center",
  },
  demoTextWrap: {
    display: "grid",
    gap: "16px",
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
    fontWeight: 700,
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
    fontWeight: 800,
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
    fontWeight: 700,
  },
  demoPreviewGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },

  videoSection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
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
    minHeight: "380px",
    boxShadow: "0 16px 34px rgba(15, 23, 42, 0.08)",
  },
  videoImageWrap: {
    position: "relative",
    minHeight: "380px",
  },
  videoOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(135deg, rgba(15,23,42,0.55), rgba(51,65,85,0.6))",
  },
  videoCenterContent: {
    position: "absolute",
    inset: 0,
    display: "grid",
    placeItems: "center",
    textAlign: "center",
    padding: "24px",
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
    margin: "0 auto 14px",
    backdropFilter: "blur(10px)",
  },
  videoPlaceholderTitle: {
    fontSize: "28px",
    fontWeight: 800,
    marginBottom: "8px",
  },
  videoPlaceholderText: {
    fontSize: "15px",
    color: "rgba(255,255,255,0.88)",
    lineHeight: 1.7,
    maxWidth: "440px",
  },

  pricingGrid: {
    maxWidth: "1280px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
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
    transform: "translateY(-4px)",
  },
  priceTag: {
    width: "fit-content",
    background: "#e2e8f0",
    color: "#0f172a",
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
    marginBottom: "16px",
  },
  priceTagDark: {
    width: "fit-content",
    background: "#0f172a",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
    marginBottom: "16px",
  },
  priceTitle: {
    margin: "0 0 10px 0",
    fontSize: "24px",
    fontWeight: 800,
  },
  priceValue: {
    fontSize: "30px",
    fontWeight: 800,
    marginBottom: "14px",
    color: "#0f172a",
  },
  priceText: {
    margin: "0 0 18px 0",
    fontSize: "15px",
    lineHeight: 1.75,
    color: "#475569",
  },
  priceList: {
    display: "grid",
    gap: "10px",
  },
  priceListItem: {
    fontSize: "15px",
    color: "#334155",
    fontWeight: 600,
  },

  ctaSection: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "24px 24px 72px",
  },
  ctaCard: {
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
    color: "#fff",
    borderRadius: "30px",
    padding: "34px",
    display: "grid",
    gap: "20px",
    boxShadow: "0 24px 56px rgba(15, 23, 42, 0.22)",
  },
  ctaTitle: {
    margin: "8px 0 10px 0",
    fontSize: "clamp(2rem, 4vw, 2.5rem)",
    lineHeight: 1.1,
    fontWeight: 800,
  },
  ctaText: {
    margin: 0,
    fontSize: "17px",
    lineHeight: 1.75,
    color: "rgba(255,255,255,0.82)",
    maxWidth: "760px",
  },
  primaryButtonLight: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    backgroundColor: "#ffffff",
    color: "#0f172a",
    border: "none",
    padding: "15px 20px",
    borderRadius: "14px",
    fontSize: "15px",
    fontWeight: 700,
    minWidth: "180px",
  },
  secondaryButtonLight: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    backgroundColor: "transparent",
    color: "#ffffff",
    border: "1px solid rgba(255,255,255,0.28)",
    padding: "15px 20px",
    borderRadius: "14px",
    fontSize: "15px",
    fontWeight: 700,
    minWidth: "180px",
  },

  imageWrap: {
    position: "relative",
    overflow: "hidden",
    borderRadius: "18px",
    background: "#cbd5e1",
    border: "1px solid rgba(148,163,184,0.22)",
  },
  image: {
    objectFit: "cover",
  },
  imageOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, rgba(15,23,42,0.05) 0%, rgba(15,23,42,0.16) 100%)",
  },
  imageOverlayDark: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, rgba(15,23,42,0.08) 0%, rgba(15,23,42,0.28) 100%)",
  },
};
