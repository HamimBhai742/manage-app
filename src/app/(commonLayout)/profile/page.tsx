"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/constants/routes";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.push(ROUTES.LOGIN);
  }, [user, loading, router]);

  const handleLogout = () => {
    logout();
    router.push(ROUTES.HOME);
  };

  if (loading || !user) return null;

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px" }}>
      {/* Avatar */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{
          width: 88, height: 88, borderRadius: "50%",
          background: "linear-gradient(135deg, var(--primary), #7c3aed)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 14px", fontSize: 34, fontWeight: 800, color: "white"
        }}>
          {user.name?.[0]?.toUpperCase()}
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{user.name}</h1>
        <p style={{ fontSize: 14, color: "var(--muted)" }}>{user.email}</p>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: user.role === "admin" ? "#4f46e520" : "#10b98120",
          color: user.role === "admin" ? "#4f46e5" : "#059669",
          borderRadius: 999, padding: "4px 12px", fontSize: 12, fontWeight: 700, marginTop: 10
        }}>
          {user.role === "admin" ? "👑 Admin" : "👤 User"}
        </div>
      </div>

      {/* Profile menu */}
      <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: 16 }}>
        {[
          { icon: <User size={18} />, label: "Account Info", sub: user.name },
          { icon: <Mail size={18} />, label: "Email", sub: user.email },
          { icon: <Lock size={18} />, label: "Change Password", sub: "Update your password", action: () => {} },
        ].map((item, idx) => (
          <div key={idx} onClick={item.action} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 16px",
            borderBottom: idx < 2 ? "1px solid var(--card-border)" : "none",
            cursor: item.action ? "pointer" : "default"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: "var(--muted-bg)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--primary)"
              }}>
                {item.icon}
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600 }}>{item.label}</p>
                <p style={{ fontSize: 12, color: "var(--muted)" }}>{item.sub}</p>
              </div>
            </div>
            {item.action && <ChevronRight size={16} style={{ color: "var(--muted)" }} />}
          </div>
        ))}
      </div>

      {/* Admin dashboard link */}
      {user.role === "admin" && (
        <button className="btn btn-outline btn-full" style={{ marginBottom: 12 }}
          onClick={() => router.push(ROUTES.DASHBOARD.HOME)}>
          👑 Go to Admin Dashboard
        </button>
      )}

      {/* Logout */}
      <button className="btn btn-full" style={{
        background: "#fee2e2", color: "#ef4444", fontWeight: 700, border: "none"
      }} onClick={handleLogout}>
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
}
