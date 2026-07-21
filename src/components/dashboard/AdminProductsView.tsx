"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Link as LinkIcon,
  X,
  Search,
  Package,
  Sparkles,
  ExternalLink,
  Tag,
  DollarSign,
  Layers,
} from "lucide-react";
import {
  useGetAllProductsAdminQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useTogglePublishMutation,
  useDeleteProductMutation,
} from "@/redux/features/productApi";

interface ProductFormData {
  title: string;
  description: string;
  price: string;
  thumbnail: string;
}

const emptyForm: ProductFormData = { title: "", description: "", price: "", thumbnail: "" };

export default function AdminProductsView() {
  const router = useRouter();
  const { data, isLoading, refetch } = useGetAllProductsAdminQuery(undefined);
  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
  const [togglePublish] = useTogglePublishMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const products = data?.data || [];

  const filteredProducts = products.filter(
    (p: any) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
  );

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  };

  const openEdit = (p: any) => {
    setEditId(p.id);
    setForm({
      title: p.title,
      description: p.description || "",
      price: String(p.price),
      thumbnail: p.thumbnail || "",
    });
    setError("");
    setShowForm(true);
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.title.trim()) return setError("Title is required");
    if (!form.price || parseFloat(form.price) <= 0) return setError("Valid price is required");

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      price: parseFloat(form.price),
      thumbnail: form.thumbnail.trim() || undefined,
    };

    try {
      if (editId) {
        await updateProduct({ id: editId, ...payload }).unwrap();
      } else {
        await createProduct(payload).unwrap();
      }
      setShowForm(false);
      refetch();
    } catch (err: any) {
      setError(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={{ maxWidth: 1140, display: "flex", flexDirection: "column", gap: 24 }}>
      {/* ── Page Header ── */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: "linear-gradient(135deg, #5a5fef, #4338ca)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 16px rgba(90,95,239,0.3)",
              color: "white",
            }}>
              <Package size={20} />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: "var(--foreground)", letterSpacing: "-0.03em" }}>
              Products Management
            </h2>
          </div>
          <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>
            Create, edit, and organize digital product inventory ({products.length} total products)
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={openCreate}
          style={{ padding: "11px 22px", borderRadius: 14 }}
        >
          <Plus size={16} /> Add New Product
        </button>
      </div>

      {/* ── Filter & Search Bar ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "8px 12px",
        background: "var(--card)",
        border: "1.5px solid var(--card-border)",
        borderRadius: 18,
        boxShadow: "var(--shadow-xs)",
      }}>
        <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center" }}>
          <Search size={16} style={{ position: "absolute", left: 14, color: "var(--muted-light)" }} />
          <input
            type="text"
            placeholder="Search products by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px 10px 40px",
              background: "var(--muted-bg)",
              border: "1px solid var(--card-border)",
              borderRadius: 14,
              fontSize: 13,
              color: "var(--foreground)",
              outline: "none",
              fontFamily: "inherit",
              transition: "border-color 0.2s",
            }}
          />
        </div>
      </div>

      {/* ── Product List ── */}
      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: 88, borderRadius: 20 }} />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="card" style={{ padding: "56px 24px", textAlign: "center" }}>
          <Package size={46} style={{ color: "var(--muted-light)", margin: "0 auto 14px" }} />
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--foreground)", marginBottom: 4 }}>
            No products found
          </h3>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 18 }}>
            Try adjusting your search query or add a new product.
          </p>
          <button className="btn btn-primary btn-sm" onClick={openCreate}>
            <Plus size={14} /> Add Product
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filteredProducts.map((p: any) => (
            <div
              key={p.id}
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                background: "var(--card)",
                border: "1.5px solid var(--card-border)",
                borderRadius: 20,
                boxShadow: "var(--shadow-xs)",
                gap: 16,
                transition: "all 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              className="stat-card-hover"
            >
              {/* Product Info */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0, flex: "1 1 300px" }}>
                {/* Thumbnail */}
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: "linear-gradient(135deg, rgba(90,95,239,0.12), rgba(124,58,237,0.12))",
                  border: "1px solid rgba(90,95,239,0.2)",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  fontWeight: 800,
                  color: "var(--primary)",
                  flexShrink: 0,
                }}>
                  {p.thumbnail ? (
                    <img src={p.thumbnail} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    p.title?.[0]?.toUpperCase() || "P"
                  )}
                </div>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                    <h3 style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: "var(--foreground)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      margin: 0,
                      letterSpacing: "-0.01em",
                    }}>
                      {p.title}
                    </h3>

                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "2px 9px",
                      borderRadius: 999,
                      fontSize: 10.5,
                      fontWeight: 800,
                      background: p.isPublished ? "rgba(16,185,129,0.1)" : "var(--muted-bg)",
                      color: p.isPublished ? "#059669" : "var(--muted)",
                      border: p.isPublished ? "1px solid rgba(16,185,129,0.2)" : "1px solid var(--card-border)",
                    }}>
                      {p.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, fontSize: 12, color: "var(--muted)" }}>
                    <span style={{ fontWeight: 800, color: "var(--primary)" }}>
                      ৳{p.price} <span style={{ fontWeight: 500, fontSize: 11 }}>/ link</span>
                    </span>
                    <span style={{ color: "var(--card-border)" }}>•</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <LinkIcon size={12} /> {p.totalLinks ?? 0} links in stock
                    </span>
                    <span style={{ color: "var(--card-border)" }}>•</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <Layers size={12} /> {p.totalOrders ?? 0} orders
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                {/* Inventory Links */}
                <button
                  onClick={() => router.push(`/dashboard/products/${p.id}/links`)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 14px",
                    borderRadius: 11,
                    background: "rgba(90,95,239,0.08)",
                    color: "var(--primary)",
                    border: "1px solid rgba(90,95,239,0.18)",
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.18s",
                    fontFamily: "inherit",
                  }}
                  title="Manage inventory links"
                >
                  <LinkIcon size={13} />
                  <span>Manage Links</span>
                </button>

                {/* Publish Toggle */}
                <button
                  onClick={async () => { await togglePublish(p.id); refetch(); }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 36,
                    height: 36,
                    borderRadius: 11,
                    background: p.isPublished ? "rgba(245,158,11,0.08)" : "rgba(16,185,129,0.08)",
                    color: p.isPublished ? "#d97706" : "#059669",
                    border: p.isPublished ? "1px solid rgba(245,158,11,0.2)" : "1px solid rgba(16,185,129,0.2)",
                    cursor: "pointer",
                    transition: "all 0.18s",
                  }}
                  title={p.isPublished ? "Unpublish Product" : "Publish Product"}
                >
                  {p.isPublished ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>

                {/* Edit */}
                <button
                  onClick={() => openEdit(p)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 36,
                    height: 36,
                    borderRadius: 11,
                    background: "var(--muted-bg)",
                    color: "var(--foreground)",
                    border: "1px solid var(--card-border)",
                    cursor: "pointer",
                    transition: "all 0.18s",
                  }}
                  title="Edit product"
                >
                  <Edit3 size={15} />
                </button>

                {/* Delete */}
                <button
                  onClick={async () => {
                    if (confirm("Are you sure you want to delete this product?")) {
                      await deleteProduct(p.id);
                      refetch();
                    }
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 36,
                    height: 36,
                    borderRadius: 11,
                    background: "rgba(239,68,68,0.08)",
                    color: "#ef4444",
                    border: "1px solid rgba(239,68,68,0.2)",
                    cursor: "pointer",
                    transition: "all 0.18s",
                  }}
                  title="Delete product"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Product Create / Edit Modal ── */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: 16,
              marginBottom: 20,
              borderBottom: "1px solid var(--card-border)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #5a5fef, #7c3aed)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}>
                  <Sparkles size={16} />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: "var(--foreground)", margin: 0 }}>
                  {editId ? "Edit Product Details" : "Create New Product"}
                </h3>
              </div>

              <button
                onClick={() => setShowForm(false)}
                style={{
                  background: "var(--muted-bg)",
                  border: "none",
                  borderRadius: 999,
                  width: 30,
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "var(--muted)",
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Form Inputs */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label className="label">Product Title *</label>
                <input
                  className="input"
                  placeholder="e.g. Google One 2TB Pro Offer Link"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                />
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  className="input"
                  style={{ minHeight: 90, resize: "vertical" }}
                  placeholder="Short summary of offer details, duration, region restrictions..."
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
                <div>
                  <label className="label">Price per Link (৳) *</label>
                  <input
                    className="input"
                    type="number"
                    placeholder="150"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="label">Thumbnail Image URL</label>
                  <input
                    className="input"
                    placeholder="https://..."
                    value={form.thumbnail}
                    onChange={(e) => setForm((f) => ({ ...f, thumbnail: e.target.value }))}
                  />
                </div>
              </div>

              {form.thumbnail && (
                <div style={{
                  padding: 12,
                  borderRadius: 14,
                  background: "var(--muted-bg)",
                  border: "1px solid var(--card-border)",
                  textAlign: "center",
                }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", marginBottom: 6 }}>
                    Thumbnail Preview
                  </p>
                  <img
                    src={form.thumbnail}
                    alt="Preview"
                    style={{ maxHeight: 90, maxWidth: "100%", objectFit: "contain", borderRadius: 8, margin: "0 auto" }}
                  />
                </div>
              )}

              {error && (
                <div style={{
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: "var(--danger-bg)",
                  color: "var(--danger)",
                  fontSize: 12.5,
                  fontWeight: 700,
                  border: "1px solid rgba(239,68,68,0.2)",
                }}>
                  {error}
                </div>
              )}

              <div style={{ paddingTop: 8 }}>
                <button
                  className="btn btn-primary btn-full"
                  onClick={handleSubmit}
                  disabled={creating || updating}
                  style={{ height: 46, borderRadius: 14 }}
                >
                  {(creating || updating) && <span className="spinner" />}
                  {editId ? "Update Product" : "Create Product"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
