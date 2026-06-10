"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const snapkeyTypes = [
  {
    title: "Snapkey Mini",
    label: "Für viele Gäste",
    price: "ab 1,90 €",
    description:
      "Der leichte Einstieg für große Gruppen. Klein, praktisch und perfekt, wenn viele Menschen Erinnerungen teilen sollen.",
    image: "/nfc-chip.jpg",
    points: ["Ideal für viele Gäste", "Tap + QR-Code", "Günstigste Variante"],
  },
  {
    title: "Snapkey Card",
    label: "Am beliebtesten",
    price: "ab 2,90 €",
    description:
      "Eine hochwertige Karte für Tische, Einladungen oder als kleines Erinnerungsstück. Elegant, schlicht und vielseitig einsetzbar.",
    image: "/pvc-cards.jpg",
    points: ["Premium Kartenlook", "Für viele Anlässe", "Persönliches Design"],
    featured: true,
  },
  {
    title: "Snapkey Wood",
    label: "Als Erinnerung",
    price: "ab 7,90 €",
    description:
      "Ein natürlicher Holzanhänger, der nach dem Event bleibt. Schön für Familie, Freunde oder ganz besondere Momente.",
    image: "/wood-keychain.jpg",
    points: ["Natürliches Holz", "Sehr persönlich", "Zum Mitnehmen"],
  },
];

const steps = [
  {
    icon: "calendar",
    title: "Album erstellen",
    text: "Legt euer persönliches Album in wenigen Minuten an — mit Anlass, Namen, Datum und eigenem Look.",
  },
  {
    icon: "key",
    title: "Snapkeys verteilen",
    text: "Legt eure Snapkeys auf Tische, in Einladungen, an der Bar oder gebt sie direkt an eure Gäste weiter.",
  },
  {
    icon: "gallery",
    title: "Erinnerungen sammeln",
    text: "Fotos und Videos von allen Beteiligten landen automatisch an einem gemeinsamen Ort.",
  },
];

const features = [
  { icon: "✦", text: "Ohne App" },
  { icon: "✓", text: "Tap & QR-Code" },
  { icon: "●", text: "Fotos & Videos" },
  { icon: "♡", text: "Für jeden Anlass" },
];

const occasions = [
  "Hochzeiten",
  "Geburtstage",
  "Familienalben",
  "Jubiläen",
  "Taufen",
  "Urlaube",
  "Firmenevents",
  "Vereinsfeste",
];

const comparisons = [
  {
    title: "Ohne Snapkey",
    items: [
      "Bilder landen in verschiedenen Chats",
      "Viele Gäste schicken Fotos nie weiter",
      "Videos gehen schnell verloren",
      "Alles muss mühsam zusammengesucht werden",
    ],
    negative: true,
  },
  {
    title: "Mit Snapkey",
    items: [
      "Alle Erinnerungen an einem Ort",
      "Einfach per Tap oder QR-Code öffnen",
      "Fotos und Videos direkt sammeln",
      "Album jederzeit teilen oder herunterladen",
    ],
    negative: false,
  },
];

const testimonials = [
  {
    name: "Anna & Tobias M.",
    occasion: "Hochzeit",
    quote:
      "Wir hatten am nächsten Morgen schon hunderte Bilder unserer Gäste im Album. Genau diese spontanen Momente hätten wir sonst nie gesehen.",
  },
  {
    name: "Familie Schneider",
    occasion: "Familienurlaub",
    quote:
      "Endlich waren nicht alle Urlaubsbilder auf fünf verschiedenen Handys verteilt. Jeder konnte seine Fotos direkt hinzufügen.",
  },
  {
    name: "Markus K.",
    occasion: "50. Geburtstag",
    quote:
      "Sehr einfach für die Gäste. Kein Erklären, keine App, kein Durcheinander in WhatsApp-Gruppen.",
  },
  {
    name: "Julia W.",
    occasion: "Taufe",
    quote:
      "Für unsere Familie war es perfekt. Auch Oma und Opa konnten die Bilder später ganz einfach anschauen.",
  },
  {
    name: "Claudia S.",
    occasion: "Jubiläum",
    quote:
      "Das Album war nach der Feier wie ein gemeinsames Erinnerungsbuch. Sehr schön und unkompliziert.",
  },
  {
    name: "Andreas B.",
    occasion: "Firmenevent",
    quote:
      "Für unser Team-Event war Snapkey super praktisch. Alle Fotos waren gesammelt, ohne dass jemand extra etwas installieren musste.",
  },
];

