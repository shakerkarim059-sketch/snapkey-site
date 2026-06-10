import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <main className="cancel-page">
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
          font-family: "Inter", system-ui, sans-serif;
          color: var(--text);
        }

        .cancel-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 14px;
          background:
            radial-gradient(circle at top right, rgba(201, 167, 108, 0.12), transparent 36%),
            linear-gradient(180deg, #faf8f5 0%, #ffffff 100%);
        }

        .cancel-card {
          width: min(100%, 720px);
          background: rgba(255,255,255,0.94);
          border: 1px solid var(--border);
          border-radius: 34px;
          padding: 36px;
          box-shadow: 0 28px 80px rgba(26,22,18,0.11);
        }

        .brand {
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.04em;
          margin-bottom: 24px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          padding: 8px 14px;
          border-radius: 999px;
          background: #fff5f5;
          border: 1px solid #fed7d7;
          color: #c53030;
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
          color: var(--gold);
        }

        .intro {
          margin-top: 18px;
          font-size: 16px;
          line-height: 1.75;
          color: var(--text-secondary);
        }

        .info-box {
          margin-top: 28px;
          padding: 22px;
          border-radius: 24px;
          background: var(--warm);
          border: 1px solid var(--border);
        }

        .info-title {
          font-size: 15px;
          font-weight: 800;
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
          padding: 14px;
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 18px;
        }

        .step-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: var(--accent);
          color: white;
          font-size: 14px;
          font-weight: 800;
        }

        .step strong {
          display: block;
          margin-bottom: 4px;
          font-size: 14px;
        }

        .step span {
          font-size: 13px;
          line-height: 1.6;
          color: var(--text-secondary);
        }

        .actions {
          display: grid;
          gap: 12px;
          margin-top: 28px;
        }

        .button {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 56px;
          border-radius: 999px;
          text-decoration: none;
          font-size: 15px;
          font-weight: 800;
          transition: all 0.2s ease;
        }

        .button-primary {
          background: var(--accent);
          color: white;
          box-shadow: 0 12px 34px rgba(26,22,18,0.18);
        }

        .button-secondary {
          background: white;
          color: var(--accent);
          border: 1px solid var(--border);
        }

        .hint {
          margin-top: 20px;
          text-align: center;
          color: var(--text-muted);
          font-size: 13px;
          line-height: 1.6;
        }

        @media (min-width: 680px) {
          .actions {
            grid-template-columns: 1fr 1fr;
          }

          .button-primary {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 520px) {
          .cancel-card {
            padding: 24px 18px;
            border-radius: 28px;
          }

          h1 {
            font-size: 38px;
          }
        }
      `}</style>

      <section className="cancel-card">
        <div className="brand">snapkey</div>

        <div className="badge">
          Zahlung nicht abgeschlossen
        </div>

        <h1>
          Fast geschafft.
          <span>Deine Bestellung wartet noch.</span>
        </h1>

        <p className="intro">
          Deine Zahlung wurde nicht abgeschlossen. Keine Sorge – dein Event
          bleibt bestehen und du kannst die Bestellung jederzeit erneut starten.
        </p>

        <div className="info-box">
          <div className="info-title">
            Was kannst du jetzt tun?
          </div>

          <div className="steps">
            <div className="step">
              <div className="step-icon">1</div>
              <div>
                <strong>Zurück zur Bestellung</strong>
                <span>
                  Du kannst deine Snapkeys und Angaben jederzeit erneut prüfen.
                </span>
              </div>
            </div>

            <div className="step">
              <div className="step-icon">2</div>
              <div>
                <strong>Zahlung erneut starten</strong>
                <span>
                  Die Bestellung wird erst nach erfolgreicher Zahlung verarbeitet.
                </span>
              </div>
            </div>

            <div className="step">
              <div className="step-icon">3</div>
              <div>
                <strong>Event bleibt erhalten</strong>
                <span>
                  Deine bereits angelegten Eventdaten gehen nicht verloren.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="actions">
          <Link href="/" className="button button-primary">
            Zur Startseite
          </Link>

          <Link href="/" className="button button-secondary">
            Später fortfahren
          </Link>
        </div>

        <p className="hint">
          Falls während der Zahlung ein technisches Problem aufgetreten ist,
          kannst du den Vorgang jederzeit erneut starten.
        </p>
      </section>
    </main>
  );
}
