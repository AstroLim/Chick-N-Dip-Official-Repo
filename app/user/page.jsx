"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const stats = [
  { id: "stat-locations", target: 1, suffix: "", label: "Locations" },
  { id: "stat-flavors", target: 6, suffix: "", label: "Flavors" },
  { id: "stat-customers", target: 10000, suffix: "", label: "Happy Customers" },
  { id: "stat-years", target: 1, suffix: "", label: "Years Serving" },
];

export default function UserLandingPage() {
  const statsRef = useRef(null);
  const [countersStarted, setCountersStarted] = useState(false);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !countersStarted) {
          setCountersStarted(true);
          stats.forEach(({ id, target, suffix }) => {
            const dom = document.getElementById(id);
            if (!dom) return;
            animateCounter(dom, target, suffix);
          });
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [countersStarted]);

  return (
    <>
      <section
        className="hero"
        style={{
          minHeight: "calc(100vh - 64px)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "center",
          gap: "2rem",
          padding: "4rem 5vw 4rem 6vw",
          position: "relative",
          overflow: "hidden",
        }}
        aria-labelledby="hero-heading"
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 60% 60% at 70% 50%, #FFF0F0 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          className="hero__text"
          style={{
            position: "relative",
            zIndex: 2,
            animation: "slideInLeft 0.8s ease forwards 0.2s",
          }}
        >
          <p
            className="hero__eyebrow"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "0.85rem",
              color: "var(--red)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 28,
                height: 2,
                background: "var(--red)",
                borderRadius: 2,
              }}
            />
            Chick N&apos; Dip
          </p>
          <h1
            id="hero-heading"
            className="hero__headline"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3.5rem, 7vw, 6.5rem)",
              lineHeight: 0.95,
              color: "var(--red)",
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              marginBottom: "1.75rem",
            }}
          >
            Every Bite
            <br />
            Better With Dip
          </h1>
          <p
            className="hero__sub"
            style={{
              fontSize: "1rem",
              color: "#6B6260",
              maxWidth: 380,
              lineHeight: 1.65,
              marginBottom: "2.5rem",
            }}
          >
            Crispy fried chicken paired with our signature house-made dipping sauces. Made fresh, served bold — every single time.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link
              href="/user/menu"
              style={{
                background: "var(--red)",
                color: "white",
                border: "none",
                padding: "0.85rem 2rem",
                borderRadius: 9999,
                fontFamily: "var(--font-heading)",
                fontSize: "0.9rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                textDecoration: "none",
                cursor: "pointer",
                boxShadow: "0 4px 18px rgba(212, 26, 26, 0.3)",
                transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
              }}
            >
              Order Now
            </Link>
            <Link
              href="/user/menu"
              style={{
                background: "transparent",
                color: "var(--dark)",
                border: "2px solid var(--dark)",
                padding: "0.85rem 2rem",
                borderRadius: 9999,
                fontFamily: "var(--font-heading)",
                fontSize: "0.9rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                textDecoration: "none",
                cursor: "pointer",
                transition: "border-color 0.2s, color 0.2s, transform 0.15s",
              }}
            >
              View Menu
            </Link>
          </div>
        </div>

        <div
          className="hero__image-wrap"
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            animation: "slideInRight 0.8s ease forwards 0.4s",
          }}
        >
          <figure
            style={{
              position: "relative",
              width: "min(520px, 100%)",
              borderRadius: 24,
              overflow: "hidden",
              boxShadow: "0 24px 64px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)",
            }}
          >
            <img
              src="/Resources/combo-meal-2.jpeg?v=4"
              alt="Combo Meal 2 – Chicken tenders with rice and signature dip"
              width={520}
              height={420}
              style={{
                display: "block",
                width: "100%",
                height: 420,
                objectFit: "cover",
              }}
            />
          </figure>
          <div
            style={{
              position: "absolute",
              bottom: "1.5rem",
              left: "-1.5rem",
              background: "white",
              borderRadius: 16,
              padding: "0.9rem 1.25rem",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              animation: "float 3s ease-in-out infinite",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                background: "var(--red-light)",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
              }}
            >
              🔥
            </div>
            <div>
              <strong style={{ display: "block", fontFamily: "var(--font-heading)", fontSize: "0.8rem", color: "var(--dark)" }}>
                Signature Dip
              </strong>
              <span style={{ fontSize: "0.72rem", color: "var(--gray)" }}>House-made daily</span>
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              top: "1.5rem",
              right: "-1.25rem",
              background: "var(--red)",
              color: "white",
              borderRadius: 14,
              padding: "0.7rem 1rem",
              boxShadow: "0 6px 24px rgba(212,26,26,0.35)",
              textAlign: "center",
              animation: "float 3s ease-in-out infinite 1.5s",
            }}
          >
            <strong style={{ display: "block", fontFamily: "var(--font-display)", fontSize: "1.4rem", lineHeight: 1 }}>
              4.9★
            </strong>
            <span style={{ fontSize: "0.7rem", opacity: 0.85, letterSpacing: "0.05em" }}>Rated</span>
          </div>
        </div>
      </section>

      <section
        ref={statsRef}
        style={{
          background: "var(--red)",
          padding: "1.5rem 6vw",
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
          gap: "1.5rem",
        }}
        aria-label="Brand highlights"
      >
        {stats.map(({ id, label }) => (
          <div key={id} style={{ textAlign: "center", color: "white" }}>
            <div
              id={id}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "2.5rem",
                letterSpacing: "0.04em",
                lineHeight: 1,
              }}
            >
              0
            </div>
            <div
              style={{
                fontSize: "0.78rem",
                opacity: 0.8,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginTop: "0.3rem",
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}

function animateCounter(el, target, suffix = "", duration = 1800) {
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}
