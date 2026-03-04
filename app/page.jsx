"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyProfile, getSession } from "@/backend/utils/supabase/auth";
import { logout } from "@/backend/services/auth.service";
import { getPublicMenu } from "@/backend/services/menu.service";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [sessionExists, setSessionExists] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  const [menuLoading, setMenuLoading] = useState(true);
  const [menu, setMenu] = useState([]);
  const [menuError, setMenuError] = useState("");

  async function load() {
    setError("");
    setLoading(true);
    setMenuError("");
    setMenuLoading(true);

    try {
      const [session, publicMenu] = await Promise.all([getSession(), getPublicMenu()]);

      setSessionExists(!!session);
      setMenu(Array.isArray(publicMenu) ? publicMenu : []);

      if (session) {
        const profileData = await getMyProfile();
        setProfile(profileData);
      } else {
        setProfile(null);
      }
    } catch (e) {
      const msg = e?.message || "Failed to load.";
      setError(msg);
      setMenuError(msg);
      setMenu([]);
      setProfile(null);
    } finally {
      setLoading(false);
      setMenuLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleLogout() {
    try {
      await logout();
      await load();
    } catch (e) {
      setError(e?.message || "Logout failed.");
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0 }}>CHICKNDIP</h1>
        <nav style={{ display: "flex", gap: 12 }}>
          <Link href="/">Home</Link>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </nav>
      </header>

      <section style={{ marginTop: 24, padding: 16, border: "1px solid #ddd", borderRadius: 10 }}>
        <h2 style={{ marginTop: 0 }}>Welcome 👋</h2>

        {loading ? (
          <p>Loading...</p>
        ) : sessionExists ? (
          <>
            <p>
              Logged in as: <b>{profile?.Email || "Unknown"}</b>
            </p>
            <p>
              Role: <b>{profile?.Role || "user"}</b>
            </p>
            <button onClick={handleLogout} style={{ padding: "10px 14px", cursor: "pointer" }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <p>You are viewing the public site. Please login to access inquiry.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <Link href="/login">Go to Login</Link>
              <Link href="/register">Create Account</Link>
            </div>
          </>
        )}

        {error && <p style={{ color: "crimson" }}>{error}</p>}
      </section>

      <section style={{ marginTop: 24 }}>
        <h3>Menu</h3>

        {menuLoading ? (
          <p>Loading menu...</p>
        ) : menuError ? (
          <p style={{ color: "crimson" }}>{menuError}</p>
        ) : !Array.isArray(menu) || menu.length === 0 ? (
          <p>No menu available yet.</p>
        ) : (
          <div style={{ display: "grid", gap: 18 }}>
            {menu.map(({ section, items }) => (
              <div
                key={section.id}
                style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}
              >
                <h4 style={{ margin: 0 }}>{section.Name}</h4>
                {section.Description && <p style={{ marginTop: 6, color: "#555" }}>{section.Description}</p>}

                {items.length === 0 ? (
                  <p style={{ color: "#777" }}>No items in this section.</p>
                ) : (
                  <div
                    style={{
                      marginTop: 12,
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: 12,
                    }}
                  >
                    {items.map((it) => (
                      <div
                        key={it.id}
                        style={{
                          border: "1px solid #ddd",
                          borderRadius: 12,
                          padding: 12,
                          display: "grid",
                          gap: 8,
                        }}
                      >
                        <img
                          src={it.ImageUrl}
                          alt={it.Name}
                          style={{
                            width: "100%",
                            height: 140,
                            objectFit: "cover",
                            borderRadius: 10,
                            border: "1px solid #eee",
                          }}
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://uukmxxswbccctevqyymo.supabase.co/storage/v1/object/public/menu-images/no-image/No-Image-Placeholder.png";
                          }}
                        />

                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                          <b style={{ lineHeight: 1.2 }}>{it.Name}</b>
                          <span>₱{Number(it.Price || 0).toFixed(2)}</span>
                        </div>

                        {it.Description && (
                          <p style={{ margin: 0, color: "#666", fontSize: 14 }}>{it.Description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}