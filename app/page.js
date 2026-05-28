"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const snapkeyTypes = [
  {
    title: "Snapkey Mini",
    label: "Für viele Gäste",
    price: "ab 1,90 €",
    description:
      "Der leichte Einstieg für große Feiern. Klein, praktisch und perfekt, damit jeder Gast eure Erinnerungen teilen kann.",
    image: "/nfc-chip.jpg",
    points: ["Ideal für viele Gäste", "Tap + QR-Code", "Günstigste Variante"],
  },
  {
    title: "Snapkey Card",
    label: "Am beliebtesten",
    price: "ab 2,90 €",
    description:
      "Eine elegante Karte im Hochzeitslook. Schlicht, hochwertig und perfekt für den Tisch, die Einladung oder als Gastgeschenk.",
    image: "/pvc-cards.jpg",
    points: ["Premium Kartenlook", "Ideal für Hochzeiten", "Persönliches Design"],
    featured: true,
  },
  {
    title: "Snapkey Wood",
    label: "Als Erinnerung",
    price: "ab 7,90 €",
    description:
      "Ein natürlicher Holzanhänger, der nach der Feier bleibt. Für Gäste, Familie oder besondere Momente.",
    image: "/wood-keychain.jpg",
    points: ["Natürliches Holz", "Sehr emotional", "Zum Mitnehmen"],
  },
];

const steps = [
  {
    icon: "✦",
    title: "Event erstellen",
    text: "In wenigen Minuten legt ihr euer persönliches Hochzeitsalbum an — mit eurem Namen, Datum und Design.",
  },
  {
    icon: "◇",
    title: "Snapkeys verteilen",
    text: "Gäste öffnen das Album per Tap oder QR-Code direkt im Browser. Keine App, kein Login.",
  },
  {
    icon: "○",
    title: "Gemeinsam sammeln",
    text: "Fotos und Videos von allen Gästen landen automatisch an einem Ort — für immer.",
  },
];

const features = [
  { icon: "⚡", text: "Ohne App" },
  { icon: "📱", text: "Tap & QR" },
  { icon: "💒", text: "Für Hochzeiten" },
  { icon: "📸", text: "Ein Album für alle" },
];

