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
      title: "Snapkey Familie",
      subtitle: "Warm, persönlich, hochwertig",
      description:
        "Ein individueller Holz-Schlüsselanhänger für Familienalben, Kinderfotos und gemeinsame Erinnerungen. Ideal für Zuhause oder als persönliches Geschenk.",
      image: "/nfc-family.jpg",
      points: [
        "Holz-Schlüsselanhänger mit persönlichem Look",
        "Ideal für Familienalben & Erinnerungen",
        "Emotional, langlebig und hochwertig",
      ],
    },
    {
      title: "Snapkey Hochzeit",
      subtitle: "Elegant, schlicht, perfekt für Gäste",
      description:
        "Eine schöne und einfache Lösung für Hochzeiten. Perfekt für Gäste, Tische oder kleine Erinnerungsgeschenke mit direktem Zugang zur Eventseite.",
      image: "/nfc-wedding.jpg",
      points: [
        "Schlichtes und stilvolles Design",
        "Ideal für mehrere Gäste",
        "Direkter Zugang zu Hochzeitsfotos und Bestellungen",
      ],
    },
    {
      title: "Snapkey Event",
      subtitle: "Modern und praktisch",
      description:
        "Für Geburtstage, Firmenfeiern, Jubiläen oder geschlossene Veranstaltungen. Gäste gelangen schnell zur passenden Eventseite und zu ihren Bildern.",
      image: "/nfc-event.jpg",
      points: [
        "Modernes Design",
        "Ideal für Gruppen und Events",
        "Perfekt für schnellen Zugang zu Erinnerungen",
      ],
    },
    {
      title: "Snapkey Reise",
      subtitle: "Kompakt und flexibel",
      description:
        "Für Reisealben, Urlaubsfotos und gemeinsame Abenteuer. Ein kompakter Snapkey für Erinnerungen, die man immer wieder öffnen möchte.",
      image: "/nfc-travel.jpg",
      points: [
        "Leicht mitzunehmen",
        "Perfekt für Urlaubsalben",
        "Praktisch und persönlich zugleich",
      ],
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Snapkey auswählen",
      text: "Du wählst den Snapkey, der zu deinem Anlass passt – Familie, Hochzeit, Event oder Reise.",
    },
    {
      number: "2",
      title: "Anlass angeben",
      text: "Du bestellst einen oder mehrere Snapkeys und gibst an, für welchen Anlass die Seite erstellt werden soll.",
    },
    {
      number: "3",
      title: "Ich richte alles ein",
      text: "Ich erstelle die passende Eventseite für dich und verbinde sie mit deinem Snapkey.",
    },
    {
      number: "4",
      title: "Öffnen & Erinnern",
      text: "Der Snapkey wird geliefert und eure Erinnerungen lassen sich direkt per Smartphone öffnen.",
    },
  ];

  const benefits = [
    {
      title: "Komplettservice",
      text: "Nicht nur ein Produkt – ich richte die passende Eventseite direkt für dich ein.",
    },
    {
      title: "Persönlich",
      text: "Snapkeys werden passend zu eurem Anlass ausgewählt und emotional erlebbar.",
    },
    {
      title: "Einfach für Gäste",
      text: "Ein Tap genügt und Bilder, Alben oder die Eventseite öffnen sich sofort.",
    },
    {
      title: "Fotos bestellbar",
      text: "Lieblingsbilder können direkt einzeln oder mit Rahmen bestellt werden.",
    },
  ];

  return (
    <main style={styles.page}>
      <section style={styles.heroSection}>
        <div style={styles.heroTextCol}>
          <div style={styles.heroBadge}>Snapkey für Erinnerungen & Events</div>

          <h1 style={styles.heroTitle}>
            Snapkey verbindet
            <br />
            echte Momente mit
            <br />
            einer fertigen Eventseite.
          </h1>

          <p style={styles.heroText}>
            Du wählst einen oder mehrere Snapkeys für Familie, Hochzeit oder
            Event – ich richte die passende Eventseite für dich ein. So erhalten
            Gäste und Familienmitglieder direkten Zugang zu Fotos,
            Erinnerungen und auf Wunsch auch zu bestellbaren Bildern.
          </p>

          <div style={styles.heroActionRow}>
            <Link href="/event" style={styles.primaryButton}>
              Jetzt Snapkey anfragen
            </Link>

            <a href="#snapkeys" style={styles.secondaryButton}>
              Varianten ansehen
            </a>
          </div>

          <div style={styles.heroIconRow}>
            <div style={styles.heroIconCard}>
              <div style={styles.heroIconCircle}>1</div>
              <div style={styles.heroIconTitle}>Snapkey wählen</div>
              <div style={styles.heroIconText}>
                Passend für Familie, Hochzeit, Event oder Reise
              </div>
            </div>

            <div style={styles.heroIconCard}>
              <div style={styles.heroIconCircle}>2</div>
              <div style={styles.heroIconTitle}>Eventseite erhalten</div>
              <div style={styles.heroIconText}>
                Ich richte die passende Seite direkt für dich ein
              </div>
            </div>

            <div style={styles.heroIconCard}>
              <div style={styles.heroIconCircle}>3</div>
              <div style={styles.heroIconTitle}>Bilder öffnen & bestellen</div>
              <div style={styles.heroIconText}>
                Gäste und Familie können Erinnerungen ansehen und Fotos bestellen
              </div>
            </div>
          </div>
        </div>

        <div style={styles.heroImageCol}>
          <img
            src="/hero-nfc.jpg"
            alt="Snapkey mit Smartphone und geöffneter Erinnerungsseite"
            style={styles.heroImage}
            onClick={() =>
              openImage(
                "/hero-nfc.jpg",
                "Snapkey mit Smartphone und geöffneter Erinnerungsseite"
              )
            }
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

      <section style={styles.serviceSection}>
        <div style={styles.serviceCard}>
          <div style={styles.sectionEyebrow}>Was du bei Snapkey bekommst</div>
          <h2 style={styles.sectionTitle}>
            Nicht nur ein Anhänger. Ein fertiges Erinnerungs-Erlebnis.
          </h2>
          <p style={styles.sectionText}>
            Bei Snapkey bestellst du nicht einfach nur einen NFC Anhänger. Du
            bestellst einen personalisierten Zugang zu einer fertigen Eventseite,
            die ich für dich einrichte. So wird aus einem schönen physischen
            Produkt ein kompletter Erinnerungszugang für Familie, Gäste oder
            Freunde.
          </p>
        </div>
      </section>

      <section id="snapkeys" style={styles.productSection}>
        <div style={styles.sectionIntro}>
          <div style={styles.sectionEyebrow}>Snapkey Varianten</div>
          <h2 style={styles.sectionTitle}>
            Der passende Snapkey für deinen Anlass
          </h2>
          <p style={styles.sectionText}>
            Je nach Anlass passt eine andere Lösung. Für Familien darf es
            hochwertig und emotional sein, für Hochzeiten schlicht, schön und
            auch in größerer Stückzahl gut geeignet.
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

                <div style={styles.productFooter}>
                  <Link href="/event" style={styles.cardButton}>
                    Anfrage starten
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
            src="/prints-order.jpg"
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
          <div style={styles.sectionEyebrow}>So läuft es ab</div>
          <h2 style={styles.sectionTitle}>
            Du bestellst den Snapkey – ich kümmere mich um den Rest
          </h2>
          <p style={styles.sectionText}>
            Snapkey ist bewusst einfach aufgebaut: Du wählst das passende
            Produkt, gibst deinen Anlass an und ich richte die dazugehörige
            Seite ein. So ist am Ende alles fertig verbunden – physischer
            Snapkey, digitale Eventseite und ein einfacher Zugang zu euren
            Erinnerungen.
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
          <div style={styles.sectionEyebrow}>Zusätzlicher Mehrwert</div>
          <h2 style={styles.sectionTitle}>
            Erinnerungen nicht nur ansehen – direkt bestellen
          </h2>
          <p style={styles.sectionText}>
            Gerade bei Hochzeiten und besonderen Events entstehen Bilder, die
            sonst oft nur digital bleiben oder nur beim Brautpaar landen. Mit
            Snapkey können Gäste ihre Lieblingsbilder direkt auswählen und
            bestellen – einzeln oder mit Rahmen.
          </p>

          <div style={styles.printList}>
            <div style={styles.printListItem}>
              ✓ Gäste können ihre eigenen Erinnerungsbilder direkt auswählen
            </div>
            <div style={styles.printListItem}>
              ✓ Bilder sind einzeln oder mit Rahmen bestellbar
            </div>
            <div style={styles.printListItem}>
              ✓ Besonders stark für Hochzeiten und emotionale Anlässe
            </div>
            <div style={styles.printListItem}>
              ✓ Aus digitalen Momenten werden echte Erinnerungsstücke
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
          <div style={styles.sectionEyebrow}>Snapkey für deinen Anlass</div>
          <h2 style={styles.finalTitle}>
            Ein persönlicher Snapkey.
            <br />
            Eine fertige Eventseite.
            <br />
            Erinnerungen, die bleiben.
          </h2>
          <p style={styles.finalText}>
            Ob Familie, Hochzeit oder Event: Mit Snapkey bekommen deine Gäste
            und Lieblingsmenschen nicht nur Zugriff auf Bilder, sondern eine
            echte, schöne und einfache Möglichkeit, Erinnerungen wiederzufinden
            und auf Wunsch direkt zu bestellen.
          </p>

          <div style={styles.finalButtons}>
            <Link href="/event" style={styles.primaryButton}>
              Jetzt Snapkey anfragen
            </Link>

            <a href="#snapkeys" style={styles.secondaryButton}>
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
    </main>
  );
}

