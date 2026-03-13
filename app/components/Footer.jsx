export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--dark)",
        color: "white",
        padding: "1.5rem 2.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.4rem",
          letterSpacing: "0.08em",
        }}
      >
        Chick N<span style={{ color: "var(--red)" }}>&apos;</span> Dip
      </div>
      <p
        style={{
          fontSize: "0.78rem",
          color: "rgba(255,255,255,0.4)",
          letterSpacing: "0.05em",
          margin: 0,
        }}
      >
        © 2025 Chick N&apos; Dip. All rights reserved.
      </p>
    </footer>
  );
}
