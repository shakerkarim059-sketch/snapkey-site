"use client";

import Link from "next/link";
import { useState } from "react";

const snapkeyTypes = [
  {
    title: "Snapkey Mini",
    label: "Für viele Gäste",
    price: "ab 1,90 € / Stück",
    description:
      "Der leichte Einstieg für große Feiern. Klein, praktisch und perfekt, damit jeder Gast eure Erinnerungen teilen kann.",
    image: "/nfc-chip.jpg",
    points: ["Ideal für viele Gäste", "Tap + QR-Code", "Günstigste Variante"],
  },
  {
    title: "Snapkey Card",
    label: "Beliebteste Wahl",
    price: "ab 2,90 € / Stück",
    description:
      "Eine elegante Karte im Hochzeitslook. Schlicht, hochwertig und perfekt für den Tisch, die Einladung oder als Gastgeschenk.",
    image: "/pvc-cards.jpg",
    points: ["Premium Kartenlook", "Ideal für Hochzeiten", "Persönliches Design"],
    featured: true,
  },
  {
    title: "Snapkey Wood",
    label: "Als Erinnerungsstück",
    price: "ab 7,90 € / Stück",
    description:
      "Ein natürlicher Holzanhänger, der nach der Feier bleibt. Für Gäste, Familie oder besondere Momente.",
    image: "/wood-keychain.jpg",
    points: ["Natürliches Holz", "Sehr emotional", "Zum Mitnehmen"],
  },
];

const steps = [
  {
    title: "Event erstellen",
    text: "Ihr legt euer persönliches Hochzeitsalbum an.",
  },
  {
    title: "Snapkeys verteilen",
    text: "Gäste öffnen das Album per Tap oder QR-Code.",
  },
  {
    title: "Erinnerungen sammeln",
    text: "Fotos und Videos landen an einem gemeinsamen Ort.",
  },
];

const trustItems = ["Ohne App", "Tap & QR", "Für Hochzeit & Events", "Ein gemeinsames Album"];

const faqs = [
  {
    question: "Brauchen Gäste eine App?",
    answer: "Nein. Snapkey funktioniert direkt über den Browser per NFC-Tap oder QR-Code.",
  },
  {
    question: "Funktioniert es auch mit iPhone und Android?",
    answer: "Ja. Moderne Smartphones können NFC oder alternativ den QR-Code nutzen.",
  },
  {
    question: "Kann ich Snapkey für andere Events nutzen?",
    answer: "Ja. Neben Hochzeiten eignet sich Snapkey auch für Geburtstage, Familienfeiern, Reisen oder Firmen-Events.",
  },
];

