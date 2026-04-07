"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function CreateEventPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const [creating, setCreating] = useState(false);

  function generateSlug(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/ß/g, "ss")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-");
  }

  async function handleCreateEvent(e) {
    e.preventDefault();

    if (!title.trim()) {
      alert("Bitte einen Titel eingeben.");
      return;
    }

    if (!password.trim()) {
      alert("Bitte ein Zugangspasswort eingeben.");
      return;
    }

    if (!adminPassword.trim()) {
      alert("Bitte ein Admin-Passwort eingeben.");
      return;
    }

    setCreating(true);

    const baseSlug = generateSlug(title);
    const slug = `${baseSlug}-${Date.now()}`;

    const { error } = await supabase.from("events").insert([
      {
        title: title.trim(),
        location: location.trim() || null,
        category: category.trim() || null,
        start_date: date || null,
        description: description.trim() || null,
        access_password: password.trim(),
        admin_password: adminPassword.trim(),
        slug,
      },
    ]);

    if (error) {
      console.error("Fehler beim Erstellen des Events:", error);
      alert("Event konnte nicht erstellt werden: " + error.message);
      setCreating(false);
      return;
    }

    alert("Event erfolgreich erstellt.");
    router.push(`/event/${slug}`);
  }

  return (
    <main style={styles.page}>
      <section style={styles.heroSection}>
        <div style={styles.heroBadge}>Event erstellen</div>
        <h1 style={styles.heroTitle}>Lege in wenigen Schritten ein neues Event an</h1>
        <p style={styles.heroText}>
          Erstelle hier die Event-Seite, die später per Link oder NFC geöffnet
          werden kann. Danach können Familie oder Gäste Bilder hochladen,
          ansehen und gemeinsam Erinnerungen sammeln.
        </p>
      </section>

      <section style={styles.contentWrap}>
        <div style={styles.infoCard}>
          <h2 style={styles.cardTitle}>Was du hier anlegst</h2>
          <div style={styles.infoList}>
            <div style={styles.infoItem}>Eine eigene Event-Seite mit individuellem Link</div>
            <div style={styles.infoItem}>Zugang für Familie, Freunde oder Gäste</div>
            <div style={styles.infoItem}>Passwortgeschützten Bereich für Uploads und Galerie</div>
            <div style={styles.infoItem}>Grundlage für deinen späteren NFC-Zugang</div>
          </div>
        </div>

        <form onSubmit={handleCreateEvent} style={styles.formCard}>
          <div style={styles.formHeader}>
            <h2 style={styles.cardTitle}>Neues Event anlegen</h2>
            <div style={styles.formHint}>Pflichtfelder mit * markiert</div>
          </div>

          <div style={styles.formGrid}>
            <div style={styles.fieldWrap}>
              <label style={styles.label}>Titel *</label>
              <input
                type="text"
                placeholder="z. B. Sommerurlaub 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.fieldWrap}>
              <label style={styles.label}>Ort</label>
              <input
                type="text"
                placeholder="z. B. Ägypten"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.fieldWrap}>
              <label style={styles.label}>Kategorie</label>
              <input
                type="text"
                placeholder="z. B. Urlaub, Geburtstag, Hochzeit"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.fieldWrap}>
              <label style={styles.label}>Datum</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.fieldWrap}>
            <label style={styles.label}>Beschreibung</label>
            <textarea
              placeholder="Kurze Beschreibung zum Event, zur Familie oder zum Anlass"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              style={styles.textarea}
            />
          </div>

          <div style={styles.passwordGrid}>
            <div style={styles.fieldWrap}>
              <label style={styles.label}>Zugangspasswort *</label>
              <input
                type="text"
                placeholder="Passwort für Gäste / Familie"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.fieldWrap}>
              <label style={styles.label}>Admin-Passwort *</label>
              <input
                type="text"
                placeholder="Passwort für Bearbeitung / Verwaltung"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.noteBox}>
            Nach dem Erstellen wirst du direkt zur Event-Seite weitergeleitet.
            Dort kannst du dich mit dem Admin-Passwort anmelden und alles weiter
            bearbeiten.
          </div>

          <div style={styles.buttonRow}>
            <button
              type="submit"
              disabled={creating}
              style={{
                ...styles.primaryButton,
                ...(creating ? styles.buttonDisabled : {}),
              }}
            >
              {creating ? "Event wird erstellt..." : "Event erstellen"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #f8fafc 0%, #ffffff 40%, #f8fafc 100%)",
    padding: "32px 24px 72px",
    overflowX: "hidden",
  },
  heroSection: {
    maxWidth: "920px",
    margin: "0 auto 28px",
    textAlign: "center",
    display: "grid",
    gap: "14px",
  },
  heroBadge: {
    width: "fit-content",
    margin: "0 auto",
    background: "#e2e8f0",
    color: "#0f172a",
    padding: "9px 14px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "700",
  },
  heroTitle: {
    margin: 0,
    fontSize: "44px",
    lineHeight: "1.12",
    fontWeight: "800",
    color: "#0f172a",
  },
  heroText: {
    margin: 0,
    fontSize: "17px",
    lineHeight: "1.75",
    color: "#475569",
  },
  contentWrap: {
    maxWidth: "1120px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "0.9fr 1.1fr",
    gap: "22px",
    alignItems: "start",
  },
  infoCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 12px 28px rgba(15, 23, 42, 0.05)",
    display: "grid",
    gap: "18px",
  },
  formCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 12px 28px rgba(15, 23, 42, 0.06)",
    display: "grid",
    gap: "18px",
  },
  formHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  cardTitle: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "800",
    color: "#0f172a",
  },
  formHint: {
    fontSize: "13px",
    color: "#64748b",
    fontWeight: "600",
  },
  infoList: {
    display: "grid",
    gap: "12px",
  },
  infoItem: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "14px 16px",
    fontSize: "15px",
    fontWeight: "600",
    color: "#334155",
    lineHeight: "1.6",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
  },
  passwordGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
  },
  fieldWrap: {
    display: "grid",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#0f172a",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    backgroundColor: "#fff",
    fontSize: "15px",
    outline: "none",
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    backgroundColor: "#fff",
    fontSize: "15px",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
  },
  noteBox: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "16px",
    color: "#475569",
    fontSize: "14px",
    lineHeight: "1.7",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "flex-start",
  },
  primaryButton: {
    backgroundColor: "#0f172a",
    color: "#fff",
    border: "none",
    padding: "15px 20px",
    borderRadius: "14px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "700",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.18)",
    minWidth: "220px",
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
  },
};
