"use client";

import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxAlt, setLightboxAlt] = useState("");

  function openImage(src, alt = "Bildvorschau") {
    setLightboxImage(src);
    setLightboxAlt(alt);
  }

  function closeImage() {
    setLightboxImage(null);
    setLightboxAlt("");
  }

  const snapkeyTypes = [
    {
      title: "NFC Karte",
      subtitle: "Günstig für viele Gäste",
      description:
        "Ideal, wenn viele Gäste einen eigenen Zugang zum Eventalbum erhalten sollen. Praktisch, schlicht und preisbewusst.",
      image: "/nfc-event.jpg",
      points: [
        "Sehr gut für große Feiern",
        "Günstiger Einstieg",
        "Direkter Zugang zum Eventalbum",
      ],
    },
    {
      title: "Snapkey Anhänger",
      subtitle: "Der Allrounder für Events",
      description:
        "Ein hochwertiger NFC Anhänger, den Gäste als Erinnerung mitnehmen können. Perfekt für Hochzeiten, Geburtstage und Familienfeiern.",
      image: "/nfc-wedding.jpg",
      points: [
        "Als Erinnerungsstück mitnehmbar",
        "Ideal für Hochzeit & Event",
        "Persönlich und praktisch",
      ],
    },
    {
      title: "Premium Holz-Snapkey",
      subtitle: "Hochwertig und emotional",
      description:
        "Für alle, die etwas Besonderes möchten. Ein wertiger Snapkey mit persönlichem Charakter für besondere Erinnerungen.",
      image: "/nfc-family.jpg",
      points: [
        "Premium-Look",
        "Sehr emotionales Geschenk",
        "Perfekt für Familie & besondere Anlässe",
      ],
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Event erstellen",
      text: "Du legst deine persönliche Eventseite an – zum Beispiel für Hochzeit, Geburtstag, Familie oder Reise.",
    },
    {
      number: "2",
      title: "Snapkeys auswählen",
      text: "Du wählst Key-Art, Menge und Design. Ob günstig für viele Gäste oder hochwertig als Erinnerungsstück.",
    },
    {
      number: "3",
      title: "Gäste scannen",
      text: "Gäste öffnen das Fotoalbum per NFC mit einem Tap – ohne App, ohne komplizierten Link.",
    },
    {
      number: "4",
      title: "Fotos sammeln & bestellen",
      text: "Fotos können angesehen, hochgeladen, geliked und als hochwertige Prints bestellt werden.",
    },
  ];

  const benefits = [
    "NFC-Erinnerung für Gäste",
    "Eventalbum ohne App öffnen",
    "Fotos hochladen & teilen",
    "Prints mit oder ohne Rahmen bestellen",
  ];

  return (
    <main style={styles.page}>
      <section style={styles.heroSection}>
        <div style={styles.heroTextCol}>
          <div style={styles.heroBadge}>Snapkey für Hochzeiten & Events</div>

          <h1 style={styles.heroTitle}>
            Dein Event als NFC-Erinnerung.
            <br />
            Fotos sammeln, teilen & für immer behalten.
          </h1>

          <p style={styles.heroText}>
            Erstelle eine persönliche Eventseite und verbinde sie mit Snapkeys
            für deine Gäste. Fotos hochladen, ansehen und als hochwertige
            Erinnerung bestellen – alles an einem Ort.
          </p>

          <div style={styles.heroActionRow}>
            <Link href="/event" style={styles.primaryButton}>
              Event erstellen
            </Link>

            <a href="#how-it-works" style={styles.secondaryButton}>
              So funktioniert’s
            </a>
          </div>

          <div style={styles.heroTrustRow}>
            {benefits.map((item) => (
              <div key={item} style={styles.heroTrustItem}>
                ✓ {item}
              </div>
            ))}
          </div>
        </div>

        <div style={styles.heroImageCol}>
          <img
            src="/hero-nfc.jpg"
            alt="Snapkey mit Smartphone und geöffneter Eventseite"
            style={styles.heroImage}
            onClick={() =>
              openImage(
                "/hero-nfc.jpg",
                "Snapkey mit Smartphone und geöffneter Eventseite"
              )
            }
          />
        </div>
      </section>

      <section style={styles.explainSection}>
        <div style={styles.explainCard}>
          <div style={styles.sectionEyebrow}>Was ist Snapkey?</div>
          <h2 style={styles.sectionTitle}>
            Kein normales Fotoalbum. Ein echtes Erinnerungsstück für deine Gäste.
          </h2>
          <p style={styles.sectionText}>
            Snapkey verbindet ein digitales Eventalbum mit einem physischen NFC
            Key. Deine Gäste können den Key mit nach Hause nehmen und später
            jederzeit wieder in eure Erinnerungen eintauchen.
          </p>

          <div style={styles.featureGrid}>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>⌁</div>
              <div style={styles.featureTitle}>NFC statt Link</div>
              <div style={styles.featureText}>
                Ein Tap mit dem Smartphone öffnet direkt die Eventseite.
              </div>
            </div>

            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>📸</div>
              <div style={styles.featureTitle}>Fotos gemeinsam sammeln</div>
              <div style={styles.featureText}>
                Gäste können Bilder ansehen, hochladen, liken und kommentieren.
              </div>
            </div>

            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🖼</div>
              <div style={styles.featureTitle}>Prints bestellen</div>
              <div style={styles.featureText}>
                Lieblingsbilder lassen sich direkt als Erinnerung bestellen.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="snapkeys" style={styles.productSection}>
        <div style={styles.sectionIntro}>
          <div style={styles.sectionEyebrow}>Snapkey Varianten</div>
          <h2 style={styles.sectionTitle}>Für jedes Budget der passende Key</h2>
          <p style={styles.sectionText}>
            Manche möchten für jeden Gast einen günstigen NFC Zugang. Andere
            möchten ein hochwertiges Erinnerungsstück. Deshalb bleibt Snapkey
            flexibel.
          </p>
        </div>

        <div style={styles.productGrid}>
          {snapkeyTypes.map((item) => (
            <div key={item.title} style={styles.productCard}>
              <img
                src={item.image}
                alt={item.title}
                style={styles.productImage}
                onClick={() => openImage(item.image, item.title)}
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
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" style={styles.storySection}>
        <div style={styles.storyImageWrap}>
          <img
            src="/how-it-works.jpg"
            alt="Snapkey neben Smartphone mit geöffneter Eventseite"
            style={styles.storyImage}
            onClick={() =>
              openImage(
                "/how-it-works.jpg",
                "Snapkey neben Smartphone mit geöffneter Eventseite"
              )
            }
          />
        </div>

        <div style={styles.storyContent}>
          <div style={styles.sectionEyebrow}>So funktioniert’s</div>
          <h2 style={styles.sectionTitle}>
            Von der Eventseite bis zum NFC Key – alles in einem Flow.
          </h2>
          <p style={styles.sectionText}>
            Du erstellst dein Event, wählst passende Snapkeys aus und aktivierst
            dein Event. Danach können Gäste über den Snapkey direkt auf das
            Album zugreifen.
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

      <section style={styles.printSection}>
        <div style={styles.printContent}>
          <div style={styles.sectionEyebrow}>Mehr als digital</div>
          <h2 style={styles.sectionTitle}>
            Aus Eventfotos werden echte Erinnerungsstücke.
          </h2>
          <p style={styles.sectionText}>
            Gäste können ihre Lieblingsbilder direkt aus dem Eventalbum
            auswählen und als hochwertige Prints bestellen – mit oder ohne
            Rahmen.
          </p>

          <div style={styles.printList}>
            <div style={styles.printListItem}>
              ✓ Ideal für Hochzeiten, Familienfeiern und besondere Momente
            </div>
            <div style={styles.printListItem}>
              ✓ Gäste bestellen nur die Bilder, die sie wirklich möchten
            </div>
            <div style={styles.printListItem}>
              ✓ Digitale Erinnerungen werden greifbar
            </div>
          </div>
        </div>

        <div style={styles.printImageWrap}>
          <img
            src="/prints-order.jpg"
            alt="Bestellbare Erinnerungsfotos mit und ohne Rahmen"
            style={styles.printImage}
            onClick={() =>
              openImage(
                "/prints-order.jpg",
                "Bestellbare Erinnerungsfotos mit und ohne Rahmen"
              )
            }
          />
        </div>
      </section>

      <section style={styles.finalSection}>
        <div style={styles.finalCard}>
          <div style={styles.sectionEyebrowLight}>Bereit für dein Event?</div>
          <h2 style={styles.finalTitle}>
            Erstelle dein Eventalbum.
            <br />
            Wähle deine Snapkeys.
            <br />
            Lass Erinnerungen bleiben.
          </h2>
          <p style={styles.finalText}>
            Snapkey macht aus deinem Event mehr als nur eine Galerie. Deine
            Gäste bekommen einen persönlichen Zugang, ein Erinnerungsstück und
            die Möglichkeit, Lieblingsbilder direkt zu bestellen.
          </p>

          <div style={styles.finalButtons}>
            <Link href="/event" style={styles.primaryButtonLight}>
              Event jetzt erstellen
            </Link>

            <a href="#snapkeys" style={styles.secondaryButtonLight}>
              Snapkey Varianten ansehen
            </a>
          </div>
        </div>
      </section>

      {lightboxImage && (
        <div style={styles.lightbox} onClick={closeImage}>
          <div
            style={styles.lightboxContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              style={styles.lightboxClose}
              onClick={closeImage}
            >
              ✕
            </button>

            <img
              src={lightboxImage}
              alt={lightboxAlt || "Bildvorschau"}
              style={styles.lightboxImage}
            />
          </div>
        </div>
      )}

      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <a href="/impressum" style={styles.footerLink}>
            Impressum
          </a>

          <span style={styles.footerDivider}>|</span>

          <a href="/datenschutz" style={styles.footerLink}>
            Datenschutz
          </a>
        </div>
      </footer>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #f7f2ec 0%, #fcfaf7 38%, #f8f6f3 100%)",
    padding: "14px 12px 56px",
    overflowX: "hidden",
  },

  heroSection: {
    maxWidth: "1320px",
    margin: "0 auto 34px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "26px",
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
    padding: "9px 13px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },

  heroTitle: {
    margin: 0,
    fontSize: "clamp(38px, 8vw, 72px)",
    lineHeight: "0.98",
    fontWeight: "900",
    color: "#2e241d",
    letterSpacing: "-0.04em",
  },

  heroText: {
    margin: 0,
    maxWidth: "720px",
    fontSize: "clamp(16px, 3.2vw, 20px)",
    lineHeight: "1.75",
    color: "#5b4d42",
  },

  heroActionRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },

  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    backgroundColor: "#4b3a2d",
    color: "#fff",
    border: "none",
    padding: "14px 18px",
    borderRadius: "14px",
    fontSize: "15px",
    fontWeight: "800",
    minHeight: "50px",
    minWidth: "190px",
    boxShadow: "0 12px 26px rgba(75, 58, 45, 0.18)",
  },

  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    backgroundColor: "#fff",
    color: "#4b3a2d",
    border: "1px solid #dbcbbd",
    padding: "14px 18px",
    borderRadius: "14px",
    fontSize: "15px",
    fontWeight: "800",
    minHeight: "50px",
    minWidth: "190px",
    boxShadow: "0 6px 18px rgba(46, 36, 29, 0.05)",
  },

  heroTrustRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "10px",
    marginTop: "4px",
  },

  heroTrustItem: {
    background: "rgba(255,255,255,0.82)",
    border: "1px solid #eadfd4",
    borderRadius: "14px",
    padding: "11px 12px",
    color: "#4f4339",
    fontSize: "14px",
    fontWeight: "700",
  },

  heroImageCol: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  heroImage: {
    width: "100%",
    maxWidth: "760px",
    borderRadius: "30px",
    display: "block",
    boxShadow: "0 24px 48px rgba(46, 36, 29, 0.14)",
    cursor: "pointer",
    objectFit: "cover",
  },

  explainSection: {
    maxWidth: "1180px",
    margin: "0 auto 42px",
  },

  explainCard: {
    background: "#fff",
    border: "1px solid #eadfd4",
    borderRadius: "28px",
    padding: "26px 20px",
    display: "grid",
    gap: "16px",
    textAlign: "center",
    boxShadow: "0 14px 30px rgba(46, 36, 29, 0.05)",
  },

  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
    marginTop: "8px",
    textAlign: "left",
  },

  featureCard: {
    background: "#faf7f3",
    border: "1px solid #eadfd4",
    borderRadius: "20px",
    padding: "16px",
    display: "grid",
    gap: "8px",
  },

  featureIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "999px",
    background: "#efe5db",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
  },

  featureTitle: {
    fontSize: "16px",
    fontWeight: "800",
    color: "#2e241d",
  },

  featureText: {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#6b5c50",
  },

  productSection: {
    maxWidth: "1320px",
    margin: "0 auto 42px",
    display: "grid",
    gap: "24px",
  },

  sectionIntro: {
    textAlign: "center",
    display: "grid",
    gap: "10px",
    maxWidth: "920px",
    margin: "0 auto",
  },

  sectionEyebrow: {
    fontSize: "12px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#9a7b61",
  },

  sectionEyebrowLight: {
    fontSize: "12px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#eaded1",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "clamp(28px, 6vw, 44px)",
    lineHeight: "1.08",
    fontWeight: "900",
    color: "#2e241d",
    letterSpacing: "-0.02em",
  },

  sectionText: {
    margin: 0,
    fontSize: "clamp(15px, 3.2vw, 18px)",
    lineHeight: "1.75",
    color: "#5f5349",
  },

  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "18px",
  },

  productCard: {
    background: "#fff",
    border: "1px solid #eadfd4",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 14px 28px rgba(46, 36, 29, 0.05)",
    display: "grid",
  },

  productImage: {
    width: "100%",
    height: "280px",
    objectFit: "cover",
    display: "block",
    cursor: "pointer",
  },

  productBody: {
    padding: "18px",
    display: "grid",
    gap: "10px",
  },

  productSubtitle: {
    fontSize: "12px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "#a28064",
  },

  productTitle: {
    margin: 0,
    fontSize: "26px",
    lineHeight: "1.15",
    fontWeight: "900",
    color: "#2e241d",
  },

  productDescription: {
    margin: 0,
    fontSize: "14px",
    lineHeight: "1.72",
    color: "#63564b",
  },

  productList: {
    display: "grid",
    gap: "8px",
    marginTop: "2px",
  },

  productListItem: {
    fontSize: "14px",
    lineHeight: "1.5",
    color: "#4f4339",
  },

  storySection: {
    maxWidth: "1320px",
    margin: "0 auto 42px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "22px",
    alignItems: "center",
    background: "rgba(255,255,255,0.82)",
    border: "1px solid #eadfd4",
    borderRadius: "28px",
    padding: "18px",
    boxShadow: "0 12px 26px rgba(46, 36, 29, 0.04)",
  },

  storyImageWrap: {
    width: "100%",
  },

  storyImage: {
    width: "100%",
    borderRadius: "22px",
    display: "block",
    cursor: "pointer",
    objectFit: "cover",
    maxHeight: "560px",
  },

  storyContent: {
    display: "grid",
    gap: "14px",
  },

  stepList: {
    display: "grid",
    gap: "14px",
    marginTop: "4px",
  },

  stepItem: {
    display: "grid",
    gridTemplateColumns: "48px 1fr",
    gap: "12px",
    alignItems: "start",
  },

  stepNumber: {
    width: "42px",
    height: "42px",
    borderRadius: "999px",
    background: "#efe1d2",
    color: "#4b3a2d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "16px",
  },

  stepTitle: {
    fontSize: "17px",
    fontWeight: "800",
    color: "#2e241d",
    marginBottom: "4px",
  },

  stepText: {
    fontSize: "14px",
    lineHeight: "1.65",
    color: "#5e5147",
  },

  printSection: {
    maxWidth: "1320px",
    margin: "0 auto 42px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "22px",
    alignItems: "center",
    background: "#fff",
    border: "1px solid #eadfd4",
    borderRadius: "28px",
    padding: "18px",
    boxShadow: "0 14px 30px rgba(46, 36, 29, 0.05)",
  },

  printContent: {
    display: "grid",
    gap: "12px",
  },

  printList: {
    display: "grid",
    gap: "8px",
    marginTop: "4px",
  },

  printListItem: {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#4f4339",
  },

  printImageWrap: {
    width: "100%",
  },

  printImage: {
    width: "100%",
    borderRadius: "22px",
    display: "block",
    cursor: "pointer",
    objectFit: "cover",
    maxHeight: "540px",
  },

  finalSection: {
    maxWidth: "1320px",
    margin: "0 auto",
  },

  finalCard: {
    background:
      "linear-gradient(135deg, #4b3a2d 0%, #5b4637 50%, #715948 100%)",
    color: "#fff",
    borderRadius: "30px",
    padding: "34px 20px",
    display: "grid",
    gap: "14px",
    textAlign: "center",
    boxShadow: "0 18px 42px rgba(46, 36, 29, 0.12)",
  },

  finalTitle: {
    margin: 0,
    fontSize: "clamp(30px, 6vw, 46px)",
    lineHeight: "1.1",
    fontWeight: "900",
    letterSpacing: "-0.02em",
  },

  finalText: {
    margin: 0,
    fontSize: "clamp(15px, 3.2vw, 18px)",
    lineHeight: "1.78",
    opacity: 0.94,
    maxWidth: "900px",
    marginInline: "auto",
  },

  finalButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "4px",
  },

  primaryButtonLight: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    backgroundColor: "#fff",
    color: "#4b3a2d",
    border: "none",
    padding: "14px 18px",
    borderRadius: "14px",
    fontSize: "15px",
    fontWeight: "900",
    minHeight: "50px",
    minWidth: "190px",
  },

  secondaryButtonLight: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.25)",
    padding: "14px 18px",
    borderRadius: "14px",
    fontSize: "15px",
    fontWeight: "900",
    minHeight: "50px",
    minWidth: "190px",
  },

  lightbox: {
    position: "fixed",
    inset: 0,
    background: "rgba(22, 18, 14, 0.72)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "16px",
  },

  lightboxContent: {
    position: "relative",
    maxWidth: "92vw",
    maxHeight: "92vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  lightboxImage: {
    maxWidth: "92vw",
    maxHeight: "88vh",
    width: "auto",
    height: "auto",
    display: "block",
    borderRadius: "18px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
  },

  lightboxClose: {
    position: "absolute",
    top: "-18px",
    right: "-6px",
    background: "#fff",
    color: "#2e241d",
    border: "none",
    borderRadius: "999px",
    width: "40px",
    height: "40px",
    cursor: "pointer",
    fontSize: "20px",
    fontWeight: "900",
    boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
  },

  footer: {
    marginTop: "60px",
    padding: "20px 0",
    borderTop: "1px solid #eadfd4",
    display: "flex",
    justifyContent: "center",
  },

  footerInner: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    fontSize: "14px",
  },

  footerLink: {
    color: "#5b4d42",
    textDecoration: "none",
    fontWeight: "700",
  },

  footerDivider: {
    color: "#cbb9a8",
  },
};
