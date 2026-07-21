"use client";

import { useState } from "react";
import { Plus, Trash2, Edit, X, CreditCard, Sparkles, CheckCircle2, QrCode } from "lucide-react";
import {
  useGetAllPaymentSettingsQuery,
  useCreatePaymentSettingMutation,
  useUpdatePaymentSettingMutation,
  useDeletePaymentSettingMutation,
} from "@/redux/features/paymentApi";

const emptyForm = { method: "bKash", number: "", qrImageUrl: "", isActive: true };

export default function PaymentSettingsView() {
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

  const methodConfig: any = {
    bKash: { bg: "bg-pink-500/10 text-pink-600 border-pink-200 dark:border-pink-900/50 dark:bg-pink-950/40 dark:text-pink-400", badge: "bKash Personal" },
    Nagad: { bg: "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-900/50 dark:bg-orange-950/40 dark:text-orange-400", badge: "Nagad Personal" },
    Rocket: { bg: "bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-900/50 dark:bg-purple-950/40 dark:text-purple-400", badge: "Rocket Personal" },
    BANK: { bg: "bg-sky-500/10 text-sky-600 border-sky-200 dark:border-sky-900/50 dark:bg-sky-950/40 dark:text-sky-400", badge: "Bank Transfer" },
  };

  return (
    <div className="max-w-4xl flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="text-indigo-600" size={24} />
            Payment Gateway Settings
          </h2>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
            Configure mobile banking numbers (bKash, Nagad, Rocket) shown to buyers during checkout
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition-all"
        >
          <Plus size={16} /> Add Method
        </button>
      </div>

      {/* Methods List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800/50 animate-pulse" />
          ))}
        </div>
      ) : settings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center text-slate-400">
          <CreditCard size={40} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No payment methods configured</p>
          <p className="text-xs text-slate-400 mt-1">Add bKash, Nagad, or Rocket account numbers for checkout.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5">
          {settings.map((s: any) => {
            const mc = methodConfig[s.method] || { bg: "bg-indigo-500/10 text-indigo-600 border-indigo-200 dark:border-indigo-900/50", badge: s.method };
            return (
              <div
                key={s.id}
                className={`group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-4 transition-all hover:shadow-md ${
                  s.isActive ? "opacity-100" : "opacity-60 bg-slate-50/50 dark:bg-slate-950/40"
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-black text-lg border ${mc.bg}`}>
                      {s.method[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{s.method}</h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            s.isActive
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                              : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                          }`}
                        >
                          {s.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                        {s.number}
                      </p>
                    </div>
                  </div>

                  {s.qrImageUrl && (
                    <div className="relative group/qr shrink-0">
                      <img src={s.qrImageUrl} alt="QR" className="h-12 w-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700" />
                    </div>
                  )}

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => openEdit(s)}
                      className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                      title="Edit method"
                    >
                      <Edit size={15} />
                    </button>
                    <button
                      onClick={async () => { if (confirm("Delete this payment method?")) { await remove(s.id); refetch(); } }}
                      className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-400 transition-colors"
                      title="Delete method"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Dialog Form */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-sheet max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5 mb-4">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles size={18} className="text-indigo-600" />
                {editId ? "Edit Payment Method" : "Add Payment Method"}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
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
                  <option value="BANK">Bank Account</option>
                </select>
              </div>

              <div>
                <label className="label">Account Number *</label>
                <input
                  className="input font-mono"
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

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
                />
                <label htmlFor="isActive" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Active (Show to customers during checkout)
                </label>
              </div>

              {error && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/60 dark:border-rose-900/50 dark:text-rose-400 p-3 text-xs font-semibold">
                  {error}
                </div>
              )}

              <div className="pt-2">
                <button
                  className="btn btn-primary btn-full font-bold py-3"
                  onClick={handleSubmit}
                  disabled={creating || updating}
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

