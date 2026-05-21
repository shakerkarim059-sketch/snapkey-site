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
      title: "Snapkey Mini",
      subtitle: "Der günstige Einstieg",
      price: "ab 1,90 € / Stück",
      description:
        "Klein, robust und perfekt für viele Gäste. Der Snapkey Mini öffnet das Eventalbum mit einem Tap.",
      image: "/nfc-chip.jpg",
      points: ["Günstigste Variante", "Ideal für viele Gäste", "Kompakt & praktisch"],
    },
    {
      title: "Snapkey Card",
      subtitle: "Elegant für Events",
      price: "ab 2,90 € / Stück",
      description:
        "Eine hochwertige Snapkey-Karte im Eventdesign. Ideal für Hochzeiten, Familienfeiern und besondere Erinnerungen.",
      image: "/pvc-cards.jpg",
      points: ["Premium Kartenlook", "Key + QR-Code", "Perfekt für Hochzeit & Event"],
    },
    {
      title: "Snapkey Wood",
      subtitle: "Das besondere Erinnerungsstück",
      price: "ab 7,90 € / Stück",
      description:
        "Ein natürlicher Holzanhänger mit persönlichem Design. Wertig, emotional und ideal als Erinnerung zum Mitnehmen.",
      image: "/wood-keychain.jpg",
      points: ["Natürliches Holz", "Sehr emotional", "Ideal als Geschenk"],
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
      text: "Du wählst passende Snapkeys für deine Gäste – Mini, Card oder Wood.",
    },
    {
      number: "3",
      title: "Gäste scannen",
      text: "Gäste öffnen das Album per Tap oder QR-Code – ohne App und ohne komplizierten Link.",
    },
    {
      number: "4",
      title: "Fotos sammeln",
      text: "Alle können Fotos ansehen, hochladen und gemeinsame Erinnerungen festhalten.",
    },
  ];

  const benefits = [
    "Ohne App nutzbar",
    "Key & QR-Code",
    "Für Hochzeit, Familie & Events",
    "Persönliche Erinnerungsstücke",
  ];

  return (
    <main style={styles.page}>
      <section style={styles.heroSection}>
        <div style={styles.heroOverlay} />

        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>Snapkey für Hochzeiten & Events</div>

          <h1 style={styles.heroTitle}>
            Erinnerungen sammeln.
            <br />
            Mit einem einfachen Tap.
          </h1>

          <p style={styles.heroText}>
            Erstelle deine Eventseite und verbinde sie mit persönlichen Snapkeys
            für deine Gäste. Fotos teilen, hochladen und immer wieder erleben.
          </p>

          <p style={styles.heroSubText}>
            Nicht nur Fotos – Erinnerungen, die deine Gäste mit nach Hause nehmen.
          </p>

          <div style={styles.heroActionRow}>
            <Link href="/event" style={styles.primaryButton}>
              Event erstellen
            </Link>

            <a href="#snapkeys" style={styles.secondaryButton}>
              Snapkeys ansehen
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
      </section>

      <section style={styles.explainSection}>
        <div style={styles.explainCard}>
          <div style={styles.sectionEyebrow}>Was ist Snapkey?</div>
          <h2 style={styles.sectionTitle}>
            Kein normales Fotoalbum. Ein echtes Erinnerungsstück.
          </h2>
          <p style={styles.sectionText}>
            Snapkey verbindet ein digitales Eventalbum mit einem physischen
            Zugang für deine Gäste. Ein Tap genügt – und alle Erinnerungen sind
            sofort da.
          </p>

          <div style={styles.featureGrid}>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>⌁</div>
              <div style={styles.featureTitle}>Tap statt Link</div>
              <div style={styles.featureText}>
                Smartphone dranhalten und direkt die Eventseite öffnen.
              </div>
            </div>

            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>📸</div>
              <div style={styles.featureTitle}>Fotos sammeln</div>
              <div style={styles.featureText}>
                Gäste können Bilder ansehen, hochladen und teilen.
              </div>
            </div>

            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>♡</div>
              <div style={styles.featureTitle}>Erinnerung behalten</div>
              <div style={styles.featureText}>
                Jeder Snapkey bleibt als persönliches Erinnerungsstück.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="snapkeys" style={styles.productSection}>
        <div style={styles.sectionIntro}>
          <div style={styles.sectionEyebrow}>Snapkey Varianten</div>
          <h2 style={styles.sectionTitle}>Drei Produkte. Ein gemeinsames Album.</h2>
          <p style={styles.sectionText}>
            Vom günstigen Mini für viele Gäste bis zum hochwertigen Holzanhänger
            als besonderes Erinnerungsstück.
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
                <div style={styles.productPrice}>{item.price}</div>
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

        <div style={styles.pricingNote}>
          Eventseite ab 29 € + Snapkeys je nach Auswahl
        </div>
      </section>

      <section id="how-it-works" style={styles.storySection}>
        <div style={styles.storyImageWrap}>
          <img
            src="/snapkey-products.jpg"
            alt="Snapkey Produkte Übersicht"
            style={styles.storyImage}
            onClick={() => openImage("/snapkey-products.jpg", "Snapkey Produkte")}
          />
        </div>

        <div style={styles.storyContent}>
          <div style={styles.sectionEyebrow}>So funktioniert’s</div>
          <h2 style={styles.sectionTitle}>
            Event erstellen. Snapkey wählen. Erinnerungen teilen.
          </h2>
          <p style={styles.sectionText}>
            Du erstellst dein Eventalbum, wählst passende Snapkeys aus und gibst
            deinen Gästen einen einfachen Zugang zu euren gemeinsamen Momenten.
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
            Aus Momenten werden Erinnerungen zum Mitnehmen.
          </h2>
          <p style={styles.sectionText}>
            Ob Hochzeit, Familie, Geburtstag oder Reise – Snapkey macht aus
            deinem Event ein gemeinsames Album mit echtem Erinnerungswert.
          </p>

          <div style={styles.printList}>
            <div style={styles.printListItem}>✓ Für Hochzeiten & Familienfeiern</div>
            <div style={styles.printListItem}>✓ Gäste brauchen keine App</div>
            <div style={styles.printListItem}>✓ Persönlicher Zugang per Key oder QR</div>
          </div>
        </div>

        <div style={styles.printImageWrap}>
          <img
            src="/pvc-cards.jpg"
            alt="Snapkey Karten"
            style={styles.printImage}
            onClick={() => openImage("/pvc-cards.jpg", "Snapkey Karten")}
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
            Snapkey macht aus deinem Event mehr als eine Galerie. Deine Gäste
            bekommen einen persönlichen Zugang und ein Erinnerungsstück.
          </p>

          <div style={styles.finalButtons}>
            <Link href="/event" style={styles.primaryButtonLight}>
              Event jetzt erstellen
            </Link>

            <a href="#snapkeys" style={styles.secondaryButtonLight}>
              Varianten ansehen
            </a>
          </div>
        </div>
      </section>

      {lightboxImage && (
        <div style={styles.lightbox} onClick={closeImage}>
          <div style={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <button type="button" style={styles.lightboxClose} onClick={closeImage}>
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
    position: "relative",
    maxWidth: "1320px",
    minHeight: "min(760px, 86vh)",
    margin: "0 auto 34px",
    borderRadius: "34px",
    overflow: "hidden",
    display: "flex",
    alignItems: "flex-end",
    padding: "26px",
    boxSizing: "border-box",
    backgroundImage: "url('/hero-snapkey.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    boxShadow: "0 24px 56px rgba(46, 36, 29, 0.16)",
  },

  heroOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(90deg, rgba(12,10,8,0.88) 0%, rgba(12,10,8,0.72) 34%, rgba(12,10,8,0.35) 68%, rgba(12,10,8,0.2) 100%)",
    zIndex: 1,
  },

  heroContent: {
    position: "relative",
    zIndex: 2,
    maxWidth: "680px",
    display: "grid",
    gap: "16px",
  },

  heroBadge: {
    width: "fit-content",
    background: "rgba(255,255,255,0.92)",
    color: "#4b3a2d",
    padding: "9px 13px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },

  heroTitle: {
    margin: 0,
    fontSize: "clamp(38px, 6vw, 72px)",
    lineHeight: "0.98",
    fontWeight: "900",
    color: "#fff",
    letterSpacing: "-0.04em",
    textShadow: "0 10px 34px rgba(0,0,0,0.45)",
  },

  heroText: {
    margin: 0,
    maxWidth: "620px",
    fontSize: "clamp(16px, 2.4vw, 20px)",
    lineHeight: "1.65",
    color: "rgba(255,255,255,0.94)",
    textShadow: "0 8px 24px rgba(0,0,0,0.35)",
  },

  heroSubText: {
    margin: 0,
    fontSize: "15px",
    color: "rgba(255,255,255,0.85)",
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
    backgroundColor: "#111827",
    color: "#fff",
    border: "none",
    padding: "14px 18px",
    borderRadius: "14px",
    fontSize: "15px",
    fontWeight: "800",
    minHeight: "50px",
    minWidth: "190px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
  },

  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    backgroundColor: "rgba(255,255,255,0.94)",
    color: "#111827",
    border: "1px solid rgba(255,255,255,0.4)",
    padding: "14px 18px",
    borderRadius: "14px",
    fontSize: "15px",
    fontWeight: "800",
    minHeight: "50px",
    minWidth: "190px",
  },

  heroTrustRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "10px",
    marginTop: "4px",
  },

  heroTrustItem: {
    background: "rgba(255,255,255,0.14)",
    border: "1px solid rgba(255,255,255,0.22)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    borderRadius: "14px",
    padding: "11px 12px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "800",
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
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
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
    height: "300px",
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

  productPrice: {
    width: "fit-content",
    background: "#f4ede6",
    color: "#4b3a2d",
    border: "1px solid #eadfd4",
    borderRadius: "999px",
    padding: "7px 11px",
    fontSize: "14px",
    fontWeight: "900",
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

  pricingNote: {
    marginTop: "12px",
    fontSize: "14px",
    color: "#6b5c50",
    textAlign: "center",
    fontWeight: "600",
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
