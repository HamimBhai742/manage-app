"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "next-themes";
import NotificationBell from "@/components/dashboard/NotificationBell";
import {
  LayoutDashboard,
  Users,
  Menu,
  X,
  LogOut,
  Sun,
  Moon,
  ShoppingBag,
  Package,
  CreditCard,
  MessageCircle,
  Search,
  Sparkles,
  ChevronRight,
  Zap,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const navigation = [
    { name: "Overview",  href: ROUTES.DASHBOARD.HOME,     icon: LayoutDashboard },
    { name: "Products",  href: ROUTES.DASHBOARD.PRODUCTS, icon: ShoppingBag },
    { name: "Orders",    href: ROUTES.DASHBOARD.ORDERS,   icon: Package },
    { name: "Live Chat", href: ROUTES.DASHBOARD.CHAT,     icon: MessageCircle },
    { name: "Users",     href: ROUTES.DASHBOARD.USERS,    icon: Users },
    { name: "Payments",  href: ROUTES.DASHBOARD.SETTINGS, icon: CreditCard },
  ];

  const currentNav = navigation.find((n) => n.href === pathname) || navigation[0];

  return (
    <div style={{
      display: "flex",
      height: "100dvh",
      width: "100%",
      overflow: "hidden",
      background: "var(--background)",
      fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
    }}>

      {/* ── Mobile Overlay ── */}
      {sidebarOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 40,
            background: "rgba(7, 9, 15, 0.55)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ══════════════════════════════
          SIDEBAR
      ══════════════════════════════ */}
      <aside
        className={`dashboard-sidebar${sidebarOpen ? " open" : ""}`}
        style={{
          width: 272,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid var(--sidebar-border)",
          background: "var(--sidebar-bg)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: sidebarOpen ? "var(--shadow-xl)" : "none",
        }}
      >

        {/* Logo */}
        <div style={{
          height: 72,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          borderBottom: "1px solid var(--sidebar-border)",
        }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: "linear-gradient(135deg, #5a5fef, #7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 16px rgba(90,95,239,0.35)",
              flexShrink: 0,
            }}>
              <Zap size={18} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: "var(--foreground)",
                  letterSpacing: "-0.03em",
                }}>
                  Basione
                </span>
                <span style={{
                  fontSize: 9,
                  fontWeight: 800,
                  padding: "2px 6px",
                  borderRadius: 5,
                  background: "rgba(90,95,239,0.1)",
                  color: "var(--primary)",
                  letterSpacing: "0.04em",
                  border: "1px solid rgba(90,95,239,0.18)",
                }}>
                  ADMIN
                </span>
              </div>
              <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 500 }}>
                Management Hub
              </span>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--muted)",
              padding: 6,
              borderRadius: 8,
              display: "flex",
            }}
            className="sidebar-mobile-only"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav Label */}
        <div style={{ padding: "18px 20px 8px" }}>
          <span style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.1em",
            color: "var(--muted-light)",
            textTransform: "uppercase",
          }}>
            Main Menu
          </span>
        </div>

        {/* Navigation Links */}
        <nav style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 12px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 13px",
                  borderRadius: 12,
                  textDecoration: "none",
                  fontSize: 13.5,
                  fontWeight: isActive ? 700 : 600,
                  color: isActive ? "#fff" : "var(--muted)",
                  background: isActive
                    ? "linear-gradient(135deg, #5a5fef, #4338ca)"
                    : "transparent",
                  boxShadow: isActive ? "0 6px 18px rgba(90,95,239,0.3)" : "none",
                  transition: "all 0.18s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                className={!isActive ? "hover-nav-item" : ""}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
                  <Icon
                    size={17}
                    style={{
                      color: isActive ? "rgba(255,255,255,0.95)" : "var(--muted-light)",
                      flexShrink: 0,
                      transition: "color 0.15s",
                    }}
                  />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.name}
                  </span>
                </div>
                {isActive && (
                  <ChevronRight size={14} style={{ color: "rgba(255,255,255,0.7)", flexShrink: 0 }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div style={{
          flexShrink: 0,
          borderTop: "1px solid var(--sidebar-border)",
          padding: 14,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 11,
            padding: "10px 12px",
            borderRadius: 14,
            background: "var(--muted-bg)",
            border: "1px solid var(--card-border)",
          }}>
            <div style={{
              position: "relative",
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #5a5fef, #7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 800,
              color: "white",
              flexShrink: 0,
              boxShadow: "0 4px 10px rgba(90,95,239,0.3)",
            }}>
              {user?.name ? user.name[0].toUpperCase() : "A"}
              <span style={{
                position: "absolute",
                bottom: -1,
                right: -1,
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: "#10b981",
                border: "2px solid var(--muted-bg)",
              }} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{
                fontSize: 12.5,
                fontWeight: 700,
                color: "var(--foreground)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>
                {user?.name || "Admin User"}
              </p>
              <p style={{
                fontSize: 11,
                color: "var(--muted)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>
                {user?.email || "admin@basione.com"}
              </p>
            </div>
          </div>

          <button
            onClick={() => { logout(); window.location.href = "/"; }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              width: "100%",
              padding: "9px 14px",
              borderRadius: 11,
              border: "1px solid rgba(239,68,68,0.22)",
              background: "rgba(239,68,68,0.06)",
              color: "#ef4444",
              fontSize: 12.5,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.18s",
              fontFamily: "inherit",
            }}
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════
          MAIN CONTENT
      ══════════════════════════════ */}
      <div style={{
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}>
        {/* ── Top Header ── */}
        <header style={{
          height: 72,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--card-border)",
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          padding: "0 28px",
          gap: 16,
        }}
        >

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="sidebar-mobile-only"
              style={{
                padding: "8px 9px",
                borderRadius: 10,
                border: "1px solid var(--card-border)",
                background: "none",
                cursor: "pointer",
                color: "var(--muted)",
                display: "flex",
              }}
            >
              <Menu size={19} />
            </button>

            {/* Breadcrumb */}
            <div className="header-breadcrumb" style={{ alignItems: "center", gap: 8, fontSize: 13.5 }}>
              <span style={{ color: "var(--muted)", fontWeight: 500 }}>Dashboard</span>
              <span style={{ color: "var(--card-border)", fontSize: 16 }}>/</span>
              <span style={{ fontWeight: 700, color: "var(--foreground)" }}>{currentNav.name}</span>
            </div>
          </div>

          {/* Search Bar */}
          <div
            className="header-search"
            style={{
              alignItems: "center",
              gap: 9,
              padding: "9px 14px",
              borderRadius: 12,
              background: "var(--muted-bg)",
              border: "1.5px solid var(--card-border)",
              flex: "0 0 auto",
              width: 240,
              cursor: "pointer",
              transition: "border-color 0.18s",
            }}
          >
            <Search size={15} style={{ color: "var(--muted-light)", flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 13, color: "var(--muted)" }}>Search anything...</span>
            <kbd style={{
              padding: "2px 6px",
              borderRadius: 5,
              fontSize: 10,
              fontFamily: "monospace",
              fontWeight: 700,
              background: "var(--card)",
              color: "var(--muted)",
              border: "1px solid var(--card-border)",
            }}>
              ⌘K
            </kbd>
          </div>

          {/* Right Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <NotificationBell />

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                border: "1.5px solid var(--card-border)",
                background: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.18s",
                color: "var(--muted)",
              }}
            >
              <Sun size={17} className="hidden dark:block" style={{ color: "#fbbf24" }} />
              <Moon size={17} className="block dark:hidden" />
            </button>
          </div>
        </header>

        {/* ── Page Content ── */}
        <main style={{
          flex: 1,
          overflowY: "auto",
          padding: "28px 32px",
          outline: "none",
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}
