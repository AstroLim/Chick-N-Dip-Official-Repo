"use client";

import { useEffect, useState } from "react";
import { getPublicMenu } from "@/backend/services/menu.service";
import { NO_IMAGE_URL } from "@/backend/services/menu.service";

const PLACEHOLDER_IMG =
  "https://uukmxxswbccctevqyymo.supabase.co/storage/v1/object/public/menu-images/no-image/No-Image-Placeholder.png";

export default function MenuPage() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getPublicMenu();
        setMenu(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e?.message || "Failed to load menu.");
        setMenu([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <>
      <div
        style={{
          background: "var(--red)",
          padding: "3.5rem 6vw 3rem",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "0.72rem",
            letterSpacing: "0.18em",
            color: "rgba(255,255,255,0.65)",
            textTransform: "uppercase",
            marginBottom: "0.6rem",
          }}
        >
          Est. 2026 · Tarlac City, Philippines
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem, 7vw, 6rem)",
            color: "white",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            lineHeight: 1,
          }}
        >
          Our Menu
        </h1>
        <p
          style={{
            fontSize: "0.9rem",
            color: "rgba(255,255,255,0.7)",
            marginTop: "0.75rem",
            letterSpacing: "0.03em",
          }}
        >
          Every Bite Better With Dip
        </p>
      </div>

      <main style={{ padding: "3.5rem 6vw 5rem" }}>
        {loading ? (
          <p style={{ textAlign: "center", color: "var(--gray)" }}>Loading menu…</p>
        ) : error ? (
          <p style={{ textAlign: "center", color: "var(--red)" }}>{error}</p>
        ) : !menu.length ? (
          <p style={{ textAlign: "center", color: "var(--gray)" }}>No menu available yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
            {menu.map(({ section, items }) => (
              <section key={section.id}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "1rem",
                    marginBottom: "2.25rem",
                    paddingBottom: "0.75rem",
                    borderBottom: "2px solid var(--gray-light)",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      bottom: -2,
                      left: 0,
                      width: 60,
                      height: 2,
                      background: "var(--red)",
                    }}
                  />
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(2rem, 4vw, 3.5rem)",
                      color: "var(--dark)",
                      textTransform: "uppercase",
                      letterSpacing: "0.03em",
                    }}
                  >
                    {section.Name}
                  </h2>
                  {section.Description && (
                    <span
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "0.75rem",
                        color: "var(--gray)",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      {items.length} items
                    </span>
                  )}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: "1.5rem",
                  }}
                >
                  {items.map((it) => (
                    <article
                      key={it.id}
                      style={{
                        background: "white",
                        borderRadius: 16,
                        overflow: "hidden",
                        border: "1px solid var(--gray-light)",
                        transition: "transform 0.25s ease, box-shadow 0.25s ease",
                      }}
                    >
                      <div style={{ overflow: "hidden" }}>
                        <img
                          src={it.ImageUrl || NO_IMAGE_URL || PLACEHOLDER_IMG}
                          alt={it.Name}
                          style={{
                            width: "100%",
                            aspectRatio: "1 / 1",
                            objectFit: "cover",
                            display: "block",
                            background: "var(--gray-light)",
                          }}
                          onError={(e) => {
                            e.currentTarget.src = PLACEHOLDER_IMG;
                          }}
                        />
                      </div>
                      <div style={{ padding: "0.9rem 1rem 1rem" }}>
                        <div
                          style={{
                            fontFamily: "var(--font-heading)",
                            fontSize: "0.8rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            color: "var(--dark)",
                            lineHeight: 1.3,
                          }}
                        >
                          {it.Name}
                        </div>
                        {it.Description && (
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--gray)",
                              marginTop: "0.3rem",
                              lineHeight: 1.5,
                            }}
                          >
                            {it.Description}
                          </div>
                        )}
                        <div
                          style={{
                            fontFamily: "var(--font-heading)",
                            fontSize: "0.88rem",
                            color: "var(--red)",
                            marginTop: "0.55rem",
                          }}
                        >
                          ₱{Number(it.Price ?? 0).toFixed(2)}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
