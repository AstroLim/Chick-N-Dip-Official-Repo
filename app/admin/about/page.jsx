"use client";

import Link from "next/link";

export default function AdminAboutPage() {
  return (
    <>
      <header
        style={{
          background: "white",
          borderBottom: "1px solid var(--gray-light)",
          padding: "0 2.5rem",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--gray)" }}>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span style={{ color: "var(--gray-light)" }}>›</span>
          <strong style={{ color: "var(--dark)" }}>About Us</strong>
        </div>
        <Link
          href="/user/about"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            background: "var(--off-white)",
            border: "1px solid var(--gray-light)",
            color: "var(--dark)",
            padding: "0.45rem 0.9rem",
            borderRadius: 8,
            fontFamily: "var(--font-heading)",
            fontSize: "0.7rem",
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            textDecoration: "none",
            transition: "background 0.2s",
          }}
        >
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          View Live Page
        </Link>
      </header>

      <div style={{ padding: 0 }}>
        <section
          style={{
            background: "var(--off-white)",
            padding: "4rem 5vw 3rem",
            position: "relative",
            overflow: "hidden",
            borderBottom: "1px solid var(--gray-light)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "0.78rem",
              color: "var(--red)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            Our Story
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.8rem, 5vw, 5.5rem)",
              lineHeight: 0.9,
              color: "var(--dark)",
              letterSpacing: "0.01em",
              textTransform: "uppercase",
              maxWidth: 700,
            }}
          >
            Why Is The Sauce Always An
            <br />
            <em style={{ fontStyle: "normal", color: "var(--red)" }}>Afterthought?</em>
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: "#6B6260",
              maxWidth: 520,
              lineHeight: 1.7,
              marginTop: "1.5rem",
            }}
          >
            We asked that question — and then decided to do something about it. It&apos;s unfair. It&apos;s affordable. It&apos;s iconic. But no one was giving it the spotlight it deserves — so we built a space that does.
          </p>
        </section>

        <section
          style={{
            padding: "5rem 5vw",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "center",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "0.75rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--red)",
                marginBottom: "1rem",
              }}
            >
              Founded in Tarlac City
            </p>
            <h2
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(1rem, 1.8vw, 1.25rem)",
                fontWeight: 400,
                lineHeight: 1.7,
                color: "var(--dark)",
              }}
            >
              Chick N&apos; Dip was created with one goal: to elevate the classic chicken tender into something{" "}
              <strong>bold</strong>, <em style={{ color: "var(--red)" }}>customizable</em>, and <strong>crave-worthy</strong>.
            </h2>
          </div>
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: "100%",
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1562967914-608f82629710?w=800&auto=format&fit=crop&q=80"
                alt="Chick N' Dip kitchen"
                width={520}
                height={380}
                style={{ width: "100%", height: 380, objectFit: "cover", display: "block" }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "-1rem",
                right: "1.5rem",
                background: "var(--red)",
                color: "white",
                padding: "0.65rem 1.1rem",
                borderRadius: 10,
                fontFamily: "var(--font-heading)",
                fontSize: "0.8rem",
                letterSpacing: "0.06em",
                boxShadow: "0 6px 24px rgba(212,26,26,0.35)",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              Born in Tarlac
            </div>
          </div>
        </section>

        <section
          style={{
            background: "var(--red)",
            padding: "4.5rem 5vw",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "0.78rem",
              color: "rgba(255,255,255,0.65)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: "1.25rem",
            }}
          >
            Our Philosophy
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 5vw, 5rem)",
              lineHeight: 0.92,
              color: "white",
              textTransform: "uppercase",
              letterSpacing: "0.02em",
              maxWidth: 600,
              marginBottom: "1rem",
            }}
          >
            Built On Flavor,
            <br />
            <span style={{ color: "rgba(255,255,255,0.35)" }}>Not Just</span>
            <br />
            Fried Chicken
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "rgba(255,255,255,0.75)",
              maxWidth: 460,
              lineHeight: 1.7,
              marginTop: "1.5rem",
            }}
          >
            Every dip is designed to be dipped, bitten, and enjoyed your way. No rules. No single right answer. Just your taste, amplified.
          </p>
        </section>

        <section
          style={{
            padding: "5rem 5vw",
            background: "var(--off-white)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.2rem, 4vw, 4rem)",
                color: "var(--dark)",
                textTransform: "uppercase",
                lineHeight: 0.95,
              }}
            >
              What We Stand For
            </h2>
            <p style={{ fontSize: "1rem", color: "var(--gray)", marginTop: "0.8rem" }}>
              Three things that make every order worth it.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1.5rem",
            }}
          >
            {[
              { icon: "🍗", title: "Crispy N' Saucy", body: "Chicken tenders made from scratch — marinated and fried to order for the perfect crunch. The base that makes the dip shine." },
              { icon: "🌍", title: "Global Dips", body: "Japanese mayo, Korean gochujang, Southeast Asian sambal. Flavors from around the globe, fresh and creamy every day." },
              { icon: "📋", title: "Precision Menu", body: "A simple, intentional menu that does less, more. Fully customizable combos well worth waiting for." },
            ].map(({ icon, title, body }) => (
              <div
                key={title}
                style={{
                  background: "white",
                  borderRadius: 20,
                  padding: "2.25rem 1.75rem",
                  border: "1px solid var(--gray-light)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                }}
              >
                <div
                  style={{
                    width: 50,
                    height: 50,
                    background: "var(--red-light)",
                    borderRadius: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.4rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  {icon}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "0.9rem",
                    color: "var(--dark)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "0.65rem",
                  }}
                >
                  {title}
                </h3>
                <p style={{ fontSize: "0.875rem", color: "#6B6260", lineHeight: 1.7 }}>{body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
