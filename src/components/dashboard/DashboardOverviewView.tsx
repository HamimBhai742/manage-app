"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useGetOrderStatsQuery } from "@/redux/features/orderApi";
import { useGetAllProductsAdminQuery } from "@/redux/features/productApi";
import { ShoppingBag, DollarSign, Clock, CheckCircle, Package } from "lucide-react";

export default function DashboardOverviewView() {
  const { user } = useAuth();
  const { data: statsData } = useGetOrderStatsQuery(undefined);
  const { data: productsData } = useGetAllProductsAdminQuery(undefined);

  const stats = statsData?.data;
  const products = productsData?.data || [];

  const cards = [
    {
      name: "Total Orders",
      value: stats?.total ?? "—",
      icon: ShoppingBag,
      color: "#6366f1",
    },
    {
      name: "Pending",
      value: stats?.pending ?? "—",
      icon: Clock,
      color: "#f59e0b",
    },
    {
      name: "Approved",
      value: stats?.approved ?? "—",
      icon: CheckCircle,
      color: "#10b981",
    },
    {
      name: "Revenue (৳)",
      value: stats?.totalRevenue ? `৳${Number(stats.totalRevenue).toLocaleString()}` : "৳0",
      icon: DollarSign,
      color: "#8b5cf6",
    },
  ];

  return (
    <div style={{ maxWidth: 1200 }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "var(--foreground)" }}>
          Welcome back, {user?.name || "Admin"} 👋
        </h2>
        <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 4 }}>
          Here is your store overview for today.
        </p>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.name} className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>{card.name}</span>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  background: card.color + "20"
                }}>
                  <Icon size={20} style={{ color: card.color }} />
                </div>
              </div>
              <span style={{ fontSize: 28, fontWeight: 900, color: "var(--foreground)" }}>{card.value}</span>
            </div>
          );
        })}
      </div>

      {/* Products summary */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Product Inventory</h3>
          <a href="/dashboard/products" style={{ fontSize: 13, color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
            Manage →
          </a>
        </div>

        {products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: "var(--muted)" }}>
            <Package size={32} style={{ margin: "0 auto 8px" }} />
            <p>No products yet. Add your first product!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {products.map((product: any) => (
              <div key={product.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 0", borderBottom: "1px solid var(--card-border)"
              }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{product.title}</p>
                  <p style={{ fontSize: 12, color: "var(--muted)" }}>৳{product.price} per link</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 13, fontWeight: 700 }}>{product.totalLinks} links</p>
                    <p style={{ fontSize: 11, color: "var(--muted)" }}>{product.totalOrders} orders</p>
                  </div>
                  <div style={{
                    padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700,
                    background: product.isPublished ? "#d1fae5" : "var(--muted-bg)",
                    color: product.isPublished ? "#059669" : "var(--muted)"
                  }}>
                    {product.isPublished ? "Live" : "Draft"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
