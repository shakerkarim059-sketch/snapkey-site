"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateEventPage() {
  const router = useRouter();

const [title, setTitle] = useState("");
const [location, setLocation] = useState("");
const [category, setCategory] = useState("");
const [date, setDate] = useState("");
const [description, setDescription] = useState("");
const [creatorEmail, setCreatorEmail] = useState("");
const [password, setPassword] = useState("");
const [adminPassword, setAdminPassword] = useState("");
const [creating, setCreating] = useState(false);


  async function handleCreateEvent(e) {
    e.preventDefault();

if (!title.trim()) return alert("Bitte Titel eingeben");
if (!creatorEmail.trim()) return alert("Bitte E-Mail eingeben");
if (!password.trim()) return alert("Bitte Zugangspasswort eingeben");
if (!adminPassword.trim()) return alert("Bitte Admin Passwort eingeben");

    setCreating(true);

const response = await fetch("/api/create-event", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    title,
    location,
    category,
    date,
    description,
    creatorEmail,
    password,
    adminPassword,
  }),
});

const result = await response.json();

if (!response.ok) {
  alert(result.error || "Event konnte nicht erstellt werden.");
  setCreating(false);
  return;
}

router.push(`/event/${result.event.slug}?setup=true`);
  }

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <div style={styles.hero}>
          <h1 style={styles.title}>Erstelle dein Event</h1>
          <p style={styles.subtitle}>
            Erstelle deine Eventseite und wähle danach passende Snapkeys für deine Gäste.
          </p>
        </div>

        <div style={styles.card}>
          <div style={styles.field}>
            <label style={styles.label}>Event Name *</label>
            <input
              placeholder="z.B. Hochzeit Anna & Max"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Ort</label>
            <input
              placeholder="z.B. Stuttgart"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={styles.input}
            />
          </div>

<div style={styles.field}>
  <label style={styles.label}>Kategorie</label>
  <select
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    style={styles.input}
  >
    <option value="">Bitte auswählen</option>
    <option value="Hochzeit">Hochzeit</option>
    <option value="Geburtstag">Geburtstag</option>
    <option value="Familienalbum">Familienalbum</option>
    <option value="Urlaub">Urlaub</option>
    <option value="Baby / Taufe">Baby / Taufe</option>
    <option value="Jubiläum">Jubiläum</option>
    <option value="Rückblick">Rückblick</option>
    <option value="Sonstiges">Sonstiges</option>
  </select>
  <div style={styles.helper}>
    Bitte Kategorie wählen, um dein Event zuzuordnen.
  </div>
</div>


          <div style={styles.field}>
            <label style={styles.label}>Datum der Veranstaltung</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={styles.dateInput}
            />
            <div style={styles.helper}>
              Wann findet das Event statt? (nicht heutiges Datum)
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Beschreibung</label>
            <textarea
              placeholder="Kurze Beschreibung für Gäste..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={styles.textarea}
            />
          </div>
<div style={styles.field}>
  <label style={styles.label}>Deine E-Mail *</label>
  <input
    type="email"
    placeholder="deine@email.de"
    value={creatorEmail}
    onChange={(e) => setCreatorEmail(e.target.value)}
    style={styles.input}
  />
  <div style={styles.helper}>
    An diese E-Mail senden wir dir später deinen Event-Link.
  </div>
</div>
              
          <div style={styles.field}>
            <label style={styles.label}>Zugang für Gäste *</label>
            <input
              placeholder="Passwort für Familie & Freunde"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
            <div style={styles.helper}>
              Gäste brauchen dieses Passwort um Fotos zu sehen
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Admin Passwort *</label>
            <input
              placeholder="Zum Bearbeiten & Löschen von Bildern"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              style={styles.input}
            />
            <div style={styles.helper}>
              Nur für dich – damit verwaltest du das Event
            </div>
          </div>

          <button
            onClick={handleCreateEvent}
            disabled={creating}
            style={styles.button}
          >
            {creating ? "Erstelle Event..." : "Event erstellen"}
          </button>
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
    maxWidth: "420px",
    padding: "20px 14px",
    display: "grid",
    gap: "20px",
  },

  hero: {
    textAlign: "center",
  },

  title: {
    fontSize: "30px",
    fontWeight: "800",
    margin: 0,
    color: "#0f172a",
  },

  subtitle: {
    fontSize: "15px",
    color: "#64748b",
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "20px",
    display: "grid",
    gap: "16px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 15px 35px rgba(0,0,0,0.05)",
  },

  field: {
    display: "grid",
    gap: "6px",
  },

  label: {
    fontSize: "14px",
    fontWeight: "700",
  },

  helper: {
    fontSize: "12px",
    color: "#64748b",
  },

  input: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "16px",
  },

  dateInput: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "16px",
    backgroundColor: "#fff",
  },

  textarea: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "16px",
    minHeight: "90px",
  },

  button: {
    marginTop: "10px",
    padding: "16px",
    borderRadius: "14px",
    background: "#0f172a",
    color: "#fff",
    fontWeight: "700",
    fontSize: "16px",
    border: "none",
  },
};
