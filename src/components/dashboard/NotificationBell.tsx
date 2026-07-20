"use client";

import { useEffect, useState } from "react";
import { Bell, Check, ShoppingBag, MessageSquare, Info, Volume2, VolumeX, ShieldCheck } from "lucide-react";
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} from "@/redux/features/notificationApi";
import { useSocket } from "@/context/SocketContext";
import { useRouter } from "next/navigation";

export default function NotificationBell() {
  const router = useRouter();
  const { socket, requestNotificationPermission } = useSocket();
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const { data, refetch } = useGetNotificationsQuery(undefined);
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();

  const notifications = data?.data?.notifications || [];
  const unreadCount = data?.data?.unreadCount || 0;

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = () => {
      refetch();
    };

    socket.on("new_notification", handleNewNotification);
    socket.on("new_order", handleNewNotification);

    return () => {
      socket.off("new_notification", handleNewNotification);
      socket.off("new_order", handleNewNotification);
    };
  }, [socket, refetch]);

  const handleNotificationClick = async (notif: any) => {
    if (!notif.isRead) {
      await markAsRead(notif.id);
      refetch();
    }
    setIsOpen(false);
    if (notif.linkUrl) {
      router.push(notif.linkUrl);
    }
  };

  const getIcon = (type: string) => {
    if (type === "NEW_ORDER") return <ShoppingBag size={15} style={{ color: "#6366f1" }} />;
    if (type === "CHAT_MESSAGE") return <MessageSquare size={15} style={{ color: "#ec4899" }} />;
    return <Info size={15} style={{ color: "#f59e0b" }} />;
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Bell Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          requestNotificationPermission();
        }}
        style={{
          position: "relative", padding: 10, borderRadius: 12,
          background: isOpen ? "var(--muted-bg)" : "transparent",
          border: "none", cursor: "pointer", color: "var(--foreground)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span style={{
            position: "absolute", top: 6, right: 6,
            background: "#ef4444", color: "white", fontSize: 10,
            fontWeight: 800, minWidth: 16, height: 16, borderRadius: 999,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "0 4px", border: "2px solid var(--card)"
          }}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div style={{
          position: "absolute", top: 48, right: 0, width: 340,
          background: "var(--card)", border: "1px solid var(--card-border)",
          borderRadius: 20, boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          zIndex: 200, overflow: "hidden"
        }}>
          {/* Header */}
          <div style={{
            padding: "12px 16px", borderBottom: "1px solid var(--card-border)",
            display: "flex", alignItems: "center", justifyContent: "space-between"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <h4 style={{ fontWeight: 800, fontSize: 14 }}>Notifications</h4>
              {unreadCount > 0 && (
                <span style={{
                  background: "#6366f120", color: "#6366f1",
                  fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999
                }}>
                  {unreadCount} new
                </span>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {unreadCount > 0 && (
                <button
                  onClick={async () => { await markAllAsRead(); refetch(); }}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: 11, fontWeight: 600, color: "var(--primary)",
                    display: "flex", alignItems: "center", gap: 3
                  }}
                >
                  <Check size={12} /> Mark all read
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div style={{ maxHeight: 360, overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 16px", color: "var(--muted)" }}>
                <Bell size={28} style={{ margin: "0 auto 8px" }} />
                <p style={{ fontSize: 13 }}>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notif: any) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  style={{
                    padding: "12px 16px", borderBottom: "1px solid var(--card-border)",
                    cursor: "pointer", background: notif.isRead ? "transparent" : "rgba(99, 102, 241, 0.05)",
                    transition: "background 0.15s"
                  }}
                  className="hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{
                      padding: 8, borderRadius: 10, background: "var(--muted-bg)", flexShrink: 0, marginTop: 2
                    }}>
                      {getIcon(notif.type)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: notif.isRead ? 600 : 800, color: "var(--foreground)" }}>
                        {notif.title}
                      </p>
                      <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.4, marginTop: 2 }}>
                        {notif.message}
                      </p>
                      <span style={{ fontSize: 10, color: "var(--muted)", marginTop: 4, display: "block" }}>
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    {!notif.isRead && (
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--primary)", marginTop: 6, flexShrink: 0 }} />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Browser Push Banner */}
          <div style={{
            padding: "10px 16px", background: "var(--muted-bg)",
            borderTop: "1px solid var(--card-border)", display: "flex",
            alignItems: "center", justifyContent: "space-between"
          }}>
            <span style={{ fontSize: 11, color: "var(--muted)", display: "flex", alignItems: "center", gap: 4 }}>
              <ShieldCheck size={13} /> Enable Push Alerts
            </span>
            <button
              onClick={requestNotificationPermission}
              style={{
                fontSize: 11, fontWeight: 700, color: "var(--primary)",
                background: "none", border: "none", cursor: "pointer"
              }}
            >
              Enable
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
