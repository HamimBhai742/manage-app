"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import { useGetMyMessagesWithAdminQuery } from "@/redux/features/chatApi";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export default function ChatWidget() {
  const router = useRouter();
  const { user } = useAuth();
  const { socket } = useSocket();
  const [isOpen, setIsOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data, refetch } = useGetMyMessagesWithAdminQuery(undefined, { skip: !user });

  useEffect(() => {
    if (data?.data) {
      setMessages(data.data);
    }
  }, [data]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    };

    const handleMessageSent = (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("new_message", handleNewMessage);
    socket.on("message_sent", handleMessageSent);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("message_sent", handleMessageSent);
    };
  }, [socket]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Don't show floating chat on admin dashboard or for admin role
  if (user?.role === "admin") return null;

  const handleSend = () => {
    if (!messageText.trim() || !user || !socket) return;

    // Send via socket
    socket.emit("send_message", {
      senderId: user.id,
      receiverId: "admin", // Handled by server to find admin
      message: messageText.trim(),
    });

    setMessageText("");
  };

  return (
    <div style={{ position: "fixed", bottom: 80, right: 16, zIndex: 150 }}>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => {
            if (!user) {
              router.push(ROUTES.LOGIN);
              return;
            }
            setIsOpen(true);
            refetch();
          }}
          style={{
            width: 54, height: 54, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--primary), #7c3aed)",
            color: "white", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 10px 30px rgba(79, 70, 229, 0.4)",
            transition: "transform 0.2s"
          }}
          className="hover:scale-105"
        >
          <MessageCircle size={26} />
        </button>
      )}

      {/* Live Chat Drawer */}
      {isOpen && (
        <div style={{
          width: "calc(100vw - 32px)", maxWidth: 360, height: 480,
          background: "var(--card)", border: "1px solid var(--card-border)",
          borderRadius: 24, boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
          display: "flex", flexDirection: "column", overflow: "hidden",
          animation: "slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        }}>
          {/* Header */}
          <div style={{
            padding: "14px 18px", background: "linear-gradient(135deg, var(--primary), #7c3aed)",
            color: "white", display: "flex", alignItems: "center", justifyContent: "space-between"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <User size={18} />
              </div>
              <div>
                <h4 style={{ fontWeight: 800, fontSize: 14 }}>Support Team</h4>
                <p style={{ fontSize: 11, opacity: 0.85 }}>● Online — Replies instantly</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{
              background: "rgba(255,255,255,0.15)", border: "none", color: "white",
              borderRadius: "50%", width: 30, height: 30, display: "flex",
              alignItems: "center", justifyContent: "center", cursor: "pointer"
            }}>
              <X size={16} />
            </button>
          </div>

          {/* Messages Container */}
          <div style={{
            flex: 1, padding: "14px", overflowY: "auto",
            display: "flex", flexDirection: "column", gap: 10,
            background: "var(--background)"
          }}>
            <div style={{ textAlign: "center", margin: "8px 0" }}>
              <span style={{
                fontSize: 11, background: "var(--card-border)", color: "var(--muted)",
                padding: "3px 10px", borderRadius: 999
              }}>
                Start of conversation
              </span>
            </div>

            {messages.map((msg, idx) => {
              const isMine = msg.senderId === user?.id;
              return (
                <div key={idx} style={{
                  alignSelf: isMine ? "flex-end" : "flex-start",
                  maxWidth: "80%", display: "flex", flexDirection: "column",
                  alignItems: isMine ? "flex-end" : "flex-start"
                }}>
                  <div style={{
                    padding: "10px 14px", borderRadius: isMine ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                    background: isMine ? "var(--primary)" : "var(--card)",
                    color: isMine ? "white" : "var(--foreground)",
                    fontSize: 13, lineHeight: 1.5,
                    border: isMine ? "none" : "1px solid var(--card-border)",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.03)"
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

          {/* Input Box */}
          <div style={{ padding: "12px", background: "var(--card)", borderTop: "1px solid var(--card-border)" }}>
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ display: "flex", gap: 8 }}>
              <input
                className="input"
                style={{ height: 42, fontSize: 13, borderRadius: 12 }}
                placeholder="Type your message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: 42, height: 42, padding: 0, borderRadius: 12, flexShrink: 0 }}
                disabled={!messageText.trim()}
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
