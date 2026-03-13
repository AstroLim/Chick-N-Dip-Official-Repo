"use client";

import { useState, useEffect } from "react";
import { createInquiryWithMessage, listMyInquiryThreads, getInquiryThread } from "@/backend/services/inquiry.service";
import { getSession, getMyProfile } from "@/backend/utils/supabase/auth";

const INQUIRY_TYPES = [
  { value: "franchising-local", label: "Franchising – Local" },
  { value: "careers", label: "Careers" },
  { value: "party-carts", label: "Party Carts Bookings" },
  { value: "sponsorship", label: "Sponsorship Inquiries" },
];

const FAQ_ITEMS = [
  { q: "How do I place an order?", a: "You can place an order directly through our website, via our partner delivery apps, or by visiting any of our physical locations. Select your meal, customize your dip, and we'll handle the rest." },
  { q: "Do you offer franchising?", a: "Yes! We currently offer local franchising opportunities across the Philippines. Fill out the contact form above and select \"Franchising – Local\" so our team can get in touch with more details." },
  { q: "Can I book a Party Cart?", a: "Absolutely! Our Party Cart is available for birthdays, corporate events, school fairs, and more. Use the form above and choose \"Party Carts Bookings\" to start the reservation process. We recommend booking at least 2 weeks in advance." },
  { q: "What are your operating hours?", a: "Most of our branches are open from 10:00 AM to 9:00 PM daily. Hours may vary by location — check the Location page for branch-specific schedules." },
  { q: "Do you have career opportunities?", a: "We're always on the lookout for passionate, hungry-for-growth people to join our team. Send us a message using the form and select \"Careers\" — include your resume and the role you're interested in." },
];

