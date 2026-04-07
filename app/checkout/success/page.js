export default function CheckoutSuccessPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "#f8fafc",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "24px",
          padding: "32px",
          textAlign: "center",
          boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)",
        }}
      >
        <h1
          style={{
            margin: "0 0 12px 0",
            fontSize: "32px",
            fontWeight: "800",
            color: "#0f172a",
          }}
        >
          Zahlung erfolgreich
        </h1>

        <p
          style={{
            margin: 0,
            fontSize: "16px",
            lineHeight: "1.7",
            color: "#475569",
          }}
        >
          Vielen Dank. Deine Bestellung wurde erfolgreich bezahlt und wird jetzt
          bearbeitet.
        </p>
      </div>
    </main>
  );
}
