"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function AdminPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [batchCount, setBatchCount] = useState(0);
  const [loadingBatchCount, setLoadingBatchCount] = useState(true);
  const [runningBatch, setRunningBatch] = useState(false);

  const [failedOrders, setFailedOrders] = useState([]);
  const [loadingFailedOrders, setLoadingFailedOrders] = useState(true);
  const [retryingOrderId, setRetryingOrderId] = useState(null);

  useEffect(() => {
    fetchEvents();
    fetchBatchCount();
    fetchFailedOrders();
  }, []);

  async function fetchEvents() {
    setLoading(true);

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fehler beim Laden der Events:", error);
      alert("Events konnten nicht geladen werden: " + error.message);
      setEvents([]);
      setLoading(false);
      return;
    }

    setEvents(data || []);
    setLoading(false);
  }

  async function fetchBatchCount() {
    setLoadingBatchCount(true);

    const { count, error } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("fulfillment_status", "waiting_for_batch");

    if (error) {
      console.error("Fehler beim Laden der Batch-Anzahl:", error);
      setBatchCount(0);
      setLoadingBatchCount(false);
      return;
    }

    setBatchCount(count || 0);
    setLoadingBatchCount(false);
  }

  async function fetchFailedOrders() {
    setLoadingFailedOrders(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("fulfillment_status", "failed")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fehler beim Laden der fehlgeschlagenen Bestellungen:", error);
      setFailedOrders([]);
      setLoadingFailedOrders(false);
      return;
    }

    setFailedOrders(data || []);
    setLoadingFailedOrders(false);
  }

  async function handleRunBatch() {
    if (batchCount === 0) {
      alert("Keine offenen Bestellungen für den Batch.");
      return;
    }

    const confirmed = window.confirm(
      `Wirklich ${batchCount} Bestellung${batchCount === 1 ? "" : "en"} gesammelt an Gelato senden?`
    );

    if (!confirmed) return;

    setRunningBatch(true);

    try {
      const response = await fetch("/api/create-gelato-batch", {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Batch konnte nicht erstellt werden.");
        setRunningBatch(false);
        return;
      }

      alert(
        `Batch erfolgreich gesendet. ${result.orders} Bestellung${
          result.orders === 1 ? "" : "en"
        } verarbeitet.`
      );

      await fetchBatchCount();
      await fetchFailedOrders();
    } catch (error) {
      console.error("Fehler beim Starten des Batchs:", error);
      alert("Batch konnte nicht gestartet werden.");
    }

    setRunningBatch(false);
  }

  async function handleRetryOrder(orderId) {
    const confirmed = window.confirm(
      "Diese fehlgeschlagene Bestellung wirklich erneut an Gelato senden?"
    );

    if (!confirmed) return;

    setRetryingOrderId(orderId);

    try {
      const response = await fetch("/api/retry-gelato-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.details || result.error || "Retry fehlgeschlagen.");
        setRetryingOrderId(null);
        return;
      }

      alert("Bestellung erfolgreich erneut an Gelato gesendet.");

      await fetchFailedOrders();
      await fetchBatchCount();
    } catch (error) {
      console.error("Fehler beim Retry:", error);
      alert("Retry konnte nicht gestartet werden.");
    }

    setRetryingOrderId(null);
  }

  async function handleDeleteEvent(eventItem) {
    const confirmed = window.confirm(
      `Event "${eventItem.title}" wirklich löschen?\n\nAchtung: Die Event-Zeile wird gelöscht. Fotos in Storage bleiben nur dann bestehen, wenn du sie nicht separat entfernst.`
    );

    if (!confirmed) return;

    setDeletingId(eventItem.id);

    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", eventItem.id);

    if (error) {
      console.error("Fehler beim Löschen des Events:", error);
      alert("Event konnte nicht gelöscht werden: " + error.message);
      setDeletingId(null);
      return;
    }

    setEvents((prev) => prev.filter((event) => event.id !== eventItem.id));
    setDeletingId(null);
    alert("Event gelöscht.");
  }

  async function handleCopyLink(slug) {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/event/${slug}`
        : `/event/${slug}`;

    try {
      await navigator.clipboard.writeText(url);
      alert("Event-Link kopiert.");
    } catch (error) {
      console.error("Link konnte nicht kopiert werden:", error);
      alert("Link konnte nicht kopiert werden.");
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "Kein Datum";
    return new Date(dateString).toLocaleDateString("de-DE");
  }

  function formatDateTime(dateString) {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("de-DE");
  }

  function formatEuro(amountInCent) {
    if (amountInCent === null || amountInCent === undefined) return "—";
    return `${(amountInCent / 100).toFixed(2)} €`;
  }

  const filteredEvents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return events;

    return events.filter((event) => {
      const haystack = [
        event.title,
        event.location,
        event.category,
        event.slug,
        event.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [events, searchTerm]);

  return (
    <main style={styles.page}>
      <section style={styles.heroSection}>
        <div style={styles.heroBadge}>Admin</div>
        <h1 style={styles.heroTitle}>Alle Events im Überblick</h1>
        <p style={styles.heroText}>
          Hier siehst du alle angelegten Events, kannst Event-Links öffnen,
          kopieren und Events bei Bedarf löschen. Zusätzlich kannst du
          Batch-Bestellungen an Gelato senden und fehlgeschlagene Bestellungen
          erneut versuchen.
        </p>
      </section>

      <section style={styles.topBar}>
        <div style={styles.statsCard}>
          <div style={styles.statsLabel}>Gesamt</div>
          <div style={styles.statsValue}>{events.length}</div>
          <div style={styles.statsSub}>angelegte Events</div>
        </div>

        <div style={styles.searchCard}>
          <label style={styles.searchLabel}>Event suchen</label>
          <input
            type="text"
            placeholder="Titel, Ort, Kategorie oder Slug suchen"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.actionsCard}>
          <Link href="/event" style={styles.primaryButton}>
            Neues Event
          </Link>
        </div>
      </section>

      <section style={styles.batchSection}>
        <div style={styles.batchInfoCard}>
          <div style={styles.batchLabel}>Offene Batch-Bestellungen</div>
          <div style={styles.batchValue}>
            {loadingBatchCount ? "…" : batchCount}
          </div>
          <div style={styles.batchSub}>
            Bestellungen mit Status „waiting_for_batch“
          </div>
        </div>

        <div style={styles.batchActionCard}>
          <button
            type="button"
            onClick={handleRunBatch}
            disabled={runningBatch || loadingBatchCount || batchCount === 0}
            style={{
              ...styles.batchButton,
              ...((runningBatch || loadingBatchCount || batchCount === 0)
                ? styles.buttonDisabled
                : {}),
            }}
          >
            {runningBatch ? "Batch wird gesendet..." : "Batch an Gelato senden"}
          </button>
        </div>
      </section>

      <section style={styles.failedSection}>
        <div style={styles.failedHeader}>
          <h2 style={styles.sectionTitle}>Fehlgeschlagene Bestellungen</h2>
          <div style={styles.failedCountBadge}>
            {loadingFailedOrders ? "…" : failedOrders.length}
          </div>
        </div>

        {loadingFailedOrders ? (
          <div style={styles.emptyBox}>Fehler-Bestellungen werden geladen...</div>
        ) : failedOrders.length === 0 ? (
          <div style={styles.emptyBox}>
            Aktuell gibt es keine fehlgeschlagenen Bestellungen.
          </div>
        ) : (
          <div style={styles.failedGrid}>
            {failedOrders.map((order) => (
              <div key={order.id} style={styles.failedCard}>
                <div style={styles.failedTopRow}>
                  <div style={styles.failedStatus}>failed</div>
                  <div style={styles.failedDate}>
                    {formatDateTime(order.created_at)}
                  </div>
                </div>

                <div style={styles.failedMetaList}>
                  <div style={styles.metaRow}>
                    <span style={styles.metaLabel}>Bestellung</span>
                    <span style={styles.metaValue}>{order.id}</span>
                  </div>

                  <div style={styles.metaRow}>
                    <span style={styles.metaLabel}>Kunde</span>
                    <span style={styles.metaValue}>
                      {order.customer_name || "—"}
                    </span>
                  </div>

                  <div style={styles.metaRow}>
                    <span style={styles.metaLabel}>E-Mail</span>
                    <span style={styles.metaValue}>
                      {order.customer_email || "—"}
                    </span>
                  </div>

                  <div style={styles.metaRow}>
                    <span style={styles.metaLabel}>Format</span>
                    <span style={styles.metaValue}>
                      {order.print_option || "—"}
                    </span>
                  </div>

                  <div style={styles.metaRow}>
                    <span style={styles.metaLabel}>Rahmen</span>
                    <span style={styles.metaValue}>
                      {order.frame_option || "—"}
                    </span>
                  </div>

                  <div style={styles.metaRow}>
                    <span style={styles.metaLabel}>Gesamt</span>
                    <span style={styles.metaValue}>
                      {formatEuro(order.total_price)}
                    </span>
                  </div>
                </div>

                <div style={styles.errorBox}>
                  <div style={styles.errorLabel}>Fehlertext</div>
                  <div style={styles.errorText}>
                    {order.fulfillment_error || "Kein Fehlertext vorhanden."}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRetryOrder(order.id)}
                  disabled={retryingOrderId === order.id}
                  style={{
                    ...styles.retryButton,
                    ...(retryingOrderId === order.id ? styles.buttonDisabled : {}),
                  }}
                >
                  {retryingOrderId === order.id
                    ? "Wird erneut gesendet..."
                    : "Erneut an Gelato senden"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={styles.contentSection}>
        {loading ? (
          <div style={styles.emptyBox}>Events werden geladen...</div>
        ) : filteredEvents.length === 0 ? (
          <div style={styles.emptyBox}>
            {events.length === 0
              ? "Noch keine Events vorhanden."
              : "Keine Events passend zur Suche gefunden."}
          </div>
        ) : (
          <div style={styles.grid}>
            {filteredEvents.map((eventItem) => {
              const eventLink = `/event/${eventItem.slug}`;

              return (
                <div key={eventItem.id} style={styles.card}>
                  <div style={styles.cardTop}>
                    <div style={styles.cardTag}>
                      {eventItem.category || "Event"}
                    </div>
                    <div style={styles.cardDate}>
                      Erstellt: {formatDateTime(eventItem.created_at)}
                    </div>
                  </div>

                  <h2 style={styles.cardTitle}>
                    {eventItem.title || "Ohne Titel"}
                  </h2>

                  <div style={styles.metaList}>
                    <div style={styles.metaRow}>
                      <span style={styles.metaLabel}>Ort</span>
                      <span style={styles.metaValue}>
                        {eventItem.location || "—"}
                      </span>
                    </div>

                    <div style={styles.metaRow}>
                      <span style={styles.metaLabel}>Datum</span>
                      <span style={styles.metaValue}>
                        {formatDate(eventItem.start_date)}
                      </span>
                    </div>

                    <div style={styles.metaRow}>
                      <span style={styles.metaLabel}>Slug</span>
                      <span style={styles.metaValue}>{eventItem.slug || "—"}</span>
                    </div>
                  </div>

                  {eventItem.description && (
                    <p style={styles.description}>{eventItem.description}</p>
                  )}

                  <div style={styles.linkBox}>
                    <div style={styles.linkLabel}>Event-Link</div>
                    <div style={styles.linkText}>{eventLink}</div>
                  </div>

                  <div style={styles.buttonRow}>
                    <Link href={eventLink} style={styles.secondaryButton}>
                      Öffnen
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleCopyLink(eventItem.slug)}
                      style={styles.copyButton}
                    >
                      Link kopieren
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteEvent(eventItem)}
                      disabled={deletingId === eventItem.id}
                      style={{
                        ...styles.deleteButton,
                        ...(deletingId === eventItem.id
                          ? styles.buttonDisabled
                          : {}),
                      }}
                    >
                      {deletingId === eventItem.id ? "Löscht..." : "Löschen"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #f8fafc 0%, #ffffff 38%, #f8fafc 100%)",
    padding: "32px 24px 72px",
    overflowX: "hidden",
  },
  heroSection: {
    maxWidth: "960px",
    margin: "0 auto 26px",
    textAlign: "center",
    display: "grid",
    gap: "14px",
  },
  heroBadge: {
    width: "fit-content",
    margin: "0 auto",
    background: "#e2e8f0",
    color: "#0f172a",
    padding: "9px 14px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "700",
  },
  heroTitle: {
    margin: 0,
    fontSize: "42px",
    lineHeight: "1.12",
    fontWeight: "800",
    color: "#0f172a",
  },
  heroText: {
    margin: 0,
    fontSize: "17px",
    lineHeight: "1.75",
    color: "#475569",
  },
  topBar: {
    maxWidth: "1280px",
    margin: "0 auto 24px",
    display: "grid",
    gridTemplateColumns: "220px 1fr 220px",
    gap: "16px",
    alignItems: "stretch",
  },
  statsCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "22px",
    padding: "20px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
    display: "grid",
    alignContent: "center",
    gap: "6px",
  },
  statsLabel: {
    fontSize: "13px",
    color: "#64748b",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  statsValue: {
    fontSize: "38px",
    fontWeight: "800",
    color: "#0f172a",
    lineHeight: 1,
  },
  statsSub: {
    fontSize: "14px",
    color: "#475569",
    fontWeight: "600",
  },
  searchCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "22px",
    padding: "20px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
    display: "grid",
    gap: "10px",
  },
  searchLabel: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#0f172a",
  },
  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    backgroundColor: "#fff",
    fontSize: "15px",
    outline: "none",
  },
  actionsCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "22px",
    padding: "20px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  batchSection: {
    maxWidth: "1280px",
    margin: "0 auto 24px",
    display: "grid",
    gridTemplateColumns: "1fr 320px",
    gap: "16px",
    alignItems: "stretch",
  },
  batchInfoCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "22px",
    padding: "20px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
    display: "grid",
    gap: "8px",
  },
  batchLabel: {
    fontSize: "13px",
    color: "#64748b",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  batchValue: {
    fontSize: "38px",
    fontWeight: "800",
    color: "#0f172a",
    lineHeight: 1,
  },
  batchSub: {
    fontSize: "14px",
    color: "#475569",
    fontWeight: "600",
  },
  batchActionCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "22px",
    padding: "20px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  batchButton: {
    backgroundColor: "#0f172a",
    color: "#fff",
    border: "none",
    padding: "15px 18px",
    borderRadius: "14px",
    fontSize: "15px",
    fontWeight: "700",
    minWidth: "220px",
    cursor: "pointer",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.16)",
  },
  failedSection: {
    maxWidth: "1280px",
    margin: "0 auto 24px",
    display: "grid",
    gap: "16px",
  },
  failedHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "26px",
    fontWeight: "800",
    color: "#0f172a",
  },
  failedCountBadge: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "700",
  },
  failedGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: "16px",
  },
  failedCard: {
    background: "#fff",
    border: "1px solid #fecaca",
    borderRadius: "22px",
    padding: "20px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
    display: "grid",
    gap: "14px",
  },
  failedTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    flexWrap: "wrap",
  },
  failedStatus: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  failedDate: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "600",
  },
  failedMetaList: {
    display: "grid",
    gap: "10px",
  },
  errorBox: {
    background: "#fff7ed",
    border: "1px solid #fdba74",
    borderRadius: "16px",
    padding: "14px",
    display: "grid",
    gap: "8px",
  },
  errorLabel: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#9a3412",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  errorText: {
    fontSize: "13px",
    lineHeight: "1.6",
    color: "#7c2d12",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  retryButton: {
    backgroundColor: "#0f172a",
    color: "#fff",
    border: "none",
    padding: "14px 16px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },
  contentSection: {
    maxWidth: "1280px",
    margin: "0 auto",
  },
  emptyBox: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "22px",
    padding: "24px",
    color: "#64748b",
    fontSize: "15px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "18px",
  },
  card: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "24px",
    padding: "22px",
    boxShadow: "0 12px 26px rgba(15, 23, 42, 0.05)",
    display: "grid",
    gap: "16px",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    flexWrap: "wrap",
  },
  cardTag: {
    background: "#e2e8f0",
    color: "#0f172a",
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
  },
  cardDate: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "600",
  },
  cardTitle: {
    margin: 0,
    fontSize: "26px",
    lineHeight: "1.2",
    fontWeight: "800",
    color: "#0f172a",
  },
  metaList: {
    display: "grid",
    gap: "10px",
  },
  metaRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "14px",
    paddingBottom: "10px",
    borderBottom: "1px solid #eef2f7",
  },
  metaLabel: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#64748b",
  },
  metaValue: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#0f172a",
    textAlign: "right",
    wordBreak: "break-word",
  },
  description: {
    margin: 0,
    fontSize: "14px",
    lineHeight: "1.7",
    color: "#475569",
  },
  linkBox: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "14px",
    display: "grid",
    gap: "6px",
  },
  linkLabel: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  linkText: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#0f172a",
    wordBreak: "break-word",
  },
  buttonRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    backgroundColor: "#0f172a",
    color: "#fff",
    border: "none",
    padding: "15px 18px",
    borderRadius: "14px",
    fontSize: "15px",
    fontWeight: "700",
    minWidth: "160px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.16)",
  },
  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    backgroundColor: "#0f172a",
    color: "#fff",
    border: "none",
    padding: "12px 14px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "700",
    minWidth: "110px",
  },
  copyButton: {
    backgroundColor: "#f8fafc",
    color: "#0f172a",
    border: "1px solid #cbd5e1",
    padding: "12px 14px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    minWidth: "130px",
  },
  deleteButton: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    border: "none",
    padding: "12px 14px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    minWidth: "110px",
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
  },
};
