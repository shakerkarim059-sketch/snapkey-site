"use client";

import { useEffect, useState } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoadingOrders(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/get-orders");
      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.error || "Bestellungen konnten nicht geladen werden.");
        setLoadingOrders(false);
        return;
      }

      setOrders(result.orders || []);
    } catch (error) {
      console.error("Fehler beim Laden der Bestellungen:", error);
      setErrorMessage("Bestellungen konnten nicht geladen werden.");
    }

    setLoadingOrders(false);
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Bezahlte Bestellungen</h1>
          <p style={styles.subtitle}>
            Hier siehst du alle bezahlten Bestellungen des aktuell eingeloggten Admin-Events.
          </p>
        </div>

        {loadingOrders ? (
          <div style={styles.card}>Bestellungen werden geladen...</div>
        ) : errorMessage ? (
          <div style={styles.card}>{errorMessage}</div>
        ) : orders.length === 0 ? (
          <div style={styles.card}>Noch keine bezahlten Bestellungen vorhanden.</div>
        ) : (
          <div style={styles.list}>
            {orders.map((order) => (
              <div key={order.id} style={styles.orderCard}>
                <div style={styles.orderTop}>
                  <div>
                    <div style={styles.name}>{order.customer_name}</div>
                    <div style={styles.email}>{order.customer_email}</div>
                  </div>

                  <div style={styles.price}>
                    {(Number(order.total_price || 0) / 100).toFixed(2)} €
                  </div>
                </div>

                <div style={styles.infoGrid}>
                  <div>
                    <div style={styles.label}>Adresse</div>
                    <div style={styles.value}>
                      {order.street}, {order.postal_code} {order.city}
                    </div>
                  </div>

                  <div>
                    <div style={styles.label}>Land</div>
                    <div style={styles.value}>{order.country || "—"}</div>
                  </div>

                  <div>
                    <div style={styles.label}>Bilder</div>
                    <div style={styles.value}>{order.item_count || 0}</div>
                  </div>

                  <div>
                    <div style={styles.label}>Status</div>
                    <div style={styles.value}>{order.payment_status || "—"}</div>
                  </div>

                  <div>
                    <div style={styles.label}>Bezahlt am</div>
                    <div style={styles.value}>
                      {order.paid_at
                        ? new Date(order.paid_at).toLocaleString("de-DE")
                        : "—"}
                    </div>
                  </div>

                  <div>
                    <div style={styles.label}>Telefon</div>
                    <div style={styles.value}>{order.customer_phone || "—"}</div>
                  </div>
                </div>

                {order.note && (
                  <div style={styles.noteBox}>
                    <div style={styles.label}>Notiz</div>
                    <div style={styles.value}>{order.note}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    padding: "32px 20px",
  },
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "24px",
  },
  title: {
    margin: 0,
    fontSize: "36px",
    fontWeight: "800",
    color: "#0f172a",
  },
  subtitle: {
    marginTop: "10px",
    color: "#475569",
    fontSize: "16px",
    lineHeight: "1.6",
  },
  card: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "22px",
    color: "#475569",
  },
  list: {
    display: "grid",
    gap: "16px",
  },
  orderCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
  },
  orderTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "flex-start",
    flexWrap: "wrap",
    marginBottom: "18px",
  },
  name: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#0f172a",
  },
  email: {
    marginTop: "6px",
    fontSize: "14px",
    color: "#64748b",
  },
  price: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#0f172a",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
  },
  label: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    marginBottom: "6px",
  },
  value: {
    fontSize: "15px",
    color: "#0f172a",
    lineHeight: "1.5",
  },
  noteBox: {
    marginTop: "16px",
    paddingTop: "16px",
    borderTop: "1px solid #e2e8f0",
  },
};
