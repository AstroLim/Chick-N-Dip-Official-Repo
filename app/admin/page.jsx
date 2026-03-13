"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPublicMenu } from "@/backend/services/menu.service";
import { listAllInquiryThreadsAdmin } from "@/backend/services/inquiry.service";

export default function AdminDashboardPage() {
  const [clock, setClock] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [menuCount, setMenuCount] = useState(0);
  const [inquiryCount, setInquiryCount] = useState(0);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [menuSnapshot, setMenuSnapshot] = useState([]);

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      setClock(now.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" }));
      setDateStr(now.toLocaleDateString("en-PH", { weekday: "long", year: "numeric", month: "long", day: "numeric" }));
    }
    updateClock();
    const id = setInterval(updateClock, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const [menu, inquiries] = await Promise.all([
          getPublicMenu(),
          listAllInquiryThreadsAdmin(),
        ]);
        const items = (menu || []).flatMap((s) => s.items || []);
        setMenuCount(items.length);
        setInquiryCount((inquiries || []).length);
        setRecentInquiries((inquiries || []).slice(0, 5));
        setMenuSnapshot(items.slice(0, 3));
      } catch {
        setMenuCount(0);
        setInquiryCount(0);
        setRecentInquiries([]);
        setMenuSnapshot([]);
      }
    }
    load();
  }, []);

  function initials(str) {
    if (!str) return "??";
    return str
      .split(/[\s_]+/)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

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
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--gray)" }}>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <rect x={3} y={3} width={7} height={7} />
            <rect x={14} y={3} width={7} height={7} />
            <rect x={14} y={14} width={7} height={7} />
            <rect x={3} y={14} width={7} height={7} />
          </svg>
          <strong style={{ color: "var(--dark)" }}>Dashboard</strong>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--gray)", letterSpacing: "0.03em" }}>{clock}</span>
          <button
            type="button"
            aria-label="Notifications"
            style={{
              position: "relative",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--gray)",
              padding: 6,
              borderRadius: 8,
              display: "flex",
            }}
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span
              style={{
                position: "absolute",
                top: 4,
                right: 4,
                width: 8,
                height: 8,
                background: "var(--red)",
                borderRadius: "50%",
                border: "2px solid white",
              }}
            />
          </button>
        </div>
      </header>

      <div style={{ padding: "2.5rem", flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: "2rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "2.8rem",
              color: "var(--dark)",
              textTransform: "uppercase",
              letterSpacing: "0.03em",
              lineHeight: 1,
            }}
          >
            Good Morning, <span style={{ color: "var(--red)" }}>Admin</span> 👋
          </h1>
          <span style={{ fontSize: "0.82rem", color: "var(--gray)", fontWeight: 500 }}>{dateStr}</span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1.25rem",
            marginBottom: "2rem",
          }}
        >
          {[
            { value: menuCount, label: "Menu Items", change: "All items", color: "var(--red)" },
            { value: inquiryCount, label: "New Inquiries", change: "Total", color: "#16A34A" },
            { value: inquiryCount, label: "Total Inquiries", change: "All time", color: "#2563EB" },
            { value: 0, label: "Categories", change: "Menu categories", color: "#D97706" },
          ].map(({ value, label, change, color }, i) => (
            <div
              key={i}
              style={{
                background: "white",
                borderRadius: 16,
                padding: "1.5rem",
                border: "1px solid var(--gray-light)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: color,
                }}
              />
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: `color-mix(in srgb, ${color} 12%, white)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1rem",
                }}
              >
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
                  <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" />
                  <path d="M12 8v4l3 3" />
                </svg>
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "2.5rem",
                  color: "var(--dark)",
                  lineHeight: 1,
                  letterSpacing: "0.02em",
                }}
              >
                {value}
              </div>
              <div
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 500,
                  color: "var(--gray)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginTop: "0.4rem",
                }}
              >
                {label}
              </div>
              <div style={{ fontSize: "0.75rem", fontWeight: 500, marginTop: "0.6rem", color: "#16A34A" }}>
                {change}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 380px",
            gap: "1.5rem",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: 16,
              border: "1px solid var(--gray-light)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "1.25rem 1.5rem",
                borderBottom: "1px solid var(--gray-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "0.88rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  color: "var(--dark)",
                }}
              >
                Recent Inquiries
              </span>
              <Link
                href="/admin/manage-inquiries"
                style={{
                  fontSize: "0.78rem",
                  color: "var(--red)",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                View all →
              </Link>
            </div>
            <div>
              {recentInquiries.length === 0 ? (
                <div style={{ padding: "2rem", textAlign: "center", color: "var(--gray)" }}>
                  No inquiries yet.
                </div>
              ) : (
                recentInquiries.map((inq) => (
                  <Link
                    key={inq.id}
                    href="/admin/manage-inquiries"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "1rem 1.5rem",
                      borderBottom: "1px solid var(--gray-light)",
                      textDecoration: "none",
                      color: "inherit",
                      transition: "background 0.15s",
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "var(--red-light)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-heading)",
                        fontSize: "0.78rem",
                        color: "var(--red)",
                        flexShrink: 0,
                      }}
                    >
                      {initials(inq.subject)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: "var(--dark)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {inq.subject?.split("–")[1]?.trim() || inq.subject || "Inquiry"}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--gray)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {inq.subject}
                      </div>
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "0.62rem",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        padding: "0.2rem 0.6rem",
                        borderRadius: 9999,
                        background: inq.status === "open" ? "#DCFCE7" : "var(--gray-light)",
                        color: inq.status === "open" ? "#15803D" : "var(--gray)",
                        flexShrink: 0,
                      }}
                    >
                      {inq.status === "open" ? "New" : inq.status || "Open"}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div
              style={{
                background: "white",
                borderRadius: 16,
                border: "1px solid var(--gray-light)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "1.25rem 1.5rem",
                  borderBottom: "1px solid var(--gray-light)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "0.88rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    color: "var(--dark)",
                  }}
                >
                  Quick Actions
                </span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.75rem",
                  padding: "1.25rem",
                }}
              >
                {[
                  { href: "/admin/manage-menu", label: "Add Menu Item", icon: "plus" },
                  { href: "/admin/manage-inquiries", label: "View Inquiries", icon: "msg" },
                  { href: "/user", label: "View Site", icon: "external", external: true },
                ].map(({ href, label, icon, external }) => (
                  <Link
                    key={href}
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.5rem",
                      background: "var(--off-white)",
                      border: "1px solid var(--gray-light)",
                      borderRadius: 12,
                      padding: "1.1rem 0.75rem",
                      cursor: "pointer",
                      textDecoration: "none",
                      color: "inherit",
                      transition: "border-color 0.2s, background 0.2s, transform 0.2s",
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        background: "var(--red-light)",
                        borderRadius: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth={2.5}>
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "0.72rem",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        color: "var(--dark)",
                        textAlign: "center",
                      }}
                    >
                      {label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div
              style={{
                background: "white",
                borderRadius: 16,
                border: "1px solid var(--gray-light)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "1.25rem 1.5rem",
                  borderBottom: "1px solid var(--gray-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "0.88rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    color: "var(--dark)",
                  }}
                >
                  Menu Snapshot
                </span>
                <Link href="/admin/manage-menu" style={{ fontSize: "0.78rem", color: "var(--red)", textDecoration: "none", fontWeight: 500 }}>
                  Manage →
                </Link>
              </div>
              <div>
                {menuSnapshot.length === 0 ? (
                  <div style={{ padding: "2rem", textAlign: "center", color: "var(--gray)" }}>No menu items.</div>
                ) : (
                  menuSnapshot.map((it) => (
                    <div
                      key={it.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        padding: "0.9rem 1.5rem",
                        borderBottom: "1px solid var(--gray-light)",
                      }}
                    >
                      <img
                        src={it.ImageUrl || "https://placehold.co/44x44/F0EDEB/9B9390?text=?"}
                        alt={it.Name}
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 10,
                          objectFit: "cover",
                          background: "var(--gray-light)",
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--dark)" }}>{it.Name}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--gray)" }}>Menu item</div>
                      </div>
                      <div style={{ fontFamily: "var(--font-heading)", fontSize: "0.88rem", color: "var(--red)" }}>
                        ₱{Number(it.Price ?? 0).toFixed(0)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