const styles = {
page: {
minHeight: "100vh",
background:
"linear-gradient(180deg, #f7f2ec 0%, #fcfaf7 35%, #f8f6f3 100%)",
padding: "12px 12px 48px",
overflowX: "hidden",
},

heroSection: {
maxWidth: "1280px",
margin: "0 auto 20px",
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
gap: "16px",
alignItems: "center",
},

heroTextCol: {
display: "grid",
gap: "14px",
},

heroBadge: {
width: "fit-content",
background: "#eaded1",
color: "#7a5c45",
padding: "8px 12px",
borderRadius: "999px",
fontSize: "11px",
fontWeight: "700",
textTransform: "uppercase",
letterSpacing: "0.05em",
},

heroTitle: {
margin: 0,
fontSize: "clamp(30px, 9vw, 60px)",
lineHeight: "1.02",
fontWeight: "800",
color: "#2e241d",
},

heroText: {
margin: 0,
maxWidth: "680px",
fontSize: "clamp(15px, 4vw, 19px)",
lineHeight: "1.65",
color: "#5b4d42",
},

heroActionRow: {
display: "grid",
gridTemplateColumns: "1fr",
gap: "10px",
width: "100%",
},

primaryButton: {
display: "inline-flex",
alignItems: "center",
justifyContent: "center",
textDecoration: "none",
backgroundColor: "#4b3a2d",
color: "#fff",
border: "none",
padding: "14px 16px",
borderRadius: "14px",
fontSize: "15px",
fontWeight: "700",
width: "100%",
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
padding: "14px 16px",
borderRadius: "14px",
fontSize: "15px",
fontWeight: "700",
width: "100%",
},

heroIconRow: {
display: "grid",
gridTemplateColumns: "1fr",
gap: "10px",
},

heroIconCard: {
background: "rgba(255,255,255,0.8)",
border: "1px solid #eadfd4",
borderRadius: "16px",
padding: "12px",
display: "grid",
gap: "6px",
},

heroIconCircle: {
width: "38px",
height: "38px",
borderRadius: "999px",
background: "#efe5db",
display: "flex",
alignItems: "center",
justifyContent: "center",
},

heroImage: {
width: "100%",
maxWidth: "600px",
borderRadius: "20px",
display: "block",
boxShadow: "0 20px 42px rgba(46, 36, 29, 0.12)",
cursor: "pointer",
},

benefitBar: {
maxWidth: "1280px",
margin: "0 auto 22px",
background: "#fff",
border: "1px solid #eadfd4",
borderRadius: "18px",
padding: "12px",
display: "grid",
gridTemplateColumns: "1fr",
gap: "8px",
},

benefitItem: {
padding: "6px",
},

benefitTitle: {
fontSize: "14px",
fontWeight: "700",
color: "#2e241d",
},

benefitText: {
fontSize: "13px",
color: "#6b5c50",
},

productSection: {
maxWidth: "1280px",
margin: "0 auto 30px",
},

sectionIntro: {
textAlign: "center",
marginBottom: "16px",
},

sectionTitle: {
fontSize: "clamp(24px, 6vw, 42px)",
fontWeight: "800",
color: "#2e241d",
},

sectionText: {
fontSize: "15px",
color: "#5f5349",
},

productGrid: {
display: "grid",
gridTemplateColumns: "1fr",
gap: "16px",
},

productCard: {
background: "#fff",
borderRadius: "18px",
overflow: "hidden",
border: "1px solid #eadfd4",
},

productImage: {
width: "100%",
height: "240px",
objectFit: "cover",
cursor: "pointer",
},

productBody: {
padding: "14px",
},

productTitle: {
fontSize: "20px",
fontWeight: "700",
color: "#2e241d",
},

productDescription: {
fontSize: "14px",
color: "#63564b",
},

productFooter: {
marginTop: "10px",
},

cardButton: {
background: "#d8bea5",
padding: "10px",
borderRadius: "10px",
display: "inline-block",
textAlign: "center",
fontWeight: "700",
},

storySection: {
maxWidth: "1280px",
margin: "0 auto 30px",
display: "grid",
gridTemplateColumns: "1fr",
gap: "18px",
background: "#fff",
borderRadius: "18px",
padding: "14px",
},

storyImage: {
width: "100%",
borderRadius: "16px",
cursor: "pointer",
},

stepList: {
marginTop: "10px",
},

stepItem: {
display: "flex",
gap: "10px",
marginBottom: "12px",
},

stepNumber: {
width: "32px",
height: "32px",
borderRadius: "999px",
background: "#efe1d2",
display: "flex",
alignItems: "center",
justifyContent: "center",
fontWeight: "700",
},

finalSection: {
marginTop: "20px",
},

finalCard: {
background: "#4b3a2d",
color: "#fff",
borderRadius: "20px",
padding: "18px",
textAlign: "center",
},

finalTitle: {
fontSize: "22px",
fontWeight: "800",
},

finalText: {
fontSize: "14px",
},
};

};
