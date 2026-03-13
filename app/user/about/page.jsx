import Image from "next/image";

export default function AboutPage() {
  return (
    <>
      <section
        style={{
          background: "var(--off-white)",
          padding: "5rem 6vw 4rem",
          position: "relative",
          overflow: "hidden",
          borderBottom: "1px solid var(--gray-light)",
        }}
        aria-labelledby="about-heading"
      >
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 320,
            height: 320,
            background: "radial-gradient(circle, #FDDADA 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
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
          id="about-heading"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3.2rem, 8vw, 7rem)",
            lineHeight: 0.9,
            color: "var(--dark)",
            letterSpacing: "0.01em",
            textTransform: "uppercase",
            maxWidth: 800,
          }}
        >
          Why Is The Sauce Always An
          <br />
          <em style={{ fontStyle: "normal", color: "var(--red)" }}>Afterthought?</em>
        </h1>
        <p
          style={{
            fontSize: "1.05rem",
            color: "#6B6260",
            maxWidth: 560,
            lineHeight: 1.7,
            marginTop: "1.75rem",
          }}
        >
          We asked that question — and then decided to do something about it. It&apos;s unfair. It&apos;s affordable. It&apos;s iconic. But no one was giving it the spotlight it deserves — so we built a space that does.
        </p>
      </section>

      <section
        style={{
          padding: "6rem 6vw",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "5rem",
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
              fontSize: "clamp(1.1rem, 2vw, 1.35rem)",
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
              src="/Resources/combo-meal-1.JPG?v=4"
              alt="Combo Meal 1 – Rice, sliced tender, drizzled dip"
              width={520}
              height={420}
              style={{ width: "100%", height: 420, objectFit: "cover", display: "block" }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "-1.2rem",
              right: "2rem",
              background: "var(--red)",
              color: "white",
              padding: "0.75rem 1.25rem",
              borderRadius: 12,
              fontFamily: "var(--font-heading)",
              fontSize: "0.85rem",
              letterSpacing: "0.06em",
              boxShadow: "0 6px 24px rgba(212,26,26,0.35)",
            }}
          >
            Born in Tarlac
          </div>
        </div>
      </section>

      <section
        style={{
          background: "var(--red)",
          padding: "5rem 6vw",
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
            fontSize: "clamp(3rem, 7vw, 6rem)",
            lineHeight: 0.92,
            color: "white",
            textTransform: "uppercase",
            letterSpacing: "0.02em",
            maxWidth: 700,
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
            maxWidth: 480,
            lineHeight: 1.7,
            marginTop: "1.5rem",
          }}
        >
          Every dip is designed to be dipped, bitten, and enjoyed your way. No rules. No single right answer. Just your taste, amplified.
        </p>
      </section>

      <section
        style={{
          padding: "6rem 6vw",
          background: "var(--off-white)",
        }}
      >
        <header style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              color: "var(--dark)",
              textTransform: "uppercase",
              letterSpacing: "0.02em",
              lineHeight: 0.95,
            }}
          >
            What We Stand For
          </h2>
          <p style={{ fontSize: "1rem", color: "var(--gray)", marginTop: "1rem", maxWidth: 400, margin: "1rem auto 0" }}>
            Three things that make every order worth it.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "2rem",
          }}
        >
          {[
            { title: "Crispy N' Saucy", body: "Chicken tenders made from scratch — marinated and fried to order for the perfect crunch. The base that makes the dip shine." },
            { title: "Global Dips", body: "Japanese mayo, Korean gochujang, Southeast Asian sambal. Flavors from around the globe, fresh and creamy every day." },
            { title: "Precision Menu", body: "A simple, intentional menu that does less, more. Fully customizable combos well worth waiting for." },
          ].map(({ title, body }) => (
            <article
              key={title}
              style={{
                background: "white",
                borderRadius: 20,
                padding: "2.5rem 2rem",
                border: "1px solid var(--gray-light)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1rem",
                  color: "var(--dark)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "0.75rem",
                }}
              >
                {title}
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#6B6260", lineHeight: 1.7 }}>
                {body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        style={{
          background: "var(--dark-2)",
          color: "white",
          padding: "6rem 6vw",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: -80,
            right: -80,
            width: 400,
            height: 400,
            background: "radial-gradient(circle, rgba(212,26,26,0.15) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "5rem",
            alignItems: "center",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "0.75rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--red-light)",
                marginBottom: "1rem",
              }}
            >
              More Than A Food Concept
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.8rem, 5vw, 5rem)",
                color: "white",
                textTransform: "uppercase",
                lineHeight: 0.92,
                letterSpacing: "0.02em",
                marginBottom: "1.5rem",
              }}
            >
              A Bold <em style={{ fontStyle: "normal", color: "var(--red)" }}>Idea</em> That Started Small
            </h2>
            <p
              style={{
                fontSize: "0.95rem",
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.75,
                marginBottom: "2rem",
              }}
            >
              Chick N&apos; Dip isn&apos;t just about chicken. It&apos;s about believing something fresh can come from anywhere — the right mindset, right technique, and the belief that a focused idea can compete with bigger chains.
            </p>
            <blockquote
              style={{
                borderLeft: "3px solid var(--red)",
                padding: "1rem 1.5rem",
                margin: "2rem 0",
                background: "rgba(255,255,255,0.04)",
                borderRadius: "0 12px 12px 0",
              }}
            >
              <p style={{ fontStyle: "italic", fontSize: "1.05rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.65 }}>
                &quot;We are created by bold challengers — the brands that prove you don&apos;t need the biggest to make the biggest impact.&quot;
              </p>
              <cite style={{ display: "block", marginTop: "0.75rem", fontStyle: "normal", fontSize: "0.8rem", color: "var(--red-light)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-heading)" }}>
                — Founders, Chick N&apos; Dip
              </cite>
            </blockquote>
            <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.65)", marginBottom: 0 }}>
              Born in Tarlac. Built to grow.
            </p>
          </div>
          <div style={{ position: "relative" }}>
            <div
              style={{
                borderRadius: 20,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Image
                src="/Resources/combo-meal-3.jpg?v=5"
                alt="Combo Meal 3 – Fried chicken with fries and dips"
                width={520}
                height={500}
                style={{
                  width: "100%",
                  height: 500,
                  objectFit: "cover",
                  display: "block",
                  filter: "brightness(0.85) contrast(1.05)",
                }}
                unoptimized
              />
            </div>
            <span
              style={{
                position: "absolute",
                bottom: "1.5rem",
                left: "1.5rem",
                fontFamily: "var(--font-heading)",
                fontSize: "0.75rem",
                color: "white",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                background: "rgba(0,0,0,0.45)",
                padding: "0.4rem 0.85rem",
                borderRadius: 9999,
                backdropFilter: "blur(6px)",
              }}
            >
              Born in Tarlac
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
