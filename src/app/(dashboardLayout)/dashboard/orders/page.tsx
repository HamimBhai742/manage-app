"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Clock, Eye, X } from "lucide-react";
import {
  useGetAllOrdersQuery,
  useApproveOrderMutation,
  useRejectOrderMutation,
} from "@/redux/features/orderApi";

const statusTabs = [
  { label: "All", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

const statusConfig: any = {
  PENDING: { label: "Pending", icon: Clock, color: "#f59e0b", bg: "#fef9c3" },
  APPROVED: { label: "Approved", icon: CheckCircle, color: "#10b981", bg: "#d1fae5" },
  REJECTED: { label: "Rejected", icon: XCircle, color: "#ef4444", bg: "#fee2e2" },
};

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

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

  return (
    <div style={{ maxWidth: 1000 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800 }}>📋 Order Management</h2>
        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>
          Review and approve customer orders
        </p>
      </div>

      {/* Status filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {statusTabs.map(tab => (
          <button key={tab.value} onClick={() => setStatusFilter(tab.value)} style={{
            padding: "7px 16px", borderRadius: 999, fontSize: 13, fontWeight: 600,
            cursor: "pointer", border: "1.5px solid",
            borderColor: statusFilter === tab.value ? "var(--primary)" : "var(--card-border)",
            background: statusFilter === tab.value ? "var(--primary)" : "var(--card)",
            color: statusFilter === tab.value ? "white" : "var(--muted)",
            transition: "all 0.15s"
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 110, borderRadius: 16 }} />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "48px" }}>
          <p style={{ color: "var(--muted)" }}>No orders found</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {orders.map((order: any) => {
            const sc = statusConfig[order.status];
            const Icon = sc.icon;

            return (
              <div key={order.id} className="card" style={{ padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    {/* Top row */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, fontFamily: "monospace", color: "var(--muted)", background: "var(--muted-bg)", padding: "2px 8px", borderRadius: 6 }}>
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        background: sc.bg, color: sc.color,
                        borderRadius: 999, padding: "3px 10px", fontSize: 11, fontWeight: 700
                      }}>
                        <Icon size={11} /> {sc.label}
                      </span>
                      <span style={{ fontSize: 12, color: "var(--muted)", marginLeft: "auto" }}>
                        {new Date(order.createdAt).toLocaleDateString("en-BD", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    {/* Details grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "6px 20px" }}>
                      <div>
                        <p style={{ fontSize: 10, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase" }}>Customer</p>
                        <p style={{ fontSize: 13, fontWeight: 600 }}>{order.user?.name}</p>
                        <p style={{ fontSize: 11, color: "var(--muted)" }}>{order.user?.email}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: 10, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase" }}>Product</p>
                        <p style={{ fontSize: 13, fontWeight: 600 }}>{order.product?.title}</p>
                        <p style={{ fontSize: 11, color: "var(--muted)" }}>Qty: {order.quantity}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: 10, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase" }}>Payment</p>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "var(--primary)" }}>৳{order.amountPaid?.toLocaleString()}</p>
                        <p style={{ fontSize: 11, color: "var(--muted)" }}>{order.paymentMethod}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: 10, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase" }}>From Number</p>
                        <p style={{ fontSize: 13, fontFamily: "monospace", fontWeight: 600 }}>{order.senderNumber}</p>
                        <p style={{ fontSize: 11, color: "var(--muted)", fontFamily: "monospace" }}>TXN: {order.transactionId}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {order.status === "PENDING" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                      <button
                        className="btn btn-sm"
                        style={{ background: "#d1fae5", color: "#065f46", border: "none" }}
                        onClick={() => handleApprove(order.id)}
                        disabled={approving}
                      >
                        <CheckCircle size={13} />
                        Approve
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{ background: "#fee2e2", color: "#991b1b", border: "none" }}
                        onClick={() => { setSelectedOrder(order); setShowRejectModal(true); }}
                      >
                        <XCircle size={13} />
                        Reject
                      </button>
                    </div>
                  )}
                </div>

                {/* Approved links */}
                {order.status === "APPROVED" && order.links?.length > 0 && (
                  <div style={{
                    marginTop: 12, background: "#d1fae520",
                    border: "1px solid #10b98130", borderRadius: 10, padding: "10px 12px"
                  }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#059669", marginBottom: 6 }}>
                      Links Delivered ({order.links.length})
                    </p>
                    {order.links.slice(0, 2).map((link: any, idx: number) => (
                      <p key={link.id} style={{ fontSize: 11, fontFamily: "monospace", color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {idx + 1}. {link.url}
                      </p>
                    ))}
                    {order.links.length > 2 && (
                      <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>+{order.links.length - 2} more</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#ef4444" }}>Reject Order</h3>
              <button onClick={() => setShowRejectModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}>
                <X size={20} />
              </button>
            </div>
            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
              Provide a reason for rejection (optional). The customer will see this.
            </p>
            <textarea className="input" rows={3} placeholder="e.g. Transaction not found, amount mismatch..."
              value={rejectNote} onChange={e => setRejectNote(e.target.value)}
              style={{ resize: "none", marginBottom: 16, fontFamily: "inherit" }}
            />
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowRejectModal(false)}>Cancel</button>
              <button className="btn btn-danger" style={{ flex: 1 }} onClick={handleReject} disabled={rejecting}>
                {rejecting && <span className="spinner" />}
                Reject Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