const faqs = [
  {
    question: "Brauchen unsere Gäste eine App?",
    answer:
      "Nein. Snapkey funktioniert komplett im Browser — egal ob iPhone oder Android. Einfach tippen oder QR-Code scannen und los geht's.",
  },
  {
    question: "Funktioniert das auch mit älteren Handys?",
    answer:
      "Ja. Moderne Smartphones nutzen NFC, bei älteren Geräten funktioniert der QR-Code als Alternative genauso einfach.",
  },
  {
    question: "Können wir Snapkey auch für andere Events nutzen?",
    answer:
      "Absolut. Neben Hochzeiten eignet sich Snapkey perfekt für Geburtstage, Jubiläen, Firmenevents oder Familientreffen.",
  },
  {
    question: "Wie lange bleiben die Fotos gespeichert?",
    answer:
      "Eure Erinnerungen bleiben dauerhaft erhalten. Ihr könnt sie jederzeit herunterladen oder mit Familie und Freunden teilen.",
  },
];

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
  }, []);

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
        @import url("[fonts.googleapis.com](https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap)");

        :root {
          --bg: #faf8f5;
          --surface: #ffffff;
          --surface-elevated: #fffefe;
          --accent: #1a1612;
          --accent-soft: #2d251f;
          --text: #1a1612;
          --text-secondary: #6b5f54;
          --text-muted: #9a8d82;
          --border: #ebe5dd;
          --border-hover: #d4cbc0;
          --warm: #f5efe7;
          --warm-deep: #ebe2d5;
          --gold: #c9a76c;
          --gold-soft: #e8d9bb;
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
          -webkit-font-smoothing: antialiased;
        }

        body {
          margin: 0;
          background: var(--bg);
          color: var(--text);
          font-family: "DM Sans", system-ui, sans-serif;
          line-height: 1.6;
        }

        .snap-page {
          min-height: 100vh;
          overflow-x: hidden;
        }

        .container {
          width: min(1200px, calc(100% - 40px));
          margin: 0 auto;
        }

        /* Navigation */
        .nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          transition: all 0.3s ease;
        }

        .nav.scrolled {
          background: rgba(250, 248, 245, 0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
        }

        .nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
          padding: 0 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .logo {
          font-family: "Playfair Display", serif;
          font-size: 26px;
          font-weight: 600;
          color: var(--accent);
          text-decoration: none;
          letter-spacing: -0.02em;
        }

        .nav-links {
          display: none;
          gap: 32px;
        }

        .nav-link {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s;
        }

        .nav-link:hover {
          color: var(--text);
        }

        .nav-cta {
          display: flex;
          align-items: center;
          height: 44px;
          padding: 0 20px;
          background: var(--accent);
          color: #fff;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          border-radius: 100px;
          transition: all 0.2s;
        }

        .nav-cta:hover {
          background: var(--accent-soft);
          transform: translateY(-1px);
        }

        /* Hero */
        .hero {
          min-height: 100svh;
          display: flex;
          align-items: center;
          padding: 100px 0 60px;
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: "";
          position: absolute;
          top: -50%;
          right: -20%;
          width: 80%;
          height: 120%;
          background: radial-gradient(ellipse, rgba(201, 167, 108, 0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero-grid {
          display: grid;
          gap: 48px;
          align-items: center;
        }

        .hero-content {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-content.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: var(--warm);
          border: 1px solid var(--border);
          border-radius: 100px;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 24px;
        }

        .hero-badge-dot {
          width: 6px;
          height: 6px;
          background: var(--gold);
          border-radius: 50%;
        }

        .hero-title {
          margin: 0;
          font-family: "Playfair Display", serif;
          font-size: clamp(42px, 8vw, 72px);
          font-weight: 600;
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: var(--accent);
        }

        .hero-title span {
          display: block;
          background: linear-gradient(135deg, var(--gold) 0%, #a88a4a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-description {
          margin: 24px 0 0;
          font-size: 18px;
          line-height: 1.7;
          color: var(--text-secondary);
          max-width: 480px;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 32px;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 56px;
          padding: 0 28px;
          font-size: 15px;
          font-weight: 600;
          border-radius: 100px;
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          border: none;
        }

        .btn-primary {
          background: var(--accent);
          color: #fff;
          box-shadow: 0 4px 24px rgba(26, 22, 18, 0.15);
        }

        .btn-primary:hover {
          background: var(--accent-soft);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(26, 22, 18, 0.2);
        }

        .btn-secondary {
          background: var(--surface);
          color: var(--text);
          border: 1px solid var(--border);
        }

        .btn-secondary:hover {
          background: var(--warm);
          border-color: var(--border-hover);
        }

        .hero-features {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-top: 48px;
          padding-top: 32px;
          border-top: 1px solid var(--border);
        }

        .hero-feature {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: var(--text-secondary);
        }

        .hero-feature-icon {
          font-size: 16px;
        }

        .hero-visual {
          position: relative;
          opacity: 0;
          transform: translateY(40px) scale(0.98);
          transition: all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s;
        }

        .hero-visual.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .hero-image-wrapper {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          aspect-ratio: 4/3;
          box-shadow: 
            0 24px 80px rgba(26, 22, 18, 0.12),
            0 0 0 1px rgba(26, 22, 18, 0.04);
        }

        .hero-image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero-float {
          position: absolute;
          background: var(--surface);
          border-radius: 16px;
          padding: 16px 20px;
          box-shadow: 
            0 12px 40px rgba(26, 22, 18, 0.1),
            0 0 0 1px rgba(26, 22, 18, 0.04);
          animation: float 4s ease-in-out infinite;
        }

        .hero-float-1 {
          top: 12%;
          right: -16px;
          animation-delay: 0s;
        }

        .hero-float-2 {
          bottom: 16%;
          left: -16px;
          animation-delay: 2s;
        }

        .hero-float-icon {
          font-size: 24px;
          margin-bottom: 4px;
        }

        .hero-float-text {
          font-size: 13px;
          font-weight: 600;
          color: var(--text);
        }

        .hero-float-sub {
          font-size: 11px;
          color: var(--text-muted);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        /* Sections */
        .section {
          padding: 80px 0;
        }

        .section-header {
          text-align: center;
          max-width: 640px;
          margin: 0 auto 56px;
        }

        .section-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--gold);
          margin-bottom: 16px;
        }

        .section-title {
          margin: 0;
          font-family: "Playfair Display", serif;
          font-size: clamp(32px, 5vw, 48px);
          font-weight: 600;
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: var(--accent);
        }

        .section-description {
          margin: 16px 0 0;
          font-size: 17px;
          line-height: 1.7;
          color: var(--text-secondary);
        }

        /* Steps */
        .steps-wrapper {
          opacity: 0;
          transform: translateY(40px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .steps-wrapper.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .steps-grid {
          display: grid;
          gap: 20px;
        }

        .step-card {
          position: relative;
          padding: 32px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          transition: all 0.3s ease;
        }

        .step-card:hover {
          border-color: var(--border-hover);
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(26, 22, 18, 0.08);
        }

        .step-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--warm);
          border-radius: 14px;
          font-size: 20px;
          margin-bottom: 20px;
        }

        .step-number {
          position: absolute;
          top: 24px;
          right: 24px;
          font-family: "Playfair Display", serif;
          font-size: 48px;
          font-weight: 600;
          color: var(--warm-deep);
          line-height: 1;
        }

        .step-title {
          margin: 0 0 8px;
          font-size: 20px;
          font-weight: 700;
          color: var(--accent);
        }

        .step-text {
          margin: 0;
          font-size: 15px;
          line-height: 1.65;
          color: var(--text-secondary);
        }

        /* Showcase */
        .showcase-wrapper {
          opacity: 0;
          transform: translateY(40px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .showcase-wrapper.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .showcase {
          display: grid;
          gap: 24px;
          background: var(--accent);
          border-radius: 28px;
          overflow: hidden;
        }

        .showcase-image {
          aspect-ratio: 16/10;
          overflow: hidden;
        }

        .showcase-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          cursor: pointer;
          transition: transform 0.5s ease;
        }

        .showcase-image img:hover {
          transform: scale(1.03);
        }

        .showcase-content {
          padding: 32px;
          color: #fff;
        }

        .showcase-eyebrow {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--gold-soft);
          margin-bottom: 12px;
        }

        .showcase-title {
          margin: 0;
          font-family: "Playfair Display", serif;
          font-size: clamp(28px, 5vw, 40px);
          font-weight: 600;
          line-height: 1.15;
          letter-spacing: -0.02em;
        }

        .showcase-text {
          margin: 16px 0 0;
          font-size: 16px;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.8);
        }

        .showcase-list {
          display: grid;
          gap: 12px;
          margin-top: 28px;
        }

        .showcase-list-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 15px;
          font-weight: 500;
        }

        .showcase-list-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          font-size: 12px;
        }

        /* Products */
        .products-wrapper {
          opacity: 0;
          transform: translateY(40px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .products-wrapper.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .products-grid {
          display: grid;
          gap: 20px;
        }

        .product-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 24px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .product-card:hover {
          border-color: var(--border-hover);
          box-shadow: 0 20px 60px rgba(26, 22, 18, 0.1);
        }

        .product-card.featured {
          border-color: var(--gold-soft);
          box-shadow: 0 0 0 1px var(--gold-soft);
        }

        .product-image {
          position: relative;
          aspect-ratio: 4/3;
          overflow: hidden;
          background: var(--warm);
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          cursor: pointer;
          transition: transform 0.5s ease;
        }

        .product-card:hover .product-image img {
          transform: scale(1.05);
        }

        .product-label {
          position: absolute;
          top: 16px;
          left: 16px;
          padding: 8px 14px;
          background: var(--surface);
          border-radius: 100px;
          font-size: 12px;
          font-weight: 700;
          color: var(--text);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .product-card.featured .product-label {
          background: var(--gold);
          color: #fff;
        }

        .product-body {
          padding: 24px;
        }

        .product-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 12px;
        }

        .product-title {
          margin: 0;
          font-size: 22px;
          font-weight: 700;
          color: var(--accent);
        }

        .product-price {
          flex-shrink: 0;
          padding: 6px 12px;
          background: var(--warm);
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .product-description {
          margin: 0 0 16px;
          font-size: 14px;
          line-height: 1.65;
          color: var(--text-secondary);
        }

        .product-features {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .product-feature {
          padding: 6px 12px;
          background: var(--warm);
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .pricing-info {
          margin-top: 32px;
          padding: 24px;
          background: var(--warm);
          border-radius: 16px;
          text-align: center;
        }

        .pricing-info p {
          margin: 0;
          font-size: 15px;
          color: var(--text-secondary);
        }

        .pricing-info strong {
          color: var(--text);
        }

        /* Testimonial */
        .testimonial {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 28px;
          padding: 48px 32px;
          text-align: center;
        }

        .testimonial-stars {
          display: flex;
          justify-content: center;
          gap: 4px;
          margin-bottom: 24px;
          color: var(--gold);
          font-size: 20px;
        }

        .testimonial-quote {
          margin: 0;
          font-family: "Playfair Display", serif;
          font-size: clamp(24px, 4vw, 36px);
          font-weight: 500;
          line-height: 1.3;
          color: var(--accent);
          font-style: italic;
        }

        .testimonial-author {
          margin-top: 24px;
          font-size: 14px;
          color: var(--text-muted);
        }

        .testimonial-author strong {
          display: block;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 2px;
        }

        /* FAQ */
        .faq-grid {
          display: grid;
          gap: 16px;
        }

        .faq-item {
          padding: 24px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          transition: all 0.2s;
        }

        .faq-item:hover {
          border-color: var(--border-hover);
        }

        .faq-question {
          margin: 0 0 8px;
          font-size: 17px;
          font-weight: 700;
          color: var(--accent);
        }

        .faq-answer {
          margin: 0;
          font-size: 15px;
          line-height: 1.65;
          color: var(--text-secondary);
        }

        /* CTA */
        .cta-section {
          padding: 80px 0;
        }

        .cta-card {
          position: relative;
          padding: 64px 32px;
          background: linear-gradient(135deg, var(--accent) 0%, var(--accent-soft) 100%);
          border-radius: 32px;
          text-align: center;
          overflow: hidden;
        }

        .cta-card::before {
          content: "";
          position: absolute;
          top: -50%;
          right: -30%;
          width: 80%;
          height: 150%;
          background: radial-gradient(ellipse, rgba(201, 167, 108, 0.15) 0%, transparent 60%);
          pointer-events: none;
        }

        .cta-title {
          position: relative;
          margin: 0;
          font-family: "Playfair Display", serif;
          font-size: clamp(32px, 6vw, 52px);
          font-weight: 600;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: #fff;
        }

        .cta-text {
          position: relative;
          margin: 20px auto 0;
          max-width: 520px;
          font-size: 17px;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.8);
        }

        .cta-actions {
          position: relative;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
          margin-top: 32px;
        }

        .btn-cta {
          background: #fff;
          color: var(--accent);
        }

        .btn-cta:hover {
          background: var(--warm);
          transform: translateY(-2px);
        }

        .btn-cta-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .btn-cta-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        /* Footer */
        .footer {
          padding: 32px 0 48px;
          border-top: 1px solid var(--border);
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
          gap: 24px;
        }

        .footer-link {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s;
        }

        .footer-link:hover {
          color: var(--text);
        }

        .footer-copy {
          font-size: 13px;
          color: var(--text-muted);
        }

        /* Lightbox */
        .lightbox {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(26, 22, 18, 0.9);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .lightbox-content {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
          animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: scale(0.95);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }

        .lightbox-image {
          max-width: 90vw;
          max-height: 85vh;
          border-radius: 16px;
          box-shadow: 0 32px 80px rgba(0, 0, 0, 0.4);
        }

        .lightbox-close {
          position: absolute;
          top: -12px;
          right: -12px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          border: none;
          border-radius: 50%;
          font-size: 20px;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s;
        }

        .lightbox-close:hover {
          transform: scale(1.1);
        }

        /* Responsive */
        @media (min-width: 768px) {
          .container {
            width: min(1200px, calc(100% - 80px));
          }

          .nav-links {
            display: flex;
          }

          .hero-grid {
            grid-template-columns: 1fr 1fr;
            gap: 64px;
          }

          .hero-visual {
            order: 2;
          }

          .section {
            padding: 120px 0;
          }

          .steps-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .showcase {
            grid-template-columns: 1fr 1fr;
          }

          .showcase-content {
            padding: 48px;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .products-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .faq-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .cta-card {
            padding: 80px 48px;
          }

          .footer-inner {
            flex-direction: row;
            justify-content: space-between;
          }
        }

        @media (max-width: 480px) {
          .container {
            width: calc(100% - 32px);
          }

          .nav-inner {
            height: 64px;
          }

          .hero {
            padding-top: 80px;
          }

          .hero-float {
            display: none;
          }

          .btn {
            width: 100%;
          }

          .testimonial {
            padding: 32px 24px;
          }
        }
      `}</style>

      {/* Navigation */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-inner">
          <Link href="/" className="logo">snapkey</Link>
          
          <div className="nav-links">
            <a href="#how-it-works" className="nav-link">So funktioniert's</a>
            <a href="#products" className="nav-link">Varianten</a>
            <a href="#faq" className="nav-link">FAQ</a>
          </div>

          <Link href="/event" className="nav-cta">Event erstellen</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero" ref={heroRef}>
        <div className="container">
          <div className="hero-grid">
            <div className={`hero-content ${heroInView ? "visible" : ""}`}>
              <div className="hero-badge">
                <span className="hero-badge-dot" />
                Für Hochzeiten & besondere Events
              </div>

              <h1 className="hero-title">
                Alle Erinnerungen.<br />
                <span>Ein gemeinsamer Ort.</span>
              </h1>

              <p className="hero-description">
                Eure Gäste teilen Fotos und Videos mit einem Tap — ohne App, 
                ohne Chaos und ohne verlorene Momente.
              </p>

              <div className="hero-actions">
                <Link href="/event" className="btn btn-primary">
                  Event erstellen →
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
            </div>

            <div className={`hero-visual ${heroInView ? "visible" : ""}`}>
              <div className="hero-image-wrapper">
                <img src="/hero-snapkey.jpg" alt="Snapkey bei einer Hochzeit" />
              </div>

              <div className="hero-float hero-float-1">
                <div className="hero-float-icon">📸</div>
                <div className="hero-float-text">247 Fotos</div>
                <div className="hero-float-sub">von 86 Gästen</div>
              </div>

              <div className="hero-float hero-float-2">
                <div className="hero-float-icon">✓</div>
                <div className="hero-float-text">Keine App nötig</div>
                <div className="hero-float-sub">Direkt im Browser</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section" id="how-it-works" ref={stepsRef}>
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">✦ So funktioniert's</div>
            <h2 className="section-title">Drei Schritte zu eurem gemeinsamen Album</h2>
            <p className="section-description">
              Snapkey verbindet euer digitales Album mit einem physischen Zugang für alle Gäste.
            </p>
          </div>

          <div className={`steps-wrapper ${stepsInView ? "visible" : ""}`}>
            <div className="steps-grid">
              {steps.map((step, i) => (
                <article className="step-card" key={step.title}>
                  <div className="step-icon">{step.icon}</div>
                  <span className="step-number">0{i + 1}</span>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-text">{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Showcase */}
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
                  Aus spontanen Momenten wird eine gemeinsame Geschichte.
                </h2>
                <p className="showcase-text">
                  Die schönsten Bilder entstehen oft nicht beim Fotografen — 
                  sondern bei euren Gästen. Snapkey sammelt genau diese Perspektiven.
                </p>

                <div className="showcase-list">
                  <div className="showcase-list-item">
                    <span className="showcase-list-icon">✓</span>
                    Gäste brauchen keine App
                  </div>
                  <div className="showcase-list-item">
                    <span className="showcase-list-icon">✓</span>
                    Zugang per NFC-Tap oder QR-Code
                  </div>
                  <div className="showcase-list-item">
                    <span className="showcase-list-icon">✓</span>
                    Perfekt als Tischdetail oder Gastgeschenk
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="section" id="products" ref={productsRef}>
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">◇ Snapkey Varianten</div>
            <h2 className="section-title">Wählt den Zugang, der zu euch passt</h2>
            <p className="section-description">
              Vom günstigen Mini für viele Gäste bis zum Erinnerungsstück aus Holz.
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
                <strong>Eventseite ab 29 €</strong> + Snapkeys je nach Auswahl. 
                Design und Farben lassen sich später anpassen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="section">
        <div className="container">
          <div className="testimonial">
            <div className="testimonial-stars">★★★★★</div>
            <blockquote className="testimonial-quote">
              „Am Ende hatten wir nicht nur die offiziellen Fotos, sondern 
              hunderte echte Momente von unseren Gästen."
            </blockquote>
            <div className="testimonial-author">
              <strong>Beispiel-Testimonial</strong>
              Später durch echte Kundenstimme ersetzen
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" id="faq">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">○ Häufige Fragen</div>
            <h2 className="section-title">Einfach für euch. Einfach für eure Gäste.</h2>
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

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2 className="cta-title">Bereit für Erinnerungen, die bleiben?</h2>
            <p className="cta-text">
              Erstellt euer Eventalbum, wählt eure Snapkeys und gebt euren Gästen 
              einen einfachen Weg, Momente zu teilen.
            </p>

            <div className="cta-actions">
              <Link href="/event" className="btn btn-cta">
                Event erstellen →
              </Link>
              <a href="#products" className="btn btn-cta-secondary">
                Varianten ansehen
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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

      {/* Lightbox */}
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
