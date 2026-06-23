"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

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
  }, []);

  async function fetchEvents() {
    setLoading(true);

    try {
      const response = await fetch("/api/admin-dashboard", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Dashboard konnte nicht geladen werden.");

        setEvents([]);
        setFailedOrders([]);
        setBatchCount(0);

        setLoading(false);
        setLoadingBatchCount(false);
        setLoadingFailedOrders(false);

        return;
      }

      setEvents(result.events || []);
      setFailedOrders(result.failedOrders || []);
      setBatchCount(result.batchCount || 0);
      setLoadingBatchCount(false);
      setLoadingFailedOrders(false);
    } catch (error) {
      console.error("Fehler beim Laden des Dashboards:", error);

      alert("Dashboard konnte nicht geladen werden.");

      setEvents([]);
      setFailedOrders([]);
      setBatchCount(0);
      setLoadingBatchCount(false);
      setLoadingFailedOrders(false);
    }

    setLoading(false);
  }

  async function handleRunBatch() {
    if (batchCount === 0) {
      alert("Keine offenen Bestellungen für den Batch.");
      return;
    }

    const confirmed = window.confirm(
      `Wirklich ${batchCount} Bestellung${
        batchCount === 1 ? "" : "en"
      } gesammelt an Gelato senden?`
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

      await fetchEvents();
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

      await fetchEvents();
    } catch (error) {
      console.error("Fehler beim Retry:", error);
      alert("Retry konnte nicht gestartet werden.");
    }

    setRetryingOrderId(null);
  }

  async function handleDeleteEvent(eventItem) {
    const confirmed = window.confirm(
      `Event "${eventItem.title}" wirklich löschen?\n\nAchtung: Die Event-Zeile wird gelöscht.`
    );

    if (!confirmed) return;

    setDeletingId(eventItem.id);

    try {
      const response = await fetch("/api/delete-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: eventItem.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Event konnte nicht gelöscht werden.");
        setDeletingId(null);
        return;
      }

      setEvents((prev) => prev.filter((event) => event.id !== eventItem.id));

      alert("Event gelöscht.");
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
      alert("Event konnte nicht gelöscht werden.");
    }

    setDeletingId(null);
  }

  async function handleCopyText(text, successMessage = "Kopiert.") {
    if (!text) {
      alert("Nichts zum Kopieren vorhanden.");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      alert(successMessage);
    } catch (error) {
      console.error("Konnte nicht kopiert werden:", error);
      alert("Konnte nicht kopiert werden.");
    }
  }

  async function handleCopyLink(slug) {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/event/${slug}`
        : `/event/${slug}`;

    await handleCopyText(url, "Event-Link kopiert.");
  }

  async function handleShareEvent(eventItem) {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/event/${eventItem.slug}`
        : `/event/${eventItem.slug}`;

    const text = `📸 Willkommen in unserem gemeinsamen Snapkey Album.

Album:
${url}

🔑 Zugangscode:
${eventItem.access_password || "Bitte Zugangscode beim Gastgeber erfragen."}

Hier können alle Gäste Fotos und Videos hochladen und ansehen.`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: eventItem.title || "Snapkey Album",
          text,
        });
        return;
      } catch {}
    }

    await handleCopyText(text, "Teilen-Text wurde kopiert.");
  }

  async function handleAdminLogout() {
    await fetch("/api/admin-logout", { method: "POST" });
    window.location.href = "/admin-login";
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
    return `${(Number(amountInCent) / 100).toFixed(2)} €`;
  }

  function getNumber(value) {
    const number = Number(value || 0);
    return Number.isFinite(number) ? number : 0;
  }

  function getEventPhotosCount(eventItem) {
    return getNumber(
      eventItem.photos_count ??
        eventItem.photo_count ??
        eventItem.photosCount ??
        eventItem.total_photos
    );
  }

  function getEventOrdersCount(eventItem) {
    return getNumber(
      eventItem.orders_count ??
        eventItem.order_count ??
        eventItem.ordersCount ??
        eventItem.total_orders
    );
  }

  function getEventRevenue(eventItem) {
    return getNumber(
      eventItem.revenue_total ??
        eventItem.total_revenue ??
        eventItem.revenue ??
        eventItem.paid_total
    );
  }

  function getEventLikes(eventItem) {
    return getNumber(
      eventItem.likes_count ??
        eventItem.like_count ??
        eventItem.total_likes
    );
  }

  function getEventComments(eventItem) {
    return getNumber(
      eventItem.comments_count ??
        eventItem.comment_count ??
        eventItem.total_comments
    );
  }

  function getLastUpload(eventItem) {
    return (
      eventItem.latest_upload_at ||
      eventItem.last_upload_at ||
      eventItem.last_photo_at ||
      null
    );
  }

  function getEventStatus(eventItem) {
    if (eventItem.setup_completed === false) {
      return {
        label: "Setup offen",
        style: styles.statusWarning,
      };
    }

    const lastUpload = getLastUpload(eventItem);

    if (!lastUpload) {
      return {
        label: "Noch keine Uploads",
        style: styles.statusMuted,
      };
    }

    const daysSinceUpload =
      (Date.now() - new Date(lastUpload).getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceUpload > 14) {
      return {
        label: "Ruhig",
        style: styles.statusWarning,
      };
    }

    return {
      label: "Aktiv",
      style: styles.statusActive,
    };
  }

  const totals = useMemo(() => {
    const photos = events.reduce((sum, item) => sum + getEventPhotosCount(item), 0);
    const orders = events.reduce((sum, item) => sum + getEventOrdersCount(item), 0);
    const revenue = events.reduce((sum, item) => sum + getEventRevenue(item), 0);
    const activeEvents = events.filter((item) => getEventStatus(item).label === "Aktiv").length;

    return {
      events: events.length,
      activeEvents,
      photos,
      orders,
      revenue,
      failedOrders: failedOrders.length,
    };
  }, [events, failedOrders]);

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
        event.creator_email,
        event.access_password,
        event.admin_password,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [events, searchTerm]);

  const recentEvents = useMemo(() => {
    return [...events]
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      .slice(0, 3);
  }, [events]);

  return (
    <main style={styles.page}>
      <section style={styles.shell}>
        <header style={styles.header}>
          <div>
            <div style={styles.brand}>getsnapkey Admin</div>
            <h1 style={styles.title}>Dein Kontrollzentrum.</h1>
            <p style={styles.subtitle}>
              Events, Bestellungen, Fehler und Links an einem Ort. Schnell sehen,
              was läuft, was offen ist und wo du eingreifen musst.
            </p>
          </div>

          <div style={styles.headerActions}>
            <Link href="/event" style={styles.primaryButton}>
              Neues Event
            </Link>

            <button type="button" onClick={handleAdminLogout} style={styles.ghostButton}>
              Logout
            </button>
          </div>
        </header>

        <section style={styles.statsGrid}>
          <StatCard label="Events" value={totals.events} sub="angelegte Alben" />
          <StatCard label="Aktiv" value={totals.activeEvents} sub="mit aktuellen Uploads" />
          <StatCard label="Fotos" value={totals.photos} sub="gesamt erfasst" />
          <StatCard label="Bestellungen" value={totals.orders} sub="gesamt" />
          <StatCard label="Umsatz" value={formatEuro(totals.revenue)} sub="bezahlter Umsatz" />
          <StatCard
            label="Fehler"
            value={loadingFailedOrders ? "…" : totals.failedOrders}
            sub="fehlgeschlagene Bestellungen"
            danger={totals.failedOrders > 0}
          />
        </section>

        <section style={styles.controlGrid}>
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <div>
                <div style={styles.eyebrow}>Suche</div>
                <h2 style={styles.panelTitle}>Event finden</h2>
              </div>
            </div>

            <input
              type="text"
              placeholder="Titel, Ort, Kategorie, E-Mail, Code oder Slug suchen"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <div>
                <div style={styles.eyebrow}>Gelato</div>
                <h2 style={styles.panelTitle}>Batch-Verarbeitung</h2>
              </div>

              <div style={styles.batchBubble}>
                {loadingBatchCount ? "…" : batchCount}
              </div>
            </div>

            <p style={styles.panelText}>
              Bestellungen mit Status „waiting_for_batch“ gesammelt an Gelato senden.
            </p>

            <button
              type="button"
              onClick={handleRunBatch}
              disabled={runningBatch || loadingBatchCount || batchCount === 0}
              style={{
                ...styles.primaryButton,
                width: "100%",
                ...(runningBatch || loadingBatchCount || batchCount === 0
                  ? styles.buttonDisabled
                  : {}),
              }}
            >
              {runningBatch ? "Batch wird gesendet..." : "Batch an Gelato senden"}
            </button>
          </div>

          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <div>
                <div style={styles.eyebrow}>Heute</div>
                <h2 style={styles.panelTitle}>Schnellüberblick</h2>
              </div>
            </div>

            <div style={styles.quickList}>
              <div style={styles.quickRow}>
                <span>Neue Events</span>
                <strong>{recentEvents.length}</strong>
              </div>
              <div style={styles.quickRow}>
                <span>Offene Batches</span>
                <strong>{loadingBatchCount ? "…" : batchCount}</strong>
              </div>
              <div style={styles.quickRow}>
                <span>Fehler</span>
                <strong>{loadingFailedOrders ? "…" : failedOrders.length}</strong>
              </div>
            </div>
          </div>
        </section>

        {recentEvents.length > 0 && (
          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <div>
                <div style={styles.eyebrow}>Aktuell</div>
                <h2 style={styles.sectionTitle}>Neueste Events</h2>
              </div>
            </div>

            <div style={styles.recentGrid}>
              {recentEvents.map((eventItem) => (
                <Link
                  key={eventItem.id}
                  href={`/event/${eventItem.slug}`}
                  style={styles.recentCard}
                >
                  <strong>{eventItem.title || "Ohne Titel"}</strong>
                  <span>{eventItem.category || "Event"} · {formatDate(eventItem.start_date)}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <div style={styles.eyebrow}>Probleme</div>
              <h2 style={styles.sectionTitle}>Fehlgeschlagene Bestellungen</h2>
            </div>

            <div
              style={{
                ...styles.countBadge,
                ...(failedOrders.length > 0 ? styles.countBadgeDanger : {}),
              }}
            >
              {loadingFailedOrders ? "…" : failedOrders.length}
            </div>
          </div>

          {loadingFailedOrders ? (
            <div style={styles.emptyBox}>Fehler-Bestellungen werden geladen...</div>
          ) : failedOrders.length === 0 ? (
            <div style={styles.emptyBox}>Aktuell gibt es keine fehlgeschlagenen Bestellungen.</div>
          ) : (
            <div style={styles.failedGrid}>
              {failedOrders.map((order) => (
                <article key={order.id} style={styles.failedCard}>
                  <div style={styles.failedTopRow}>
                    <div style={styles.failedStatus}>failed</div>
                    <div style={styles.mutedText}>{formatDateTime(order.created_at)}</div>
                  </div>

                  <div style={styles.metaList}>
                    <MetaRow label="Bestellung" value={order.id} />
                    <MetaRow label="Kunde" value={order.customer_name || "—"} />
                    <MetaRow label="E-Mail" value={order.customer_email || "—"} />
                    <MetaRow label="Format" value={order.print_option || "—"} />
                    <MetaRow label="Rahmen" value={order.frame_option || "—"} />
                    <MetaRow label="Gesamt" value={formatEuro(order.total_price)} />
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
                      ...styles.primaryButton,
                      width: "100%",
                      ...(retryingOrderId === order.id ? styles.buttonDisabled : {}),
                    }}
                  >
                    {retryingOrderId === order.id
                      ? "Wird erneut gesendet..."
                      : "Erneut an Gelato senden"}
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <div style={styles.eyebrow}>Events</div>
              <h2 style={styles.sectionTitle}>Alle Alben</h2>
            </div>

            <div style={styles.countBadge}>
              {loading ? "…" : filteredEvents.length}
            </div>
          </div>

          {loading ? (
            <div style={styles.emptyBox}>Events werden geladen...</div>
          ) : filteredEvents.length === 0 ? (
            <div style={styles.emptyBox}>
              {events.length === 0
                ? "Noch keine Events vorhanden."
                : "Keine Events passend zur Suche gefunden."}
            </div>
          ) : (
            <div style={styles.eventGrid}>
              {filteredEvents.map((eventItem) => {
                const eventLink = `/event/${eventItem.slug}`;
                const status = getEventStatus(eventItem);
                const photoCount = getEventPhotosCount(eventItem);
                const orderCount = getEventOrdersCount(eventItem);
                const eventRevenue = getEventRevenue(eventItem);
                const likeCount = getEventLikes(eventItem);
                const commentCount = getEventComments(eventItem);
                const lastUpload = getLastUpload(eventItem);

                return (
                  <article key={eventItem.id} style={styles.eventCard}>
                    <div style={styles.eventTop}>
                      <div style={styles.cardTag}>
                        {eventItem.category || "Event"}
                      </div>

                      <div style={{ ...styles.statusPill, ...status.style }}>
                        {status.label}
                      </div>
                    </div>

                    <h3 style={styles.cardTitle}>{eventItem.title || "Ohne Titel"}</h3>

                    <div style={styles.eventSubline}>
                      <span>{eventItem.location || "Kein Ort"}</span>
                      <span>{formatDate(eventItem.start_date)}</span>
                    </div>

                    <div style={styles.metricGrid}>
                      <MiniMetric label="Fotos" value={photoCount} />
                      <MiniMetric label="Bestellungen" value={orderCount} />
                      <MiniMetric label="Likes" value={likeCount} />
                      <MiniMetric label="Kommentare" value={commentCount} />
                    </div>

                    <div style={styles.metaList}>
                      <MetaRow label="Erstellt" value={formatDateTime(eventItem.created_at)} />
                      <MetaRow label="Letzter Upload" value={lastUpload ? formatDateTime(lastUpload) : "—"} />
                      <MetaRow label="Umsatz" value={formatEuro(eventRevenue)} />
                      <MetaRow label="Ersteller" value={eventItem.creator_email || "—"} />
                      <MetaRow label="Slug" value={eventItem.slug || "—"} />
                    </div>

                    <div style={styles.codeGrid}>
                      <div style={styles.codeBox}>
                        <span>Gast-Code</span>
                        <strong>{eventItem.access_password || "—"}</strong>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopyText(eventItem.access_password, "Gast-Code kopiert.")
                          }
                          style={styles.tinyButton}
                        >
                          Kopieren
                        </button>
                      </div>

                      <div style={styles.codeBox}>
                        <span>Admin-Code</span>
                        <strong>{eventItem.admin_password || "—"}</strong>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopyText(eventItem.admin_password, "Admin-Code kopiert.")
                          }
                          style={styles.tinyButton}
                        >
                          Kopieren
                        </button>
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
                        onClick={() => handleShareEvent(eventItem)}
                        style={styles.copyButton}
                      >
                        Teilen
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
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

function StatCard({ label, value, sub, danger }) {
  return (
    <div style={danger ? { ...styles.statCard, ...styles.statCardDanger } : styles.statCard}>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statValue}>{value}</div>
      <div style={styles.statSub}>{sub}</div>
    </div>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div style={styles.miniMetric}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function MetaRow({ label, value }) {
  return (
    <div style={styles.metaRow}>
      <span style={styles.metaLabel}>{label}</span>
      <span style={styles.metaValue}>{value}</span>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top right, rgba(201,167,108,0.14), transparent 34%), linear-gradient(180deg, #faf8f5 0%, #ffffff 100%)",
    padding: "28px 18px 72px",
    overflowX: "hidden",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#1a1612",
  },
  shell: {
    width: "100%",
    maxWidth: "1320px",
    margin: "0 auto",
    display: "grid",
    gap: "24px",
  },
  header: {
    display: "grid",
    gap: "22px",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    alignItems: "end",
  },
  brand: {
    fontSize: "26px",
    fontWeight: "800",
    letterSpacing: "-0.04em",
    color: "#1a1612",
    marginBottom: "18px",
  },
  title: {
    margin: 0,
    fontSize: "clamp(42px, 7vw, 72px)",
    lineHeight: "1.02",
    letterSpacing: "-0.06em",
    fontWeight: "800",
  },
  subtitle: {
    margin: "18px 0 0",
    maxWidth: "720px",
    color: "#6b5f54",
    fontSize: "16px",
    lineHeight: "1.75",
  },
  headerActions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    backgroundColor: "#1a1612",
    color: "#fff",
    border: "none",
    padding: "14px 18px",
    borderRadius: "999px",
    fontSize: "14px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow: "0 12px 34px rgba(26, 22, 18, 0.16)",
  },
  ghostButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    color: "#1a1612",
    border: "1px solid #ebe5dd",
    padding: "14px 18px",
    borderRadius: "999px",
    fontSize: "14px",
    fontWeight: "800",
    cursor: "pointer",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
    gap: "14px",
  },
  statCard: {
    background: "rgba(255,255,255,0.94)",
    border: "1px solid #ebe5dd",
    borderRadius: "24px",
    padding: "20px",
    boxShadow: "0 18px 50px rgba(26,22,18,0.06)",
    display: "grid",
    gap: "6px",
  },
  statCardDanger: {
    borderColor: "#fecaca",
    background: "#fff7f7",
  },
  statLabel: {
    fontSize: "12px",
    fontWeight: "800",
    color: "#9a8d82",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  statValue: {
    fontSize: "34px",
    lineHeight: 1,
    fontWeight: "800",
    color: "#1a1612",
  },
  statSub: {
    fontSize: "13px",
    color: "#6b5f54",
    fontWeight: "600",
  },
  controlGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.3fr) minmax(280px, 0.8fr) minmax(260px, 0.7fr)",
    gap: "14px",
  },
  panel: {
    background: "rgba(255,255,255,0.94)",
    border: "1px solid #ebe5dd",
    borderRadius: "26px",
    padding: "22px",
    boxShadow: "0 18px 50px rgba(26,22,18,0.06)",
    display: "grid",
    gap: "16px",
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "14px",
    alignItems: "flex-start",
  },
  eyebrow: {
    fontSize: "12px",
    fontWeight: "800",
    color: "#c9a76c",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
  panelTitle: {
    margin: "6px 0 0",
    fontSize: "22px",
    lineHeight: "1.15",
    letterSpacing: "-0.035em",
    color: "#1a1612",
  },
  panelText: {
    margin: 0,
    color: "#6b5f54",
    fontSize: "14px",
    lineHeight: "1.6",
  },
  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "16px 18px",
    borderRadius: "18px",
    border: "1px solid #ebe5dd",
    backgroundColor: "#fff",
    color: "#1a1612",
    fontSize: "15px",
    outline: "none",
  },
  batchBubble: {
    width: "44px",
    height: "44px",
    borderRadius: "16px",
    background: "#f5efe7",
    border: "1px solid #ebe5dd",
    display: "grid",
    placeItems: "center",
    fontWeight: "800",
    color: "#1a1612",
  },
  quickList: {
    display: "grid",
    gap: "10px",
  },
  quickRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    paddingBottom: "10px",
    borderBottom: "1px solid #ebe5dd",
    color: "#6b5f54",
    fontSize: "14px",
  },
  section: {
    display: "grid",
    gap: "16px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "14px",
    alignItems: "center",
  },
  sectionTitle: {
    margin: "6px 0 0",
    fontSize: "30px",
    lineHeight: "1.1",
    letterSpacing: "-0.04em",
    color: "#1a1612",
  },
  countBadge: {
    minWidth: "42px",
    height: "42px",
    padding: "0 14px",
    borderRadius: "999px",
    background: "#f5efe7",
    border: "1px solid #ebe5dd",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "800",
    color: "#1a1612",
  },
  countBadgeDanger: {
    background: "#fee2e2",
    borderColor: "#fecaca",
    color: "#b91c1c",
  },
  recentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "14px",
  },
  recentCard: {
    display: "grid",
    gap: "6px",
    textDecoration: "none",
    background: "#fff",
    border: "1px solid #ebe5dd",
    borderRadius: "22px",
    padding: "18px",
    color: "#1a1612",
    boxShadow: "0 14px 36px rgba(26,22,18,0.05)",
  },
  failedGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "16px",
  },
  failedCard: {
    background: "#fff",
    border: "1px solid #fecaca",
    borderRadius: "24px",
    padding: "20px",
    boxShadow: "0 14px 36px rgba(26,22,18,0.05)",
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
    fontWeight: "800",
    textTransform: "uppercase",
  },
  mutedText: {
    color: "#9a8d82",
    fontSize: "12px",
    fontWeight: "700",
  },
  errorBox: {
    background: "#fff7ed",
    border: "1px solid #fdba74",
    borderRadius: "18px",
    padding: "14px",
    display: "grid",
    gap: "8px",
  },
  errorLabel: {
    fontSize: "12px",
    fontWeight: "800",
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
  eventGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: "18px",
  },
  eventCard: {
    background: "#fff",
    border: "1px solid #ebe5dd",
    borderRadius: "28px",
    padding: "22px",
    boxShadow: "0 18px 50px rgba(26,22,18,0.06)",
    display: "grid",
    gap: "16px",
  },
  eventTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  cardTag: {
    background: "#f5efe7",
    color: "#6b5f54",
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "800",
  },
  statusPill: {
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "800",
  },
  statusActive: {
    background: "#dcfce7",
    color: "#166534",
  },
  statusWarning: {
    background: "#fef3c7",
    color: "#92400e",
  },
  statusMuted: {
    background: "#f1f5f9",
    color: "#64748b",
  },
  cardTitle: {
    margin: 0,
    fontSize: "26px",
    lineHeight: "1.18",
    letterSpacing: "-0.035em",
    color: "#1a1612",
  },
  eventSubline: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    color: "#6b5f54",
    fontSize: "14px",
    fontWeight: "700",
  },
  metricGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "8px",
  },
  miniMetric: {
    background: "#faf8f5",
    border: "1px solid #ebe5dd",
    borderRadius: "18px",
    padding: "12px 8px",
    display: "grid",
    gap: "2px",
    textAlign: "center",
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
    borderBottom: "1px solid #f1ede8",
  },
  metaLabel: {
    fontSize: "13px",
    fontWeight: "800",
    color: "#9a8d82",
  },
  metaValue: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#1a1612",
    textAlign: "right",
    wordBreak: "break-word",
  },
  codeGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
  codeBox: {
    display: "grid",
    gap: "7px",
    padding: "14px",
    borderRadius: "18px",
    background: "#f5efe7",
    border: "1px solid #ebe5dd",
  },
  tinyButton: {
    width: "100%",
    border: "1px solid #ebe5dd",
    background: "#fff",
    color: "#1a1612",
    borderRadius: "999px",
    padding: "9px 10px",
    fontSize: "12px",
    fontWeight: "800",
    cursor: "pointer",
  },
  description: {
    margin: 0,
    fontSize: "14px",
    lineHeight: "1.7",
    color: "#6b5f54",
  },
  linkBox: {
    background: "#faf8f5",
    border: "1px solid #ebe5dd",
    borderRadius: "18px",
    padding: "14px",
    display: "grid",
    gap: "6px",
  },
  linkLabel: {
    fontSize: "12px",
    fontWeight: "800",
    color: "#9a8d82",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  linkText: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#1a1612",
    wordBreak: "break-word",
  },
  buttonRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    backgroundColor: "#1a1612",
    color: "#fff",
    border: "none",
    padding: "12px 14px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "800",
    minWidth: "100px",
  },
  copyButton: {
    backgroundColor: "#fff",
    color: "#1a1612",
    border: "1px solid #ebe5dd",
    padding: "12px 14px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "800",
    cursor: "pointer",
    minWidth: "110px",
  },
  deleteButton: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    border: "none",
    padding: "12px 14px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "800",
    cursor: "pointer",
    minWidth: "100px",
  },
  emptyBox: {
    background: "#fff",
    border: "1px solid #ebe5dd",
    borderRadius: "24px",
    padding: "24px",
    color: "#6b5f54",
    fontSize: "15px",
  },
  buttonDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
  },
};
