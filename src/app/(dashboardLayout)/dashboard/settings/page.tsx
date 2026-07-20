"use client";

import { useState } from "react";
import { Plus, Trash2, Edit, X, CreditCard } from "lucide-react";
import {
  useGetAllPaymentSettingsQuery,
  useCreatePaymentSettingMutation,
  useUpdatePaymentSettingMutation,
  useDeletePaymentSettingMutation,
} from "@/redux/features/paymentApi";

const emptyForm = { method: "bKash", number: "", qrImageUrl: "", isActive: true };

export default function PaymentSettingsPage() {
  const { data, isLoading, refetch } = useGetAllPaymentSettingsQuery(undefined);
  const [create, { isLoading: creating }] = useCreatePaymentSettingMutation();
  const [update, { isLoading: updating }] = useUpdatePaymentSettingMutation();
  const [remove] = useDeletePaymentSettingMutation();

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const settings = data?.data || [];

  const openCreate = () => { setEditId(null); setForm(emptyForm); setError(""); setShowForm(true); };
  const openEdit = (s: any) => {
    setEditId(s.id);
    setForm({ method: s.method, number: s.number, qrImageUrl: s.qrImageUrl || "", isActive: s.isActive });
    setError(""); setShowForm(true);
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.method.trim()) return setError("Method is required");
    if (!form.number.trim()) return setError("Number is required");

    const payload = {
      method: form.method.trim(),
      number: form.number.trim(),
      qrImageUrl: form.qrImageUrl.trim() || undefined,
      isActive: form.isActive,
    };

    try {
      if (editId) {
        await update({ id: editId, ...payload }).unwrap();
      } else {
        await create(payload).unwrap();
      }
      setShowForm(false);
      refetch();
    } catch (err: any) {
      setError(err?.data?.message || "Something went wrong");
    }
  };

  const methodColors: any = {
    bKash: { bg: "#e91e8c20", color: "#e91e8c" },
    Nagad: { bg: "#ff630220", color: "#ff6302" },
    Rocket: { bg: "#8b4cf620", color: "#8b4cf6" },
    BANK: { bg: "#0ea5e920", color: "#0ea5e9" },
  };

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800 }}>💳 Payment Settings</h2>
          <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>
            Manage payment methods shown to customers at checkout
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openCreate}>
          <Plus size={14} /> Add Method
        </button>
      </div>

      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[1, 2].map(i => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 16 }} />)}
        </div>
      ) : settings.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "48px" }}>
          <CreditCard size={40} style={{ color: "var(--muted)", margin: "0 auto 12px" }} />
          <p style={{ fontWeight: 600, marginBottom: 4 }}>No payment methods yet</p>
          <p style={{ fontSize: 13, color: "var(--muted)" }}>Add bKash, Nagad, or Rocket for customers to pay</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {settings.map((s: any) => {
            const mc = methodColors[s.method] || { bg: "#6366f120", color: "#6366f1" };
            return (
              <div key={s.id} className="card" style={{ padding: "14px 16px", opacity: s.isActive ? 1 : 0.55 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                    background: mc.bg, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, fontWeight: 900, color: mc.color
                  }}>
                    {s.method[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <h3 style={{ fontWeight: 700, fontSize: 15 }}>{s.method}</h3>
                      {!s.isActive && (
                        <span style={{ fontSize: 10, background: "var(--muted-bg)", color: "var(--muted)", borderRadius: 999, padding: "2px 7px", fontWeight: 700 }}>
                          Inactive
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 14, fontFamily: "monospace", color: "var(--muted)", marginTop: 2 }}>
                      {s.number}
                    </p>
                  </div>
                  {s.qrImageUrl && (
                    <img src={s.qrImageUrl} alt="QR" style={{ width: 52, height: 52, borderRadius: 10, objectFit: "cover" }} />
                  )}
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <button onClick={() => openEdit(s)} style={{ padding: 7, borderRadius: 8, background: "var(--muted-bg)", border: "none", cursor: "pointer", color: "var(--muted)" }}>
                      <Edit size={14} />
                    </button>
                    <button onClick={async () => { if (confirm("Delete this payment method?")) { await remove(s.id); refetch(); } }}
                      style={{ padding: 7, borderRadius: 8, background: "#fee2e2", border: "none", cursor: "pointer", color: "#ef4444" }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800 }}>{editId ? "Edit Method" : "Add Payment Method"}</h3>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label className="label">Method Name *</label>
              <input className="input" placeholder="bKash / Nagad / Rocket / BANK" value={form.method}
                onChange={e => setForm(f => ({ ...f, method: e.target.value }))} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label className="label">Account Number *</label>
              <input className="input" placeholder="01XXXXXXXXX" value={form.number}
                onChange={e => setForm(f => ({ ...f, number: e.target.value }))} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label className="label">QR Code Image URL (optional)</label>
              <input className="input" placeholder="https://..." value={form.qrImageUrl}
                onChange={e => setForm(f => ({ ...f, qrImageUrl: e.target.value }))} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <input type="checkbox" id="isActive" checked={form.isActive}
                onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
                style={{ width: 16, height: 16, accentColor: "var(--primary)" }} />
              <label htmlFor="isActive" style={{ fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Active (visible to customers)</label>
            </div>

            {error && <div style={{ background: "#fee2e2", color: "#991b1b", padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 16 }}>{error}</div>}

            <button className="btn btn-primary btn-full" onClick={handleSubmit} disabled={creating || updating}>
              {(creating || updating) && <span className="spinner" />}
              {editId ? "Update Method" : "Add Method"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
