"use client";

import Link from "next/link";

export default function HomePage() {
  const productTypes = [
    {
      title: "Familien Album",
      subtitle: "Persönlich & hochwertig",
      description:
        "Ein individueller Holz-Schlüsselanhänger für Familienmomente, Kinderfotos, gemeinsame Erinnerungen und private Alben.",
      image: "/family-key.jpg",
      points: [
        "Individueller Holz Schlüsselanhänger",
        "Mit Namen oder Familienmotiv",
        "Besonders emotional & langlebig",
      ],
      price: "ab 19,90 €",
    },
    {
      title: "Hochzeiten",
      subtitle: "Schön, schlicht & günstig",
      description:
        "Elegante NFC Tags für Hochzeiten, die sich perfekt für Gäste, Tische oder kleine Erinnerungsgeschenke eignen.",
      image: "/wedding-key.jpg",
      points: [
        "Schlichtes elegantes Design",
        "Mit Namen & Datum personalisierbar",
        "Ideal für viele Gäste",
      ],
      price: "ab 9,90 €",
    },
    {
      title: "Events & Feiern",
      subtitle: "Praktisch & modern",
      description:
        "Perfekt für Geburtstage, Firmenfeiern, Jubiläen oder geschlossene Veranstaltungen mit einem gemeinsamen Album.",
      image: "/event-key.jpg",
      points: [
        "Modernes Design",
        "Mit Eventname oder Logo",
        "Ideal für Gruppen & Gäste",
      ],
      price: "ab 6,90 €",
    },
    {
      title: "Reisen & Erinnerungen",
      subtitle: "Leicht & flexibel",
      description:
        "Praktische NFC Karten oder Anhänger für Urlaubsalben, Reisetagebücher und gemeinsame Abenteuer.",
      image: "/travel-key.jpg",
      points: [
        "Praktisches Kartenformat",
        "Leicht mitzunehmen",
        "Perfekt für Reise-Erinnerungen",
      ],
      price: "ab 7,90 €",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "NFC Key auswählen",
      text: "Wähle den NFC Key, der zu deinem Anlass passt – Familie, Hochzeit, Event oder Reise.",
    },
    {
      number: "2",
      title: "Individuell gestalten",
      text: "Personalisiere deinen Key mit Namen, Datum, Motiv oder Eventbezeichnung.",
    },
    {
      number: "3",
      title: "Mit dem Handy öffnen",
      text: "Ein Tap genügt und dein digitales Album, Fotos oder Erinnerungsbereich öffnet sich direkt.",
    },
  ];

  const benefits = [
    {
      title: "Ohne App",
      text: "Funktioniert direkt mit dem Smartphone.",
    },
    {
      title: "Persönlich",
      text: "Nicht nur ein Link, sondern ein echtes Erinnerungsstück.",
    },
    {
      title: "Einfach",
      text: "Tippen, öffnen, Erinnerungen ansehen.",
    },
    {
      title: "Für jeden Anlass",
      text: "Familie, Hochzeit, Event oder Reise.",
    },
  ];

  return (
    <main style={styles.page}>
      <section style={styles.heroSection}>
        <div style={styles.heroTextCol}>
          <div style={styles.heroBadge}>NFC Keys für deine Erinnerungen</div>

          <h1 style={styles.heroTitle}>
            Deine Erinnerungen.
            <br />
            Mit einem Tap abrufbar.
          </h1>

          <p style={styles.heroText}>
            Mit deinem individuellen NFC Key öffnest du Familienalben,
            Hochzeitsmomente, Eventfotos und besondere Erinnerungen direkt auf
            dem Smartphone.
          </p>

          <div style={styles.heroActionRow}>
            <Link href="/event" style={styles.primaryButton}>
              Jetzt NFC Key gestalten
            </Link>

            <a href="#produkte" style={styles.secondaryButton}>
              Produkte ansehen
            </a>
          </div>

          <div style={styles.heroIconRow}>
            <div style={styles.heroIconCard}>
              <div style={styles.heroIconCircle}>⌁</div>
              <div style={styles.heroIconTitle}>NFC scannen</div>
              <div style={styles.heroIconText}>
                Einfach ans Handy halten
              </div>
            </div>

            <div style={styles.heroIconCard}>
              <div style={styles.heroIconCircle}>▣</div>
              <div style={styles.heroIconTitle}>Album öffnen</div>
              <div style={styles.heroIconText}>
                Fotos & Erinnerungen direkt laden
              </div>
            </div>

            <div style={styles.heroIconCard}>
              <div style={styles.heroIconCircle}>♡</div>
              <div style={styles.heroIconTitle}>Persönlich erleben</div>
              <div style={styles.heroIconText}>
                Mehr als nur ein Fotoalbum
              </div>
            </div>
          </div>
        </div>

        <div style={styles.heroImageCol}>
          <img
            src="/hero-nfc-family.png"
            alt="Individueller NFC Key mit Smartphone und Familienalbum"
            style={styles.heroImage}
          />
        </div>
      </section>

      <section style={styles.benefitBar}>
        {benefits.map((item) => (
          <div key={item.title} style={styles.benefitItem}>
            <div style={styles.benefitTitle}>{item.title}</div>
            <div style={styles.benefitText}>{item.text}</div>
          </div>
        ))}
      </section>

      <section id="produkte" style={styles.productSection}>
        <div style={styles.sectionIntro}>
          <div style={styles.sectionEyebrow}>Für jeden Anlass</div>
          <h2 style={styles.sectionTitle}>
            Der passende NFC Key für deine Momente
          </h2>
          <p style={styles.sectionText}>
            Nicht jeder Anlass braucht denselben NFC Key. Für Familienalben
            passt ein wertiger Holzanhänger, für Hochzeiten eher eine elegante
            und günstigere Lösung für viele Gäste.
          </p>
        </div>

        <div style={styles.productGrid}>
          {productTypes.map((item) => (
            <div key={item.title} style={styles.productCard}>
              <img
                src={item.image}
                alt={item.title}
                style={styles.productImage}
              />

              <div style={styles.productBody}>
                <div style={styles.productSubtitle}>{item.subtitle}</div>
                <h3 style={styles.productTitle}>{item.title}</h3>
                <p style={styles.productDescription}>{item.description}</p>

                <div style={styles.productList}>
                  {item.points.map((point) => (
                    <div key={point} style={styles.productListItem}>
                      ✓ {point}
                    </div>
                  ))}
                </div>

                <div style={styles.productFooter}>
                  <div style={styles.productPrice}>{item.price}</div>
                  <Link href="/event" style={styles.cardButton}>
                    Jetzt gestalten
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.storySection}>
        <div style={styles.storyImageWrap}>
          <img
            src="/how-it-works.jpg"
            alt="NFC Key neben Smartphone mit geöffnetem Album"
            style={styles.storyImage}
          />
        </div>

        <div style={styles.storyContent}>
          <div style={styles.sectionEyebrow}>So funktioniert es</div>
          <h2 style={styles.sectionTitle}>Ein Produkt, das Erinnerungen öffnet</h2>
          <p style={styles.sectionText}>
            Dein Verkaufsargument ist nicht ein weiteres digitales Album,
            sondern ein physischer Schlüssel zu Erinnerungen. Genau das muss man
            auf der Startseite sofort verstehen.
          </p>

          <div style={styles.stepList}>
            {steps.map((step) => (
              <div key={step.number} style={styles.stepItem}>
                <div style={styles.stepNumber}>{step.number}</div>
                <div>
                  <div style={styles.stepTitle}>{step.title}</div>
                  <div style={styles.stepText}>{step.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={styles.finalSection}>
        <div style={styles.finalCard}>
          <div style={styles.sectionEyebrow}>Mehr als ein Link</div>
          <h2 style={styles.finalTitle}>
            Ein schöner NFC Key macht Erinnerungen greifbar
          </h2>
          <p style={styles.finalText}>
            Ob für Familien, Hochzeiten oder Events: Du gibst Menschen nicht
            einfach nur Zugriff auf Fotos, sondern ein persönliches Objekt, das
            Erinnerungen sichtbar und emotional macht.
          </p>

          <div style={styles.finalButtons}>
            <Link href="/event" style={styles.primaryButton}>
              Jetzt starten
            </Link>

            <a href="#produkte" style={styles.secondaryButton}>
              NFC Varianten ansehen
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #f6f1ea 0%, #fcfaf7 35%, #f8f6f3 100%)",
    padding: "24px 18px 80px",
    overflowX: "hidden",
  },

  heroSection: {
    maxWidth: "1280px",
    margin: "0 auto 26px",
    display: "grid",
    gridTemplateColumns: "1.05fr 0.95fr",
    gap: "28px",
    alignItems: "center",
  },

  heroTextCol: {
    display: "grid",
    gap: "18px",
  },

  heroBadge: {
    width: "fit-content",
    background: "#eaded1",
    color: "#7a5c45",
    padding: "10px 14px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },

  heroTitle: {
    margin: 0,
    fontSize: "64px",
    lineHeight: "1.02",
    fontWeight: "800",
    color: "#2e241d",
  },

  heroText: {
    margin: 0,
    maxWidth: "620px",
    fontSize: "20px",
    lineHeight: "1.8",
    color: "#5b4d42",
  },

  heroActionRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },

  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    backgroundColor: "#4b3a2d",
    color: "#fff",
    border: "none",
    padding: "15px 20px",
    borderRadius: "14px",
    fontSize: "15px",
    fontWeight: "700",
    minWidth: "190px",
    boxShadow: "0 10px 24px rgba(75, 58, 45, 0.18)",
  },

  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    backgroundColor: "#fff",
    color: "#4b3a2d",
    border: "1px solid #dbcbbd",
    padding: "15px 20px",
    borderRadius: "14px",
    fontSize: "15px",
    fontWeight: "700",
    minWidth: "190px",
  },

  heroIconRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "14px",
    marginTop: "6px",
  },

  heroIconCard: {
    background: "rgba(255,255,255,0.72)",
    border: "1px solid #eadfd4",
    borderRadius: "20px",
    padding: "16px",
    display: "grid",
    gap: "8px",
    boxShadow: "0 8px 24px rgba(46, 36, 29, 0.04)",
  },

  heroIconCircle: {
    width: "44px",
    height: "44px",
    borderRadius: "999px",
    background: "#efe5db",
    color: "#4b3a2d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "18px",
  },

  heroIconTitle: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#2e241d",
  },

  heroIconText: {
    fontSize: "14px",
    lineHeight: "1.5",
    color: "#6c5f54",
  },

  heroImageCol: {
    display: "flex",
    justifyContent: "center",
  },

  heroImage: {
    width: "100%",
    maxWidth: "580px",
    borderRadius: "30px",
    display: "block",
    boxShadow: "0 20px 42px rgba(46, 36, 29, 0.12)",
  },

  benefitBar: {
    maxWidth: "1280px",
    margin: "0 auto 34px",
    background: "rgba(255,255,255,0.76)",
    border: "1px solid #eadfd4",
    borderRadius: "24px",
    padding: "18px",
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "14px",
  },

  benefitItem: {
    display: "grid",
    gap: "4px",
    padding: "8px",
  },

  benefitTitle: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#2e241d",
  },

  benefitText: {
    fontSize: "14px",
    lineHeight: "1.55",
    color: "#6b5c50",
  },

  productSection: {
    maxWidth: "1280px",
    margin: "0 auto 40px",
    display: "grid",
    gap: "24px",
  },

  sectionIntro: {
    textAlign: "center",
    display: "grid",
    gap: "12px",
    maxWidth: "880px",
    margin: "0 auto",
  },

  sectionEyebrow: {
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#9a7b61",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "42px",
    lineHeight: "1.12",
    fontWeight: "800",
    color: "#2e241d",
  },

  sectionText: {
    margin: 0,
    fontSize: "18px",
    lineHeight: "1.8",
    color: "#5f5349",
  },

  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "18px",
  },

  productCard: {
    background: "#fff",
    border: "1px solid #eadfd4",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 10px 28px rgba(46, 36, 29, 0.05)",
    display: "grid",
  },

  productImage: {
    width: "100%",
    height: "260px",
    objectFit: "cover",
    display: "block",
  },

  productBody: {
    padding: "18px",
    display: "grid",
    gap: "12px",
  },

  productSubtitle: {
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "#a28064",
  },

  productTitle: {
    margin: 0,
    fontSize: "26px",
    lineHeight: "1.2",
    fontWeight: "800",
    color: "#2e241d",
  },

  productDescription: {
    margin: 0,
    fontSize: "14px",
    lineHeight: "1.7",
    color: "#63564b",
  },

  productList: {
    display: "grid",
    gap: "8px",
  },

  productListItem: {
    fontSize: "14px",
    lineHeight: "1.5",
    color: "#4f4339",
  },

  productFooter: {
    display: "grid",
    gap: "12px",
    marginTop: "6px",
  },

  productPrice: {
    fontSize: "18px",
    fontWeight: "800",
    color: "#2e241d",
  },

  cardButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    backgroundColor: "#d8bea5",
    color: "#3c2f25",
    border: "none",
    padding: "13px 16px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "700",
  },

  storySection: {
    maxWidth: "1280px",
    margin: "0 auto 40px",
    display: "grid",
    gridTemplateColumns: "0.95fr 1.05fr",
    gap: "24px",
    alignItems: "center",
    background: "rgba(255,255,255,0.72)",
    border: "1px solid #eadfd4",
    borderRadius: "28px",
    padding: "22px",
  },

  storyImageWrap: {
    width: "100%",
  },

  storyImage: {
    width: "100%",
    borderRadius: "22px",
    display: "block",
  },

  storyContent: {
    display: "grid",
    gap: "14px",
  },

  stepList: {
    display: "grid",
    gap: "16px",
    marginTop: "6px",
  },

  stepItem: {
    display: "grid",
    gridTemplateColumns: "56px 1fr",
    gap: "14px",
    alignItems: "start",
  },

  stepNumber: {
    width: "48px",
    height: "48px",
    borderRadius: "999px",
    background: "#efe1d2",
    color: "#4b3a2d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "18px",
  },

  stepTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#2e241d",
    marginBottom: "4px",
  },

  stepText: {
    fontSize: "15px",
    lineHeight: "1.7",
    color: "#5e5147",
  },

  finalSection: {
    maxWidth: "1280px",
    margin: "0 auto",
  },

  finalCard: {
    background:
      "linear-gradient(135deg, #4b3a2d 0%, #5b4637 50%, #715948 100%)",
    color: "#fff",
    borderRadius: "30px",
    padding: "34px 28px",
    display: "grid",
    gap: "16px",
    textAlign: "center",
    boxShadow: "0 18px 42px rgba(46, 36, 29, 0.12)",
  },

  finalTitle: {
    margin: 0,
    fontSize: "42px",
    lineHeight: "1.14",
    fontWeight: "800",
  },

  finalText: {
    margin: 0,
    fontSize: "18px",
    lineHeight: "1.8",
    opacity: 0.92,
    maxWidth: "880px",
    marginInline: "auto",
  },

  finalButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "4px",
  },
};
