"use client";

import { useState } from "react";
import Link from "next/link";
import { login } from "@/backend/services/auth.service";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    setBusy(true);

    try {
      await login({ email, password });
      window.location.href = "/admin";
    } catch (err) {
      setMsg(err?.message || "Login failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ maxWidth: 520, margin: "0 auto", padding: 24 }}>
      <h1>Login</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />
        </label>

        <label>
          Password
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />
        </label>

        <button disabled={busy} style={{ padding: 12, cursor: "pointer" }}>
          {busy ? "Logging in..." : "Login"}
        </button>

        {msg && <p style={{ color: "crimson" }}>{msg}</p>}
      </form>

      <p style={{ marginTop: 16 }}>
        No account? <Link href="/register">Register here</Link>
      </p>
    </main>
  );
}