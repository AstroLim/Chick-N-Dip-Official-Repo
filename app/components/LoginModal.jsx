"use client";

import { useState } from "react";
import { login } from "@/backend/services/auth.service";

export default function LoginModal({ isOpen, onClose, onSuccess, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email, password });
      onClose();
      window.location.href = "/admin";
    } catch (err) {
      setError(err?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        zIndex: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "white",
          borderRadius: 20,
          width: "min(420px, 95vw)",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: "1.5rem 1.75rem",
            borderBottom: "1px solid var(--gray-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2
            id="login-title"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1rem",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--dark)",
            }}
          >
            Log in
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--gray)",
              padding: 4,
              borderRadius: 6,
              display: "flex",
            }}
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "1.75rem" }}>
          <div style={{ marginBottom: "1.1rem" }}>
            <label
              htmlFor="login-email"
              style={{
                display: "block",
                fontSize: "0.78rem",
                fontWeight: 500,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "var(--gray)",
                marginBottom: "0.4rem",
              }}
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={{
                width: "100%",
                border: "1.5px solid var(--gray-light)",
                borderRadius: 10,
                padding: "0.65rem 0.9rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                color: "var(--dark)",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label
              htmlFor="login-password"
              style={{
                display: "block",
                fontSize: "0.78rem",
                fontWeight: 500,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "var(--gray)",
                marginBottom: "0.4rem",
              }}
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{
                width: "100%",
                border: "1.5px solid var(--gray-light)",
                borderRadius: 10,
                padding: "0.65rem 0.9rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                color: "var(--dark)",
                outline: "none",
              }}
            />
          </div>

          {error && (
            <p style={{ color: "var(--red)", fontSize: "0.85rem", marginBottom: "1rem" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: "var(--red)",
              color: "white",
              border: "none",
              padding: "0.9rem",
              borderRadius: 10,
              fontFamily: "var(--font-heading)",
              fontSize: "0.9rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Logging in…" : "Log in"}
          </button>

          <p style={{ marginTop: "1rem", fontSize: "0.85rem", color: "var(--gray)", textAlign: "center" }}>
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToRegister}
              style={{
                background: "none",
                border: "none",
                color: "var(--red)",
                cursor: "pointer",
                fontWeight: 500,
                textDecoration: "underline",
              }}
            >
              Sign up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
