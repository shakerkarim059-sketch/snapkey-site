"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SuccessPage() {
  const params = useSearchParams();
const slug = params.get("slug");
const guestCode = params.get("code");

const eventUrl = slug ? `https://getsnapkey.de/event/${slug}` : "";

  function copyLink() {
    navigator.clipboard.writeText(eventUrl);
    alert("Link kopiert!");
  }

function shareWhatsApp() {
  const text = encodeURIComponent(
`📸 Willkommen in unserem gemeinsamen Snapkey Album.

Album:
${eventUrl}

🔑 Zugangscode:
${guestCode || "Bitte Zugangscode beim Gastgeber erfragen."}

Hier können alle Gäste Fotos und Videos hochladen und ansehen.`
  );

  window.open(`https://wa.me/?text=${text}`, "_blank");
}

  return (
    <main className="success-page">
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

        button {
          font: inherit;
        }

        .success-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background:
            radial-gradient(circle at top right, rgba(201, 167, 108, 0.16), transparent 34%),
            linear-gradient(180deg, #faf8f5 0%, #ffffff 100%);
        }

        .success-card {
          width: min(100%, 520px);
          padding: 34px;
          background: rgba(255, 255, 255, 0.94);
          border: 1px solid var(--border);
          border-radius: 32px;
          text-align: center;
          box-shadow:
            0 30px 90px rgba(26, 22, 18, 0.12),
            0 0 0 1px rgba(255, 255, 255, 0.7) inset;
        }

        .success-icon {
          width: 70px;
          height: 70px;
          margin: 0 auto 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 24px;
          background: var(--warm);
          border: 1px solid var(--border);
          font-size: 34px;
        }

        .title {
          margin: 0;
          font-size: clamp(30px, 6vw, 42px);
          line-height: 1.08;
          letter-spacing: -0.055em;
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

        .text {
          margin: 16px auto 0;
          max-width: 400px;
          font-size: 15px;
          line-height: 1.7;
          color: var(--text-secondary);
        }

        .link-box {
          margin-top: 22px;
          padding: 15px;
          border-radius: 18px;
          background: var(--warm);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          font-size: 13px;
          line-height: 1.5;
          word-break: break-all;
        }

        .button-grid {
          display: grid;
          gap: 12px;
          margin-top: 22px;
        }

        .button {
          width: 100%;
          min-height: 54px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 999px;
          background: var(--accent);
          color: #fff;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 12px 34px rgba(26, 22, 18, 0.16);
          transition: all 0.22s ease;
        }

        .button:hover {
          background: var(--accent-soft);
          transform: translateY(-2px);
        }

        .button-secondary {
          width: 100%;
          min-height: 54px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border);
          border-radius: 999px;
          background: #fff;
          color: var(--accent);
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.22s ease;
        }

        .button-secondary:hover {
          background: var(--warm);
          transform: translateY(-2px);
        }

        .button-whatsapp {
          background: #25d366;
          color: #fff;
          border: none;
        }

        .button-whatsapp:hover {
          background: #20bd5a;
        }

        .hint {
          margin: 18px 0 0;
          font-size: 12px;
          line-height: 1.55;
          color: var(--text-muted);
        }

        .home-link {
          display: inline-flex;
          margin-top: 20px;
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
        }

        .home-link:hover {
          color: var(--accent);
        }

        @media (min-width: 640px) {
          .button-grid {
            grid-template-columns: 1fr 1fr;
          }

          .button-grid .button:first-child {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 480px) {
          .success-page {
            padding: 16px;
            align-items: flex-start;
            padding-top: 42px;
          }

          .success-card {
            padding: 26px 20px;
            border-radius: 26px;
          }

          .success-icon {
            width: 62px;
            height: 62px;
            font-size: 30px;
          }
        }
      `}</style>

      <section className="success-card">
        <div className="success-icon">🎉</div>

        <h1 className="title">
          Dein Album ist
          <span>startklar.</span>
        </h1>

        <p className="text">
          Deine Eventseite wurde erfolgreich erstellt. Teile den Link jetzt mit
          Familie, Freunden oder Gästen, damit alle Fotos & Videos sammeln können.
        </p>

        <div className="link-box">{eventUrl}</div>

        <div className="button-grid">
          <button onClick={copyLink} className="button">
            Link kopieren
          </button>

          <button onClick={shareWhatsApp} className="button-secondary button-whatsapp">
            WhatsApp teilen
          </button>

<button
  onClick={() => {
    if (!eventUrl) {
      alert("Event-Link wurde nicht gefunden.");
      return;
    }

    window.location.href = eventUrl;
  }}
  className="button-secondary"
>
  Event öffnen
</button>
        </div>

        <p className="hint">
          Du hast den Link zusätzlich per E-Mail erhalten. Bewahre ihn gut auf,
          damit du dein Album später wieder findest.
        </p>

        <Link href="/" className="home-link">
          Zurück zur Startseite
        </Link>
      </section>
    </main>
  );
}