export default function HomePage() {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState("");

  function openImage(src: string, alt = "Bildvorschau") {
    setLightboxImage(src);
    setLightboxAlt(alt);
  }

  function closeImage() {
    setLightboxImage(null);
    setLightboxAlt("");
  }

  return (
    <main className="snap-page">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700;800&display=swap");

        :root {
          --cream: #f8f3ed;
          --warm: #efe4d8;
          --sand: #d9c0a3;
          --taupe: #8f7159;
          --espresso: #2b211b;
          --brown: #4b372b;
          --text: #312720;
          --muted: #6e5f54;
          --line: #e7d8c8;
          --white: #fffdf9;
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: var(--cream);
          color: var(--text);
          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .snap-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(217, 192, 163, 0.35), transparent 34rem),
            linear-gradient(180deg, #fbf7f1 0%, #f8f3ed 45%, #fffaf5 100%);
          overflow-x: hidden;
        }

        .shell {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
        }

        .nav {
          position: sticky;
          top: 0;
          z-index: 50;
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          background: rgba(248, 243, 237, 0.82);
          border-bottom: 1px solid rgba(231, 216, 200, 0.8);
        }

        .nav-inner {
          width: min(1180px, calc(100% - 32px));
          min-height: 68px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
        }

        .brand {
          color: var(--espresso);
          text-decoration: none;
          font-weight: 800;
          letter-spacing: -0.04em;
          font-size: 23px;
        }

        .nav-links {
          display: none;
          align-items: center;
          gap: 22px;
        }

        .nav-link {
          color: var(--muted);
          text-decoration: none;
          font-size: 14px;
          font-weight: 700;
        }

        .nav-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          padding: 0 16px;
          border-radius: 999px;
          background: var(--espresso);
          color: #fff;
          text-decoration: none;
          font-size: 14px;
          font-weight: 800;
          box-shadow: 0 14px 28px rgba(43, 33, 27, 0.18);
        }

        .hero {
          padding: 18px 0 52px;
        }

        .hero-card {
          position: relative;
          overflow: hidden;
          min-height: calc(100svh - 96px);
          border-radius: 30px;
          background: var(--espresso);
          box-shadow: 0 28px 70px rgba(43, 33, 27, 0.2);
          isolation: isolate;
        }

        .hero-image {
          position: absolute;
          inset: 0;
          z-index: -2;
          background-image: url("/hero-snapkey.jpg");
          background-size: cover;
          background-position: center;
          transform: scale(1.02);
        }

        .hero-card::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          background:
            linear-gradient(180deg, rgba(21, 17, 14, 0.08) 0%, rgba(21, 17, 14, 0.4) 38%, rgba(21, 17, 14, 0.82) 100%),
            linear-gradient(90deg, rgba(21, 17, 14, 0.55), rgba(21, 17, 14, 0.08));
        }

        .hero-content {
          min-height: calc(100svh - 96px);
          padding: 28px 22px 24px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: flex-start;
          gap: 16px;
        }

        .eyebrow-pill {
          display: inline-flex;
          align-items: center;
          width: fit-content;
          min-height: 34px;
          padding: 0 12px;
          border-radius: 999px;
          background: rgba(255, 253, 249, 0.88);
          color: var(--brown);
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .hero-title {
          margin: 0;
          max-width: 760px;
          color: #fffaf5;
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: clamp(48px, 15vw, 96px);
          line-height: 0.88;
          letter-spacing: -0.055em;
          font-weight: 700;
          text-wrap: balance;
        }

        .hero-copy {
          margin: 0;
          max-width: 580px;
          color: rgba(255, 250, 245, 0.9);
          font-size: 16px;
          line-height: 1.65;
          font-weight: 500;
        }

        .hero-actions {
          width: 100%;
          display: grid;
          gap: 10px;
          margin-top: 4px;
        }

        .button-primary,
        .button-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 54px;
          padding: 0 20px;
          border-radius: 999px;
          text-decoration: none;
          font-size: 15px;
          font-weight: 800;
          transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
        }

        .button-primary {
          background: #fffaf5;
          color: var(--espresso);
          box-shadow: 0 16px 34px rgba(0, 0, 0, 0.24);
        }

        .button-secondary {
          background: rgba(255, 250, 245, 0.12);
          color: #fffaf5;
          border: 1px solid rgba(255, 250, 245, 0.22);
        }

        .button-primary:hover,
        .button-secondary:hover,
        .nav-cta:hover {
          transform: translateY(-1px);
        }

        .trust-strip {
          width: min(1180px, calc(100% - 32px));
          margin: -26px auto 0;
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .trust-item {
          min-height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 10px;
          border-radius: 18px;
          background: rgba(255, 253, 249, 0.92);
          border: 1px solid rgba(231, 216, 200, 0.88);
          color: var(--brown);
          font-size: 13px;
          font-weight: 800;
          box-shadow: 0 16px 38px rgba(43, 33, 27, 0.08);
        }

        .section {
          padding: 42px 0;
        }

        .section-header {
          display: grid;
          gap: 10px;
          margin-bottom: 22px;
        }

        .eyebrow {
          color: var(--taupe);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .section-title {
          margin: 0;
          max-width: 820px;
          color: var(--espresso);
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: clamp(38px, 10vw, 68px);
          line-height: 0.95;
          letter-spacing: -0.045em;
          font-weight: 700;
          text-wrap: balance;
        }

        .section-text {
          margin: 0;
          max-width: 680px;
          color: var(--muted);
          font-size: 16px;
          line-height: 1.75;
          font-weight: 500;
        }

        .steps-grid {
          display: grid;
          gap: 14px;
        }

        .step-card {
          position: relative;
          overflow: hidden;
          padding: 22px;
          border-radius: 26px;
          background: var(--white);
          border: 1px solid var(--line);
          box-shadow: 0 18px 44px rgba(43, 33, 27, 0.06);
        }

        .step-number {
          width: 44px;
          height: 44px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--warm);
          color: var(--brown);
          font-weight: 900;
          margin-bottom: 18px;
        }

        .step-title {
          margin: 0 0 8px;
          color: var(--espresso);
          font-size: 20px;
          letter-spacing: -0.02em;
          font-weight: 850;
        }

        .step-text {
          margin: 0;
          color: var(--muted);
          font-size: 15px;
          line-height: 1.65;
        }

        .showcase {
          display: grid;
          gap: 16px;
        }

        .showcase-image-card {
          overflow: hidden;
          min-height: 360px;
          border-radius: 30px;
          border: 1px solid var(--line);
          background: var(--white);
          box-shadow: 0 22px 54px rgba(43, 33, 27, 0.08);
        }

        .showcase-image-card img {
          width: 100%;
          height: 100%;
          min-height: 360px;
          object-fit: cover;
          display: block;
          cursor: pointer;
        }

        .showcase-copy-card {
          padding: 24px;
          border-radius: 30px;
          background: var(--espresso);
          color: #fffaf5;
          box-shadow: 0 22px 54px rgba(43, 33, 27, 0.1);
        }

        .showcase-copy-card .eyebrow {
          color: rgba(255, 250, 245, 0.72);
        }

        .showcase-title {
          margin: 10px 0 12px;
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: clamp(36px, 9vw, 58px);
          line-height: 0.95;
          letter-spacing: -0.045em;
        }

        .showcase-text {
          margin: 0;
          color: rgba(255, 250, 245, 0.82);
          font-size: 16px;
          line-height: 1.75;
        }

        .mini-list {
          display: grid;
          gap: 10px;
          margin-top: 22px;
        }

        .mini-list-item {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          color: rgba(255, 250, 245, 0.92);
          font-size: 15px;
          font-weight: 700;
        }

        .products-grid {
          display: grid;
          gap: 16px;
        }

        .product-card {
          overflow: hidden;
          border-radius: 30px;
          border: 1px solid var(--line);
          background: var(--white);
          box-shadow: 0 18px 44px rgba(43, 33, 27, 0.06);
        }

        .product-card.featured {
          border-color: rgba(143, 113, 89, 0.5);
          box-shadow: 0 22px 54px rgba(43, 33, 27, 0.1);
        }

        .product-image-wrap {
          position: relative;
          height: 260px;
          overflow: hidden;
          background: #eadfd3;
        }

        .product-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          cursor: pointer;
          transition: transform 260ms ease;
        }

        .product-card:hover img {
          transform: scale(1.035);
        }

        .product-label {
          position: absolute;
          left: 14px;
          top: 14px;
          min-height: 32px;
          display: inline-flex;
          align-items: center;
          padding: 0 12px;
          border-radius: 999px;
          background: rgba(255, 253, 249, 0.9);
          color: var(--brown);
          font-size: 12px;
          font-weight: 900;
        }

        .product-body {
          padding: 22px;
          display: grid;
          gap: 12px;
        }

        .product-title-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .product-title {
          margin: 0;
          color: var(--espresso);
          font-size: 25px;
          line-height: 1.1;
          letter-spacing: -0.035em;
        }

        .product-price {
          white-space: nowrap;
          color: var(--brown);
          background: var(--warm);
          border: 1px solid var(--line);
          border-radius: 999px;
          padding: 8px 10px;
          font-size: 12px;
          font-weight: 900;
        }

        .product-description {
          margin: 0;
          color: var(--muted);
          font-size: 14px;
          line-height: 1.7;
        }

        .product-points {
          display: grid;
          gap: 8px;
          margin-top: 2px;
        }

        .product-point {
          color: var(--brown);
          font-size: 14px;
          font-weight: 700;
        }

        .pricing-note {
          margin-top: 16px;
          padding: 16px;
          border-radius: 24px;
          background: rgba(255, 253, 249, 0.72);
          border: 1px solid var(--line);
          color: var(--muted);
          font-size: 14px;
          line-height: 1.6;
          font-weight: 700;
          text-align: center;
        }

        .testimonial-card {
          padding: 26px;
          border-radius: 30px;
          background: var(--white);
          border: 1px solid var(--line);
          box-shadow: 0 18px 44px rgba(43, 33, 27, 0.06);
        }

        .quote {
          margin: 0;
          color: var(--espresso);
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: clamp(30px, 8vw, 52px);
          line-height: 1.02;
          letter-spacing: -0.04em;
        }

        .quote-person {
          margin-top: 18px;
          color: var(--taupe);
          font-size: 14px;
          font-weight: 900;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .faq-grid {
          display: grid;
          gap: 12px;
        }

        .faq-card {
          padding: 20px;
          border-radius: 24px;
          background: var(--white);
          border: 1px solid var(--line);
        }

        .faq-question {
          margin: 0 0 8px;
          color: var(--espresso);
          font-size: 17px;
          letter-spacing: -0.02em;
        }

        .faq-answer {
          margin: 0;
          color: var(--muted);
          font-size: 14px;
          line-height: 1.7;
        }

        .final-cta {
          padding: 54px 0 34px;
        }

        .final-card {
          overflow: hidden;
          position: relative;
          border-radius: 34px;
          padding: 30px 22px;
          background:
            radial-gradient(circle at top right, rgba(217, 192, 163, 0.36), transparent 20rem),
            linear-gradient(135deg, #2b211b 0%, #4b372b 62%, #6f5542 100%);
          color: #fffaf5;
          text-align: center;
          box-shadow: 0 28px 70px rgba(43, 33, 27, 0.18);
        }

        .final-title {
          margin: 0;
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: clamp(42px, 12vw, 74px);
          line-height: 0.94;
          letter-spacing: -0.055em;
        }

        .final-text {
          margin: 16px auto 0;
          max-width: 620px;
          color: rgba(255, 250, 245, 0.84);
          font-size: 16px;
          line-height: 1.75;
        }

        .final-actions {
          display: grid;
          gap: 10px;
          margin-top: 24px;
        }

        .footer {
          padding: 24px 0 52px;
        }

        .footer-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          color: #a58c77;
          font-size: 14px;
        }

        .footer a {
          color: var(--muted);
          text-decoration: none;
          font-weight: 700;
        }

        .lightbox {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          background: rgba(22, 18, 14, 0.72);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .lightbox-content {
          position: relative;
          max-width: 94vw;
          max-height: 92svh;
        }

        .lightbox-image {
          max-width: 94vw;
          max-height: 88svh;
          display: block;
          border-radius: 24px;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.38);
        }

        .lightbox-close {
          position: absolute;
          top: -16px;
          right: -8px;
          width: 42px;
          height: 42px;
          border: 0;
          border-radius: 999px;
          background: #fffaf5;
          color: var(--espresso);
          cursor: pointer;
          font-size: 20px;
          font-weight: 900;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.22);
        }

        @media (min-width: 720px) {
          .shell,
          .nav-inner,
          .trust-strip {
            width: min(1180px, calc(100% - 56px));
          }

          .nav-links {
            display: flex;
          }

          .hero {
            padding-top: 28px;
          }

          .hero-card,
          .hero-content {
            min-height: 760px;
          }

          .hero-content {
            padding: 54px;
            justify-content: center;
          }

          .hero-card::after {
            background:
              linear-gradient(90deg, rgba(21, 17, 14, 0.82) 0%, rgba(21, 17, 14, 0.52) 44%, rgba(21, 17, 14, 0.08) 100%),
              linear-gradient(180deg, rgba(21, 17, 14, 0.08), rgba(21, 17, 14, 0.28));
          }

          .hero-copy {
            font-size: 19px;
          }

          .hero-actions,
          .final-actions {
            width: auto;
            display: flex;
            align-items: center;
          }

          .button-primary,
          .button-secondary {
            min-width: 188px;
          }

          .trust-strip {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            margin-top: -28px;
          }

          .section {
            padding: 76px 0;
          }

          .section-header.center {
            text-align: center;
            justify-items: center;
          }

          .steps-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .showcase {
            grid-template-columns: 1.05fr 0.95fr;
            align-items: stretch;
          }

          .showcase-copy-card {
            padding: 44px;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .products-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .product-image-wrap {
            height: 290px;
          }

          .faq-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .final-card {
            padding: 70px 48px;
          }

          .final-actions {
            justify-content: center;
          }
        }

        @media (max-width: 420px) {
          .shell,
          .nav-inner,
          .trust-strip {
            width: min(100% - 24px, 1180px);
          }

          .nav-inner {
            min-height: 62px;
          }

          .brand {
            font-size: 21px;
          }

          .nav-cta {
            min-height: 40px;
            padding: 0 13px;
            font-size: 13px;
          }

          .hero-card {
            border-radius: 24px;
          }

          .hero-content {
            padding: 24px 18px 20px;
          }

          .hero-title {
            font-size: clamp(44px, 14vw, 58px);
          }

          .section-title {
            font-size: clamp(36px, 10vw, 46px);
          }

          .product-title-row {
            display: grid;
          }

          .product-price {
            width: fit-content;
          }
        }
      `}</style>

      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="brand">
            snapkey
          </Link>

          <div className="nav-links">
            <a className="nav-link" href="#how-it-works">
              So funktioniert’s
            </a>
            <a className="nav-link" href="#snapkeys">
              Varianten
            </a>
            <a className="nav-link" href="#faq">
              FAQ
            </a>
          </div>

          <Link href="/event" className="nav-cta">
            Event erstellen
          </Link>
        </div>
      </nav>

      <section className="hero">
        <div className="shell">
          <div className="hero-card">
            <div className="hero-image" aria-hidden="true" />

            <div className="hero-content">
              <div className="eyebrow-pill">Für Hochzeiten & besondere Events</div>

              <h1 className="hero-title">Alle Erinnerungen. Ein gemeinsamer Ort.</h1>

              <p className="hero-copy">
                Eure Gäste teilen Fotos und Videos mit einem Tap — ohne App, ohne Link-Chaos und ohne, dass Momente verloren gehen.
              </p>

              <div className="hero-actions">
                <Link href="/event" className="button-primary">
                  Event erstellen
                </Link>
                <a href="#how-it-works" className="button-secondary">
                  So funktioniert’s
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="trust-strip" aria-label="Snapkey Vorteile">
          {trustItems.map((item) => (
            <div className="trust-item" key={item}>
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="how-it-works">
        <div className="shell">
          <div className="section-header center">
            <div className="eyebrow">So funktioniert’s</div>
            <h2 className="section-title">Drei Schritte. Und eure Hochzeit lebt weiter.</h2>
            <p className="section-text">
              Snapkey verbindet ein digitales Album mit einem physischen Zugang für eure Gäste. Einfach, schön und direkt verständlich.
            </p>
          </div>

          <div className="steps-grid">
            {steps.map((step, index) => (
              <article className="step-card" key={step.title}>
                <div className="step-number">{index + 1}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-text">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="showcase">
            <div className="showcase-image-card">
              <img
                src="/snapkey-products.jpg"
                alt="Snapkey bei einer Hochzeit"
                onClick={() => openImage("/snapkey-products.jpg", "Snapkey bei einer Hochzeit")}
              />
            </div>

            <div className="showcase-copy-card">
              <div className="eyebrow">Mehr als ein Fotoalbum</div>
              <h2 className="showcase-title">Aus spontanen Momenten wird eine gemeinsame Geschichte.</h2>
              <p className="showcase-text">
                Die schönsten Bilder entstehen oft nicht beim Fotografen, sondern bei euren Gästen. Snapkey sammelt genau diese Perspektiven an einem Ort.
              </p>

              <div className="mini-list">
                <div className="mini-list-item">✓ Gäste brauchen keine App</div>
                <div className="mini-list-item">✓ Zugang per NFC-Tap oder QR-Code</div>
                <div className="mini-list-item">✓ Perfekt als Tischdetail oder Gastgeschenk</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="snapkeys">
        <div className="shell">
          <div className="section-header center">
            <div className="eyebrow">Snapkey Varianten</div>
            <h2 className="section-title">Wählt den Zugang, der zu eurem Event passt.</h2>
            <p className="section-text">
              Vom günstigen Mini für viele Gäste bis zum hochwertigen Erinnerungsstück aus Holz.
            </p>
          </div>

          <div className="products-grid">
            {snapkeyTypes.map((item) => (
              <article className={`product-card ${item.featured ? "featured" : ""}`} key={item.title}>
                <div className="product-image-wrap">
                  <img src={item.image} alt={item.title} onClick={() => openImage(item.image, item.title)} />
                  <div className="product-label">{item.label}</div>
                </div>

                <div className="product-body">
                  <div className="product-title-row">
                    <h3 className="product-title">{item.title}</h3>
                    <div className="product-price">{item.price}</div>
                  </div>

                  <p className="product-description">{item.description}</p>

                  <div className="product-points">
                    {item.points.map((point) => (
                      <div className="product-point" key={point}>
                        ✓ {point}
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="pricing-note">
            Eventseite ab 29 € + Snapkeys je nach Auswahl. Ihr könnt später Bilder, Farben und Design an euer Event anpassen.
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="testimonial-card">
            <p className="quote">
              „Am Ende hatten wir nicht nur die offiziellen Fotos, sondern hunderte echte Momente von unseren Gästen.“
            </p>
            <div className="quote-person">Beispiel-Testimonial · später durch echte Kundenstimme ersetzen</div>
          </div>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="shell">
          <div className="section-header center">
            <div className="eyebrow">Gut zu wissen</div>
            <h2 className="section-title">Einfach für euch. Einfach für eure Gäste.</h2>
          </div>

          <div className="faq-grid">
            {faqs.map((faq) => (
              <article className="faq-card" key={faq.question}>
                <h3 className="faq-question">{faq.question}</h3>
                <p className="faq-answer">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="shell">
          <div className="final-card">
            <h2 className="final-title">Bereit für Erinnerungen, die bleiben?</h2>
            <p className="final-text">
              Erstellt euer Eventalbum, wählt eure Snapkeys und gebt euren Gästen einen einfachen Weg, Momente zu teilen.
            </p>

            <div className="final-actions">
              <Link href="/event" className="button-primary">
                Event jetzt erstellen
              </Link>
              <a href="#snapkeys" className="button-secondary">
                Varianten ansehen
              </a>
            </div>
          </div>
        </div>
      </section>

      {lightboxImage && (
        <div className="lightbox" onClick={closeImage} role="presentation">
          <div className="lightbox-content" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="lightbox-close" onClick={closeImage} aria-label="Bild schließen">
              ×
            </button>

            <img src={lightboxImage} alt={lightboxAlt || "Bildvorschau"} className="lightbox-image" />
          </div>
        </div>
      )}

      <footer className="footer">
        <div className="footer-inner">
          <a href="/impressum">Impressum</a>
          <span>|</span>
          <a href="/datenschutz">Datenschutz</a>
        </div>
      </footer>
    </main>
  );
}
