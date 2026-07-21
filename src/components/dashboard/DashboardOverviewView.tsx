"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useGetOrderStatsQuery } from "@/redux/features/orderApi";
import { useGetAllProductsAdminQuery } from "@/redux/features/productApi";
import {
  ShoppingBag,
  DollarSign,
  Clock,
  CheckCircle,
  Package,
  Plus,
  ArrowRight,
  TrendingUp,
  MessageCircle,
  CreditCard,
  Sparkles,
  ExternalLink,
  Activity,
  Zap,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";

export default function DashboardOverviewView() {
  const { user } = useAuth();
  const { data: statsData, isLoading: statsLoading } = useGetOrderStatsQuery(undefined);
  const { data: productsData, isLoading: productsLoading } = useGetAllProductsAdminQuery(undefined);

  const stats = statsData?.data;
  const products = productsData?.data || [];

  const cards = [
    {
      name: "Total Orders",
      value: stats?.total ?? "—",
      trend: "+12.5% vs last month",
      trendUp: true,
      icon: ShoppingBag,
      accent: "#5a5fef",
      bgLight: "rgba(90,95,239,0.06)",
      iconBg: "linear-gradient(135deg, #5a5fef, #4338ca)",
      shadow: "rgba(90,95,239,0.2)",
    },
    {
      name: "Pending Approval",
      value: stats?.pending ?? "—",
      trend: "Requires review",
      trendUp: null,
      icon: Clock,
      accent: "#f59e0b",
      bgLight: "rgba(245,158,11,0.06)",
      iconBg: "linear-gradient(135deg, #f59e0b, #d97706)",
      shadow: "rgba(245,158,11,0.2)",
    },
    {
      name: "Approved Orders",
      value: stats?.approved ?? "—",
      trend: "+8.4% completed",
      trendUp: true,
      icon: CheckCircle,
      accent: "#10b981",
      bgLight: "rgba(16,185,129,0.06)",
      iconBg: "linear-gradient(135deg, #10b981, #059669)",
      shadow: "rgba(16,185,129,0.2)",
    },
    {
      name: "Total Revenue",
      value: stats?.totalRevenue ? `৳${Number(stats.totalRevenue).toLocaleString()}` : "৳0",
      trend: "Lifetime sales",
      trendUp: true,
      icon: DollarSign,
      accent: "#8b5cf6",
      bgLight: "rgba(139,92,246,0.06)",
      iconBg: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
      shadow: "rgba(139,92,246,0.2)",
    },
  ];

  const quickActions = [
    {
      href: ROUTES.DASHBOARD.PRODUCTS,
      label: "Products",
      sub: "Manage items",
      emoji: "📦",
      accent: "#5a5fef",
      bg: "rgba(90,95,239,0.07)",
    },
    {
      href: ROUTES.DASHBOARD.ORDERS,
      label: "Orders",
      sub: "Process queue",
      emoji: "🛒",
      accent: "#f59e0b",
      bg: "rgba(245,158,11,0.07)",
    },
    {
      href: ROUTES.DASHBOARD.CHAT,
      label: "Live Chat",
      sub: "Customer help",
      emoji: "💬",
      accent: "#10b981",
      bg: "rgba(16,185,129,0.07)",
    },
    {
      href: ROUTES.DASHBOARD.SETTINGS,
      label: "Payments",
      sub: "Gateway config",
      emoji: "💳",
      accent: "#8b5cf6",
      bg: "rgba(139,92,246,0.07)",
    },
  ];

  return (
    <div style={{ maxWidth: 1140, display: "flex", flexDirection: "column", gap: 24 }}>

      {/* ── Hero Banner ── */}
      <div style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 24,
        background: "linear-gradient(130deg, #1e1b4b 0%, #3730a3 30%, #4f46e5 60%, #6d28d9 100%)",
        padding: "32px 36px",
        color: "white",
      }}>
        {/* Decorative blobs */}
        <div style={{
          position: "absolute", top: -50, right: -50,
          width: 200, height: 200, borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -30, left: "40%",
          width: 150, height: 150, borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: "50%", right: 80,
          transform: "translateY(-50%)",
          width: 100, height: 100, borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
          <div>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(255,255,255,0.12)",
              borderRadius: 999,
              padding: "4px 14px",
              marginBottom: 14,
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(8px)",
            }}>
              <Activity size={12} style={{ color: "#fbbf24" }} />
              <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.02em", color: "rgba(255,255,255,0.92)" }}>
                Store Performance Dashboard
              </span>
            </div>
            <h2 style={{
              fontSize: "clamp(22px, 3vw, 30px)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              marginBottom: 8,
            }}>
              Welcome back, {user?.name || "Admin"} 👋
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", maxWidth: 420, lineHeight: 1.6 }}>
              Here is your latest store overview and live order statistics.
            </p>
          </div>

          <Link
            href={ROUTES.DASHBOARD.PRODUCTS}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "11px 20px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.95)",
              color: "#3730a3",
              fontWeight: 800,
              fontSize: 13,
              textDecoration: "none",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            <Plus size={15} />
            Add Product
          </Link>
        </div>
      </div>

      {/* ── Quick Actions Grid ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 14,
      }}>
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 13,
              padding: "14px 16px",
              borderRadius: 18,
              background: "var(--card)",
              border: "1.5px solid var(--card-border)",
              textDecoration: "none",
              transition: "all 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: "var(--shadow-xs)",
            }}
            className="quick-action-link"
          >
            <div style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: action.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              flexShrink: 0,
              transition: "transform 0.2s",
            }}>
              {action.emoji}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{
                fontSize: 13,
                fontWeight: 800,
                color: "var(--foreground)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>
                {action.label}
              </p>
              <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 1 }}>
                {action.sub}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* ── KPI Stats Grid ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 16,
      }}>
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.name}
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 20,
                background: "var(--card)",
                border: "1.5px solid var(--card-border)",
                padding: "20px 22px 18px",
                transition: "all 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "var(--shadow-sm)",
              }}
              className="stat-card-hover"
            >
              {/* Subtle tinted background */}
              <div style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 120,
                height: 120,
                borderRadius: "0 20px 0 120px",
                background: card.bgLight,
                pointerEvents: "none",
              }} />

              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: "var(--muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                  }}>
                    {card.name}
                  </span>
                  <div style={{
                    width: 38,
                    height: 38,
                    borderRadius: 11,
                    background: card.iconBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 6px 16px ${card.shadow}`,
                    flexShrink: 0,
                  }}>
                    <Icon size={18} color="white" />
                  </div>
                </div>

                <div style={{ fontSize: 32, fontWeight: 900, color: "var(--foreground)", letterSpacing: "-0.04em", lineHeight: 1 }}>
                  {statsLoading ? (
                    <div style={{ height: 36, width: 80, borderRadius: 8, background: "var(--muted-bg)", animation: "shimmer 1.6s infinite" }} />
                  ) : (
                    card.value
                  )}
                </div>

                <div style={{
                  marginTop: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: card.trendUp ? "var(--success)" : "var(--muted)",
                }}>
                  {card.trendUp && <TrendingUp size={12} style={{ color: "var(--success)" }} />}
                  <span>{card.trend}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Products Summary ── */}
      <div style={{
        borderRadius: 20,
        background: "var(--card)",
        border: "1.5px solid var(--card-border)",
        overflow: "hidden",
        boxShadow: "var(--shadow-sm)",
      }}>
        {/* Card Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 22px",
          borderBottom: "1px solid var(--card-border)",
          background: "rgba(var(--muted-bg), 0.3)",
        }}>
          <div>
            <h3 style={{
              fontSize: 14.5,
              fontWeight: 800,
              color: "var(--foreground)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              letterSpacing: "-0.02em",
            }}>
              <Package size={16} style={{ color: "var(--primary)" }} />
              Product Inventory Overview
            </h3>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>
              Summary of total available links and pricing
            </p>
          </div>
          <Link
            href={ROUTES.DASHBOARD.PRODUCTS}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              fontSize: 12.5,
              fontWeight: 700,
              color: "var(--primary)",
              textDecoration: "none",
              transition: "opacity 0.15s",
            }}
          >
            Manage All <ArrowRight size={13} />
          </Link>
        </div>

        {/* Card Body */}
        <div style={{ padding: "8px 6px" }}>
          {productsLoading ? (
            <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 10 }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ height: 52, borderRadius: 12, background: "var(--muted-bg)", animation: "shimmer 1.6s infinite" }} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div style={{ padding: "52px 20px", textAlign: "center" }}>
              <Package size={42} style={{ color: "var(--muted-light)", margin: "0 auto 12px" }} />
              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)", marginBottom: 4 }}>
                No products created yet.
              </p>
              <Link
                href={ROUTES.DASHBOARD.PRODUCTS}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 10,
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: "var(--primary)",
                  textDecoration: "none",
                }}
              >
                <Plus size={13} /> Add your first product
              </Link>
            </div>
          ) : (
            <div>
              {products.slice(0, 5).map((product: any, idx: number) => (
                <div
                  key={product.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "13px 16px",
                    borderRadius: 14,
                    transition: "background 0.15s",
                    margin: "2px 0",
                  }}
                  className="product-row-hover"
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: 11,
                      background: "rgba(90,95,239,0.08)",
                      border: "1px solid rgba(90,95,239,0.14)",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 15,
                      fontWeight: 800,
                      color: "var(--primary)",
                      flexShrink: 0,
                    }}>
                      {product.thumbnail ? (
                        <img src={product.thumbnail} alt={product.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        product.title?.[0]?.toUpperCase() || "P"
                      )}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{
                        fontSize: 13.5,
                        fontWeight: 700,
                        color: "var(--foreground)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}>
                        {product.title}
                      </p>
                      <p style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 2 }}>
                        ৳{product.price} per link
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
                    <div style={{ textAlign: "right", display: "none" }} className="sm-block">
                      <p style={{ fontSize: 12.5, fontWeight: 700, color: "var(--foreground)" }}>
                        {product.totalLinks} links
                      </p>
                      <p style={{ fontSize: 11, color: "var(--muted)" }}>
                        {product.totalOrders} orders
                      </p>
                    </div>

                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "3px 10px",
                      borderRadius: 999,
                      fontSize: 10.5,
                      fontWeight: 800,
                      background: product.isPublished
                        ? "rgba(16,185,129,0.1)"
                        : "rgba(100,116,139,0.08)",
                      color: product.isPublished ? "#059669" : "var(--muted)",
                      border: product.isPublished
                        ? "1px solid rgba(16,185,129,0.2)"
                        : "1px solid var(--card-border)",
                    }}>
                      {product.isPublished ? "Live" : "Draft"}
                    </span>

                    <Link
                      href={`/dashboard/products/${product.id}/links`}
                      style={{
                        padding: 6,
                        borderRadius: 8,
                        color: "var(--muted)",
                        transition: "color 0.15s",
                      }}
                      title="Manage links"
                    >
                      <ExternalLink size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
