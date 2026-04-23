"use client";

import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const params = useSearchParams();
  const slug = params.get("slug");

  const eventUrl = slug
    ? `https://getsnapkey.de/event/${slug}`
    : "";

  function copyLink() {
    navigator.clipboard.writeText(eventUrl);
    alert("Link kopiert!");
  }

  function shareWhatsApp() {
    const text = encodeURIComponent(
      `Hier ist unser Event: ${eventUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Event erfolgreich erstellt 🎉</h1>

        <p style={styles.text}>
          Dein Event ist jetzt fertig. Du kannst den Link direkt teilen oder
          speichern.
        </p>

        <div style={styles.linkBox}>
          {eventUrl}
        </div>

<div style={styles.buttons}>
  <button onClick={copyLink} style={styles.button}>
    Link kopieren
  </button>

  <button onClick={shareWhatsApp} style={styles.buttonSecondary}>
    WhatsApp teilen
  </button>

  <button
    onClick={() => window.open(eventUrl, "_blank")}
    style={styles.button}
  >
    Event öffnen
  </button>
</div>

        <p style={styles.hint}>
          Du hast den Link zusätzlich per E-Mail erhalten.
        </p>
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f8fafc",
    padding: "20px",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "20px",
    maxWidth: "420px",
    width: "100%",
    textAlign: "center",
    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
  },
  title: {
    fontSize: "24px",
    fontWeight: "800",
    marginBottom: "10px",
  },
  text: {
    fontSize: "14px",
    color: "#64748b",
  },
  linkBox: {
    marginTop: "16px",
    padding: "12px",
    borderRadius: "10px",
    background: "#f1f5f9",
    wordBreak: "break-all",
    fontSize: "13px",
  },
  buttons: {
    marginTop: "16px",
    display: "flex",
    gap: "10px",
    flexDirection: "column",
  },
  button: {
    padding: "14px",
    borderRadius: "10px",
    background: "#0f172a",
    color: "#fff",
    border: "none",
    fontWeight: "700",
  },
  buttonSecondary: {
    padding: "14px",
    borderRadius: "10px",
    background: "#25D366",
    color: "#fff",
    border: "none",
    fontWeight: "700",
  },
  hint: {
    marginTop: "14px",
    fontSize: "12px",
    color: "#94a3b8",
  },
};
