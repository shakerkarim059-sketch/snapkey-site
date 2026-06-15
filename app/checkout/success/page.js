import Link from "next/link";

export default function SuccessPage({ searchParams }) {
  const eventSlug = searchParams?.event;
  const guestCode = searchParams?.code;
  const eventUrl = eventSlug
    ? `https://getsnapkey.de/event/${eventSlug}`
    : "https://getsnapkey.de";

const whatsappText = encodeURIComponent(
  eventSlug
    ? `📸 Willkommen in unserem gemeinsamen Snapkey Album.

Album:
${eventUrl}

🔑 Zugangscode:
${guestCode || "Bitte Zugangscode beim Gastgeber erfragen."}

Hier können alle Gäste Fotos und Videos hochladen und ansehen.`
    : "Unser Snapkey Album ist bereit."
);

  return (
    <main className="success-page">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");

        :root {
          --bg: #faf8f5;
          --surface: #ffffff;
          --accent: #1a1612;
          --text: #1a1612;
          --text-secondary: #6b5f54;
          --text-muted: #9a8d82;
          --border: #ebe5dd;
          --warm: #f5efe7;
          --gold: #c9a76c;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: var(--bg);
          font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          color: var(--text);
        }

        .success-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 14px;
          background:
            radial-gradient(circle at top right, rgba(201, 167, 108, 0.14), transparent 36%),
            linear-gradient(180deg, #faf8f5 0%, #ffffff 100%);
        }

        .success-card {
          width: min(100%, 720px);
          background: rgba(255, 255, 255, 0.94);
          border: 1px solid var(--border);
          border-radius: 34px;
          padding: 28px;
          box-shadow: 0 28px 80px rgba(26, 22, 18, 0.11);
        }

        .brand {
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: var(--accent);
          margin-bottom: 26px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          width: fit-content;
          padding: 8px 14px;
          border-radius: 999px;
          background: var(--warm);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 800;
          margin-bottom: 18px;
        }

        h1 {
          margin: 0;
          font-size: clamp(36px, 7vw, 58px);
          line-height: 1.04;
          letter-spacing: -0.06em;
          color: var(--accent);
        }

        h1 span {
          display: block;
          background: linear-gradient(135deg, var(--gold) 0%, #a88a4a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .intro {
          margin: 20px 0 0;
          color: var(--text-secondary);
          font-size: 16px;
          line-height: 1.75;
          max-width: 620px;
        }

        .next-box {
          margin-top: 26px;
          padding: 20px;
          border-radius: 24px;
          background: var(--warm);
          border: 1px solid var(--border);
        }

        .next-box-title {
          font-size: 15px;
          font-weight: 800;
          color: var(--accent);
          margin-bottom: 14px;
        }

        .steps {
          display: grid;
          gap: 12px;
        }

        .step {
          display: grid;
          grid-template-columns: 36px 1fr;
          gap: 12px;
          align-items: flex-start;
          padding: 14px;
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 18px;
        }

        .step-number {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          background: var(--accent);
          color: #fff;
          font-size: 13px;
          font-weight: 800;
        }

        .step strong {
          display: block;
          color: var(--accent);
          font-size: 14px;
          margin-bottom: 3px;
        }

        .step span {
          color: var(--text-secondary);
          font-size: 13px;
          line-height: 1.5;
        }

        .link-box {
          margin-top: 20px;
          padding: 16px;
          border-radius: 20px;
          background: #fff;
          border: 1px solid var(--border);
        }

        .link-label {
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          margin-bottom: 8px;
        }

        .event-link {
          display: block;
          color: var(--accent);
          text-decoration: none;
          font-size: 14px;
          line-height: 1.5;
          word-break: break-all;
          font-weight: 700;
        }

        .actions {
          display: grid;
          gap: 12px;
          margin-top: 24px;
        }

        .button {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 56px;
          padding: 0 22px;
          border-radius: 999px;
          text-decoration: none;
          border: none;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.22s ease;
        }

        .button-primary {
          background: var(--accent);
          color: #fff;
          box-shadow: 0 12px 34px rgba(26, 22, 18, 0.18);
        }

        .button-secondary {
          background: #fff;
          color: var(--accent);
          border: 1px solid var(--border);
        }

        .button-whatsapp {
          background: #25d366;
          color: #fff;
        }

        .hint {
          margin: 20px 0 0;
          color: var(--text-muted);
          font-size: 13px;
          line-height: 1.6;
          text-align: center;
        }

        @media (min-width: 680px) {
          .success-card {
            padding: 38px;
          }

          .actions {
            grid-template-columns: 1fr 1fr;
          }

          .actions .button-primary {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 520px) {
          .success-page {
            padding: 18px 12px;
            align-items: flex-start;
          }

          .success-card {
            border-radius: 28px;
            padding: 24px 18px;
          }

          h1 {
            font-size: 38px;
          }
        }
      `}</style>

      <section className="success-card">
        <div className="brand">getsnapkey</div>

        <div className="badge">Zahlung erfolgreich</div>

        <h1>
          Dein Album ist
          <span>freigeschaltet.</span>
        </h1>

        <p className="intro">
          Vielen Dank! Deine Bestellung wurde erfolgreich bezahlt. Dein Snapkey Album ist jetzt bereit und deine Snapkeys werden vorbereitet.
        </p>

        <div className="next-box">
          <div className="next-box-title">Wie geht es jetzt weiter?</div>

          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div>
                <strong>Album öffnen</strong>
                <span>Prüfe dein Album und teile den Link mit Familie, Freunden oder Gästen.</span>
              </div>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <div>
                <strong>Snapkeys werden vorbereitet</strong>
                <span>Deine ausgewählten Snapkeys werden mit deinem Album verbunden und für dich vorbereitet.</span>
              </div>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <div>
                <strong>Erinnerungen sammeln</strong>
                <span>Gäste können Fotos und Videos direkt im Browser hochladen – ganz ohne App.</span>
              </div>
            </div>
          </div>
        </div>

        {eventSlug && (
          <div className="link-box">
            <div className="link-label">Dein Album-Link</div>
            <a href={eventUrl} className="event-link">
              {eventUrl}
            </a>
          </div>
        )}

        <div className="actions">
          <Link href={eventSlug ? `/event/${eventSlug}` : "/"} className="button button-primary">
            {eventSlug ? "Album öffnen" : "Zur Startseite"}
          </Link>

          {eventSlug && (
            <a
              href={`https://wa.me/?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-whatsapp"
            >
              Per WhatsApp teilen
            </a>
          )}

          <Link href="/" className="button button-secondary">
            Zur Startseite
          </Link>
        </div>

        <p className="hint">
          Du erhältst zusätzlich eine Bestätigung per E-Mail. Bewahre sie gut auf, damit du deinen Album-Link später wiederfindest.
        </p>
      </section>
    </main>
  );
}
