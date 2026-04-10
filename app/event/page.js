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

    if (!title.trim()) return alert("Titel fehlt");
    if (!password.trim()) return alert("Passwort fehlt");
    if (!adminPassword.trim()) return alert("Admin Passwort fehlt");

    setCreating(true);

    const slug = `${generateSlug(title)}-${Date.now()}`;

    const { error } = await supabase.from("events").insert([
      {
        title,
        location,
        category,
        start_date: date || null,
        description,
        access_password: password,
        admin_password: adminPassword,
        slug,
      },
    ]);

    if (error) {
      alert(error.message);
      setCreating(false);
      return;
    }

    router.push(`/event/${slug}`);
  }

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <h1 style={styles.title}>Event erstellen</h1>
        <p style={styles.subtitle}>
          Erstelle schnell dein Event – perfekt für Handy-Nutzung.
        </p>

        <div style={styles.card}>
          <input
            placeholder="Titel *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />

          <input
            placeholder="Ort"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={styles.input}
          />

          <input
            placeholder="Kategorie"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={styles.input}
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={styles.input}
          />

          <textarea
            placeholder="Beschreibung"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
          />

          <input
            placeholder="Zugangspasswort *"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <input
            placeholder="Admin Passwort *"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            style={styles.input}
          />

          <button
            onClick={handleCreateEvent}
            disabled={creating}
            style={styles.button}
          >
            {creating ? "Erstelle..." : "Event erstellen"}
          </button>
        </div>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#ffefef", // DEBUG sichtbar!
    display: "flex",
    justifyContent: "center",
  },

  container: {
    width: "100%",
    maxWidth: "420px",
    padding: "16px",
    boxSizing: "border-box",
    display: "grid",
    gap: "16px",
  },

  title: {
    fontSize: "26px",
    fontWeight: "800",
    margin: 0,
  },

  subtitle: {
    fontSize: "14px",
    color: "#555",
  },

  card: {
    background: "#fff",
    padding: "16px",
    borderRadius: "16px",
    display: "grid",
    gap: "12px",
    border: "1px solid #ddd",
  },

  input: {
    width: "100%",
    padding: "14px",
    fontSize: "16px",
    borderRadius: "10px",
    border: "1px solid #ccc",
  },

  textarea: {
    width: "100%",
    padding: "14px",
    fontSize: "16px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    minHeight: "80px",
  },

  button: {
    width: "100%",
    padding: "16px",
    fontSize: "16px",
    borderRadius: "12px",
    backgroundColor: "#0f172a",
    color: "#fff",
    border: "none",
    fontWeight: "700",
  },
};