const faqs = [
  {
    question: "Brauchen Gäste eine App?",
    answer:
      "Nein. Snapkey funktioniert direkt im Browser — egal ob iPhone oder Android. Gäste öffnen das Album per Tap oder QR-Code.",
  },
  {
    question: "Für welche Anlässe eignet sich Snapkey?",
    answer:
      "Snapkey eignet sich für Hochzeiten, Geburtstage, Familienfeiern, Urlaube, Taufen, Jubiläen, Firmenevents, Vereinsfeste und alle Momente, bei denen mehrere Menschen Fotos und Videos sammeln möchten.",
  },
  {
    question: "Können Gäste auch Videos hochladen?",
    answer:
      "Ja. Gäste können Fotos und Videos hinzufügen, damit nicht nur einzelne Bilder, sondern ganze Momente erhalten bleiben.",
  },
  {
    question: "Wie lange bleiben die Fotos gespeichert?",
    answer:
      "Die Fotos bleiben in der Regel 1 Monat gespeichert. Für 4,99 € im Monat kann die Speicherung verlängert werden. Die Verlängerung ist monatlich kündbar.",
  },
  {
    question: "Können wir die Bilder herunterladen?",
    answer:
      "Ja. Ihr könnt eure gesammelten Erinnerungen herunterladen und privat sichern.",
  },
  {
    question: "Funktioniert Snapkey auch mit älteren Handys?",
    answer:
      "Ja. Falls der Tap nicht genutzt wird, funktioniert der QR-Code als einfache Alternative.",
  },
];

function StepIcon({ type }) {
  if (type === "calendar") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 3v3M17 3v3M4.5 9.5h15M6.5 5h11A2.5 2.5 0 0 1 20 7.5v10A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-10A2.5 2.5 0 0 1 6.5 5Z" />
        <path d="M8 13h3v3H8zM14 13h2" />
      </svg>
    );
  }

  if (type === "key") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9.5 14.5a5 5 0 1 1 3.6-3.6L21 18.8V21h-2.2l-1.5-1.5H15v-2.3l-1.5-1.5h-2.3l-1.7-1.2Z" />
        <path d="M7.5 9.5h.01" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.5 6.5h15A2.5 2.5 0 0 1 22 9v8.5A2.5 2.5 0 0 1 19.5 20h-15A2.5 2.5 0 0 1 2 17.5V9a2.5 2.5 0 0 1 2.5-2.5Z" />
      <path d="m6 16 3.2-3.2a1.2 1.2 0 0 1 1.7 0l1.1 1.1 2.2-2.2a1.2 1.2 0 0 1 1.7 0L20 15.8" />
      <path d="M8.5 10h.01" />
    </svg>
  );
}

function useInView(options = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.disconnect();
      }
    }, { threshold: 0.1, ...options });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options]);

  return [ref, isInView];
}

