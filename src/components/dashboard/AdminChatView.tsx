"use client";

import { useEffect, useRef, useState } from "react";
import { MessageSquare, Send, User, Search, Clock } from "lucide-react";
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

  const filteredConversations = conversations.filter((c: any) =>
    c.customer.name.toLowerCase().includes(search.toLowerCase()) ||
    c.customer.email.toLowerCase().includes(search.toLowerCase())
  );

  const activeCustomer = conversations.find((c: any) => c.customer.id === selectedCustomerId)?.customer;

  return (
    <div style={{ maxWidth: 1100, height: "calc(100vh - 140px)" }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800 }}>💬 Live Customer Chat</h2>
        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>
          Reply to customer inquiries in real-time
        </p>
      </div>

      <div className="card" style={{ padding: 0, height: "100%", display: "flex", overflow: "hidden" }}>
        {/* Left Side: Conversations List */}
        <div style={{
          width: 320, borderRight: "1px solid var(--card-border)",
          display: "flex", flexDirection: "column"
        }}>
          {/* Search */}
          <div style={{ padding: 14, borderBottom: "1px solid var(--card-border)" }}>
            <div style={{ position: "relative" }}>
              <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
              <input
                className="input"
                style={{ paddingLeft: 36, height: 38, fontSize: 13, borderRadius: 10 }}
                placeholder="Search customer..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {filteredConversations.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 16px", color: "var(--muted)" }}>
                <MessageSquare size={32} style={{ margin: "0 auto 8px" }} />
                <p style={{ fontSize: 13 }}>No active conversations</p>
              </div>
            ) : (
              filteredConversations.map((item: any) => {
                const isSelected = item.customer.id === selectedCustomerId;
                return (
                  <div
                    key={item.customer.id}
                    onClick={() => { setSelectedCustomerId(item.customer.id); refetchMessages(); }}
                    style={{
                      padding: "12px 16px", borderBottom: "1px solid var(--card-border)",
                      cursor: "pointer",
                      background: isSelected ? "var(--primary-light)15" : "transparent",
                      borderLeft: isSelected ? "3px solid var(--primary)" : "3px solid transparent",
                      transition: "all 0.15s"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)" }}>
                        {item.customer.name}
                      </span>
                      <span style={{ fontSize: 10, color: "var(--muted)" }}>
                        {new Date(item.lastMessageAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <p style={{
                        fontSize: 12, color: "var(--muted)", overflow: "hidden",
                        textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 220
                      }}>
                        {item.lastMessage}
                      </p>
                      {item.unreadCount > 0 && (
                        <span style={{
                          background: "#ec4899", color: "white", fontSize: 10,
                          fontWeight: 800, padding: "2px 6px", borderRadius: 999
                        }}>
                          {item.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Active Chat Room */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {selectedCustomerId && activeCustomer ? (
            <>
              {/* Header */}
              <div style={{
                padding: "14px 20px", borderBottom: "1px solid var(--card-border)",
                display: "flex", alignItems: "center", gap: 12, background: "var(--muted-bg)"
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%", background: "var(--primary)",
                  display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700
                }}>
                  {activeCustomer.name[0]}
                </div>
                <div>
                  <h4 style={{ fontWeight: 800, fontSize: 15 }}>{activeCustomer.name}</h4>
                  <p style={{ fontSize: 12, color: "var(--muted)" }}>{activeCustomer.email}</p>
                </div>
              </div>

              {/* Messages Area */}
              <div style={{
                flex: 1, padding: 20, overflowY: "auto", display: "flex",
                flexDirection: "column", gap: 10, background: "var(--background)"
              }}>
                {messages.map((msg, idx) => {
                  const isMine = msg.senderId === user?.id;
                  return (
                    <div key={idx} style={{
                      alignSelf: isMine ? "flex-end" : "flex-start",
                      maxWidth: "70%", display: "flex", flexDirection: "column",
                      alignItems: isMine ? "flex-end" : "flex-start"
                    }}>
                      <div style={{
                        padding: "10px 14px", borderRadius: isMine ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                        background: isMine ? "var(--primary)" : "var(--card)",
                        color: isMine ? "white" : "var(--foreground)",
                        fontSize: 13, lineHeight: 1.5,
                        border: isMine ? "none" : "1px solid var(--card-border)"
                      }}>
                        {msg.message}
                      </div>
                      <span style={{ fontSize: 10, color: "var(--muted)", marginTop: 2, padding: "0 4px" }}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div style={{ padding: 14, borderTop: "1px solid var(--card-border)" }}>
                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ display: "flex", gap: 10 }}>
                  <input
                    className="input"
                    placeholder="Write a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary" style={{ padding: "0 20px" }} disabled={!messageText.trim()}>
                    <Send size={16} />
                    Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--muted)" }}>
              <MessageSquare size={48} style={{ marginBottom: 12, opacity: 0.5 }} />
              <p style={{ fontWeight: 600 }}>Select a customer from the left to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
