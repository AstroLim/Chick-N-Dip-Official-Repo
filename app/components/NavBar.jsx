"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function NavBar({ activePath, session, profile = null, onLoginClick, onSignupClick, onLogout }) {
  const isAdminUser = profile && ["admin", "super_admin", "superadmin"].includes((profile.Role || "").toLowerCase());
  const navLinks = [
    { href: "/user/menu", label: "Menu" },
    { href: "/user/about", label: "About Us" },
    { href: "/user/location", label: "Location" },
    { href: "/user/contact", label: "Contact Us" },
    ...(isAdminUser ? [{ href: "/admin", label: "Admin" }] : []),
  ];
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [iconError, setIconError] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className="site-header"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(255,255,255,0.94)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--gray-light)",
          padding: "0 2rem",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "box-shadow 0.3s",
          boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.08)" : "none",
        }}
      >
        <Link href="/user" className="nav__logo" aria-label="Chick N' Dip Home">
          <div
            className="nav__logo-icon"
            style={{
              width: 38,
              height: 38,
              background: "var(--red)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {!iconError ? (
              <img
                src="/ICON.PNG"
                alt="Chick N' Dip"
                width={38}
                height={38}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
                onError={() => setIconError(true)}
              />
            ) : (
              <span
                style={{
                  color: "white",
                  fontSize: "1.1rem",
                  fontFamily: "var(--font-display)",
                }}
              >
                C
              </span>
            )}
          </div>
        </Link>

        <nav aria-label="Primary navigation">
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              gap: "2rem",
              margin: 0,
              padding: 0,
            }}
          >
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={activePath === href ? "active" : ""}
                  style={{
                    textDecoration: "none",
                    fontFamily: "var(--font-body)",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    color: "var(--dark)",
                    letterSpacing: "0.02em",
                    position: "relative",
                    transition: "color 0.2s",
                  }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div
          className="nav__actions"
          style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
        >
          {session ? (
            <>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  color: "var(--dark)",
                  letterSpacing: "0.02em",
                }}
              >
                {[profile?.FirstName, profile?.LastName].filter(Boolean).join(" ") || "User"}
              </span>
              {isAdminUser && (
                <Link
                  href="/admin"
                  style={{
                    background: "var(--red)",
                    color: "white",
                    border: "none",
                    padding: "0.5rem 1.3rem",
                    borderRadius: 9999,
                    fontFamily: "var(--font-body)",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    letterSpacing: "0.03em",
                    textDecoration: "none",
                  }}
                >
                  Admin
                </Link>
              )}
              <button
                type="button"
                className="btn-signup"
                onClick={onLogout}
                style={{
                  background: "var(--gray-light)",
                  color: "var(--dark)",
                  border: "none",
                  padding: "0.5rem 1.3rem",
                  borderRadius: 9999,
                  fontFamily: "var(--font-body)",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  letterSpacing: "0.03em",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn-icon"
                aria-label="User account"
                onClick={onLoginClick}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--dark)",
              padding: 7,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </button>
          <button
            type="button"
            className="btn-signup"
            onClick={onSignupClick}
            style={{
              background: "var(--red)",
              color: "white",
              border: "none",
              padding: "0.5rem 1.3rem",
              borderRadius: 9999,
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              fontSize: "0.875rem",
              cursor: "pointer",
              letterSpacing: "0.03em",
              transition: "background 0.2s, transform 0.15s",
            }}
          >
            Sign up
          </button>
            </>
          )}
          <button
            type="button"
            className="hamburger"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: "none",
              flexDirection: "column",
              gap: 5,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
            }}
          >
            <span
              style={{
                display: "block",
                width: 24,
                height: 2,
                background: "var(--dark)",
                borderRadius: 2,
                transition: "transform 0.3s, opacity 0.3s",
                transform: mobileOpen ? "translateY(7px) rotate(45deg)" : "none",
              }}
            />
            <span
              style={{
                display: "block",
                width: 24,
                height: 2,
                background: "var(--dark)",
                borderRadius: 2,
                opacity: mobileOpen ? 0 : 1,
                transition: "opacity 0.3s",
              }}
            />
            <span
              style={{
                display: "block",
                width: 24,
                height: 2,
                background: "var(--dark)",
                borderRadius: 2,
                transition: "transform 0.3s",
                transform: mobileOpen ? "translateY(-7px) rotate(-45deg)" : "none",
              }}
            />
          </button>
        </div>
      </header>

      {/* Mobile nav */}
      <nav
        className="mobile-nav"
        aria-label="Mobile navigation"
        style={{
          display: mobileOpen ? "flex" : "none",
          position: "fixed",
          top: 64,
          left: 0,
          right: 0,
          background: "white",
          borderBottom: "1px solid var(--gray-light)",
          padding: "1.5rem 2rem",
          zIndex: 99,
          flexDirection: "column",
          gap: "1.25rem",
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        }}
      >
        {navLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            style={{
              textDecoration: "none",
              fontWeight: 500,
              color: "var(--dark)",
              fontSize: "1rem",
              transition: "color 0.2s",
            }}
          >
            {label}
          </Link>
        ))}
        {session ? (
          <>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 500,
                fontSize: "0.9rem",
                color: "var(--dark)",
              }}
            >
              {[profile?.FirstName, profile?.LastName].filter(Boolean).join(" ") || "User"}
            </span>
            {isAdminUser && (
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                style={{
                  width: "fit-content",
                  background: "var(--red)",
                  color: "white",
                  padding: "0.5rem 1.3rem",
                  borderRadius: 9999,
                  fontFamily: "var(--font-body)",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  textDecoration: "none",
                }}
              >
                Admin
              </Link>
            )}
            <button
              type="button"
              onClick={() => {
                onLogout?.();
                setMobileOpen(false);
              }}
              style={{
                width: "fit-content",
                background: "var(--gray-light)",
                color: "var(--dark)",
                border: "none",
                padding: "0.5rem 1.3rem",
                borderRadius: 9999,
                fontFamily: "var(--font-body)",
                fontWeight: 500,
                fontSize: "0.875rem",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            type="button"
            className="btn-signup"
            onClick={() => {
              onSignupClick();
              setMobileOpen(false);
            }}
            style={{
              width: "fit-content",
              background: "var(--red)",
              color: "white",
              border: "none",
              padding: "0.5rem 1.3rem",
              borderRadius: 9999,
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >
            Sign up
          </button>
        )}
      </nav>
    </>
  );
}
