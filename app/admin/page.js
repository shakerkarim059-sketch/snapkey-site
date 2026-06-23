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
    } catch (error) {
      console.error("Fehler beim Laden des Dashboards:", error);
      alert("Dashboard konnte nicht geladen werden.");
      setEvents([]);
      setFailedOrders([]);
      setBatchCount(0);
    }

    setLoading(false);
    setLoadingBatchCount(false);
    setLoadingFailedOrders(false);
  }

  async function handleRunBatch() {
    if (batchCount === 0) {
      alert("Keine offenen Bestellungen für den Batch.");
      return;
    }

    if (!window.confirm(`${batchCount} Bestellung(en) an Gelato senden?`)) return;

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

      alert(`Batch erfolgreich gesendet. ${result.orders} Bestellung(en) verarbeitet.`);
      await fetchEvents();
    } catch (error) {
      console.error("Fehler beim Starten des Batchs:", error);
      alert("Batch konnte nicht gestartet werden.");
    }

    setRunningBatch(false);
  }

  async function handleRetryOrder(orderId) {
    if (!window.confirm("Diese Bestellung erneut an Gelato senden?")) return;

    setRetryingOrderId(orderId);

    try {
      const response = await fetch("/api/retry-gelato-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: eventItem.id }),
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

  async function handleCopyText(text, message = "Kopiert.") {
    if (!text) return alert("Nichts zum Kopieren vorhanden.");

    try {
      await navigator.clipboard.writeText(text);
      alert(message);
    } catch {
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

    if (navigator.share) {
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

  function number(value) {
    const n = Number(value || 0);
    return Number.isFinite(n) ? n : 0;
  }

  function photosCount(eventItem) {
    return number(eventItem.photos_count ?? eventItem.photo_count ?? eventItem.total_photos);
  }

  function ordersCount(eventItem) {
    return number(eventItem.orders_count ?? eventItem.order_count ?? eventItem.total_orders);
  }

  function revenueAmount(eventItem) {
    return number(eventItem.revenue_total ?? eventItem.total_revenue ?? eventItem.revenue ?? eventItem.paid_total);
  }

  function likesCount(eventItem) {
    return number(eventItem.likes_count ?? eventItem.like_count ?? eventItem.total_likes);
  }

  function commentsCount(eventItem) {
    return number(eventItem.comments_count ?? eventItem.comment_count ?? eventItem.total_comments);
  }

  function lastUpload(eventItem) {
    return eventItem.latest_upload_at || eventItem.last_upload_at || eventItem.last_photo_at || null;
  }

  function getStatus(eventItem) {
    if (eventItem.setup_completed === false) return "Setup offen";
    if (!lastUpload(eventItem)) return "Keine Uploads";

    const days =
      (Date.now() - new Date(lastUpload(eventItem)).getTime()) /
      (1000 * 60 * 60 * 24);

    return days > 14 ? "Ruhig" : "Aktiv";
  }

  const totals = useMemo(() => {
    return {
      events: events.length,
      active: events.filter((item) => getStatus(item) === "Aktiv").length,
      photos: events.reduce((sum, item) => sum + photosCount(item), 0),
      orders: events.reduce((sum, item) => sum + ordersCount(item), 0),
      revenue: events.reduce((sum, item) => sum + revenueAmount(item), 0),
      failed: failedOrders.length,
    };
  }, [events, failedOrders]);

  const filteredEvents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return events;

    return events.filter((event) =>
      [
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
        .toLowerCase()
        .includes(term)
    );
  }, [events, searchTerm]);

  const recentEvents = useMemo(() => {
    return [...events]
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      .slice(0, 3);
  }, [events]);

  return (
    <main className="admin-page">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: "Inter", system-ui, sans-serif;
          background: #faf8f5;
          color: #1a1612;
        }

        button,
        input {
          font: inherit;
        }

        .admin-page {
          min-height: 100vh;
          padding: 28px 18px 72px;
          background:
            radial-gradient(circle at top right, rgba(201, 167, 108, 0.14), transparent 34%),
            linear-gradient(180deg, #faf8f5 0%, #ffffff 100%);
          overflow-x: hidden;
        }

        .admin-shell {
          width: 100%;
          max-width: 1320px;
          margin: 0 auto;
          display: grid;
          gap: 24px;
        }

        .admin-header {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 22px;
          align-items: end;
        }

        .brand {
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.04em;
          margin-bottom: 18px;
        }

        .title {
          margin: 0;
          font-size: clamp(42px, 7vw, 72px);
          line-height: 1.02;
          letter-spacing: -0.06em;
          font-weight: 800;
        }

        .subtitle {
          max-width: 720px;
          margin: 18px 0 0;
          color: #6b5f54;
          font-size: 16px;
          line-height: 1.75;
        }

        .header-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .primary-button,
        .secondary-button,
        .ghost-button,
        .copy-button,
        .danger-button,
        .tiny-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          border: none;
          cursor: pointer;
          font-weight: 800;
          transition: all 0.2s ease;
        }

        .primary-button {
          background: #1a1612;
          color: white;
          padding: 14px 18px;
          border-radius: 999px;
          font-size: 14px;
          box-shadow: 0 12px 34px rgba(26, 22, 18, 0.16);
        }

        .secondary-button {
          background: #1a1612;
          color: white;
          padding: 12px 14px;
          border-radius: 999px;
          font-size: 13px;
        }

        .ghost-button,
        .copy-button {
          background: white;
          color: #1a1612;
          border: 1px solid #ebe5dd;
          padding: 12px 14px;
          border-radius: 999px;
          font-size: 13px;
        }

        .ghost-button {
          padding: 14px 18px;
          font-size: 14px;
        }

        .danger-button {
          background: #fee2e2;
          color: #b91c1c;
          padding: 12px 14px;
          border-radius: 999px;
          font-size: 13px;
        }

        .tiny-button {
          width: 100%;
          background: white;
          color: #1a1612;
          border: 1px solid #ebe5dd;
          border-radius: 999px;
          padding: 9px 10px;
          font-size: 12px;
        }

        .button-disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
          gap: 14px;
        }

        .stat-card,
        .panel,
        .event-card,
        .failed-card,
        .recent-card,
        .empty-box {
          background: rgba(255, 255, 255, 0.94);
          border: 1px solid #ebe5dd;
          box-shadow: 0 18px 50px rgba(26, 22, 18, 0.06);
        }

        .stat-card {
          border-radius: 24px;
          padding: 20px;
          display: grid;
          gap: 6px;
        }

        .stat-card.danger {
          border-color: #fecaca;
          background: #fff7f7;
        }

        .stat-label,
        .eyebrow {
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #c9a76c;
        }

        .stat-label {
          color: #9a8d82;
        }

        .stat-value {
          font-size: 34px;
          line-height: 1;
          font-weight: 800;
        }

        .stat-sub {
          color: #6b5f54;
          font-size: 13px;
          font-weight: 600;
        }

        .control-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.3fr) minmax(280px, 0.8fr) minmax(260px, 0.7fr);
          gap: 14px;
        }

        .panel {
          border-radius: 26px;
          padding: 22px;
          display: grid;
          gap: 16px;
        }

        .panel-header,
        .section-header,
        .event-top,
        .failed-top {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          align-items: flex-start;
        }

        .panel-title,
        .section-title {
          margin: 6px 0 0;
          line-height: 1.1;
          letter-spacing: -0.04em;
        }

        .panel-title {
          font-size: 22px;
        }

        .section-title {
          font-size: 30px;
        }

        .panel-text {
          margin: 0;
          color: #6b5f54;
          font-size: 14px;
          line-height: 1.6;
        }

        .search-input {
          width: 100%;
          padding: 16px 18px;
          border-radius: 18px;
          border: 1px solid #ebe5dd;
          background: white;
          color: #1a1612;
          font-size: 15px;
          outline: none;
        }

        .batch-bubble,
        .count-badge {
          min-width: 44px;
          height: 44px;
          border-radius: 999px;
          background: #f5efe7;
          border: 1px solid #ebe5dd;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 14px;
          font-weight: 800;
        }

        .count-badge.danger {
          background: #fee2e2;
          border-color: #fecaca;
          color: #b91c1c;
        }

        .quick-list,
        .meta-list {
          display: grid;
          gap: 10px;
        }

        .quick-row,
        .meta-row {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          padding-bottom: 10px;
          border-bottom: 1px solid #f1ede8;
        }

        .quick-row span,
        .meta-label {
          color: #9a8d82;
          font-size: 13px;
          font-weight: 800;
        }

        .quick-row strong,
        .meta-value {
          color: #1a1612;
          font-size: 13px;
          font-weight: 800;
          text-align: right;
          word-break: break-word;
        }

        .section {
          display: grid;
          gap: 16px;
        }

        .recent-grid,
        .failed-grid,
        .event-grid {
          display: grid;
          gap: 16px;
        }

        .recent-grid {
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        }

        .failed-grid {
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        }

        .event-grid {
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
        }

        .recent-card {
          display: grid;
          gap: 6px;
          text-decoration: none;
          color: #1a1612;
          border-radius: 22px;
          padding: 18px;
        }

        .recent-card span {
          color: #6b5f54;
          font-size: 13px;
          font-weight: 700;
        }

        .failed-card,
        .event-card {
          border-radius: 28px;
          padding: 22px;
          display: grid;
          gap: 16px;
        }

        .failed-card {
          border-color: #fecaca;
        }

        .failed-status,
        .card-tag,
        .status-pill {
          width: fit-content;
          padding: 8px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
        }

        .failed-status {
          background: #fee2e2;
          color: #b91c1c;
          text-transform: uppercase;
        }

        .card-tag {
          background: #f5efe7;
          color: #6b5f54;
        }

        .status-aktiv {
          background: #dcfce7;
          color: #166534;
        }

        .status-ruhig,
        .status-setup-offen {
          background: #fef3c7;
          color: #92400e;
        }

        .status-keine-uploads {
          background: #f1f5f9;
          color: #64748b;
        }

        .muted {
          color: #9a8d82;
          font-size: 12px;
          font-weight: 700;
        }

        .error-box {
          background: #fff7ed;
          border: 1px solid #fdba74;
          border-radius: 18px;
          padding: 14px;
          display: grid;
          gap: 8px;
        }

        .error-label {
          font-size: 12px;
          font-weight: 800;
          color: #9a3412;
          text-transform: uppercase;
        }

        .error-text {
          color: #7c2d12;
          font-size: 13px;
          line-height: 1.6;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .card-title {
          margin: 0;
          font-size: 26px;
          line-height: 1.18;
          letter-spacing: -0.035em;
        }

        .event-subline {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          color: #6b5f54;
          font-size: 14px;
          font-weight: 700;
        }

        .metric-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .mini-metric {
          background: #faf8f5;
          border: 1px solid #ebe5dd;
          border-radius: 18px;
          padding: 12px 8px;
          display: grid;
          gap: 2px;
          text-align: center;
        }

        .mini-metric strong {
          font-size: 18px;
        }

        .mini-metric span {
          color: #6b5f54;
          font-size: 11px;
          font-weight: 800;
        }

        .code-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .code-box {
          display: grid;
          gap: 7px;
          padding: 14px;
          border-radius: 18px;
          background: #f5efe7;
          border: 1px solid #ebe5dd;
        }

        .code-box span {
          color: #9a8d82;
          font-size: 12px;
          font-weight: 800;
        }

        .code-box strong {
          font-size: 16px;
          word-break: break-word;
        }

        .description {
          margin: 0;
          color: #6b5f54;
          font-size: 14px;
          line-height: 1.7;
        }

        .link-box {
          background: #faf8f5;
          border: 1px solid #ebe5dd;
          border-radius: 18px;
          padding: 14px;
          display: grid;
          gap: 6px;
        }

        .link-label {
          color: #9a8d82;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .link-text {
          color: #1a1612;
          font-size: 13px;
          font-weight: 700;
          word-break: break-word;
        }

        .button-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .empty-box {
          border-radius: 24px;
          padding: 24px;
          color: #6b5f54;
          font-size: 15px;
        }

        @media (max-width: 980px) {
          .admin-header {
            grid-template-columns: 1fr;
          }

          .header-actions {
            justify-content: flex-start;
          }

          .control-grid {
            grid-template-columns: 1fr;
          }

          .metric-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .admin-page {
            padding: 20px 12px 56px;
          }

          .title {
            font-size: 42px;
          }

          .subtitle {
            font-size: 15px;
          }

          .stats-grid,
          .recent-grid,
          .failed-grid,
          .event-grid {
            grid-template-columns: 1fr;
          }

          .panel,
          .event-card,
          .failed-card,
          .stat-card {
            border-radius: 22px;
            padding: 18px;
          }

          .section-header,
          .panel-header,
          .event-top,
          .failed-top {
            align-items: flex-start;
          }

          .code-grid {
            grid-template-columns: 1fr;
          }

          .button-row,
          .header-actions {
            display: grid;
            grid-template-columns: 1fr;
            width: 100%;
          }

          .primary-button,
          .secondary-button,
          .ghost-button,
          .copy-button,
          .danger-button {
            width: 100%;
            min-height: 48px;
          }

          .meta-row,
          .quick-row {
            align-items: flex-start;
          }
        }
      `}</style>

      <section className="admin-shell">
        <header className="admin-header">
          <div>
            <div className="brand">getsnapkey Admin</div>
            <h1 className="title">Dein Kontrollzentrum.</h1>
            <p className="subtitle">
              Events, Bestellungen, Fehler und Links an einem Ort. Schnell sehen,
              was läuft, was offen ist und wo du eingreifen musst.
            </p>
          </div>

          <div className="header-actions">
            <Link href="/event" className="primary-button">
              Neues Event
            </Link>

            <button type="button" onClick={handleAdminLogout} className="ghost-button">
              Logout
            </button>
          </div>
        </header>

        <section className="stats-grid">
          <StatCard label="Events" value={totals.events} sub="angelegte Alben" />
          <StatCard label="Aktiv" value={totals.active} sub="mit Uploads" />
          <StatCard label="Fotos" value={totals.photos} sub="gesamt" />
          <StatCard label="Bestellungen" value={totals.orders} sub="gesamt" />
          <StatCard label="Umsatz" value={formatEuro(totals.revenue)} sub="bezahlt" />
          <StatCard
            label="Fehler"
            value={loadingFailedOrders ? "…" : totals.failed}
            sub="fehlgeschlagen"
            danger={totals.failed > 0}
          />
        </section>

        <section className="control-grid">
          <div className="panel">
            <div>
              <div className="eyebrow">Suche</div>
              <h2 className="panel-title">Event finden</h2>
            </div>

            <input
              type="text"
              placeholder="Titel, Ort, Kategorie, E-Mail, Code oder Slug suchen"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="panel">
            <div className="panel-header">
              <div>
                <div className="eyebrow">Gelato</div>
                <h2 className="panel-title">Batch-Verarbeitung</h2>
              </div>

              <div className="batch-bubble">
                {loadingBatchCount ? "…" : batchCount}
              </div>
            </div>

            <p className="panel-text">
              Offene Bestellungen gesammelt an Gelato senden.
            </p>

            <button
              type="button"
              onClick={handleRunBatch}
              disabled={runningBatch || loadingBatchCount || batchCount === 0}
              className={
                runningBatch || loadingBatchCount || batchCount === 0
                  ? "primary-button button-disabled"
                  : "primary-button"
              }
            >
              {runningBatch ? "Batch wird gesendet..." : "Batch an Gelato senden"}
            </button>
          </div>

          <div className="panel">
            <div>
              <div className="eyebrow">Heute</div>
              <h2 className="panel-title">Schnellüberblick</h2>
            </div>

            <div className="quick-list">
              <QuickRow label="Neue Events" value={recentEvents.length} />
              <QuickRow label="Offene Batches" value={loadingBatchCount ? "…" : batchCount} />
              <QuickRow label="Fehler" value={loadingFailedOrders ? "…" : failedOrders.length} />
            </div>
          </div>
        </section>

        {recentEvents.length > 0 && (
          <section className="section">
            <div className="section-header">
              <div>
                <div className="eyebrow">Aktuell</div>
                <h2 className="section-title">Neueste Events</h2>
              </div>
            </div>

            <div className="recent-grid">
              {recentEvents.map((eventItem) => (
                <Link
                  key={eventItem.id}
                  href={`/event/${eventItem.slug}`}
                  className="recent-card"
                >
                  <strong>{eventItem.title || "Ohne Titel"}</strong>
                  <span>{eventItem.category || "Event"} · {formatDate(eventItem.start_date)}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="section">
          <div className="section-header">
            <div>
              <div className="eyebrow">Probleme</div>
              <h2 className="section-title">Fehlgeschlagene Bestellungen</h2>
            </div>

            <div className={failedOrders.length > 0 ? "count-badge danger" : "count-badge"}>
              {loadingFailedOrders ? "…" : failedOrders.length}
            </div>
          </div>

          {loadingFailedOrders ? (
            <div className="empty-box">Fehler-Bestellungen werden geladen...</div>
          ) : failedOrders.length === 0 ? (
            <div className="empty-box">Aktuell gibt es keine fehlgeschlagenen Bestellungen.</div>
          ) : (
            <div className="failed-grid">
              {failedOrders.map((order) => (
                <article key={order.id} className="failed-card">
                  <div className="failed-top">
                    <div className="failed-status">failed</div>
                    <div className="muted">{formatDateTime(order.created_at)}</div>
                  </div>

                  <div className="meta-list">
                    <MetaRow label="Bestellung" value={order.id} />
                    <MetaRow label="Kunde" value={order.customer_name || "—"} />
                    <MetaRow label="E-Mail" value={order.customer_email || "—"} />
                    <MetaRow label="Format" value={order.print_option || "—"} />
                    <MetaRow label="Rahmen" value={order.frame_option || "—"} />
                    <MetaRow label="Gesamt" value={formatEuro(order.total_price)} />
                  </div>

                  <div className="error-box">
                    <div className="error-label">Fehlertext</div>
                    <div className="error-text">
                      {order.fulfillment_error || "Kein Fehlertext vorhanden."}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRetryOrder(order.id)}
                    disabled={retryingOrderId === order.id}
                    className={
                      retryingOrderId === order.id
                        ? "primary-button button-disabled"
                        : "primary-button"
                    }
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

        <section className="section">
          <div className="section-header">
            <div>
              <div className="eyebrow">Events</div>
              <h2 className="section-title">Alle Alben</h2>
            </div>

            <div className="count-badge">
              {loading ? "…" : filteredEvents.length}
            </div>
          </div>

          {loading ? (
            <div className="empty-box">Events werden geladen...</div>
          ) : filteredEvents.length === 0 ? (
            <div className="empty-box">Keine Events gefunden.</div>
          ) : (
            <div className="event-grid">
              {filteredEvents.map((eventItem) => {
                const eventLink = `/event/${eventItem.slug}`;
                const status = getStatus(eventItem);

                return (
                  <article key={eventItem.id} className="event-card">
                    <div className="event-top">
                      <div className="card-tag">{eventItem.category || "Event"}</div>
                      <div className={`status-pill status-${status.toLowerCase().replaceAll(" ", "-")}`}>
                        {status}
                      </div>
                    </div>

                    <h3 className="card-title">{eventItem.title || "Ohne Titel"}</h3>

                    <div className="event-subline">
                      <span>{eventItem.location || "Kein Ort"}</span>
                      <span>{formatDate(eventItem.start_date)}</span>
                    </div>

                    <div className="metric-grid">
                      <MiniMetric label="Fotos" value={photosCount(eventItem)} />
                      <MiniMetric label="Bestellungen" value={ordersCount(eventItem)} />
                      <MiniMetric label="Likes" value={likesCount(eventItem)} />
                      <MiniMetric label="Kommentare" value={commentsCount(eventItem)} />
                    </div>

                    <div className="meta-list">
                      <MetaRow label="Erstellt" value={formatDateTime(eventItem.created_at)} />
                      <MetaRow label="Letzter Upload" value={lastUpload(eventItem) ? formatDateTime(lastUpload(eventItem)) : "—"} />
                      <MetaRow label="Umsatz" value={formatEuro(revenueAmount(eventItem))} />
                      <MetaRow label="Ersteller" value={eventItem.creator_email || "—"} />
                      <MetaRow label="Slug" value={eventItem.slug || "—"} />
                    </div>

                    <div className="code-grid">
                      <div className="code-box">
                        <span>Gast-Code</span>
                        <strong>{eventItem.access_password || "—"}</strong>
                        <button
                          type="button"
                          onClick={() => handleCopyText(eventItem.access_password, "Gast-Code kopiert.")}
                          className="tiny-button"
                        >
                          Kopieren
                        </button>
                      </div>

                      <div className="code-box">
                        <span>Admin-Code</span>
                        <strong>{eventItem.admin_password || "—"}</strong>
                        <button
                          type="button"
                          onClick={() => handleCopyText(eventItem.admin_password, "Admin-Code kopiert.")}
                          className="tiny-button"
                        >
                          Kopieren
                        </button>
                      </div>
                    </div>

                    {eventItem.description && (
                      <p className="description">{eventItem.description}</p>
                    )}

                    <div className="link-box">
                      <div className="link-label">Event-Link</div>
                      <div className="link-text">{eventLink}</div>
                    </div>

                    <div className="button-row">
                      <Link href={eventLink} className="secondary-button">
                        Öffnen
                      </Link>

                      <button type="button" onClick={() => handleCopyLink(eventItem.slug)} className="copy-button">
                        Link kopieren
                      </button>

                      <button type="button" onClick={() => handleShareEvent(eventItem)} className="copy-button">
                        Teilen
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteEvent(eventItem)}
                        disabled={deletingId === eventItem.id}
                        className={
                          deletingId === eventItem.id
                            ? "danger-button button-disabled"
                            : "danger-button"
                        }
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
    <div className={danger ? "stat-card danger" : "stat-card"}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-sub">{sub}</div>
    </div>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div className="mini-metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function MetaRow({ label, value }) {
  return (
    <div className="meta-row">
      <span className="meta-label">{label}</span>
      <span className="meta-value">{value}</span>
    </div>
  );
}

function QuickRow({ label, value }) {
  return (
    <div className="quick-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
