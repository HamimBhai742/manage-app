/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  X,
  Copy,
  Check,
  ShoppingBag,
  Calendar,
  User,
  Hash,
  DollarSign,
  Phone,
  PackageCheck,
  ExternalLink
} from "lucide-react";
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

const statusConfig: Record<string, { label: string; icon: any; color: string; bg: string; border: string }> = {
  PENDING: {
    label: "Pending Review",
    icon: Clock,
    color: "#d97706",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.2)",
  },
  APPROVED: {
    label: "Approved & Delivered",
    icon: CheckCircle2,
    color: "#059669",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.2)",
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    color: "#ef4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.2)",
  },
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
    try {
      await approveOrder(id).unwrap();
      refetch();
    } catch (err: any) {
      alert(err?.data?.message || "Failed to approve order");
    }
  };

  const handleReject = async () => {
    if (!selectedOrder) return;
    try {
      await rejectOrder({ id: selectedOrder.id, adminNote: rejectNote }).unwrap();
      setShowRejectModal(false);
      setRejectNote("");
      setSelectedOrder(null);
      refetch();
    } catch (err: any) {
      alert(err?.data?.message || "Failed to reject order");
    }
  };

  const copyTxn = (id: string, txn: string) => {
    navigator.clipboard.writeText(txn);
    setCopiedTxn(id);
    setTimeout(() => setCopiedTxn(null), 2000);
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
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 16px rgba(245,158,11,0.3)",
              color: "white",
            }}>
              <ShoppingBag size={20} />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: "var(--foreground)", letterSpacing: "-0.03em" }}>
              Order Management
            </h2>
          </div>
          <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>
            Review and process customer orders, verify transaction IDs, and issue digital links ({orders.length} orders)
          </p>
        </div>
      </div>

      {/* ── Status Filter Tabs ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        paddingBottom: 4,
        borderBottom: "1.5px solid var(--card-border)",
        overflowX: "auto",
      }}>
        {statusTabs.map((tab) => {
          const isActive = statusFilter === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              style={{
                padding: "8px 18px",
                borderRadius: 12,
                fontSize: 13,
                fontWeight: isActive ? 800 : 600,
                color: isActive ? "#ffffff" : "var(--muted)",
                background: isActive ? "var(--primary-gradient)" : "var(--card)",
                border: isActive ? "1px solid transparent" : "1.5px solid var(--card-border)",
                boxShadow: isActive ? "var(--shadow-primary)" : "var(--shadow-xs)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
                fontFamily: "inherit",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Orders List ── */}
      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: 140, borderRadius: 20 }} />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="card" style={{ padding: "56px 24px", textAlign: "center" }}>
          <ShoppingBag size={46} style={{ color: "var(--muted-light)", margin: "0 auto 14px" }} />
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--foreground)", marginBottom: 4 }}>
            No orders found
          </h3>
          <p style={{ fontSize: 13, color: "var(--muted)" }}>
            There are no customer orders matching the selected status tab.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {orders.map((order: any) => {
            const sc = statusConfig[order.status] || statusConfig.PENDING;
            const Icon = sc.icon;

            return (
              <div
                key={order.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  padding: "20px 22px",
                  background: "var(--card)",
                  border: "1.5px solid var(--card-border)",
                  borderRadius: 20,
                  boxShadow: "var(--shadow-xs)",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                className="stat-card-hover"
              >
                {/* Header Row */}
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      fontWeight: 800,
                      padding: "4px 10px",
                      borderRadius: 8,
                      background: "var(--muted-bg)",
                      color: "var(--foreground)",
                      border: "1px solid var(--card-border)",
                    }}>
                      #{order.id.slice(-8).toUpperCase()}
                    </span>

                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "4px 12px",
                      borderRadius: 999,
                      fontSize: 11.5,
                      fontWeight: 800,
                      background: sc.bg,
                      color: sc.color,
                      border: `1px solid ${sc.border}`,
                    }}>
                      <Icon size={13} /> {sc.label}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>
                    <Calendar size={13} />
                    {new Date(order.createdAt).toLocaleDateString("en-BD", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                {/* Details Grid */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: 14,
                  padding: "16px 18px",
                  background: "var(--muted-bg)",
                  border: "1px solid var(--card-border)",
                  borderRadius: 16,
                }}>
                  {/* Customer Info */}
                  <div>
                    <span style={{ fontSize: 10.5, fontWeight: 800, textTransform: "uppercase", color: "var(--muted)", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 5 }}>
                      <User size={12} /> Customer
                    </span>
                    <p style={{ fontSize: 13.5, fontWeight: 800, color: "var(--foreground)", margin: "4px 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {order.user?.name || "Customer"}
                    </p>
                    <p style={{ fontSize: 11.5, color: "var(--muted)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {order.user?.email}
                    </p>
                  </div>

                  {/* Product & Qty */}
                  <div>
                    <span style={{ fontSize: 10.5, fontWeight: 800, textTransform: "uppercase", color: "var(--muted)", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 5 }}>
                      <PackageCheck size={12} /> Product
                    </span>
                    <p style={{ fontSize: 13.5, fontWeight: 800, color: "var(--foreground)", margin: "4px 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {order.product?.title}
                    </p>
                    <p style={{ fontSize: 11.5, color: "var(--muted)", margin: 0 }}>
                      Quantity: {order.quantity} link(s)
                    </p>
                  </div>

                  {/* Payment Amount */}
                  <div>
                    <span style={{ fontSize: 10.5, fontWeight: 800, textTransform: "uppercase", color: "var(--muted)", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 5 }}>
                      <DollarSign size={12} /> Payment
                    </span>
                    <p style={{ fontSize: 14, fontWeight: 900, color: "var(--primary)", margin: "4px 0 2px" }}>
                      ৳{order.amountPaid ? Number(order.amountPaid).toLocaleString() : order.totalAmount?.toLocaleString()}
                    </p>
                    <p style={{ fontSize: 11.5, fontWeight: 700, color: "var(--muted)", margin: 0 }}>
                      {order.paymentMethod || "Manual Transfer"}
                    </p>
                  </div>

                  {/* Verification Info */}
                  <div>
                    <span style={{ fontSize: 10.5, fontWeight: 800, textTransform: "uppercase", color: "var(--muted)", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 5 }}>
                      <Hash size={12} /> Verification
                    </span>
                    <p style={{ fontSize: 12.5, fontWeight: 700, color: "var(--foreground)", margin: "4px 0 2px", display: "flex", alignItems: "center", gap: 4 }}>
                      <Phone size={11} style={{ color: "var(--muted)" }} />
                      {order.senderNumber || order.senderPhone || "N/A"}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--foreground)", fontWeight: 700 }}>
                      <span>TXN: {order.transactionId}</span>
                      <button
                        onClick={() => copyTxn(order.id, order.transactionId)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--muted)",
                          padding: 2,
                          display: "flex",
                          alignItems: "center",
                        }}
                        title="Copy Transaction ID"
                      >
                        {copiedTxn === order.id ? (
                          <Check size={13} style={{ color: "#10b981" }} />
                        ) : (
                          <Copy size={13} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Status-specific Footer Actions / Details */}
                {order.status === "PENDING" && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, paddingTop: 4 }}>
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowRejectModal(true);
                      }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "9px 18px",
                        borderRadius: 12,
                        background: "rgba(239,68,68,0.08)",
                        color: "#ef4444",
                        border: "1px solid rgba(239,68,68,0.2)",
                        fontSize: 12.5,
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "all 0.18s",
                        fontFamily: "inherit",
                      }}
                    >
                      <XCircle size={15} />
                      Reject Order
                    </button>

                    <button
                      onClick={() => handleApprove(order.id)}
                      disabled={approving}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "9px 20px",
                        borderRadius: 12,
                        background: "linear-gradient(135deg, #10b981, #059669)",
                        color: "#ffffff",
                        border: "none",
                        fontSize: 12.5,
                        fontWeight: 800,
                        cursor: "pointer",
                        boxShadow: "0 6px 18px rgba(16,185,129,0.3)",
                        transition: "all 0.18s",
                        fontFamily: "inherit",
                      }}
                    >
                      {approving && <span className="spinner" />}
                      <CheckCircle2 size={15} />
                      Approve Order
                    </button>
                  </div>
                )}

                {/* Approved Links Box */}
                {order.status === "APPROVED" && order.links?.length > 0 && (
                  <div style={{
                    padding: 14,
                    borderRadius: 14,
                    background: "rgba(16,185,129,0.06)",
                    border: "1px solid rgba(16,185,129,0.18)",
                  }}>
                    <p style={{ fontSize: 11.5, fontWeight: 800, color: "#059669", margin: "0 0 8px", display: "flex", alignItems: "center", gap: 6 }}>
                      <CheckCircle2 size={14} /> Delivered Redeem Links ({order.links.length})
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {order.links.map((link: any, idx: number) => (
                        <div
                          key={link.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "8px 12px",
                            borderRadius: 10,
                            background: "var(--card)",
                            border: "1px solid var(--card-border)",
                            fontSize: 12,
                            fontFamily: "var(--font-mono)",
                            color: "var(--foreground)",
                          }}
                        >
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {idx + 1}. {link.url}
                          </span>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "var(--primary)", display: "flex", alignItems: "center", paddingLeft: 8 }}
                          >
                            <ExternalLink size={13} />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rejected Reason Box */}
                {order.status === "REJECTED" && order.adminNote && (
                  <div style={{
                    padding: "12px 14px",
                    borderRadius: 12,
                    background: "rgba(239,68,68,0.06)",
                    border: "1px solid rgba(239,68,68,0.18)",
                    color: "#ef4444",
                    fontSize: 12.5,
                  }}>
                    <strong>Rejection Reason:</strong> {order.adminNote}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Reject Modal Sheet ── */}
      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal-sheet" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: 14,
              marginBottom: 16,
              borderBottom: "1px solid var(--card-border)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: "rgba(239,68,68,0.12)",
                  color: "#ef4444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <XCircle size={18} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--foreground)", margin: 0 }}>
                  Reject Customer Order
                </h3>
              </div>

              <button
                onClick={() => setShowRejectModal(false)}
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

            <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 16, lineHeight: 1.5 }}>
              Provide a reason for rejection. This note will be visible in the customer&apos;s order details.
            </p>

            <textarea
              className="input"
              style={{ minHeight: 96, resize: "vertical", marginBottom: 20 }}
              placeholder="e.g. Transaction ID not found in bKash statement or payment amount mismatch..."
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
            />

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button
                onClick={() => setShowRejectModal(false)}
                style={{
                  flex: 1,
                  padding: "11px 16px",
                  borderRadius: 12,
                  background: "var(--muted-bg)",
                  border: "1px solid var(--card-border)",
                  color: "var(--foreground)",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={rejecting}
                style={{
                  flex: 1,
                  padding: "11px 16px",
                  borderRadius: 12,
                  background: "#ef4444",
                  color: "#ffffff",
                  border: "none",
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: "0 6px 18px rgba(239,68,68,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  fontFamily: "inherit",
                }}
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
