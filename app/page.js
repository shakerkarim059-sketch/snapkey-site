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
  <div style={styles.heroBadge}>Snapkey – mehr als nur ein NFC Tag</div>

  <h1 style={styles.heroTitle}>
    Ein Snapkey.
    <br />
    Eine fertige Eventseite.
    <br />
    Alle Erinnerungen an einem Ort.
  </h1>

  <p style={styles.heroText}>
    Du bestellst deinen Snapkey – ich erstelle die komplette Eventseite für dich.
    Gäste öffnen sie mit einem Tap und können Fotos ansehen, teilen und direkt
    als hochwertige Prints bestellen.
  </p>

  <div style={styles.heroActionRow}>
    <Link href="/event" style={styles.primaryButton}>
      Snapkey jetzt erstellen
    </Link>

<a href="#snapkeys" style={styles.secondaryButton}>
  Snapkeys ansehen
</a>
  </div>

  <div style={styles.heroIconRow}>
    <div style={styles.heroIconCard}>
      <div style={styles.heroIconCircle}>⌁</div>
      <div style={styles.heroIconTitle}>Snapkey auswählen</div>
      <div style={styles.heroIconText}>
        Für Familie, Hochzeit oder Event
      </div>
    </div>

    <div style={styles.heroIconCard}>
      <div style={styles.heroIconCircle}>⚙</div>
      <div style={styles.heroIconTitle}>Alles wird eingerichtet</div>
      <div style={styles.heroIconText}>
        Eventseite & Zugang sind direkt fertig
      </div>
    </div>

    <div style={styles.heroIconCard}>
      <div style={styles.heroIconCircle}>📸</div>
      <div style={styles.heroIconTitle}>Fotos & Prints</div>
      <div style={styles.heroIconText}>
        Gäste sehen & bestellen Bilder sofort
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
padding: "14px 12px 56px",
overflowX: "hidden",
},

heroSection: {
maxWidth: "1320px",
margin: "0 auto 28px",
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
gap: "22px",
alignItems: "center",
},

heroTextCol: {
display: "grid",
gap: "16px",
},

heroBadge: {
width: "fit-content",
background: "#eaded1",
color: "#7a5c45",
padding: "9px 13px",
borderRadius: "999px",
fontSize: "11px",
fontWeight: "700",
textTransform: "uppercase",
letterSpacing: "0.05em",
},

heroTitle: {
margin: 0,
fontSize: "clamp(34px, 8vw, 68px)",
lineHeight: "0.98",
fontWeight: "800",
color: "#2e241d",
letterSpacing: "-0.03em",
},

heroText: {
margin: 0,
maxWidth: "720px",
fontSize: "clamp(15px, 3.2vw, 20px)",
lineHeight: "1.72",
color: "#5b4d42",
},

heroActionRow: {
display: "flex",
flexWrap: "wrap",
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
padding: "14px 18px",
borderRadius: "14px",
fontSize: "15px",
fontWeight: "700",
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
fontWeight: "700",
minHeight: "50px",
minWidth: "190px",
boxShadow: "0 6px 18px rgba(46, 36, 29, 0.05)",
},

heroIconRow: {
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
gap: "12px",
marginTop: "2px",
},

heroIconCard: {
background: "rgba(255,255,255,0.82)",
border: "1px solid #eadfd4",
borderRadius: "18px",
padding: "14px",
display: "grid",
gap: "7px",
boxShadow: "0 10px 24px rgba(46, 36, 29, 0.04)",
},

heroIconCircle: {
width: "40px",
height: "40px",
borderRadius: "999px",
background: "#efe5db",
color: "#4b3a2d",
display: "flex",
alignItems: "center",
justifyContent: "center",
fontWeight: "800",
fontSize: "16px",
},

heroIconTitle: {
fontSize: "15px",
fontWeight: "700",
color: "#2e241d",
},

heroIconText: {
fontSize: "13px",
lineHeight: "1.55",
color: "#6c5f54",
},

heroImageCol: {
display: "flex",
justifyContent: "center",
alignItems: "center",
},

heroImage: {
width: "100%",
maxWidth: "760px",
borderRadius: "28px",
display: "block",
boxShadow: "0 24px 48px rgba(46, 36, 29, 0.14)",
cursor: "pointer",
objectFit: "cover",
},

benefitBar: {
maxWidth: "1320px",
margin: "0 auto 28px",
background: "rgba(255,255,255,0.82)",
border: "1px solid #eadfd4",
borderRadius: "24px",
padding: "14px",
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
gap: "12px",
boxShadow: "0 10px 24px rgba(46, 36, 29, 0.04)",
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

serviceSection: {
maxWidth: "1080px",
margin: "0 auto 34px",
},

serviceCard: {
background: "#fff",
border: "1px solid #eadfd4",
borderRadius: "26px",
padding: "24px 20px",
boxShadow: "0 14px 30px rgba(46, 36, 29, 0.05)",
display: "grid",
gap: "12px",
textAlign: "center",
},

productSection: {
maxWidth: "1320px",
margin: "0 auto 40px",
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
fontWeight: "700",
textTransform: "uppercase",
letterSpacing: "0.08em",
color: "#9a7b61",
},

sectionTitle: {
margin: 0,
fontSize: "clamp(28px, 6vw, 44px)",
lineHeight: "1.08",
fontWeight: "800",
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
transition: "transform 0.18s ease",
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
fontWeight: "700",
textTransform: "uppercase",
letterSpacing: "0.06em",
color: "#a28064",
},

productTitle: {
margin: 0,
fontSize: "26px",
lineHeight: "1.15",
fontWeight: "800",
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

productFooter: {
display: "grid",
gap: "10px",
marginTop: "8px",
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
minHeight: "46px",
},

storySection: {
maxWidth: "1320px",
margin: "0 auto 38px",
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
gap: "22px",
alignItems: "center",
background: "rgba(255,255,255,0.82)",
border: "1px solid #eadfd4",
borderRadius: "26px",
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
fontWeight: "800",
fontSize: "16px",
},

stepTitle: {
fontSize: "17px",
fontWeight: "700",
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
margin: "0 auto 38px",
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
gap: "22px",
alignItems: "center",
background: "#fff",
border: "1px solid #eadfd4",
borderRadius: "26px",
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
padding: "30px 20px",
display: "grid",
gap: "14px",
textAlign: "center",
boxShadow: "0 18px 42px rgba(46, 36, 29, 0.12)",
},

finalTitle: {
margin: 0,
fontSize: "clamp(30px, 6vw, 44px)",
lineHeight: "1.1",
fontWeight: "800",
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
fontWeight: "800",
boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
},
};

