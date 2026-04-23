import Link from "next/link";

export default function SuccessPage() {
  return (
    <div style={{ padding: "24px", maxWidth: "520px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "12px" }}>
        🎉 Zahlung erfolgreich
      </h1>

      <p style={{ marginBottom: "16px", fontSize: "15px", lineHeight: "1.6" }}>
        Vielen Dank! Deine Bestellung wurde erfolgreich bezahlt.
      </p>

      <div
        style={{
          background: "#f8fafc",
          padding: "16px",
          borderRadius: "14px",
          border: "1px solid #e8ebf2",
          marginBottom: "20px",
        }}
      >
        <p style={{ margin: 0, fontWeight: "600" }}>
          Wie geht es jetzt weiter?
        </p>

        <ul style={{ marginTop: "10px", paddingLeft: "18px", lineHeight: "1.6" }}>
          <li>Dein Event ist jetzt aktiviert</li>
          <li>Deine Snapkeys werden vorbereitet</li>
          <li>Du erhältst Updates per E-Mail</li>
        </ul>
      </div>

      <Link
        href="/"
        style={{
          display: "block",
          width: "100%",
          padding: "14px",
          borderRadius: "12px",
          background: "#111827",
          color: "#fff",
          textDecoration: "none",
          fontWeight: "700",
          fontSize: "15px",
          textAlign: "center",
          boxSizing: "border-box",
        }}
      >
        Zurück zur Startseite
      </Link>
    </div>
  );
}