export default function ContactPage() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    inquiry: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [expandedInquiry, setExpandedInquiry] = useState(null);
  const [threadData, setThreadData] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [sess, prof] = await Promise.all([getSession(), getMyProfile()]);
        setSession(sess);
        setProfile(prof);
        if (sess && prof) {
          setFormData((prev) => ({
            ...prev,
            fullname: [prof.FirstName, prof.LastName].filter(Boolean).join(" ") || prof.Email || "",
            email: prof.Email || prev.email,
          }));
        }
      } catch {
        setSession(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!historyOpen || !session) return;
    async function loadInquiries() {
      setHistoryLoading(true);
      try {
        const list = await listMyInquiryThreads();
        setInquiries(list);
        setExpandedInquiry(null);
        setThreadData(null);
      } catch {
        setInquiries([]);
      } finally {
        setHistoryLoading(false);
      }
    }
    loadInquiries();
  }, [historyOpen, session]);

  async function handleExpandInquiry(inquiryId) {
    if (expandedInquiry === inquiryId) {
      setExpandedInquiry(null);
      setThreadData(null);
      return;
    }
    try {
      const data = await getInquiryThread(inquiryId);
      setExpandedInquiry(inquiryId);
      setThreadData(data);
    } catch {
      setThreadData(null);
    }
  }

  function formatDate(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!session) {
      setError("Please log in to submit an inquiry.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const typeLabel = INQUIRY_TYPES.find((t) => t.value === formData.inquiry)?.label || formData.inquiry;
      const subject = `${typeLabel} – ${formData.fullname}`.slice(0, 120);
      const body = formData.message;
      await createInquiryWithMessage({ subject, body });
      setToast("Message sent! We'll get back to you soon.");
      setFormData((prev) => ({ ...prev, message: "" }));
      setTimeout(() => setToast(""), 3500);
    } catch (err) {
      setError(err?.message || "Failed to send message.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main style={{ padding: "3.5rem 6vw 5rem", textAlign: "center" }}>
        <p style={{ color: "var(--gray)" }}>Loading…</p>
      </main>
    );
  }

  return (
    <main
      style={{
        flex: 1,
        padding: "3.5rem 6vw 5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "3.5rem",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2.5rem, 6vw, 4rem)",
          color: "var(--red)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        Chick N&apos; Dip
      </h1>

      {!session && (
        <div
          style={{
            background: "var(--red-light)",
            border: "1px solid var(--red)",
            borderRadius: 12,
            padding: "1rem 1.5rem",
            maxWidth: 500,
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0, color: "var(--dark)" }}>
            You must be logged in to submit an inquiry. Please use the Sign up or Log in button in the navigation.
          </p>
        </div>
      )}

      {session && (
        <button
          type="button"
          onClick={() => setHistoryOpen(true)}
          style={{
            background: "transparent",
            color: "var(--red)",
            border: "2px solid var(--red)",
            padding: "0.6rem 1.25rem",
            borderRadius: 9999,
            fontFamily: "var(--font-heading)",
            fontSize: "0.85rem",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "background 0.2s, color 0.2s",
          }}
        >
          View chat history
        </button>
      )}

      <div
        className="contact-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "380px 1fr",
          gap: "4rem",
          width: "100%",
          maxWidth: 1000,
          alignContent: "start",
        }}
      >
        <section aria-labelledby="form-heading">
          <div
            style={{
              background: "white",
              borderRadius: 20,
              boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
              padding: "2.25rem 2rem 2rem",
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
                height: 4,
                background: "var(--red)",
              }}
            />
            <p
              id="form-heading"
              style={{
                fontFamily: "var(--font-body)",
                fontStyle: "italic",
                fontSize: "0.82rem",
                color: "var(--red)",
                letterSpacing: "0.1em",
                textAlign: "center",
                marginBottom: "1.75rem",
              }}
            >
              Send a message
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "1.25rem" }}>
                <label
                  htmlFor="fullname"
                  style={{
                    display: "block",
                    fontSize: "0.82rem",
                    fontWeight: 500,
                    color: "var(--dark)",
                    letterSpacing: "0.02em",
                    marginBottom: "0.45rem",
                  }}
                >
                  Full Name / Username
                </label>
                <input
                  id="fullname"
                  type="text"
                  value={formData.fullname}
                  onChange={(e) => setFormData((p) => ({ ...p, fullname: e.target.value }))}
                  required
                  autoComplete="name"
                  disabled={!session}
                  style={{
                    width: "100%",
                    border: "1.5px solid #E0DADA",
                    borderRadius: 8,
                    padding: "0.65rem 0.85rem",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.88rem",
                    color: "var(--dark)",
                    background: "white",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label
                  htmlFor="email"
                  style={{
                    display: "block",
                    fontSize: "0.82rem",
                    fontWeight: 500,
                    color: "var(--dark)",
                    letterSpacing: "0.02em",
                    marginBottom: "0.45rem",
                  }}
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  required
                  autoComplete="email"
                  disabled={!session}
                  style={{
                    width: "100%",
                    border: "1.5px solid #E0DADA",
                    borderRadius: 8,
                    padding: "0.65rem 0.85rem",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.88rem",
                    color: "var(--dark)",
                    background: "white",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label
                  htmlFor="inquiry"
                  style={{
                    display: "block",
                    fontSize: "0.82rem",
                    fontWeight: 500,
                    color: "var(--dark)",
                    letterSpacing: "0.02em",
                    marginBottom: "0.45rem",
                  }}
                >
                  Types of Inquiries
                </label>
                <select
                  id="inquiry"
                  value={formData.inquiry}
                  onChange={(e) => setFormData((p) => ({ ...p, inquiry: e.target.value }))}
                  required
                  disabled={!session}
                  style={{
                    width: "100%",
                    border: "1.5px solid #E0DADA",
                    borderRadius: 8,
                    padding: "0.65rem 0.85rem",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.88rem",
                    color: "var(--dark)",
                    background: "white",
                    outline: "none",
                  }}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  {INQUIRY_TYPES.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  htmlFor="message"
                  style={{
                    display: "block",
                    fontSize: "0.82rem",
                    fontWeight: 500,
                    color: "var(--dark)",
                    letterSpacing: "0.02em",
                    marginBottom: "0.45rem",
                  }}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                  rows={5}
                  required
                  disabled={!session}
                  style={{
                    width: "100%",
                    border: "1.5px solid #E0DADA",
                    borderRadius: 8,
                    padding: "0.65rem 0.85rem",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.88rem",
                    color: "var(--dark)",
                    background: "white",
                    outline: "none",
                    resize: "vertical",
                    minHeight: 110,
                  }}
                />
              </div>

              {error && <p style={{ color: "var(--red)", fontSize: "0.85rem", marginBottom: "1rem" }}>{error}</p>}

              <button
                type="submit"
                disabled={!session || submitting}
                style={{
                  width: "100%",
                  background: "var(--red)",
                  color: "white",
                  border: "none",
                  padding: "0.9rem",
                  borderRadius: 8,
                  fontFamily: "var(--font-heading)",
                  fontSize: "0.95rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: session && !submitting ? "pointer" : "not-allowed",
                  opacity: session && !submitting ? 1 : 0.6,
                  boxShadow: "0 4px 16px rgba(212,26,26,0.25)",
                }}
              >
                {submitting ? "Sending…" : "Send"}
              </button>
            </form>
          </div>
        </section>

        <section aria-labelledby="faq-heading" style={{ display: "flex", flexDirection: "column" }}>
          <p
            id="faq-heading"
            style={{
              fontFamily: "var(--font-body)",
              fontStyle: "italic",
              fontSize: "0.82rem",
              color: "var(--red)",
              letterSpacing: "0.1em",
              marginBottom: "1.75rem",
            }}
          >
            Frequently Asked Questions
          </p>

          <ul style={{ listStyle: "none", padding: 0, margin: 0, borderTop: "1px solid var(--gray-light)" }}>
            {FAQ_ITEMS.map(({ q, a }, i) => (
              <li
                key={i}
                style={{
                  borderBottom: "1px solid var(--gray-light)",
                  overflow: "hidden",
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    padding: "1.1rem 0.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    textAlign: "left",
                    gap: "1rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 500,
                      fontSize: "0.92rem",
                      color: openFaq === i ? "var(--red)" : "var(--dark)",
                      lineHeight: 1.4,
                    }}
                  >
                    {q}
                  </span>
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      flexShrink: 0,
                      border: "1.5px solid #DDD",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: openFaq === i ? "var(--red)" : "transparent",
                      borderColor: openFaq === i ? "var(--red)" : "#DDD",
                    }}
                  >
                    <svg
                      width={10}
                      height={10}
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke={openFaq === i ? "white" : "#999"}
                      strokeWidth={2}
                      style={{ transform: openFaq === i ? "rotate(45deg)" : "none" }}
                    >
                      <line x1="6" y1="1" x2="6" y2="11" />
                      <line x1="1" y1="6" x2="11" y2="6" />
                    </svg>
                  </span>
                </button>
                <div
                  style={{
                    maxHeight: openFaq === i ? 300 : 0,
                    overflow: "hidden",
                    transition: "max-height 0.38s ease",
                    padding: openFaq === i ? "0 0.25rem 1.1rem" : "0 0.25rem",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.88rem",
                      color: "#6B6260",
                      lineHeight: 1.7,
                    }}
                  >
                    {a}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Chat history modal */}
      {historyOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="history-title"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(4px)",
          }}
          onClick={(e) => e.target === e.currentTarget && setHistoryOpen(false)}
        >
          <div
            style={{
              background: "white",
              borderRadius: 20,
              boxShadow: "0 24px 64px rgba(0,0,0,0.15)",
              maxWidth: 520,
              width: "90%",
              maxHeight: "80vh",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "1.5rem 1.75rem",
                borderBottom: "1px solid var(--gray-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h2
                id="history-title"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.25rem",
                  color: "var(--dark)",
                  margin: 0,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Your inquiries
              </h2>
              <button
                type="button"
                onClick={() => setHistoryOpen(false)}
                aria-label="Close"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                  color: "var(--gray)",
                }}
              >
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div style={{ overflowY: "auto", flex: 1, padding: "1rem 1.75rem" }}>
              {historyLoading ? (
                <p style={{ color: "var(--gray)", textAlign: "center", padding: "2rem 0" }}>Loading…</p>
              ) : inquiries.length === 0 ? (
                <p style={{ color: "var(--gray)", textAlign: "center", padding: "2rem 0" }}>No inquiries yet.</p>
              ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {inquiries.map((inq) => (
                    <li
                      key={inq.id}
                      style={{
                        borderBottom: "1px solid var(--gray-light)",
                        padding: "1rem 0",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleExpandInquiry(inq.id)}
                        style={{
                          width: "100%",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          textAlign: "left",
                          padding: 0,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: "0.75rem",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "var(--font-body)",
                              fontWeight: 500,
                              fontSize: "0.95rem",
                              color: "var(--dark)",
                              flex: 1,
                            }}
                          >
                            {inq.subject}
                          </span>
                          <span
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--gray)",
                              flexShrink: 0,
                            }}
                          >
                            {formatDate(inq.updated_at)}
                          </span>
                        </div>
                        <span
                          style={{
                            display: "inline-block",
                            marginTop: "0.35rem",
                            fontSize: "0.72rem",
                            color: inq.status === "closed" ? "var(--gray)" : "var(--red)",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {inq.status}
                        </span>
                      </button>
                      {expandedInquiry === inq.id && threadData?.messages && (
                        <div
                          style={{
                            marginTop: "1rem",
                            padding: "1rem",
                            background: "var(--off-white)",
                            borderRadius: 12,
                            maxHeight: 240,
                            overflowY: "auto",
                          }}
                        >
                          {threadData.messages.map((msg) => (
                            <div
                              key={msg.id}
                              style={{
                                marginBottom: "0.75rem",
                                paddingBottom: "0.75rem",
                                borderBottom: "1px solid rgba(0,0,0,0.06)",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "0.7rem",
                                  color: "var(--gray)",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.05em",
                                }}
                              >
                                {msg.sender_type === "admin" ? "Support" : "You"} · {formatDate(msg.created_at)}
                              </span>
                              <p
                                style={{
                                  margin: "0.35rem 0 0",
                                  fontSize: "0.88rem",
                                  color: "var(--dark)",
                                  lineHeight: 1.5,
                                  whiteSpace: "pre-wrap",
                                }}
                              >
                                {msg.body}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--dark)",
            color: "white",
            padding: "0.85rem 1.5rem",
            borderRadius: 12,
            fontSize: "0.88rem",
            fontWeight: 500,
            letterSpacing: "0.03em",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              background: "#4ADE80",
              borderRadius: "50%",
              flexShrink: 0,
            }}
          />
          {toast}
        </div>
      )}
    </main>
  );
}
