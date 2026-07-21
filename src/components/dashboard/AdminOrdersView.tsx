"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Clock, X, Copy, Check, ShoppingBag, Calendar, User, Hash, DollarSign } from "lucide-react";
import {
  useGetAllOrdersQuery,
  useApproveOrderMutation,
  useRejectOrderMutation,
} from "@/redux/features/orderApi";

const statusTabs = [
  { label: "All Orders", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

const statusConfig: any = {
  PENDING: { label: "Pending", icon: Clock, color: "#f59e0b", bgClass: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-900/50" },
  APPROVED: { label: "Approved", icon: CheckCircle, color: "#10b981", bgClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50" },
  REJECTED: { label: "Rejected", icon: XCircle, color: "#ef4444", bgClass: "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-900/50" },
};

export default function AdminOrdersView() {
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [copiedTxn, setCopiedTxn] = useState<string | null>(null);

  const { data, isLoading, refetch } = useGetAllOrdersQuery(statusFilter || undefined);
  const [approveOrder, { isLoading: approving }] = useApproveOrderMutation();
  const [rejectOrder, { isLoading: rejecting }] = useRejectOrderMutation();

  const orders = data?.data || [];

  const handleApprove = async (id: string) => {
    await approveOrder(id);
    refetch();
  };

  const handleReject = async () => {
    if (!selectedOrder) return;
    await rejectOrder({ id: selectedOrder.id, adminNote: rejectNote });
    setShowRejectModal(false);
    setRejectNote("");
    setSelectedOrder(null);
    refetch();
  };

  const copyTxn = (id: string, txn: string) => {
    navigator.clipboard.writeText(txn);
    setCopiedTxn(id);
    setTimeout(() => setCopiedTxn(null), 2000);
  };

  return (
    <div className="max-w-6xl flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ShoppingBag className="text-indigo-600" size={24} />
            Order Management
          </h2>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
            Review and process customer orders, verify transaction IDs, and issue digital links
          </p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800/80 pb-3 overflow-x-auto">
        {statusTabs.map((tab) => {
          const isActive = statusFilter === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800/80"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-slate-100 dark:bg-slate-800/50 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-12 text-center text-slate-400">
          <ShoppingBag size={44} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No orders found</p>
          <p className="text-xs text-slate-400 mt-1">There are no orders matching the selected status tab.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => {
            const sc = statusConfig[order.status] || statusConfig.PENDING;
            const Icon = sc.icon;

            return (
              <div
                key={order.id}
                className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60">
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${sc.bgClass}`}>
                        <Icon size={12} /> {sc.label}
                      </span>
                      <span className="text-xs text-slate-400 ml-auto flex items-center gap-1">
                        <Calendar size={13} />
                        {new Date(order.createdAt).toLocaleDateString("en-BD", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1 bg-slate-50/50 dark:bg-slate-950/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/60">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                          <User size={10} /> Customer
                        </p>
                        <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 truncate">{order.user?.name || "Customer"}</p>
                        <p className="text-[11px] text-slate-400 truncate">{order.user?.email}</p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Product</p>
                        <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 truncate">{order.product?.title}</p>
                        <p className="text-[11px] text-slate-400">Qty: {order.quantity} link(s)</p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                          <DollarSign size={10} /> Amount
                        </p>
                        <p className="text-xs font-black text-indigo-600 dark:text-indigo-400 mt-0.5">৳{order.amountPaid?.toLocaleString()}</p>
                        <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">{order.paymentMethod}</p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                          <Hash size={10} /> Transaction ID
                        </p>
                        <p className="text-xs font-mono font-bold text-slate-900 dark:text-white mt-0.5 truncate">{order.senderNumber}</p>
                        <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                          <span className="truncate">TXN: {order.transactionId}</span>
                          <button
                            onClick={() => copyTxn(order.id, order.transactionId)}
                            className="p-0.5 text-slate-400 hover:text-indigo-600"
                            title="Copy TXN ID"
                          >
                            {copiedTxn === order.id ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pending Action Buttons */}
                  {order.status === "PENDING" && (
                    <div className="flex sm:flex-col gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => handleApprove(order.id)}
                        disabled={approving}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
                      >
                        <CheckCircle size={14} /> Approve
                      </button>
                      <button
                        onClick={() => { setSelectedOrder(order); setShowRejectModal(true); }}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 font-bold text-xs transition-colors"
                      >
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  )}
                </div>

                {/* Delivered links list */}
                {order.status === "APPROVED" && order.links?.length > 0 && (
                  <div className="rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 p-3">
                    <p className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 mb-1.5 flex items-center gap-1.5">
                      <CheckCircle size={14} /> Delivered Links ({order.links.length})
                    </p>
                    <div className="space-y-1">
                      {order.links.map((link: any, idx: number) => (
                        <p key={link.id} className="text-[11px] font-mono text-slate-700 dark:text-slate-300 truncate bg-white/70 dark:bg-slate-900/60 px-2.5 py-1 rounded-md border border-emerald-100 dark:border-emerald-900/30">
                          {idx + 1}. {link.url}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Modal Sheet */}
      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal-sheet max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5 mb-4">
              <h3 className="text-base font-extrabold text-rose-600 flex items-center gap-2">
                <XCircle size={18} /> Reject Customer Order
              </h3>
              <button
                onClick={() => setShowRejectModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Provide a reason for rejection. This note will be recorded in customer&apos;s order details.
            </p>
            <textarea
              className="input min-h-[90px] mb-4"
              placeholder="e.g. Transaction ID not found in bKash statement or amount mismatch..."
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
            />
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={rejecting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/25 inline-flex items-center justify-center gap-2"
              >
                {rejecting && <span className="spinner" />}
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