export default function HomePage() {
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxAlt, setLightboxAlt] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const [heroRef, heroInView] = useInView();
  const [stepsRef, stepsInView] = useInView();
  const [showcaseRef, showcaseInView] = useInView();
  const [productsRef, productsInView] = useInView();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function openImage(src, alt = "Bildvorschau") {
    setLightboxImage(src);
    setLightboxAlt(alt);
    document.body.style.overflow = "hidden";
  }

  function closeImage() {
    setLightboxImage(null);
    setLightboxAlt("");
    document.body.style.overflow = "";
  }

  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && closeImage();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <main className="snap-page">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700&display=swap");

        :root {
          --bg: #fbf8f3;
          --surface: #ffffff;
          --surface-soft: #fffdf9;
          --ink: #19140f;
          --ink-soft: #3d332b;
          --muted: #74685d;
          --muted-light: #9e9287;
          --line: #ebe2d8;
          --line-strong: #d8cabb;
          --cream: #f5eee4;
          --cream-strong: #eadfce;
          --gold: #c79f5b;
          --gold-dark: #9d7738;
          --rose: #f3dfd6;
          --success: #6f7f58;
          --shadow: 0 24px 80px rgba(25, 20, 15, 0.11);
          --shadow-soft: 0 14px 44px rgba(25, 20, 15, 0.075);
          --radius-xl: 32px;
          --radius-lg: 24px;
          --radius-md: 18px;
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        body {
          margin: 0;
          background:
            radial-gradient(circle at top left, rgba(199, 159, 91, 0.16), transparent 34rem),
            linear-gradient(180deg, #fffaf2 0%, var(--bg) 42%, #fff 100%);
          color: var(--ink);
          font-family: "DM Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          line-height: 1.6;
        }

        button,
        input,
        textarea,
        select {
          font: inherit;
        }

        .snap-page {
          min-height: 100vh;
          overflow-x: hidden;
        }

        .container {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
        }

        .nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          transition: background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }

        .nav.scrolled {
          background: rgba(251, 248, 243, 0.88);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(235, 226, 216, 0.85);
          box-shadow: 0 8px 30px rgba(25, 20, 15, 0.05);
        }

        .nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 70px;
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 16px;
        }

        .logo {
          font-family: "Playfair Display", Georgia, serif;
          font-size: 27px;
          font-weight: 700;
          color: var(--ink);
          text-decoration: none;
          letter-spacing: -0.04em;
        }

        .nav-links {
          display: none;
          align-items: center;
          gap: 28px;
        }

        .nav-link {
          color: var(--muted);
          text-decoration: none;
          font-size: 14px;
          font-weight: 700;
          transition: color 0.2s;
        }

        .nav-link:hover {
          color: var(--ink);
        }

        .nav-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
          padding: 0 18px;
          background: var(--ink);
          color: #fff;
          text-decoration: none;
          font-size: 14px;
          font-weight: 800;
          border-radius: 999px;
          box-shadow: 0 10px 28px rgba(25, 20, 15, 0.14);
          transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
          white-space: nowrap;
        }

        .nav-cta:hover {
          background: var(--ink-soft);
          transform: translateY(-1px);
          box-shadow: 0 14px 34px rgba(25, 20, 15, 0.18);
        }

        .hero {
          min-height: 100svh;
          display: flex;
          align-items: center;
          position: relative;
          padding: 96px 0 56px;
        }

        .hero::after {
          content: "";
          position: absolute;
          inset: auto -18% 4% auto;
          width: min(680px, 80vw);
          height: min(680px, 80vw);
          background: radial-gradient(circle, rgba(243, 223, 214, 0.62), transparent 68%);
          pointer-events: none;
          z-index: -1;
        }

        .hero-grid {
          display: grid;
          gap: 34px;
          align-items: center;
        }

        .hero-content,
        .hero-visual,
        .steps-wrapper,
        .showcase-wrapper,
        .products-wrapper {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-visual {
          transition-delay: 0.14s;
        }

        .hero-content.visible,
        .hero-visual.visible,
        .steps-wrapper.visible,
        .showcase-wrapper.visible,
        .products-wrapper.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          max-width: 100%;
          padding: 9px 14px;
          background: rgba(255, 255, 255, 0.72);
          border: 1px solid var(--line);
          border-radius: 999px;
          font-size: 13px;
          font-weight: 800;
          color: var(--muted);
          margin-bottom: 22px;
          box-shadow: 0 10px 34px rgba(25, 20, 15, 0.055);
        }

        .hero-badge-dot {
          width: 7px;
          height: 7px;
          background: var(--gold);
          border-radius: 50%;
          box-shadow: 0 0 0 5px rgba(199, 159, 91, 0.16);
          flex: 0 0 auto;
        }

        .hero-title {
          margin: 0;
          font-family: "Playfair Display", Georgia, serif;
          font-size: clamp(40px, 12vw, 74px);
          font-weight: 700;
          line-height: 0.98;
          letter-spacing: -0.055em;
          color: var(--ink);
        }

        .hero-title span {
          display: block;
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-description {
          margin: 22px 0 0;
          font-size: 17px;
          line-height: 1.75;
          color: var(--muted);
          max-width: 560px;
        }

        .hero-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 28px;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 58px;
          padding: 0 28px;
          font-size: 15px;
          font-weight: 800;
          border-radius: 999px;
          text-decoration: none;
          transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s ease, background 0.22s ease, border-color 0.22s ease;
          cursor: pointer;
          border: none;
          width: 100%;
        }

        .btn-primary {
          background: var(--ink);
          color: #fff;
          box-shadow: 0 14px 34px rgba(25, 20, 15, 0.18);
        }

        .btn-primary:hover {
          background: var(--ink-soft);
          transform: translateY(-2px);
          box-shadow: 0 18px 42px rgba(25, 20, 15, 0.23);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.74);
          color: var(--ink);
          border: 1px solid var(--line);
        }

        .btn-secondary:hover {
          background: var(--cream);
          border-color: var(--line-strong);
        }

        .hero-features {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 32px;
        }

        .hero-feature {
          display: flex;
          align-items: center;
          gap: 9px;
          min-height: 42px;
          padding: 10px 12px;
          background: rgba(255, 255, 255, 0.66);
          border: 1px solid var(--line);
          border-radius: 999px;
          font-size: 13px;
          font-weight: 800;
          color: var(--muted);
        }

        .hero-feature-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          background: var(--cream);
          border-radius: 999px;
          color: var(--gold-dark);
          font-size: 12px;
          flex: 0 0 auto;
        }

        .occasion-strip {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          margin-top: 18px;
          padding: 2px 0 8px;
          scrollbar-width: none;
        }

        .occasion-strip::-webkit-scrollbar {
          display: none;
        }

        .occasion-pill {
          flex: 0 0 auto;
          padding: 8px 12px;
          background: var(--cream);
          border: 1px solid var(--line);
          border-radius: 999px;
          color: var(--ink-soft);
          font-size: 12px;
          font-weight: 800;
          white-space: nowrap;
        }

        .hero-visual-card {
          position: relative;
          padding: 10px;
          background: rgba(255, 255, 255, 0.72);
          border: 1px solid rgba(255, 255, 255, 0.82);
          border-radius: 28px;
          box-shadow: var(--shadow);
        }

        .hero-image-wrapper {
          position: relative;
          border-radius: 22px;
          overflow: hidden;
          background: var(--cream);
          aspect-ratio: 4 / 3;
          cursor: zoom-in;
        }

        .hero-image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          transition: transform 0.5s ease;
        }

        .hero-image-wrapper:hover img {
          transform: scale(1.025);
        }

        .hero-mini-panel {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 10px;
        }

        .hero-stat {
          padding: 14px;
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 18px;
        }

        .hero-stat strong {
          display: block;
          color: var(--ink);
          font-size: 18px;
          line-height: 1.1;
        }

        .hero-stat span {
          display: block;
          margin-top: 4px;
          color: var(--muted);
          font-size: 12px;
          font-weight: 700;
        }

        .section {
          padding: 76px 0;
        }

        .section-header {
          max-width: 700px;
          margin: 0 auto 38px;
          text-align: center;
        }

        .section-eyebrow {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--gold-dark);
          margin-bottom: 14px;
        }

        .section-title {
          margin: 0;
          font-family: "Playfair Display", Georgia, serif;
          font-size: clamp(32px, 8vw, 52px);
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -0.04em;
          color: var(--ink);
        }

        .section-description {
          margin: 16px auto 0;
          max-width: 620px;
          font-size: 16px;
          line-height: 1.75;
          color: var(--muted);
        }

        .steps-grid {
          display: grid;
          gap: 16px;
        }

        .step-card {
          position: relative;
          padding: 24px;
          background: rgba(255, 255, 255, 0.78);
          border: 1px solid var(--line);
          border-radius: var(--radius-lg);
          box-shadow: 0 10px 34px rgba(25, 20, 15, 0.045);
          overflow: hidden;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }

        .step-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top right, rgba(199, 159, 91, 0.12), transparent 42%);
          pointer-events: none;
        }

        .step-card:hover {
          transform: translateY(-4px);
          border-color: var(--line-strong);
          box-shadow: var(--shadow-soft);
        }

        .step-icon {
          position: relative;
          width: 54px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--cream);
          border: 1px solid var(--line);
          border-radius: 17px;
          color: var(--gold-dark);
          margin-bottom: 18px;
        }

        .step-icon svg {
          width: 25px;
          height: 25px;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .step-number {
          position: absolute;
          top: 20px;
          right: 22px;
          font-family: "Playfair Display", Georgia, serif;
          font-size: 54px;
          font-weight: 700;
          color: rgba(234, 223, 206, 0.82);
          line-height: 1;
        }

        .step-title {
          position: relative;
          margin: 0 0 8px;
          font-size: 20px;
          font-weight: 900;
          color: var(--ink);
          letter-spacing: -0.02em;
        }

        .step-text {
          position: relative;
          margin: 0;
          font-size: 15px;
          line-height: 1.7;
          color: var(--muted);
        }

        .showcase-wrapper {
          border-radius: var(--radius-xl);
        }

        .showcase {
          display: grid;
          gap: 0;
          background: linear-gradient(135deg, var(--ink) 0%, #2c241d 100%);
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow);
        }

        .showcase-image {
          min-height: 0;
          background: #f7efe4;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
        }

        .showcase-image img {
          width: 100%;
          height: auto;
          max-height: 420px;
          object-fit: contain;
          object-position: center;
          border-radius: 22px;
          cursor: zoom-in;
          display: block;
          transition: transform 0.5s ease;
        }

        .showcase-image img:hover {
          transform: scale(1.015);
        }

        .showcase-content {
          padding: 30px 24px;
          color: #fff;
        }

        .showcase-eyebrow {
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--gold);
          margin-bottom: 12px;
        }

        .showcase-title {
          margin: 0;
          font-family: "Playfair Display", Georgia, serif;
          font-size: clamp(30px, 8vw, 46px);
          font-weight: 700;
          line-height: 1.08;
          letter-spacing: -0.04em;
        }

        .showcase-text {
          margin: 16px 0 0;
          font-size: 16px;
          line-height: 1.75;
          color: rgba(255, 255, 255, 0.78);
        }

        .showcase-list {
          display: grid;
          gap: 12px;
          margin-top: 26px;
        }

        .showcase-list-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 15px;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.9);
        }

        .showcase-list-icon {
          width: 27px;
          height: 27px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 9px;
          font-size: 13px;
          color: var(--gold);
          flex: 0 0 auto;
        }

        .occasion-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: 28px;
        }

        .occasion-card {
          padding: 18px 14px;
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 20px;
          text-align: center;
          font-size: 14px;
          font-weight: 900;
          color: var(--ink-soft);
          box-shadow: 0 10px 30px rgba(25, 20, 15, 0.04);
        }

        .comparison-grid {
          display: grid;
          gap: 16px;
        }

        .comparison-card {
          padding: 24px;
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-soft);
        }

        .comparison-card.positive {
          border-color: rgba(199, 159, 91, 0.46);
          background: linear-gradient(180deg, #fff 0%, #fffaf1 100%);
        }

        .comparison-title {
          margin: 0 0 16px;
          font-size: 21px;
          font-weight: 900;
          color: var(--ink);
          letter-spacing: -0.03em;
        }

        .comparison-list {
          display: grid;
          gap: 12px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .comparison-list li {
          display: flex;
          gap: 10px;
          color: var(--muted);
          font-size: 15px;
          line-height: 1.55;
          font-weight: 700;
        }

        .comparison-mark {
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 999px;
          background: var(--cream);
          color: var(--gold-dark);
          font-size: 12px;
          font-weight: 900;
        }

        .products-grid {
          display: grid;
          gap: 18px;
        }

        .product-card {
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
          box-shadow: 0 10px 34px rgba(25, 20, 15, 0.045);
        }

        .product-card:hover {
          border-color: var(--line-strong);
          box-shadow: var(--shadow-soft);
          transform: translateY(-3px);
        }

        .product-card.featured {
          border-color: rgba(199, 159, 91, 0.62);
          box-shadow: 0 20px 54px rgba(199, 159, 91, 0.15);
        }

        .product-image {
          position: relative;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          background: var(--cream);
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          cursor: zoom-in;
          transition: transform 0.5s ease;
          display: block;
        }

        .product-card:hover .product-image img {
          transform: scale(1.04);
        }

        .product-label {
          position: absolute;
          top: 14px;
          left: 14px;
          padding: 8px 13px;
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(255, 255, 255, 0.72);
          border-radius: 999px;
          font-size: 12px;
          font-weight: 900;
          color: var(--ink);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.11);
        }

        .product-card.featured .product-label {
          background: var(--gold);
          color: #fff;
        }

        .product-body {
          padding: 22px;
        }

        .product-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 12px;
        }

        .product-title {
          margin: 0;
          font-size: 22px;
          font-weight: 900;
          color: var(--ink);
          letter-spacing: -0.03em;
        }

        .product-price {
          flex-shrink: 0;
          padding: 7px 11px;
          background: var(--cream);
          border-radius: 10px;
          font-size: 13px;
          font-weight: 900;
          color: var(--gold-dark);
          white-space: nowrap;
        }

        .product-description {
          margin: 0 0 16px;
          font-size: 14px;
          line-height: 1.7;
          color: var(--muted);
        }

        .product-features {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .product-feature {
          padding: 7px 11px;
          background: var(--cream);
          border-radius: 10px;
          font-size: 12px;
          font-weight: 800;
          color: var(--muted);
        }

        .pricing-info {
          margin-top: 26px;
          padding: 22px;
          background: linear-gradient(135deg, var(--cream) 0%, #fff 100%);
          border: 1px solid var(--line);
          border-radius: 20px;
          text-align: center;
        }

        .pricing-info p {
          margin: 0;
          font-size: 15px;
          color: var(--muted);
          line-height: 1.65;
        }

        .pricing-info strong {
          color: var(--ink);
        }

        .testimonials-grid {
          display: grid;
          gap: 14px;
        }

        .testimonial-card {
          padding: 22px;
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 22px;
          box-shadow: 0 10px 32px rgba(25, 20, 15, 0.04);
        }

        .testimonial-stars {
          color: var(--gold);
          letter-spacing: 0.08em;
          font-size: 15px;
          margin-bottom: 14px;
        }

        .testimonial-quote {
          margin: 0;
          font-size: 15px;
          line-height: 1.72;
          color: var(--ink-soft);
          font-weight: 600;
        }

        .testimonial-author {
          margin-top: 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .testimonial-author strong {
          display: block;
          font-size: 14px;
          font-weight: 900;
          color: var(--ink);
        }

        .testimonial-author span {
          display: block;
          margin-top: 2px;
          font-size: 12px;
          font-weight: 800;
          color: var(--muted-light);
        }

        .faq-grid {
          display: grid;
          gap: 14px;
        }

        .faq-item {
          padding: 22px;
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 20px;
          transition: border-color 0.22s ease, transform 0.22s ease, box-shadow 0.22s ease;
        }

        .faq-item:hover {
          border-color: var(--line-strong);
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(25, 20, 15, 0.055);
        }

        .faq-question {
          margin: 0 0 8px;
          font-size: 17px;
          font-weight: 900;
          color: var(--ink);
          letter-spacing: -0.02em;
        }

        .faq-answer {
          margin: 0;
          font-size: 15px;
          line-height: 1.72;
          color: var(--muted);
        }

        .cta-section {
          padding: 70px 0;
        }

        .cta-card {
          position: relative;
          padding: 52px 22px;
          background:
            radial-gradient(circle at top right, rgba(199, 159, 91, 0.24), transparent 34rem),
            linear-gradient(135deg, var(--ink) 0%, #2c241d 100%);
          border-radius: var(--radius-xl);
          text-align: center;
          overflow: hidden;
          box-shadow: var(--shadow);
        }

        .cta-title {
          position: relative;
          margin: 0;
          font-family: "Playfair Display", Georgia, serif;
          font-size: clamp(32px, 9vw, 56px);
          font-weight: 700;
          line-height: 1.04;
          letter-spacing: -0.045em;
          color: #fff;
        }

        .cta-text {
          position: relative;
          margin: 18px auto 0;
          max-width: 560px;
          font-size: 16px;
          line-height: 1.75;
          color: rgba(255, 255, 255, 0.76);
        }

        .cta-actions {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 12px;
          margin-top: 28px;
        }

        .btn-cta {
          background: #fff;
          color: var(--ink);
        }

        .btn-cta:hover {
          background: var(--cream);
          transform: translateY(-2px);
        }

        .btn-cta-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.22);
        }

        .btn-cta-secondary:hover {
          background: rgba(255, 255, 255, 0.16);
        }

        .footer {
          padding: 30px 0 46px;
          border-top: 1px solid var(--line);
        }

        .footer-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          text-align: center;
        }

        .footer-links {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 22px;
        }

        .footer-link {
          color: var(--muted);
          text-decoration: none;
          font-size: 14px;
          font-weight: 800;
          transition: color 0.2s;
        }

        .footer-link:hover {
          color: var(--ink);
        }

        .footer-copy {
          font-size: 13px;
          color: var(--muted-light);
          font-weight: 700;
        }

        .lightbox {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          background: rgba(25, 20, 15, 0.9);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .lightbox-content {
          position: relative;
          max-width: 94vw;
          max-height: 90vh;
          animation: scaleIn 0.28s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .lightbox-image {
          display: block;
          max-width: 94vw;
          max-height: 84vh;
          object-fit: contain;
          border-radius: 18px;
          box-shadow: 0 32px 90px rgba(0, 0, 0, 0.48);
          background: #fff;
        }

        .lightbox-close {
          position: absolute;
          top: -12px;
          right: -12px;
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          border: none;
          border-radius: 999px;
          font-size: 22px;
          cursor: pointer;
          box-shadow: 0 8px 26px rgba(0, 0, 0, 0.26);
          transition: transform 0.2s;
          color: var(--ink);
        }

        .lightbox-close:hover {
          transform: scale(1.06);
        }

        @media (min-width: 560px) {
          .hero-actions,
          .cta-actions {
            flex-direction: row;
          }

          .btn {
            width: auto;
          }

          .occasion-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }

          .testimonials-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (min-width: 768px) {
          .container {
            width: min(1180px, calc(100% - 72px));
          }

          .nav-inner {
            padding: 0 36px;
            height: 76px;
          }

          .nav-links {
            display: flex;
          }

          .hero {
            padding: 118px 0 76px;
          }

          .hero-grid {
            grid-template-columns: minmax(0, 1.02fr) minmax(0, 0.98fr);
            gap: 58px;
          }

          .hero-actions {
            justify-content: flex-start;
          }

          .hero-features {
            grid-template-columns: repeat(4, max-content);
            gap: 12px;
          }

          .occasion-strip {
            flex-wrap: wrap;
            overflow: visible;
          }

          .section {
            padding: 104px 0;
          }

          .section-header {
            margin-bottom: 52px;
          }

          .steps-grid,
          .products-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .showcase {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
            align-items: stretch;
          }

          .showcase-image {
            padding: 18px;
            min-height: 520px;
          }

          .showcase-image img {
            max-height: none;
            height: 100%;
            object-fit: contain;
          }

          .showcase-content {
            padding: 52px;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .comparison-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .testimonials-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .faq-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .cta-card {
            padding: 82px 48px;
          }

          .footer-inner {
            flex-direction: row;
            justify-content: space-between;
          }
        }

        @media (max-width: 480px) {
          .nav-inner {
            height: 64px;
          }

          .logo {
            font-size: 25px;
          }

          .nav-cta {
            min-height: 40px;
            padding: 0 14px;
            font-size: 13px;
          }

          .hero {
            padding-top: 84px;
          }

          .hero-title {
            font-size: clamp(39px, 12vw, 48px);
          }

          .hero-description {
            font-size: 16px;
          }

          .hero-image-wrapper {
            aspect-ratio: 1 / 1;
          }

          .hero-image-wrapper img {
            object-fit: cover;
          }

          .hero-mini-panel {
            grid-template-columns: 1fr;
          }

          .showcase {
            border-radius: 26px;
          }

          .showcase-image {
            padding: 12px;
            background: #f7efe4;
          }

          .showcase-image img {
            width: 100%;
            height: auto;
            max-height: none;
            object-fit: contain;
            object-position: center;
          }

          .product-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .testimonial-card,
          .faq-item,
          .comparison-card,
          .step-card {
            padding: 21px;
          }
        }
      `}</style>

      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-inner">
          <Link href="/" className="logo">snapkey</Link>

          <div className="nav-links">
            <a href="#occasions" className="nav-link">Anlässe</a>
            <a href="#how-it-works" className="nav-link">So funktioniert's</a>
            <a href="#products" className="nav-link">Varianten</a>
            <a href="#faq" className="nav-link">FAQ</a>
          </div>

          <Link href="/event" className="nav-cta">Album erstellen</Link>
        </div>
      </nav>

      <section className="hero" ref={heroRef}>
        <div className="container">
          <div className="hero-grid">
            <div className={`hero-content ${heroInView ? "visible" : ""}`}>
              <div className="hero-badge">
                <span className="hero-badge-dot" />
                Für Feiern, Familie, Urlaub & besondere Momente
              </div>

              <h1 className="hero-title">
                Alle Erinnerungen.<br />
                <span>Ein gemeinsamer Ort.</span>
              </h1>

              <p className="hero-description">
                Mit Snapkey sammeln Familie, Freunde und Gäste Fotos und Videos direkt in einem gemeinsamen Album —
                ohne App, ohne WhatsApp-Chaos und ohne verlorene Momente.
              </p>

              <div className="hero-actions">
                <Link href="/event" className="btn btn-primary">
                  Album in 2 Minuten erstellen →
                </Link>
                <a href="#how-it-works" className="btn btn-secondary">
                  So funktioniert's
                </a>
              </div>

              <div className="hero-features">
                {features.map((f) => (
                  <div className="hero-feature" key={f.text}>
                    <span className="hero-feature-icon">{f.icon}</span>
                    {f.text}
                  </div>
                ))}
              </div>

              <div className="occasion-strip" aria-label="Anlässe">
                {occasions.map((occasion) => (
                  <span className="occasion-pill" key={occasion}>{occasion}</span>
                ))}
              </div>
            </div>

            <div className={`hero-visual ${heroInView ? "visible" : ""}`}>
              <div className="hero-visual-card">
                <div
                  className="hero-image-wrapper"
                  onClick={() => openImage("/hero-snapkey.jpg", "Snapkey für gemeinsame Erinnerungen")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && openImage("/hero-snapkey.jpg", "Snapkey für gemeinsame Erinnerungen")}
                  aria-label="Hero-Bild vergrößern"
                >
                  <img src="/hero-snapkey.jpg" alt="Snapkey für gemeinsame Erinnerungen" />
                </div>

                <div className="hero-mini-panel">
                  <div className="hero-stat">
                    <strong>1 Album</strong>
                    <span>für alle Bilder & Videos</span>
                  </div>
                  <div className="hero-stat">
                    <strong>0 Apps</strong>
                    <span>direkt im Browser nutzbar</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="occasions">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">✦ Für jeden Anlass</div>
            <h2 className="section-title">Nicht nur für Hochzeiten. Für alles, was bleiben soll.</h2>
            <p className="section-description">
              Snapkey passt überall dort, wo Menschen zusammenkommen und Erinnerungen nicht auf einzelnen Handys verschwinden sollen.
            </p>
          </div>

          <div className="occasion-grid">
            {occasions.map((occasion) => (
              <div className="occasion-card" key={occasion}>{occasion}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="how-it-works" ref={stepsRef}>
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">◇ So funktioniert's</div>
            <h2 className="section-title">Drei Schritte zu eurem gemeinsamen Album</h2>
            <p className="section-description">
              Snapkey macht das Sammeln von Fotos und Videos einfach — für Gastgeber und für Gäste.
            </p>
          </div>

          <div className={`steps-wrapper ${stepsInView ? "visible" : ""}`}>
            <div className="steps-grid">
              {steps.map((step, i) => (
                <article className="step-card" key={step.title}>
                  <div className="step-icon"><StepIcon type={step.icon} /></div>
                  <span className="step-number">0{i + 1}</span>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-text">{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" ref={showcaseRef}>
        <div className="container">
          <div className={`showcase-wrapper ${showcaseInView ? "visible" : ""}`}>
            <div className="showcase">
              <div className="showcase-image">
                <img
                  src="/snapkey-products.jpg"
                  alt="Snapkey Produkte"
                  onClick={() => openImage("/snapkey-products.jpg", "Snapkey Produkte")}
                />
              </div>

              <div className="showcase-content">
                <div className="showcase-eyebrow">Mehr als ein Fotoalbum</div>
                <h2 className="showcase-title">
                  Aus vielen einzelnen Momenten wird eine gemeinsame Geschichte.
                </h2>
                <p className="showcase-text">
                  Die besten Erinnerungen entstehen oft spontan — beim Essen, auf der Tanzfläche, im Urlaub,
                  beim Auspacken, Lachen oder Wiedersehen. Snapkey sammelt genau diese Perspektiven.
                </p>

                <div className="showcase-list">
                  <div className="showcase-list-item">
                    <span className="showcase-list-icon">✓</span>
                    Gäste brauchen keine App
                  </div>
                  <div className="showcase-list-item">
                    <span className="showcase-list-icon">✓</span>
                    Zugang per Snapkey oder QR-Code
                  </div>
                  <div className="showcase-list-item">
                    <span className="showcase-list-icon">✓</span>
                    Perfekt als Tischdetail, Einladung oder Erinnerung
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">○ Warum Snapkey?</div>
            <h2 className="section-title">Weniger Suchen. Mehr Erinnerungen.</h2>
          </div>

          <div className="comparison-grid">
            {comparisons.map((group) => (
              <article className={`comparison-card ${group.negative ? "" : "positive"}`} key={group.title}>
                <h3 className="comparison-title">{group.title}</h3>
                <ul className="comparison-list">
                  {group.items.map((item) => (
                    <li key={item}>
                      <span className="comparison-mark">{group.negative ? "–" : "✓"}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="products" ref={productsRef}>
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">✦ Snapkey Varianten</div>
            <h2 className="section-title">Wählt den Zugang, der zu euch passt</h2>
            <p className="section-description">
              Vom günstigen Mini für viele Gäste bis zum persönlichen Erinnerungsstück aus Holz.
            </p>
          </div>

          <div className={`products-wrapper ${productsInView ? "visible" : ""}`}>
            <div className="products-grid">
              {snapkeyTypes.map((product) => (
                <article
                  className={`product-card ${product.featured ? "featured" : ""}`}
                  key={product.title}
                >
                  <div className="product-image">
                    <img
                      src={product.image}
                      alt={product.title}
                      onClick={() => openImage(product.image, product.title)}
                    />
                    <div className="product-label">{product.label}</div>
                  </div>

                  <div className="product-body">
                    <div className="product-header">
                      <h3 className="product-title">{product.title}</h3>
                      <div className="product-price">{product.price}</div>
                    </div>

                    <p className="product-description">{product.description}</p>

                    <div className="product-features">
                      {product.points.map((point) => (
                        <span className="product-feature" key={point}>{point}</span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="pricing-info">
              <p>
                <strong>Eventseite genau 29 €</strong> + Snapkeys je nach Auswahl.
                Design und Farben lassen sich später an euren Anlass anpassen.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">★★★★★ Bewertungen</div>
            <h2 className="section-title">So fühlt sich gemeinsames Sammeln an</h2>
            <p className="section-description">
              Stimmen von Menschen, die ihre Erinnerungen nicht mehr in Chats und auf einzelnen Handys verlieren wollten.
            </p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial) => (
              <article className="testimonial-card" key={`${testimonial.name}-${testimonial.occasion}`}>
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-quote">„{testimonial.quote}“</p>
                <div className="testimonial-author">
                  <div>
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.occasion}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">◇ Häufige Fragen</div>
            <h2 className="section-title">Einfach für euch. Einfach für alle Gäste.</h2>
          </div>

          <div className="faq-grid">
            {faqs.map((faq) => (
              <article className="faq-item" key={faq.question}>
                <h3 className="faq-question">{faq.question}</h3>
                <p className="faq-answer">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2 className="cta-title">Bereit für Erinnerungen, die nicht verloren gehen?</h2>
            <p className="cta-text">
              Erstellt euer Album, wählt eure Snapkeys und gebt allen einen einfachen Weg,
              Fotos und Videos zu teilen.
            </p>

            <div className="cta-actions">
              <Link href="/event" className="btn btn-cta">
                Album erstellen →
              </Link>
              <a href="#products" className="btn btn-cta-secondary">
                Varianten ansehen
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-links">
              <Link href="/impressum" className="footer-link">Impressum</Link>
              <Link href="/datenschutz" className="footer-link">Datenschutz</Link>
            </div>
            <div className="footer-copy">© 2026 snapkey</div>
          </div>
        </div>
      </footer>

      {lightboxImage && (
        <div className="lightbox" onClick={closeImage}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-close"
              onClick={closeImage}
              aria-label="Schließen"
            >
              ×
            </button>
            <img
              src={lightboxImage}
              alt={lightboxAlt}
              className="lightbox-image"
            />
          </div>
        </div>
      )}
    </main>
  );
}
