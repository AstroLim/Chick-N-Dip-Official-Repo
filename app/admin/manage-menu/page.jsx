"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getAdminMenu,
  listAllSectionsAdmin,
  createItem,
  updateItem,
  deleteMenuItem,
  appendItemToSection,
  uploadMenuImage,
  NO_IMAGE_URL,
} from "@/backend/services/menu.service";

const PLACEHOLDER = "https://placehold.co/48x48/F0EDEB/9B9390?text=?";

const thStyle = {
  background: "var(--off-white)",
  padding: "0.85rem 1.25rem",
  textAlign: "left",
  fontFamily: "var(--font-heading)",
  fontSize: "0.68rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "var(--gray)",
  borderBottom: "1px solid var(--gray-light)",
};

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
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
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "white",
          borderRadius: 16,
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          maxWidth: 480,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
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
          <h2 id="modal-title" style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "var(--dark)" }}>
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              color: "var(--gray)",
              display: "flex",
            }}
          >
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div style={{ padding: "1.5rem" }}>{children}</div>
      </div>
    </div>
  );
}

export default function ManageMenuPage() {
  const [data, setData] = useState({ sections: [], unassignedItems: [] });
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const loadData = useCallback(async () => {
    try {
      const [d, secs] = await Promise.all([getAdminMenu(), listAllSectionsAdmin()]);
      setData(d || { sections: [], unassignedItems: [] });
      setSections(secs || []);
      setError("");
    } catch (e) {
      setError(e?.message || "Failed to load menu.");
      setData({ sections: [], unassignedItems: [] });
      setSections([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Dedupe items by id (item can appear in multiple sections)
  const byId = new Map();
  for (const s of data.sections || []) {
    for (const it of s.items || []) {
      if (!byId.has(it.id)) {
        byId.set(it.id, { ...it, sectionName: s.section?.Name });
      } else {
        const ex = byId.get(it.id);
        ex.sectionName = ex.sectionName ? `${ex.sectionName}, ${s.section?.Name}` : s.section?.Name;
      }
    }
  }
  for (const it of data.unassignedItems || []) {
    if (!byId.has(it.id)) byId.set(it.id, { ...it, sectionName: "Unassigned" });
  }
  const allItems = Array.from(byId.values());

  const handleAdd = async (form) => {
    setFormError("");
    setSubmitting(true);
    try {
      const item = await createItem({
        Name: form.name.trim(),
        Price: parseFloat(form.price) || 0,
        Description: form.description?.trim() || null,
        Availability: form.availability !== false,
      });
      if (form.sectionId) {
        await appendItemToSection(form.sectionId, item.id);
      }
      if (form.imageFile) {
        const sectionIdForPath = form.sectionId || "items";
        const fileToUpload = await compressImage(form.imageFile);
        const { path } = await uploadMenuImage(fileToUpload, {
          sectionId: sectionIdForPath,
          itemId: item.id,
        });
        await updateItem(item.id, { ImagePath: path });
      }
      setAddModalOpen(false);
      await loadData();
    } catch (e) {
      setFormError(e?.message || "Failed to add item.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (form) => {
    if (!editingItem) return;
    setFormError("");
    setSubmitting(true);
    try {
      await updateItem(editingItem.id, {
        Name: form.name.trim(),
        Price: parseFloat(form.price) || 0,
        Description: form.description?.trim() || null,
        Availability: form.availability !== false,
      });
      setEditModalOpen(false);
      setEditingItem(null);
      await loadData();
    } catch (e) {
      setFormError(e?.message || "Failed to update item.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item) => {
    setSubmitting(true);
    try {
      await deleteMenuItem(item.id);
      setDeleteConfirm(null);
      await loadData();
    } catch (e) {
      setFormError(e?.message || "Failed to delete item.");
    } finally {
      setSubmitting(false);
    }
  };

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
            <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" />
            <path d="M12 8v4l3 3" />
          </svg>
          <span style={{ color: "var(--gray-light)" }}>›</span>
          <strong style={{ color: "var(--dark)" }}>Menu Manager</strong>
        </div>
      </header>

      <div style={{ padding: "2.5rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.75rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
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
            Menu Manager
          </h1>
          <button
            type="button"
            onClick={() => setAddModalOpen(true)}
            style={{
              background: "var(--red)",
              color: "white",
              border: "none",
              padding: "0.6rem 1.25rem",
              borderRadius: 10,
              fontFamily: "var(--font-heading)",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Menu Item
          </button>
        </div>

        {loading ? (
          <p style={{ color: "var(--gray)" }}>Loading…</p>
        ) : error ? (
          <p style={{ color: "var(--red)" }}>{error}</p>
        ) : (
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
                padding: "1rem 1.5rem",
                borderBottom: "1px solid var(--gray-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: "0.8rem", color: "var(--gray)" }}>
                Showing <strong style={{ color: "var(--dark)" }}>{allItems.length}</strong> items
              </span>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }} aria-label="Menu items">
              <thead>
                <tr>
                  <th style={thStyle}>Item</th>
                  <th style={thStyle}>Category</th>
                  <th style={thStyle}>Price</th>
                  <th style={thStyle}>Status</th>
                  <th style={{ ...thStyle, width: 100 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        textAlign: "center",
                        padding: "2.5rem",
                        color: "var(--gray)",
                        fontSize: "0.875rem",
                      }}
                    >
                      No items found.
                    </td>
                  </tr>
                ) : (
                  allItems.map((it) => (
                    <tr key={it.id} style={{ transition: "background 0.15s" }}>
                      <td style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--gray-light)", verticalAlign: "middle" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                          <img
                            src={it.ImageUrl || NO_IMAGE_URL || PLACEHOLDER}
                            alt={it.Name}
                            style={{
                              width: 48,
                              height: 48,
                              borderRadius: 10,
                              objectFit: "cover",
                              background: "var(--gray-light)",
                            }}
                            onError={(e) => {
                              e.currentTarget.src = PLACEHOLDER;
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--dark)" }}>{it.Name}</div>
                            {it.Description && (
                              <div
                                style={{
                                  fontSize: "0.75rem",
                                  color: "var(--gray)",
                                  marginTop: 2,
                                  maxWidth: 220,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {it.Description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--gray-light)" }}>
                        <span
                          style={{
                            display: "inline-block",
                            fontFamily: "var(--font-heading)",
                            fontSize: "0.62rem",
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            padding: "0.2rem 0.6rem",
                            borderRadius: 9999,
                            background: "var(--gray-light)",
                            color: "var(--gray)",
                          }}
                        >
                          {it.sectionName || "—"}
                        </span>
                      </td>
                      <td style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--gray-light)" }}>
                        <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.9rem", color: "var(--red)" }}>
                          ₱{Number(it.Price ?? 0).toFixed(2)}
                        </span>
                      </td>
                      <td style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--gray-light)" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            fontSize: "0.78rem",
                            fontWeight: 500,
                            color: it.Availability !== false ? "#16A34A" : "var(--gray)",
                          }}
                        >
                          <span
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              background: "currentColor",
                              display: "inline-block",
                            }}
                          />
                          {it.Availability !== false ? "Available" : "Unavailable"}
                        </span>
                      </td>
                      <td style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--gray-light)" }}>
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingItem(it);
                              setEditModalOpen(true);
                            }}
                            aria-label={`Edit ${it.Name}`}
                            style={{
                              background: "var(--off-white)",
                              border: "1px solid var(--gray-light)",
                              padding: "0.4rem 0.75rem",
                              borderRadius: 8,
                              fontSize: "0.75rem",
                              fontWeight: 500,
                              cursor: "pointer",
                              color: "var(--dark)",
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirm(it)}
                            aria-label={`Delete ${it.Name}`}
                            style={{
                              background: "none",
                              border: "1px solid var(--red)",
                              padding: "0.4rem 0.75rem",
                              borderRadius: 8,
                              fontSize: "0.75rem",
                              fontWeight: 500,
                              cursor: "pointer",
                              color: "var(--red)",
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        sections={sections}
        onSubmit={handleAdd}
        submitting={submitting}
        formError={formError}
        onCloseError={() => setFormError("")}
      />
      <EditModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingItem(null);
        }}
        item={editingItem}
        onSubmit={handleEdit}
        submitting={submitting}
        formError={formError}
        onCloseError={() => setFormError("")}
      />
      <DeleteConfirmModal
        item={deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        submitting={submitting}
      />
    </>
  );
}

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_IMAGE_SIZE = 800 * 1024; // 800KB - stays under typical Supabase limits
const MAX_DIMENSION = 1200;

async function compressImage(file) {
  if (file.size <= MAX_IMAGE_SIZE) return file;
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let w = img.width;
      let h = img.height;
      if (w > MAX_DIMENSION || h > MAX_DIMENSION) {
        if (w > h) {
          h = Math.round((h * MAX_DIMENSION) / w);
          w = MAX_DIMENSION;
        } else {
          w = Math.round((w * MAX_DIMENSION) / h);
          h = MAX_DIMENSION;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: "image/jpeg" }));
          } else {
            resolve(file);
          }
        },
        "image/jpeg",
        0.85
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    img.src = url;
  });
}

function AddModal({ open, onClose, sections, onSubmit, submitting, formError, onCloseError }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [availability, setAvailability] = useState(true);
  const [sectionId, setSectionId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [localError, setLocalError] = useState("");

  const reset = () => {
    setName("");
    setPrice("");
    setDescription("");
    setAvailability(true);
    setSectionId("");
    setImageFile(null);
    setImagePreview(null);
    setLocalError("");
    onCloseError();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setLocalError("Please use a valid image (JPEG, PNG, WebP, or GIF).");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      onCloseError();
      return;
    }
    onSubmit({ name, price, description, availability, sectionId: sectionId || null, imageFile });
  };

  if (!open) return null;
  const displayError = formError || localError;
  return (
    <Modal open={open} onClose={handleClose} title="Add Menu Item">
      <form onSubmit={handleSubmit}>
        {displayError && (
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
            {displayError}
          </div>
        )}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.4rem", color: "var(--dark)" }}>
            Image
          </label>
          <p style={{ fontSize: "0.72rem", color: "var(--gray)", marginBottom: "0.5rem" }}>
            Large images are automatically resized to fit storage limits.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            {imagePreview ? (
              <div style={{ position: "relative" }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 10,
                    border: "1px solid var(--gray-light)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  aria-label="Remove image"
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "var(--red)",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>
            ) : null}
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                background: "var(--off-white)",
                border: "1px dashed var(--gray-light)",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: "0.85rem",
                color: "var(--dark)",
              }}
            >
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              {imageFile ? "Change image" : "Upload image"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>
          </div>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.4rem", color: "var(--dark)" }}>
            Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.6rem 0.75rem",
              border: "1px solid var(--gray-light)",
              borderRadius: 8,
              fontSize: "0.9rem",
            }}
            placeholder="e.g. Classic Burger"
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.4rem", color: "var(--dark)" }}>
            Price (₱) *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.6rem 0.75rem",
              border: "1px solid var(--gray-light)",
              borderRadius: 8,
              fontSize: "0.9rem",
            }}
            placeholder="0.00"
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.4rem", color: "var(--dark)" }}>
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{
              width: "100%",
              padding: "0.6rem 0.75rem",
              border: "1px solid var(--gray-light)",
              borderRadius: 8,
              fontSize: "0.9rem",
              resize: "vertical",
            }}
            placeholder="Optional description"
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.4rem", color: "var(--dark)" }}>
            Category
          </label>
          <select
            value={sectionId}
            onChange={(e) => setSectionId(e.target.value)}
            style={{
              width: "100%",
              padding: "0.6rem 0.75rem",
              border: "1px solid var(--gray-light)",
              borderRadius: 8,
              fontSize: "0.9rem",
            }}
          >
            <option value="">Unassigned</option>
            {sections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.Name || "Unnamed"}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="checkbox"
            id="add-available"
            checked={availability}
            onChange={(e) => setAvailability(e.target.checked)}
          />
          <label htmlFor="add-available" style={{ fontSize: "0.85rem", color: "var(--dark)" }}>
            Available
          </label>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button type="button" onClick={handleClose} style={{ padding: "0.6rem 1.25rem", borderRadius: 8, border: "1px solid var(--gray-light)", background: "white", cursor: "pointer", fontSize: "0.85rem" }}>
            Cancel
          </button>
          <button type="submit" disabled={submitting} style={{ padding: "0.6rem 1.25rem", borderRadius: 8, border: "none", background: "var(--red)", color: "white", cursor: submitting ? "not-allowed" : "pointer", fontSize: "0.85rem", fontWeight: 600 }}>
            {submitting ? "Adding…" : "Add Item"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function EditModal({ open, onClose, item, onSubmit, submitting, formError, onCloseError }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [availability, setAvailability] = useState(true);

  useEffect(() => {
    if (item) {
      setName(item.Name || "");
      setPrice(item.Price != null ? String(item.Price) : "");
      setDescription(item.Description || "");
      setAvailability(item.Availability !== false);
    }
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!item || !name.trim()) return;
    onSubmit({ name, price, description, availability });
  };

  if (!open || !item) return null;
  return (
    <Modal open={open} onClose={onClose} title="Edit Menu Item">
      <form onSubmit={handleSubmit}>
        {formError && (
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
            {formError}
          </div>
        )}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.4rem", color: "var(--dark)" }}>
            Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.6rem 0.75rem",
              border: "1px solid var(--gray-light)",
              borderRadius: 8,
              fontSize: "0.9rem",
            }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.4rem", color: "var(--dark)" }}>
            Price (₱) *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.6rem 0.75rem",
              border: "1px solid var(--gray-light)",
              borderRadius: 8,
              fontSize: "0.9rem",
            }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.4rem", color: "var(--dark)" }}>
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{
              width: "100%",
              padding: "0.6rem 0.75rem",
              border: "1px solid var(--gray-light)",
              borderRadius: 8,
              fontSize: "0.9rem",
              resize: "vertical",
            }}
          />
        </div>
        <div style={{ marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input type="checkbox" id="edit-available" checked={availability} onChange={(e) => setAvailability(e.target.checked)} />
          <label htmlFor="edit-available" style={{ fontSize: "0.85rem", color: "var(--dark)" }}>
            Available
          </label>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button type="button" onClick={onClose} style={{ padding: "0.6rem 1.25rem", borderRadius: 8, border: "1px solid var(--gray-light)", background: "white", cursor: "pointer", fontSize: "0.85rem" }}>
            Cancel
          </button>
          <button type="submit" disabled={submitting} style={{ padding: "0.6rem 1.25rem", borderRadius: 8, border: "none", background: "var(--red)", color: "white", cursor: submitting ? "not-allowed" : "pointer", fontSize: "0.85rem", fontWeight: 600 }}>
            {submitting ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function DeleteConfirmModal({ item, onClose, onConfirm, submitting }) {
  if (!item) return null;
  return (
    <Modal open={!!item} onClose={onClose} title="Delete Menu Item">
      <p style={{ marginBottom: "1.25rem", color: "var(--gray)", fontSize: "0.9rem" }}>
        Are you sure you want to delete <strong style={{ color: "var(--dark)" }}>{item.Name}</strong>? This cannot be undone.
      </p>
      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
        <button type="button" onClick={onClose} style={{ padding: "0.6rem 1.25rem", borderRadius: 8, border: "1px solid var(--gray-light)", background: "white", cursor: "pointer", fontSize: "0.85rem" }}>
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onConfirm(item)}
          disabled={submitting}
          style={{
            padding: "0.6rem 1.25rem",
            borderRadius: 8,
            border: "none",
            background: "var(--red)",
            color: "white",
            cursor: submitting ? "not-allowed" : "pointer",
            fontSize: "0.85rem",
            fontWeight: 600,
          }}
        >
          {submitting ? "Deleting…" : "Delete"}
        </button>
      </div>
    </Modal>
  );
}
