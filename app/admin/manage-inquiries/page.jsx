"use client";

import { useEffect, useState, useCallback } from "react";
import {
  listAllInquiryThreadsAdmin,
  getInquiryThread,
  replyToInquiryAsAdmin,
  adminSoftDeleteInquiry,
} from "@/backend/services/inquiry.service";

export default function ManageInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [replying, setReplying] = useState(false);
  const [replyError, setReplyError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadInquiries = useCallback(async () => {
    try {
      const data = await listAllInquiryThreadsAdmin();
      setInquiries(data || []);
      setError("");
    } catch (e) {
      setError(e?.message || "Failed to load inquiries.");
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInquiries();
  }, [loadInquiries]);

  useEffect(() => {
    if (!selected) {
      setThread(null);
      setReplyBody("");
      setReplyError("");
      return;
    }
    let cancelled = false;
    getInquiryThread(selected).then((t) => {
      if (!cancelled) setThread(t);
    });
    return () => { cancelled = true; };
  }, [selected]);

  async function handleReply() {
    if (!selected || !replyBody.trim()) return;
    setReplyError("");
    setReplying(true);
    try {
      await replyToInquiryAsAdmin({ inquiryId: selected, body: replyBody.trim() });
      try {
        const res = await fetch("/api/send-inquiry-reply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            inquiryId: selected,
            replyBody: replyBody.trim(),
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) setReplyError("Reply saved. Email could not be sent: " + (data?.error || res.statusText));
      } catch (emailErr) {
        setReplyError("Reply saved, but email could not be sent. " + (emailErr?.message || ""));
      }
      setReplyBody("");
      const t = await getInquiryThread(selected);
      setThread(t);
    } catch (e) {
      setReplyError(e?.message || "Failed to send reply.");
    } finally {
      setReplying(false);
    }
  }

  async function handleDelete(inquiryId) {
    setDeleting(true);
    try {
      await adminSoftDeleteInquiry(inquiryId);
      setDeleteConfirm(null);
      if (selected === inquiryId) setSelected(null);
      await loadInquiries();
    } catch (e) {
      setReplyError(e?.message || "Failed to delete inquiry.");
    } finally {
      setDeleting(false);
    }
  }

  function initials(str) {
    if (!str) return "??";
    return str
      .split(/[\s–\-_]+/)
      .filter(Boolean)
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
          boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--gray)" }}>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span style={{ color: "var(--gray-light)" }}>›</span>
          <strong style={{ color: "var(--dark)" }}>Inquiries</strong>
        </div>
      </header>

      <div style={{ padding: "2.5rem" }}>
        <div style={{ marginBottom: "1.75rem" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "2.5rem",
              color: "var(--dark)",
              textTransform: "uppercase",
              letterSpacing: "0.03em",
              lineHeight: 1,
            }}
          >
            Inquiries
          </h1>
        </div>

        {loading ? (
          <p style={{ color: "var(--gray)" }}>Loading…</p>
        ) : error ? (
          <p style={{ color: "var(--red)" }}>{error}</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "380px 1fr",
              gap: "1.5rem",
              alignItems: "start",
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
                  padding: "1rem 1.25rem",
                  borderBottom: "1px solid var(--gray-light)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "0.72rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--gray)",
                  }}
                >
                  Inbox
                </span>
                <span style={{ fontSize: "0.78rem", color: "var(--gray)" }}>
                  {inquiries.length} {inquiries.length === 1 ? "inquiry" : "inquiries"}
                </span>
              </div>
              <div>
                {inquiries.length === 0 ? (
                  <div style={{ padding: "2rem", textAlign: "center", color: "var(--gray)", fontSize: "0.85rem" }}>
                    No inquiries found.
                  </div>
                ) : (
                  inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      onClick={() => setSelected(inq.id)}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.85rem",
                        padding: "1rem 1.25rem",
                        borderBottom: "1px solid var(--gray-light)",
                        cursor: "pointer",
                        transition: "background 0.15s",
                        background: selected === inq.id ? "#FFF5F5" : "transparent",
                        borderLeft: selected === inq.id ? "3px solid var(--red)" : "3px solid transparent",
                      }}
                    >
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: "50%",
                          background: "var(--red-light)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "var(--font-heading)",
                          fontSize: "0.8rem",
                          color: "var(--red)",
                          flexShrink: 0,
                        }}
                      >
                        {initials(inq.subject)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--dark)" }}>
                          {inq.subject?.split("–")[1]?.trim() || inq.subject || "Inquiry"}
                        </div>
                        <div
                          style={{
                            fontSize: "0.72rem",
                            color: "var(--red)",
                            fontFamily: "var(--font-heading)",
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            marginTop: 1,
                          }}
                        >
                          {inq.subject?.split("–")[0]?.trim() || "General"}
                        </div>
                      </div>
                      <span
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: "0.6rem",
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          padding: "0.15rem 0.5rem",
                          borderRadius: 9999,
                          background: inq.status === "open" ? "#DCFCE7" : "var(--gray-light)",
                          color: inq.status === "open" ? "#15803D" : "var(--gray)",
                          flexShrink: 0,
                        }}
                      >
                        {inq.status || "open"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div
              style={{
                background: "white",
                borderRadius: 16,
                border: "1px solid var(--gray-light)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                minHeight: 300,
              }}
            >
              {!selected ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 300,
                    gap: "0.75rem",
                  }}
                >
                  <svg
                    width={48}
                    height={48}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--gray-light)"
                    strokeWidth={1.5}
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <p style={{ fontSize: "0.85rem", color: "var(--gray)" }}>Select an inquiry to view details</p>
                </div>
              ) : thread ? (
                <>
                  <div
                    style={{
                      padding: "1.25rem 1.5rem",
                      borderBottom: "1px solid var(--gray-light)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--dark)" }}>
                        {thread.inquiry?.subject}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--gray)", marginTop: 1 }}>
                        Status: {thread.inquiry?.status || "open"}
                        {thread.creator?.Email && (
                          <span style={{ marginLeft: "1rem" }}>• {thread.creator.Email}</span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(thread.inquiry)}
                      style={{
                        background: "none",
                        border: "1px solid var(--red)",
                        color: "var(--red)",
                        padding: "0.4rem 0.75rem",
                        borderRadius: 8,
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    >
                      Delete
                    </button>
                  </div>
                  <div style={{ padding: "1.5rem", flex: 1, overflowY: "auto" }}>
                    <div
                      style={{
                        fontSize: "0.68rem",
                        fontFamily: "var(--font-heading)",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--gray)",
                        marginBottom: "0.75rem",
                      }}
                    >
                      Messages
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                      }}
                    >
                      {(thread.messages || []).map((m) => (
                        <div
                          key={m.id}
                          style={{
                            fontSize: "0.9rem",
                            color: "var(--dark)",
                            lineHeight: 1.75,
                            background: "var(--off-white)",
                            borderRadius: 12,
                            padding: "1.25rem",
                          }}
                        >
                          <div style={{ fontSize: "0.72rem", color: "var(--gray)", marginBottom: "0.5rem" }}>
                            {m.sender_type} • {m.created_at ? new Date(m.created_at).toLocaleString() : ""}
                          </div>
                          {m.body}
                        </div>
                      ))}
                    </div>
                    {thread.inquiry?.status !== "closed" && (
                      <div style={{ marginTop: "1.5rem" }}>
                        {replyError && (
                          <div
                            style={{
                              background: "rgba(212,26,26,0.1)",
                              color: "var(--red)",
                              padding: "0.75rem",
                              borderRadius: 8,
                              marginBottom: "1rem",
                              fontSize: "0.85rem",
                            }}
                          >
                            {replyError}
                          </div>
                        )}
                        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.4rem", color: "var(--dark)" }}>
                          Reply
                        </label>
                        <textarea
                          value={replyBody}
                          onChange={(e) => setReplyBody(e.target.value)}
                          placeholder="Type your reply… (will be sent to the user's email)"
                          rows={4}
                          style={{
                            width: "100%",
                            padding: "0.75rem",
                            border: "1px solid var(--gray-light)",
                            borderRadius: 10,
                            fontSize: "0.9rem",
                            resize: "vertical",
                            fontFamily: "inherit",
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleReply}
                          disabled={replying || !replyBody.trim()}
                          style={{
                            marginTop: "0.75rem",
                            background: "var(--red)",
                            color: "white",
                            border: "none",
                            padding: "0.6rem 1.25rem",
                            borderRadius: 10,
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            cursor: replying || !replyBody.trim() ? "not-allowed" : "pointer",
                            opacity: replying || !replyBody.trim() ? 0.7 : 1,
                          }}
                        >
                          {replying ? "Sending…" : "Send Reply"}
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div style={{ padding: "2rem", textAlign: "center", color: "var(--gray)" }}>Loading thread…</div>
              )}
            </div>
          </div>
        )}

        {deleteConfirm && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.5)",
              padding: "1rem",
            }}
            onClick={(e) => e.target === e.currentTarget && setDeleteConfirm(null)}
          >
            <div
              style={{
                background: "white",
                borderRadius: 16,
                padding: "1.5rem",
                maxWidth: 400,
                width: "100%",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", marginBottom: "0.75rem" }}>
                Delete inquiry?
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--gray)", marginBottom: "1.25rem" }}>
                This will permanently remove &quot;{deleteConfirm.subject}&quot; from the inbox. This cannot be undone.
              </p>
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(null)}
                  style={{
                    padding: "0.6rem 1.25rem",
                    borderRadius: 8,
                    border: "1px solid var(--gray-light)",
                    background: "white",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(deleteConfirm.id)}
                  disabled={deleting}
                  style={{
                    padding: "0.6rem 1.25rem",
                    borderRadius: 8,
                    border: "none",
                    background: "var(--red)",
                    color: "white",
                    cursor: deleting ? "not-allowed" : "pointer",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  {deleting ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
