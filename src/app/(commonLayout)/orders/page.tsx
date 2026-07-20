"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package, Clock, CheckCircle, XCircle, Link as LinkIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useGetMyOrdersQuery } from "@/redux/features/orderApi";
import { ROUTES } from "@/constants/routes";

const statusConfig = {
  PENDING: { label: "Pending Review", icon: Clock, color: "#f59e0b", bg: "#fef9c3" },
  APPROVED: { label: "Approved ✅", icon: CheckCircle, color: "#10b981", bg: "#d1fae5" },
  REJECTED: { label: "Rejected", icon: XCircle, color: "#ef4444", bg: "#fee2e2" },
};

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { data, isLoading } = useGetMyOrdersQuery(undefined, { skip: !user });

  useEffect(() => {
    if (!loading && !user) router.push(ROUTES.LOGIN);
  }, [user, loading, router]);

  const orders = data?.data || [];

  if (loading || isLoading) {
    return (
      <div style={{ padding: "20px 16px", maxWidth: 680, margin: "0 auto" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>My Orders</h1>
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton" style={{ height: 120, borderRadius: 16, marginBottom: 12 }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 16px", maxWidth: 680, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>📦 My Orders</h1>
      <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>
        {orders.length} order{orders.length !== 1 ? "s" : ""} total
      </p>

      {orders.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "60px 20px" }}>
          <Package size={48} style={{ color: "var(--muted)", margin: "0 auto 16px" }} />
          <p style={{ fontWeight: 600, marginBottom: 8 }}>No orders yet</p>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>Place your first order from the Products page</p>
          <button className="btn btn-primary" onClick={() => router.push(ROUTES.PRODUCTS)}>
            Browse Products
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {orders.map((order: any) => {
            const sc = statusConfig[order.status as keyof typeof statusConfig];
            const Icon = sc.icon;

            return (
              <div key={order.id} className="card" style={{ padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>
                      {order.product?.title}
                    </h3>
                    <p style={{ fontSize: 12, color: "var(--muted)" }}>
                      {new Date(order.createdAt).toLocaleDateString("en-BD", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    background: sc.bg, color: sc.color,
                    borderRadius: 999, padding: "4px 10px", fontSize: 11, fontWeight: 700
                  }}>
                    <Icon size={12} />
                    {sc.label}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 20, marginBottom: 12 }}>
                  <div>
                    <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 2 }}>QTY</p>
                    <p style={{ fontSize: 14, fontWeight: 700 }}>{order.quantity}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 2 }}>TOTAL</p>
                    <p style={{ fontSize: 14, fontWeight: 700 }}>৳{order.totalAmount?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 2 }}>METHOD</p>
                    <p style={{ fontSize: 14, fontWeight: 700 }}>{order.paymentMethod}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 2 }}>TXN ID</p>
                    <p style={{ fontSize: 12, fontFamily: "monospace", fontWeight: 600 }}>{order.transactionId}</p>
                  </div>
                </div>

                {/* Links (only visible when approved) */}
                {order.status === "APPROVED" && order.links?.length > 0 && (
                  <div style={{
                    background: "var(--muted-bg)", borderRadius: 12, padding: "12px"
                  }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", marginBottom: 8, textTransform: "uppercase" }}>
                      🎉 Your Links
                    </p>
                    {order.links.map((link: any, idx: number) => (
                      <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                        style={{
                          display: "flex", alignItems: "center", gap: 8,
                          padding: "8px 10px", background: "var(--card)",
                          borderRadius: 8, marginBottom: 6, textDecoration: "none",
                          color: "var(--primary)", fontSize: 13, fontWeight: 600,
                          border: "1px solid var(--card-border)"
                        }}>
                        <LinkIcon size={13} />
                        Link {idx + 1} — Click to redeem
                      </a>
                    ))}
                  </div>
                )}

                {order.status === "REJECTED" && order.adminNote && (
                  <div style={{ background: "#fee2e2", borderRadius: 10, padding: "10px 12px", fontSize: 13, color: "#991b1b" }}>
                    <strong>Reason:</strong> {order.adminNote}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
