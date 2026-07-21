/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { MessageSquare, Send, Search, Circle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import {
  useGetAdminConversationsQuery,
  useGetMessagesWithUserQuery,
} from "@/redux/features/chatApi";

export default function AdminChatView() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: convData, refetch: refetchConversations } = useGetAdminConversationsQuery(undefined);
  const { data: msgData, refetch: refetchMessages } = useGetMessagesWithUserQuery(selectedCustomerId || "", {
    skip: !selectedCustomerId,
  });

  const conversations = convData?.data || [];

  useEffect(() => {
    if (msgData?.data) {
      setMessages(msgData.data);
    }
  }, [msgData]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg: any) => {
      refetchConversations();
      if (selectedCustomerId && (msg.senderId === selectedCustomerId || msg.receiverId === selectedCustomerId)) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    const handleMessageSent = (msg: any) => {
      if (selectedCustomerId && (msg.senderId === selectedCustomerId || msg.receiverId === selectedCustomerId)) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("new_message", handleNewMessage);
    socket.on("message_sent", handleMessageSent);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("message_sent", handleMessageSent);
    };
  }, [socket, selectedCustomerId, refetchConversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!messageText.trim() || !selectedCustomerId || !socket || !user) return;

    socket.emit("send_message", {
      senderId: user.id,
      receiverId: selectedCustomerId,
      message: messageText.trim(),
    });

    setMessageText("");
  };

  const filteredConversations = conversations.filter(
    (c: any) =>
      c.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      c.customer.email.toLowerCase().includes(search.toLowerCase())
  );

  const activeCustomer = conversations.find((c: any) => c.customer.id === selectedCustomerId)?.customer;

  return (
    <div style={{ maxWidth: 1140, display: "flex", flexDirection: "column", gap: 20, height: "calc(100vh - 140px)" }}>
      {/* ── Page Header ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <div style={{
          width: 38,
          height: 38,
          borderRadius: 12,
          background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 16px rgba(236,72,153,0.3)",
          color: "white",
        }}>
          <MessageSquare size={20} />
        </div>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: "var(--foreground)", letterSpacing: "-0.03em", margin: 0 }}>
            Live Support Desk
          </h2>
          <p style={{ fontSize: 13, color: "var(--muted)", margin: "2px 0 0" }}>
            Real-time chat messaging with buyers and visitors
          </p>
        </div>
      </div>

      {/* ── Main Chat Shell ── */}
      <div style={{
        flex: 1,
        minHeight: 0,
        borderRadius: 22,
        background: "var(--card)",
        border: "1.5px solid var(--card-border)",
        boxShadow: "var(--shadow-sm)",
        display: "flex",
        overflow: "hidden",
      }}>
        {/* ── Left Sidebar: Conversations ── */}
        <div style={{
          width: 300,
          borderRight: "1px solid var(--card-border)",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          background: "var(--sidebar-bg)",
        }}>
          {/* Search Header */}
          <div style={{
            padding: "14px 16px",
            borderBottom: "1px solid var(--card-border)",
            background: "rgba(var(--muted-bg), 0.3)",
          }}>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <Search size={15} style={{ position: "absolute", left: 12, color: "var(--muted-light)" }} />
              <input
                type="text"
                placeholder="Search customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px 8px 36px",
                  background: "var(--card)",
                  border: "1.5px solid var(--card-border)",
                  borderRadius: 12,
                  fontSize: 12.5,
                  color: "var(--foreground)",
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
            </div>
          </div>

          {/* Conversations List */}
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
            {filteredConversations.length === 0 ? (
              <div style={{ padding: "48px 16px", textAlign: "center", color: "var(--muted)" }}>
                <MessageSquare size={36} style={{ margin: "0 auto 10px", opacity: 0.5 }} />
                <p style={{ fontSize: 13, fontWeight: 800, color: "var(--foreground)", marginBottom: 2 }}>
                  No active chats
                </p>
                <p style={{ fontSize: 11.5, color: "var(--muted)" }}>
                  Customer messages will appear here in real-time.
                </p>
              </div>
            ) : (
              filteredConversations.map((item: any) => {
                const isSelected = item.customer.id === selectedCustomerId;
                return (
                  <div
                    key={item.customer.id}
                    onClick={() => {
                      setSelectedCustomerId(item.customer.id);
                      refetchMessages();
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "14px 16px",
                      cursor: "pointer",
                      background: isSelected ? "rgba(90,95,239,0.08)" : "transparent",
                      borderLeft: isSelected ? "3.5px solid var(--primary)" : "3.5px solid transparent",
                      borderBottom: "1px solid var(--card-border)",
                      transition: "all 0.18s ease",
                    }}
                    className={!isSelected ? "hover-nav-item" : ""}
                  >
                    {/* Customer Avatar */}
                    <div style={{
                      position: "relative",
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: "linear-gradient(135deg, #5a5fef, #7c3aed)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: 15,
                      fontWeight: 800,
                      flexShrink: 0,
                      boxShadow: "0 4px 10px rgba(90,95,239,0.25)",
                    }}>
                      {item.customer.name?.[0]?.toUpperCase() || "C"}
                    </div>

                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                        <p style={{
                          fontSize: 13,
                          fontWeight: isSelected ? 800 : 700,
                          color: "var(--foreground)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          margin: 0,
                        }}>
                          {item.customer.name}
                        </p>
                        <span style={{ fontSize: 10.5, color: "var(--muted)", flexShrink: 0 }}>
                          {item.lastMessageAt
                            ? new Date(item.lastMessageAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                            : ""}
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
                        <p style={{
                          fontSize: 11.5,
                          color: isSelected ? "var(--foreground)" : "var(--muted)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          margin: 0,
                        }}>
                          {item.lastMessage || "Started a chat"}
                        </p>
                        {item.unreadCount > 0 && (
                          <span style={{
                            background: "#ef4444",
                            color: "white",
                            fontSize: 10,
                            fontWeight: 800,
                            padding: "2px 7px",
                            borderRadius: 999,
                            flexShrink: 0,
                          }}>
                            {item.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Right Viewport: Active Chat ── */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          background: "var(--background)",
        }}>
          {selectedCustomerId && activeCustomer ? (
            <>
              {/* Active Conversation Header */}
              <div style={{
                height: 64,
                padding: "0 20px",
                borderBottom: "1px solid var(--card-border)",
                background: "var(--card)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    position: "relative",
                    width: 38,
                    height: 38,
                    borderRadius: 11,
                    background: "linear-gradient(135deg, #5a5fef, #7c3aed)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: 800,
                    fontSize: 15,
                    boxShadow: "0 4px 12px rgba(90,95,239,0.3)",
                  }}>
                    {activeCustomer.name?.[0]?.toUpperCase() || "C"}
                    <span style={{
                      position: "absolute",
                      bottom: -1,
                      right: -1,
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      background: "#10b981",
                      border: "2px solid var(--card)",
                    }} />
                  </div>

                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 800, color: "var(--foreground)", margin: 0 }}>
                      {activeCustomer.name}
                    </h4>
                    <p style={{ fontSize: 11.5, color: "var(--muted)", margin: 0 }}>
                      {activeCustomer.email}
                    </p>
                  </div>
                </div>

                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 10px",
                  borderRadius: 999,
                  background: "rgba(16,185,129,0.1)",
                  color: "#059669",
                  fontSize: 11,
                  fontWeight: 700,
                  border: "1px solid rgba(16,185,129,0.2)",
                }}>
                  <Circle size={8} fill="#10b981" color="#10b981" />
                  Live Connected
                </div>
              </div>

              {/* Messages Viewport */}
              <div style={{
                flex: 1,
                padding: "20px 24px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}>
                <div style={{ textAlign: "center", margin: "4px 0 10px" }}>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    background: "var(--muted-bg)",
                    color: "var(--muted)",
                    padding: "4px 14px",
                    borderRadius: 999,
                    border: "1px solid var(--card-border)",
                  }}>
                    Beginning of support chat session
                  </span>
                </div>

                {messages.map((msg, idx) => {
                  const isMine = msg.senderId === user?.id;
                  return (
                    <div
                      key={idx}
                      style={{
                        alignSelf: isMine ? "flex-end" : "flex-start",
                        maxWidth: "75%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: isMine ? "flex-end" : "flex-start",
                      }}
                    >
                      <div
                        style={{
                          padding: "11px 16px",
                          borderRadius: isMine ? "18px 18px 3px 18px" : "18px 18px 18px 3px",
                          background: isMine ? "var(--primary-gradient)" : "var(--card)",
                          color: isMine ? "#ffffff" : "var(--foreground)",
                          fontSize: 13.5,
                          lineHeight: 1.5,
                          border: isMine ? "none" : "1.5px solid var(--card-border)",
                          boxShadow: isMine ? "var(--shadow-primary)" : "var(--shadow-xs)",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {msg.message}
                      </div>
                      <span style={{ fontSize: 10.5, color: "var(--muted)", marginTop: 4, padding: "0 4px", fontWeight: 600 }}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Bottom Toolbar Input */}
              <div style={{
                padding: "14px 18px",
                background: "var(--card)",
                borderTop: "1px solid var(--card-border)",
                flexShrink: 0,
              }}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  style={{ display: "flex", gap: 10, alignItems: "center" }}
                >
                  <input
                    type="text"
                    className="input"
                    style={{ height: 44, borderRadius: 14, fontSize: 13.5 }}
                    placeholder={`Reply to ${activeCustomer.name}...`}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!messageText.trim()}
                    style={{
                      height: 44,
                      padding: "0 22px",
                      borderRadius: 14,
                      flexShrink: 0,
                    }}
                  >
                    <Send size={16} />
                    Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 32,
              textAlign: "center",
            }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                background: "rgba(90,95,239,0.08)",
                border: "1px solid rgba(90,95,239,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--primary)",
                marginBottom: 16,
              }}>
                <MessageSquare size={30} />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: "var(--foreground)", marginBottom: 6 }}>
                Select a Customer Conversation
              </h3>
              <p style={{ fontSize: 13, color: "var(--muted)", maxWidth: 320, lineHeight: 1.5 }}>
                Pick a buyer from the left list to view chat trajectory and reply to support inquiries.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
