"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function CardOrderPage() {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [instagram, setInstagram] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [website, setWebsite] = useState("");
  const [cardStyle, setCardStyle] = useState("classic-black");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!customerName.trim()) {
      alert("Bitte deinen Namen eingeben.");
      return;
    }

    if (!customerEmail.trim()) {
      alert("Bitte deine E-Mail eingeben.");
      return;
    }

    if (!isValidEmail(customerEmail)) {
      alert("Bitte eine gültige E-Mail-Adresse eingeben.");
      return;
    }

    if (!displayName.trim()) {
      alert("Bitte den Namen eingeben, der auf dem Profil erscheinen soll.");
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from("card_orders").insert([
      {
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim(),
        display_name: displayName.trim(),
        bio: bio.trim() || null,
        instagram: instagram.trim() || null,
        whatsapp: whatsapp.trim() || null,
        website: website.trim() || null,
        card_style: cardStyle,
        note: note.trim() || null,
        status: "neu",
      },
    ]);

    if (error) {
      console.error("Fehler beim Speichern der Kartenbestellung:", error);
      alert("Bestellung konnte nicht gespeichert werden: " + error.message);
      setSubmitting(false);
      return;
    }

    alert("Deine Anfrage wurde gespeichert. Wir melden uns bei dir.");
    setCustomerName("");
    setCustomerEmail("");
    setDisplayName("");
    setBio("");
    setInstagram("");
    setWhatsapp("");
    setWebsite("");
    setCardStyle("classic-black");
    setNote("");
    setSubmitting(false);
  }

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <div style={styles.hero}>
          <div style={styles.badge}>NFC Visitenkarte</div>
          <h1 style={styles.title}>Bestelle deine individuelle NFC Karte</h1>
          <p style={styles.subtitle}>
            Du schickst uns deine Daten – wir erstellen dein Profil und bereiten
            deine persönliche NFC Karte für dich vor.
          </p>
        </div>

        <div style={styles.card}>
          <div style={styles.infoBox}>
            <div style={styles.infoTitle}>So läuft es ab</div>
            <div style={styles.infoItem}>1. Du sendest uns deine Daten</div>
            <div style={styles.infoItem}>2. Wir erstellen dein digitales Profil</div>
            <div style={styles.infoItem}>3. Wir bereiten deine NFC Karte für dich vor</div>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Dein Name *</label>
              <input
                type="text"
                placeholder="Vor- und Nachname"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>E-Mail *</label>
              <input
                type="email"
                placeholder="deine@email.de"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Name auf dem Profil *</label>
              <input
                type="text"
                placeholder="z. B. Max Müller"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                style={styles.input}
              />
              <div style={styles.helper}>
                So wird dein Name später auf der digitalen Visitenkarte angezeigt.
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Kurzbeschreibung</label>
              <textarea
                placeholder="z. B. Vertrieb, Creator, Fotograf, Coach ..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                style={styles.textarea}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Instagram</label>
              <input
                type="text"
                placeholder="https://instagram.com/deinprofil"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>WhatsApp</label>
              <input
                type="text"
                placeholder="49123456789"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                style={styles.input}
              />
              <div style={styles.helper}>
                Bitte ohne Leerzeichen, idealerweise mit Ländervorwahl.
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Website</label>
              <input
                type="text"
                placeholder="https://deine-seite.de"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Kartenstil</label>
              <select
                value={cardStyle}
                onChange={(e) => setCardStyle(e.target.value)}
                style={styles.input}
              >
                <option value="classic-black">Classic Black</option>
                <option value="clean-white">Clean White</option>
                <option value="modern-minimal">Modern Minimal</option>
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Zusätzliche Notiz</label>
              <textarea
                placeholder="Wünsche, Farben, besondere Hinweise ..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                style={styles.textarea}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                ...styles.button,
                ...(submitting ? styles.buttonDisabled : {}),
              }}
            >
              {submitting ? "Wird gesendet..." : "Anfrage senden"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
    display: "flex",
    justifyContent: "center",
  },
  container: {
    width: "100%",
    maxWidth: "460px",
    padding: "20px 14px 40px",
    display: "grid",
    gap: "18px",
  },
  hero: {
    textAlign: "center",
    display: "grid",
    gap: "10px",
  },
  badge: {
    width: "fit-content",
    margin: "0 auto",
    background: "#e2e8f0",
    color: "#0f172a",
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
  },
  title: {
    margin: 0,
    fontSize: "30px",
    lineHeight: "1.15",
    fontWeight: "800",
    color: "#0f172a",
  },
  subtitle: {
    margin: 0,
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#64748b",
  },
  card: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    padding: "18px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.05)",
    display: "grid",
    gap: "18px",
  },
  infoBox: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "14px",
    display: "grid",
    gap: "8px",
  },
  infoTitle: {
    fontSize: "14px",
    fontWeight: "800",
    color: "#0f172a",
  },
  infoItem: {
    fontSize: "14px",
    color: "#475569",
    lineHeight: "1.5",
  },
  form: {
    display: "grid",
    gap: "14px",
  },
  field: {
    display: "grid",
    gap: "6px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#0f172a",
  },
  helper: {
    fontSize: "12px",
    color: "#64748b",
    lineHeight: "1.5",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "16px",
    backgroundColor: "#fff",
    outline: "none",
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "16px",
    backgroundColor: "#fff",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
  },
  button: {
    marginTop: "6px",
    padding: "16px",
    borderRadius: "14px",
    background: "#0f172a",
    color: "#fff",
    fontWeight: "700",
    fontSize: "16px",
    border: "none",
    cursor: "pointer",
    width: "100%",
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
  },
};
