/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Mail, UserCheck, Search, MessageSquare, ExternalLink, ShieldCheck, Calendar } from "lucide-react";
import { useGetAdminConversationsQuery } from "@/redux/features/chatApi";
import { ROUTES } from "@/constants/routes";

export default function AdminUsersView() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { data: convData, isLoading } = useGetAdminConversationsQuery(undefined);
  const conversations = convData?.data || [];

  const filteredConversations = conversations.filter(
    (item: any) =>
      item.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.customer?.email?.toLowerCase().includes(search.toLowerCase())
  );

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
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 16px rgba(59,130,246,0.3)",
              color: "white",
            }}>
              <Users size={20} />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: "var(--foreground)", letterSpacing: "-0.03em" }}>
              Customer & User Accounts
            </h2>
          </div>
          <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>
            Registered buyers and active customer chat profiles ({conversations.length} total)
          </p>
        </div>
      </div>

      {/* ── Filter & Search Bar ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "8px 12px",
        background: "var(--card)",
        border: "1.5px solid var(--card-border)",
        borderRadius: 18,
        boxShadow: "var(--shadow-xs)",
      }}>
        <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center" }}>
          <Search size={16} style={{ position: "absolute", left: 14, color: "var(--muted-light)" }} />
          <input
            type="text"
            placeholder="Search customers by name or email address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px 10px 40px",
              background: "var(--muted-bg)",
              border: "1px solid var(--card-border)",
              borderRadius: 14,
              fontSize: 13,
              color: "var(--foreground)",
              outline: "none",
              fontFamily: "inherit",
              transition: "border-color 0.2s",
            }}
          />
        </div>
      </div>

      {/* ── Customer Accounts Grid ── */}
      {isLoading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton" style={{ height: 110, borderRadius: 20 }} />
          ))}
        </div>
      ) : filteredConversations.length === 0 ? (
        <div className="card" style={{ padding: "56px 24px", textAlign: "center" }}>
          <Users size={46} style={{ color: "var(--muted-light)", margin: "0 auto 14px" }} />
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--foreground)", marginBottom: 4 }}>
            No customer accounts found
          </h3>
          <p style={{ fontSize: 13, color: "var(--muted)" }}>
            Registered customer records will appear here as orders and chat sessions are initiated.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
          {filteredConversations.map((item: any) => (
            <div
              key={item.customer.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 14,
                padding: "18px 20px",
                background: "var(--card)",
                border: "1.5px solid var(--card-border)",
                borderRadius: 20,
                boxShadow: "var(--shadow-xs)",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              className="stat-card-hover"
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0, flex: 1 }}>
                {/* Avatar */}
                <div style={{
                  position: "relative",
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: "linear-gradient(135deg, #5a5fef, #7c3aed)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: 18,
                  fontWeight: 800,
                  flexShrink: 0,
                  boxShadow: "0 6px 16px rgba(90,95,239,0.3)",
                }}>
                  {item.customer.name?.[0]?.toUpperCase() || "U"}
                  <span style={{
                    position: "absolute",
                    bottom: -2,
                    right: -2,
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#10b981",
                    border: "2px solid var(--card)",
                  }} />
                </div>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
                    <h3 style={{
                      fontSize: 14.5,
                      fontWeight: 800,
                      color: "var(--foreground)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      margin: 0,
                      letterSpacing: "-0.01em",
                    }}>
                      {item.customer.name}
                    </h3>

                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "2px 8px",
                      borderRadius: 999,
                      fontSize: 10.5,
                      fontWeight: 800,
                      background: "rgba(16,185,129,0.1)",
                      color: "#059669",
                      border: "1px solid rgba(16,185,129,0.2)",
                    }}>
                      <UserCheck size={10} /> Active Buyer
                    </span>
                  </div>

                  <p style={{
                    fontSize: 12,
                    color: "var(--muted)",
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}>
                    <Mail size={12} style={{ color: "var(--muted-light)", flexShrink: 0 }} />
                    {item.customer.email}
                  </p>
                </div>
              </div>

              {/* Chat Button */}
              <button
                onClick={() => router.push(ROUTES.DASHBOARD.CHAT)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  background: "rgba(90,95,239,0.08)",
                  color: "var(--primary)",
                  border: "1px solid rgba(90,95,239,0.18)",
                  cursor: "pointer",
                  transition: "all 0.18s",
                  flexShrink: 0,
                }}
                title="Open Live Chat with Customer"
              >
                <MessageSquare size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
