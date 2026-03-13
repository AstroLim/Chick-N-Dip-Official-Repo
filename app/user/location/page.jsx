import Link from "next/link";

export default function LocationPage() {
  return (
    <main>
      <section
        className="location-hero"
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1.15fr",
          alignItems: "center",
          gap: "4rem",
          padding: "5rem 5vw 5rem 7vw",
          minHeight: "calc(100vh - 64px)",
          position: "relative",
          overflow: "hidden",
        }}
        aria-labelledby="location-heading"
      >
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "-5%",
            width: 500,
            height: 500,
            background: "radial-gradient(circle, rgba(212,26,26,0.05) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            position: "relative",
            zIndex: 2,
          }}
        >
          <h1
            id="location-heading"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3.5rem, 7vw, 6.5rem)",
              color: "var(--red)",
              lineHeight: 0.92,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            Locate
            <br />
            Us At
          </h1>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }}
          >
            <address
              style={{
                fontStyle: "normal",
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                color: "var(--dark)",
                fontWeight: 400,
                lineHeight: 1.8,
                textDecoration: "underline",
                textDecorationColor: "rgba(26,18,16,0.25)",
                textUnderlineOffset: 3,
                letterSpacing: "0.01em",
              }}
            >
              Villa Lucinda, Getha Road, Villa Lucinda,
              <br />
              Tarlac, Philippines, 2300
            </address>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.6rem",
            }}
            role="list"
            aria-label="Location details"
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "white",
                border: "1.5px solid var(--gray-light)",
                borderRadius: 9999,
                padding: "0.35rem 0.9rem",
                fontSize: "0.78rem",
                fontWeight: 500,
                color: "#5A5250",
                letterSpacing: "0.03em",
              }}
            >
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth={2.2}>
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Mon–Sun: 10AM – 9PM
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "white",
                border: "1.5px solid var(--gray-light)",
                borderRadius: 9999,
                padding: "0.35rem 0.9rem",
                fontSize: "0.78rem",
                fontWeight: 500,
                color: "#5A5250",
                letterSpacing: "0.03em",
              }}
            >
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth={2.2}>
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              Tarlac City
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "white",
                border: "1.5px solid var(--gray-light)",
                borderRadius: 9999,
                padding: "0.35rem 0.9rem",
                fontSize: "0.78rem",
                fontWeight: 500,
                color: "#5A5250",
                letterSpacing: "0.03em",
              }}
            >
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth={2.2}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 11.5 19.79 19.79 0 0 1 1 2.18 2 2 0 0 1 3 0h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 7.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 14h1a2 2 0 0 1 0 2.92z" />
              </svg>
              Near TSU Lucinda
            </span>
          </div>

          <Link
            href="/user/menu"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              background: "var(--red)",
              color: "white",
              border: "none",
              padding: "0.9rem 2rem",
              borderRadius: 9999,
              fontFamily: "var(--font-heading)",
              fontSize: "0.9rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: "pointer",
              width: "fit-content",
              textDecoration: "none",
              boxShadow: "0 4px 18px rgba(212,26,26,0.28)",
              transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
            }}
          >
            See the menu
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 2,
          }}
        >
          <figure
            style={{
              borderRadius: 22,
              overflow: "hidden",
              boxShadow: "0 24px 64px rgba(0,0,0,0.11), 0 4px 16px rgba(0,0,0,0.06)",
              position: "relative",
              background: "var(--gray-light)",
              outline: "1px solid rgba(0,0,0,0.07)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "1.25rem",
                left: "1.25rem",
                background: "white",
                borderRadius: 12,
                padding: "0.6rem 1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.55rem",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "var(--dark)",
                letterSpacing: "0.03em",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  background: "var(--red)",
                  borderRadius: "50%",
                  flexShrink: 0,
                  boxShadow: "0 0 0 3px rgba(212,26,26,0.2)",
                }}
              />
              Chick N&apos; Dip
            </div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3845.265283093474!2d120.61666367588465!3d15.470156355195401!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396c7aecd637159%3A0x33fd9b3dfbe75a50!2sChick%20N&#39;%20Dip!5e0!3m2!1sen!2sph!4v1773268646980!5m2!1sen!2sph"
              title="Chick N' Dip location on Google Maps"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{
                display: "block",
                width: "100%",
                height: 460,
                border: 0,
                borderRadius: 22,
              }}
            />
          </figure>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.9rem" }}>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Chick+N+Dip+Tarlac"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Get directions to Chick N' Dip on Google Maps"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.8rem",
                fontWeight: 500,
                color: "var(--red)",
                textDecoration: "none",
                letterSpacing: "0.03em",
              }}
            >
              Get directions
              <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
