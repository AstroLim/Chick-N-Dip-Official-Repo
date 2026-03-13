"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/manage-menu", label: "Menu Manager", icon: "menu" },
  { href: "/admin/manage-inquiries", label: "Inquiries", icon: "inquiries", badge: true },
];

const iconSvg = {
  dashboard: (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x={3} y={3} width={7} height={7} />
      <rect x={14} y={3} width={7} height={7} />
      <rect x={14} y={14} width={7} height={7} />
      <rect x={3} y={14} width={7} height={7} />
    </svg>
  ),
  menu: (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" />
      <path d="M12 8v4l3 3" />
    </svg>
  ),
  inquiries: (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
};

export default function AdminSidebar({ profile, inquiryCount = 0, onLogout }) {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: "var(--sidebar-w)",
        background: "var(--dark-2)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        zIndex: 200,
      }}
      aria-label="Admin navigation"
    >
      <div
        style={{
          padding: "1.75rem 1.5rem 1.25rem",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.6rem",
            letterSpacing: "0.06em",
            color: "white",
            lineHeight: 1,
          }}
        >
          Chick N<span style={{ color: "var(--red)" }}>&apos;</span> Dip
        </div>
        <div
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)",
            marginTop: "0.3rem",
            fontFamily: "var(--font-heading)",
          }}
        >
          Admin Panel
        </div>
      </div>

      <nav style={{ flex: 1, padding: "1.25rem 0", overflowY: "auto" }}>
        <div
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "0.6rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.28)",
            padding: "0.5rem 1.5rem 0.35rem",
            marginTop: "0.5rem",
          }}
        >
          Main
        </div>
        {links.map(({ href, label, icon, badge }) => {
          const isActive = pathname === href || (href !== "/admin" && pathname?.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.72rem 1.5rem",
                textDecoration: "none",
                color: isActive ? "white" : "rgba(255,255,255,0.6)",
                fontSize: "0.875rem",
                fontWeight: 500,
                letterSpacing: "0.02em",
                borderLeft: `3px solid ${isActive ? "var(--red)" : "transparent"}`,
                background: isActive ? "rgba(212,26,26,0.12)" : "transparent",
                transition: "color 0.2s, background 0.2s, border-color 0.2s",
              }}
            >
              <span style={{ opacity: isActive ? 1 : 0.7 }}>{iconSvg[icon]}</span>
              {label}
              {badge && inquiryCount > 0 && (
                <span
                  style={{
                    marginLeft: "auto",
                    background: "var(--red)",
                    color: "white",
                    fontFamily: "var(--font-heading)",
                    fontSize: "0.62rem",
                    padding: "0.15rem 0.45rem",
                    borderRadius: 9999,
                    minWidth: 20,
                    textAlign: "center",
                  }}
                >
                  {inquiryCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div
        style={{
          padding: "1rem 1.5rem",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            background: "var(--red)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-heading)",
            fontSize: "0.75rem",
            color: "white",
            flexShrink: 0,
          }}
        >
          {(() => {
            const f = profile?.FirstName?.[0] || "";
            const l = profile?.LastName?.[0] || "";
            if (f || l) return `${f}${l}`.toUpperCase();
            const e = profile?.Email?.[0] || "A";
            return e.toUpperCase();
          })()}
        </div>
        <div>
          <div style={{ fontSize: "0.82rem", fontWeight: 500, color: "white" }}>
            {profile?.FirstName || "Admin"}
          </div>
          <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.38)" }}>
            {profile?.Role || "Admin"}
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          aria-label="Log out"
          style={{
            marginLeft: "auto",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "rgba(255,255,255,0.35)",
            padding: 4,
            borderRadius: 6,
            display: "flex",
            transition: "color 0.2s",
          }}
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
