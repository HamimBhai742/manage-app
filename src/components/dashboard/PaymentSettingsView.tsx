/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Plus, Trash2, Edit3, X, CreditCard, Sparkles, QrCode, CheckCircle2, AlertCircle } from "lucide-react";
import {
  useGetAllPaymentSettingsQuery,
  useCreatePaymentSettingMutation,
  useUpdatePaymentSettingMutation,
  useDeletePaymentSettingMutation,
} from "@/redux/features/paymentApi";

interface PaymentFormData {
  method: string;
  number: string;
  qrImageUrl: string;
  isActive: boolean;
}

const emptyForm: PaymentFormData = { method: "bKash", number: "", qrImageUrl: "", isActive: true };

const methodStyles: Record<string, { bg: string; color: string; gradient: string; label: string }> = {
  bKash: {
    bg: "rgba(236,72,153,0.1)",
    color: "#ec4899",
    gradient: "linear-gradient(135deg, #e11d48, #ec4899)",
    label: "bKash Personal",
  },
  Nagad: {
    bg: "rgba(249,115,22,0.1)",
    color: "#f97316",
    gradient: "linear-gradient(135deg, #ea580c, #f97316)",
    label: "Nagad Personal",
  },
  Rocket: {
    bg: "rgba(168,85,247,0.1)",
    color: "#a855f7",
    gradient: "linear-gradient(135deg, #7e22ce, #a855f7)",
    label: "Rocket Personal",
  },
  BANK: {
    bg: "rgba(59,130,246,0.1)",
    color: "#3b82f6",
    gradient: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
    label: "Bank Account Transfer",
  },
};

