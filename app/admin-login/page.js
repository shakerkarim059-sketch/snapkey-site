"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Login fehlgeschlagen.");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (error) {
      setError("Login fehlgeschlagen.");
    }

    setLoading(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background: "#f6f7fb",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#fff",
          border: "1px solid #e8ebf2",
          borderRadius: "24px",
          padding: "24px",
          boxShadow: "0 12px 32px rgba(15, 23, 42, 0.06)",
          display: "grid",
          gap: "14px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "28px",
            fontWeight: "800",
            color: "#111827",
          }}
        >
          Admin Login
        </h1>

        <p
          style={{
            margin: 0,
            color: "#667085",
            fontSize: "14px",
            lineHeight: "1.5",
          }}
        >
          Bitte Admin-Passwort eingeben.
        </p>

        <form onSubmit={handleLogin} style={{ display: "grid", gap: "12px" }}>
          <input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 15px",
              borderRadius: "14px",
              border: "1px solid #d7deea",
              fontSize: "15px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#111827",
              color: "#fff",
              border: "none",
              padding: "14px 18px",
              borderRadius: "14px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "15px",
              fontWeight: "700",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Wird geprüft..." : "Einloggen"}
          </button>
        </form>

        {error && (
          <p
            style={{
              margin: 0,
              color: "#b42318",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
