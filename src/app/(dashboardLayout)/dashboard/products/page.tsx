"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Eye, EyeOff, Link as LinkIcon, X } from "lucide-react";
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

export default function AdminProductsPage() {
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

  const products = data?.data || [];

  const openCreate = () => { setEditId(null); setForm(emptyForm); setError(""); setShowForm(true); };
  const openEdit = (p: any) => {
    setEditId(p.id);
    setForm({ title: p.title, description: p.description || "", price: String(p.price), thumbnail: p.thumbnail || "" });
    setError(""); setShowForm(true);
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
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800 }}>Products</h2>
          <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>
            {products.length} product{products.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openCreate}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Product list */}
      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 16 }} />)}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {products.map((p: any) => (
            <div key={p.id} className="card" style={{ padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {/* Thumbnail */}
                <div style={{
                  width: 52, height: 52, borderRadius: 12, flexShrink: 0, overflow: "hidden",
                  background: "linear-gradient(135deg, #4f46e5, #7c3aed)"
                }}>
                  {p.thumbnail && <img src={p.thumbnail} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <h3 style={{ fontWeight: 700, fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</h3>
                    <span style={{
                      padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 700,
                      background: p.isPublished ? "#d1fae5" : "var(--muted-bg)",
                      color: p.isPublished ? "#059669" : "var(--muted)", flexShrink: 0
                    }}>
                      {p.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--muted)" }}>
                    <span>৳{p.price}/link</span>
                    <span>{p.totalLinks} links</span>
                    <span>{p.totalOrders} orders</span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                  <button
                    title="Manage Links"
                    onClick={() => router.push(`/dashboard/products/${p.id}/links`)}
                    style={{ padding: "7px", borderRadius: 8, border: "none", cursor: "pointer", background: "#6366f120", color: "#6366f1" }}
                  >
                    <LinkIcon size={15} />
                  </button>
                  <button
                    title={p.isPublished ? "Unpublish" : "Publish"}
                    onClick={async () => { await togglePublish(p.id); refetch(); }}
                    style={{ padding: "7px", borderRadius: 8, border: "none", cursor: "pointer", background: p.isPublished ? "#f59e0b20" : "#10b98120", color: p.isPublished ? "#f59e0b" : "#10b981" }}
                  >
                    {p.isPublished ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  <button
                    title="Edit"
                    onClick={() => openEdit(p)}
                    style={{ padding: "7px", borderRadius: 8, border: "none", cursor: "pointer", background: "var(--muted-bg)", color: "var(--muted)" }}
                  >
                    <Edit size={15} />
                  </button>
                  <button
                    title="Delete"
                    onClick={async () => { if (confirm("Delete this product?")) { await deleteProduct(p.id); refetch(); } }}
                    style={{ padding: "7px", borderRadius: 8, border: "none", cursor: "pointer", background: "#fee2e2", color: "#ef4444" }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800 }}>{editId ? "Edit Product" : "Add Product"}</h3>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label className="label">Title *</label>
              <input className="input" placeholder="Google One Pro — 100GB" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label className="label">Description</label>
              <textarea className="input" rows={3} placeholder="Short description..." value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                style={{ resize: "vertical", fontFamily: "inherit" }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label className="label">Price per Link (৳) *</label>
              <input className="input" type="number" placeholder="150" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label className="label">Thumbnail URL</label>
              <input className="input" placeholder="https://..." value={form.thumbnail} onChange={e => setForm(f => ({ ...f, thumbnail: e.target.value }))} />
            </div>

            {error && <div style={{ background: "#fee2e2", color: "#991b1b", padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 16 }}>{error}</div>}

            <button className="btn btn-primary btn-full" onClick={handleSubmit} disabled={creating || updating}>
              {(creating || updating) && <span className="spinner" />}
              {editId ? "Update Product" : "Create Product"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
