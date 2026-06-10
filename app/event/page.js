"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

    if (!title.trim()) return alert("Bitte Eventnamen eingeben");
    if (!creatorEmail.trim()) return alert("Bitte E-Mail eingeben");
    if (!password.trim()) return alert("Bitte Zugangscode für Gäste eingeben");
    if (!adminPassword.trim()) return alert("Bitte Admin-Code eingeben");

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
    <main className="event-page">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");

        :root {
          --bg: #faf8f5;
          --surface: #ffffff;
          --accent: #1a1612;
          --accent-soft: #2d251f;
          --text: #1a1612;
          --text-secondary: #6b5f54;
          --text-muted: #9a8d82;
          --border: #ebe5dd;
          --warm: #f5efe7;
          --warm-deep: #ebe2d5;
          --gold: #c9a76c;
          --gold-soft: #e8d9bb;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: var(--bg);
          color: var(--text);
          font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        button,
        input,
        textarea,
        select {
          font: inherit;
        }

        .event-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top right, rgba(201, 167, 108, 0.14), transparent 36%),
            linear-gradient(180deg, #faf8f5 0%, #ffffff 100%);
          padding: 28px 18px 56px;
        }

        .event-shell {
          width: min(1120px, 100%);
          margin: 0 auto;
        }

        .event-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 42px;
        }

        .logo {
          font-size: 25px;
          font-weight: 800;
          color: var(--accent);
          text-decoration: none;
          letter-spacing: -0.04em;
        }

        .back-link {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 14px;
          font-weight: 700;
        }

        .event-grid {
          display: grid;
          gap: 28px;
          align-items: start;
        }

        .intro {
          padding-top: 10px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          background: var(--warm);
          border: 1px solid var(--border);
          border-radius: 999px;
          font-size: 13px;
          font-weight: 800;
          color: var(--text-secondary);
          margin-bottom: 22px;
        }

        .badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: var(--gold);
        }

        .title {
          margin: 0;
          font-size: clamp(38px, 7vw, 66px);
          line-height: 1.03;
          letter-spacing: -0.06em;
          font-weight: 800;
          color: var(--accent);
        }

        .title span {
          display: block;
          background: linear-gradient(135deg, var(--gold) 0%, #a88a4a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          max-width: 560px;
          margin: 22px 0 0;
          color: var(--text-secondary);
          font-size: 17px;
          line-height: 1.75;
        }

        .trust-row {
          display: grid;
          gap: 12px;
          margin-top: 30px;
        }

        .trust-card {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 16px;
          background: rgba(255, 255, 255, 0.72);
          border: 1px solid var(--border);
          border-radius: 18px;
          box-shadow: 0 10px 30px rgba(26, 22, 18, 0.04);
        }

        .trust-icon {
          width: 38px;
          height: 38px;
          flex: 0 0 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--warm);
          border-radius: 14px;
          font-size: 18px;
        }

        .trust-card strong {
          display: block;
          font-size: 14px;
          color: var(--text);
          margin-bottom: 2px;
        }

        .trust-card span {
          display: block;
          font-size: 13px;
          line-height: 1.45;
          color: var(--text-secondary);
        }

        .form-card {
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid var(--border);
          border-radius: 30px;
          padding: 24px;
          box-shadow:
            0 28px 80px rgba(26, 22, 18, 0.10),
            0 0 0 1px rgba(255, 255, 255, 0.7) inset;
        }

        .form-top {
          margin-bottom: 22px;
        }

        .form-title {
          margin: 0;
          font-size: 24px;
          line-height: 1.15;
          letter-spacing: -0.035em;
          color: var(--accent);
        }

        .form-subtitle {
          margin: 8px 0 0;
          color: var(--text-secondary);
          font-size: 14px;
          line-height: 1.6;
        }

        .form {
          display: grid;
          gap: 16px;
        }

        .field {
          display: grid;
          gap: 7px;
        }

        .field-row {
          display: grid;
          gap: 16px;
        }

        .label {
          font-size: 13px;
          font-weight: 800;
          color: var(--accent);
        }

        .input,
        .select,
        .textarea {
          width: 100%;
          padding: 15px 16px;
          border-radius: 16px;
          border: 1px solid var(--border);
          background: #fff;
          color: var(--text);
          font-size: 15px;
          outline: none;
          transition: all 0.2s ease;
        }

        .input:focus,
        .select:focus,
        .textarea:focus {
          border-color: var(--gold);
          box-shadow: 0 0 0 4px rgba(201, 167, 108, 0.14);
        }

        .textarea {
          min-height: 96px;
          resize: vertical;
        }

        .helper {
          color: var(--text-muted);
          font-size: 12px;
          line-height: 1.45;
        }

        .notice {
          display: grid;
          gap: 4px;
          padding: 15px;
          border-radius: 18px;
          background: var(--warm);
          border: 1px solid var(--border);
        }

        .notice-title {
          font-size: 14px;
          font-weight: 800;
          color: var(--accent);
        }

        .notice-text {
          font-size: 13px;
          line-height: 1.5;
          color: var(--text-secondary);
        }

        .button {
          width: 100%;
          min-height: 58px;
          margin-top: 4px;
          border: none;
          border-radius: 999px;
          background: var(--accent);
          color: #fff;
          font-size: 16px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 12px 34px rgba(26, 22, 18, 0.18);
          transition: all 0.22s ease;
        }

        .button:hover:not(:disabled) {
          background: var(--accent-soft);
          transform: translateY(-2px);
          box-shadow: 0 18px 44px rgba(26, 22, 18, 0.22);
        }

        .button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .secure-note {
          text-align: center;
          color: var(--text-muted);
          font-size: 12px;
          line-height: 1.5;
          margin-top: 10px;
        }

        @media (min-width: 900px) {
          .event-page {
            padding: 34px 32px 72px;
          }

          .event-nav {
            margin-bottom: 66px;
          }

          .event-grid {
            grid-template-columns: minmax(0, 1fr) minmax(430px, 470px);
            gap: 72px;
          }

          .intro {
            position: sticky;
            top: 36px;
            padding-top: 26px;
          }

          .trust-row {
            grid-template-columns: 1fr;
            max-width: 480px;
          }

          .form-card {
            padding: 30px;
          }

          .field-row {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 520px) {
          .event-page {
            padding: 20px 14px 42px;
          }

          .event-nav {
            margin-bottom: 30px;
          }

          .back-link {
            font-size: 13px;
          }

          .form-card {
            padding: 20px;
            border-radius: 24px;
          }

          .title {
            font-size: 40px;
          }

          .subtitle {
            font-size: 15px;
          }

          .trust-row {
            margin-top: 24px;
          }
        }
      `}</style>

      <div className="event-shell">
        <nav className="event-nav">
          <Link href="/" className="logo">
            snapkey
          </Link>
          <Link href="/" className="back-link">
            Zurück zur Startseite
          </Link>
        </nav>

        <div className="event-grid">
          <section className="intro">
            <div className="badge">
              <span className="badge-dot" />
              In wenigen Minuten startklar
            </div>

            <h1 className="title">
              Erstelle dein
              <span>gemeinsames Album.</span>
            </h1>

            <p className="subtitle">
              Lege deine Eventseite an, teile den Link mit Familie, Freunden oder Gästen
              und sammle Fotos & Videos automatisch an einem gemeinsamen Ort.
            </p>

            <div className="trust-row">
              <div className="trust-card">
                <div className="trust-icon">📸</div>
                <div>
                  <strong>Fotos & Videos sammeln</strong>
                  <span>Alle Erinnerungen landen übersichtlich in einem Album.</span>
                </div>
              </div>

              <div className="trust-card">
                <div className="trust-icon">📱</div>
                <div>
                  <strong>Ohne App für Gäste</strong>
                  <span>Der Zugang funktioniert direkt im Browser per Link, QR-Code oder Snapkey.</span>
                </div>
              </div>

              <div className="trust-card">
                <div className="trust-icon">🔐</div>
                <div>
                  <strong>Du behältst die Kontrolle</strong>
                  <span>Mit deinem Admin-Code kannst du dein Event später verwalten.</span>
                </div>
              </div>
            </div>
          </section>

          <section className="form-card">
            <div className="form-top">
              <h2 className="form-title">Eventdetails</h2>
              <p className="form-subtitle">
                Diese Angaben kannst du später noch anpassen.
              </p>
            </div>

            <form className="form" onSubmit={handleCreateEvent}>
              <div className="field">
                <label className="label">Eventname *</label>
                <input
                  className="input"
                  placeholder="z. B. Geburtstag von Anna"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="field-row">
                <div className="field">
                  <label className="label">Anlass</label>
                  <select
                    className="select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Anlass auswählen</option>
                    <option value="Hochzeit">Hochzeit</option>
                    <option value="Geburtstag">Geburtstag</option>
                    <option value="Familienfeier">Familienfeier</option>
                    <option value="Taufe">Taufe</option>
                    <option value="Jubiläum">Jubiläum</option>
                    <option value="Urlaub">Urlaub</option>
                    <option value="Firmenevent">Firmenevent</option>
                    <option value="Sonstiges">Sonstiges</option>
                  </select>
                </div>

                <div className="field">
                  <label className="label">Datum</label>
                  <input
                    className="input"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Ort</label>
                <input
                  className="input"
                  placeholder="z. B. Köln, Mallorca oder Zuhause"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="field">
                <label className="label">Beschreibung</label>
                <textarea
                  className="textarea"
                  placeholder="Kurzer Text für deine Gäste, z. B. Teilt hier eure schönsten Fotos und Videos mit uns."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="field">
                <label className="label">Deine E-Mail *</label>
                <input
                  className="input"
                  type="email"
                  placeholder="deine@email.de"
                  value={creatorEmail}
                  onChange={(e) => setCreatorEmail(e.target.value)}
                />
                <div className="helper">
                  An diese Adresse senden wir dir deinen Event-Link und wichtige Infos.
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label className="label">Zugangscode für Gäste *</label>
                  <input
                    className="input"
                    placeholder="z. B. party2026"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="helper">
                    Damit Gäste Fotos ansehen können.
                  </div>
                </div>

                <div className="field">
                  <label className="label">Admin-Code für dich *</label>
                  <input
                    className="input"
                    placeholder="Nur für dich"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                  />
                  <div className="helper">
                    Zum Verwalten und Löschen von Inhalten.
                  </div>
                </div>
              </div>

              <div className="notice">
                <div className="notice-title">Eventseite einmalig 29 €</div>
                <div className="notice-text">
                  Fotos & Videos werden standardmäßig 1 Monat gespeichert.
                  Eine Verlängerung ist optional für 4,99 € pro Monat möglich und monatlich kündbar.
                </div>
              </div>

              <button className="button" type="submit" disabled={creating}>
                {creating ? "Album wird erstellt..." : "Album erstellen →"}
              </button>

              <div className="secure-note">
                Du erstellst zuerst dein Album. Snapkeys und weitere Optionen wählst du danach.
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