export default function PaymentSettingsView() {
  const { data, isLoading, refetch } = useGetAllPaymentSettingsQuery(undefined);
  const [create, { isLoading: creating }] = useCreatePaymentSettingMutation();
  const [update, { isLoading: updating }] = useUpdatePaymentSettingMutation();
  const [remove] = useDeletePaymentSettingMutation();

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<PaymentFormData>(emptyForm);
  const [error, setError] = useState("");

  const settings = data?.data || [];

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  };

  const openEdit = (s: any) => {
    setEditId(s.id);
    setForm({ method: s.method, number: s.number, qrImageUrl: s.qrImageUrl || "", isActive: s.isActive });
    setError("");
    setShowForm(true);
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
              background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 16px rgba(139,92,246,0.3)",
              color: "white",
            }}>
              <CreditCard size={20} />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: "var(--foreground)", letterSpacing: "-0.03em" }}>
              Payment Gateway Settings
            </h2>
          </div>
          <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>
            Configure mobile banking numbers (bKash, Nagad, Rocket, Bank) shown to buyers during checkout ({settings.length} active)
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={openCreate}
          style={{ padding: "11px 22px", borderRadius: 14 }}
        >
          <Plus size={16} /> Add Method
        </button>
      </div>

      {/* ── Methods List ── */}
      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[1, 2].map((i) => (
            <div key={i} className="skeleton" style={{ height: 84, borderRadius: 20 }} />
          ))}
        </div>
      ) : settings.length === 0 ? (
        <div className="card" style={{ padding: "56px 24px", textAlign: "center" }}>
          <CreditCard size={46} style={{ color: "var(--muted-light)", margin: "0 auto 14px" }} />
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--foreground)", marginBottom: 4 }}>
            No payment methods configured
          </h3>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 18 }}>
            Add bKash, Nagad, or Rocket account numbers for buyers during checkout.
          </p>
          <button className="btn btn-primary btn-sm" onClick={openCreate}>
            <Plus size={14} /> Add Payment Method
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {settings.map((s: any) => {
            const ms = methodStyles[s.method] || {
              bg: "rgba(90,95,239,0.1)",
              color: "var(--primary)",
              gradient: "linear-gradient(135deg, #5a5fef, #7c3aed)",
              label: s.method,
            };

            return (
              <div
                key={s.id}
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
                  opacity: s.isActive ? 1 : 0.6,
                  transition: "all 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                className="stat-card-hover"
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0, flex: "1 1 280px" }}>
                  {/* Method Icon / Badge */}
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: ms.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: 18,
                    fontWeight: 900,
                    flexShrink: 0,
                    boxShadow: `0 6px 16px ${ms.bg}`,
                  }}>
                    {s.method[0]?.toUpperCase()}
                  </div>

                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
                      <h3 style={{
                        fontSize: 15,
                        fontWeight: 800,
                        color: "var(--foreground)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        margin: 0,
                      }}>
                        {s.method}
                      </h3>

                      <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "2px 9px",
                        borderRadius: 999,
                        fontSize: 10.5,
                        fontWeight: 800,
                        background: s.isActive ? "rgba(16,185,129,0.1)" : "var(--muted-bg)",
                        color: s.isActive ? "#059669" : "var(--muted)",
                        border: s.isActive ? "1px solid rgba(16,185,129,0.2)" : "1px solid var(--card-border)",
                      }}>
                        {s.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <p style={{
                      fontSize: 13,
                      fontFamily: "var(--font-mono)",
                      fontWeight: 700,
                      color: "var(--foreground)",
                      margin: 0,
                    }}>
                      {s.number}
                    </p>
                  </div>
                </div>

                {/* QR Image Preview */}
                {s.qrImageUrl && (
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "4px 10px",
                    borderRadius: 12,
                    background: "var(--muted-bg)",
                    border: "1px solid var(--card-border)",
                    flexShrink: 0,
                  }}>
                    <QrCode size={16} style={{ color: "var(--muted)" }} />
                    <img
                      src={s.qrImageUrl}
                      alt="QR Code"
                      style={{ width: 34, height: 34, borderRadius: 8, objectFit: "cover" }}
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <button
                    onClick={() => openEdit(s)}
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
                    title="Edit payment method"
                  >
                    <Edit3 size={15} />
                  </button>

                  <button
                    onClick={async () => {
                      if (confirm("Are you sure you want to delete this payment method?")) {
                        await remove(s.id);
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
                    title="Delete payment method"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Add / Edit Modal Sheet ── */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-sheet" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: 14,
              marginBottom: 18,
              borderBottom: "1px solid var(--card-border)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}>
                  <Sparkles size={16} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--foreground)", margin: 0 }}>
                  {editId ? "Edit Payment Method" : "Add Payment Method"}
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

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label className="label">Payment Gateway Method *</label>
                <select
                  className="input"
                  value={form.method}
                  onChange={(e) => setForm((f) => ({ ...f, method: e.target.value }))}
                >
                  <option value="bKash">bKash Personal</option>
                  <option value="Nagad">Nagad Personal</option>
                  <option value="Rocket">Rocket Personal</option>
                  <option value="BANK">Bank Account Transfer</option>
                </select>
              </div>

              <div>
                <label className="label">Account / Phone Number *</label>
                <input
                  className="input"
                  style={{ fontFamily: "var(--font-mono)" }}
                  placeholder="01XXXXXXXXX"
                  value={form.number}
                  onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))}
                />
              </div>

              <div>
                <label className="label">QR Code Image URL (optional)</label>
                <input
                  className="input"
                  placeholder="https://..."
                  value={form.qrImageUrl}
                  onChange={(e) => setForm((f) => ({ ...f, qrImageUrl: e.target.value }))}
                />
              </div>

              {form.qrImageUrl && (
                <div style={{
                  padding: 12,
                  borderRadius: 14,
                  background: "var(--muted-bg)",
                  border: "1px solid var(--card-border)",
                  textAlign: "center",
                }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", marginBottom: 6 }}>
                    QR Code Preview
                  </p>
                  <img
                    src={form.qrImageUrl}
                    alt="Preview"
                    style={{ maxHeight: 90, maxWidth: "100%", objectFit: "contain", borderRadius: 8, margin: "0 auto" }}
                  />
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    cursor: "pointer",
                    accentColor: "var(--primary)",
                  }}
                />
                <label htmlFor="isActive" style={{ fontSize: 12.5, fontWeight: 700, color: "var(--foreground)", cursor: "pointer" }}>
                  Active (Show to buyers during checkout)
                </label>
              </div>

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

              <div style={{ paddingTop: 6 }}>
                <button
                  className="btn btn-primary btn-full"
                  onClick={handleSubmit}
                  disabled={creating || updating}
                  style={{ height: 46, borderRadius: 14 }}
                >
                  {(creating || updating) && <span className="spinner" />}
                  {editId ? "Update Payment Method" : "Save Payment Method"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
