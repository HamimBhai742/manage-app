/* eslint-disable @typescript-eslint/no-explicit-any */
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
    if (type === "NEW_ORDER") return <ShoppingBag size={15} className="text-indigo-600 dark:text-indigo-400" />;
    if (type === "CHAT_MESSAGE") return <MessageSquare size={15} className="text-pink-600 dark:text-pink-400" />;
    return <Info size={15} className="text-amber-500" />;
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          requestNotificationPermission();
        }}
        className={`relative p-2.5 rounded-xl border transition-all ${
          isOpen
            ? "bg-slate-100 dark:bg-slate-800 border-indigo-500 text-indigo-600 dark:text-indigo-400"
            : "border-slate-200/80 dark:border-slate-800 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        }`}
        aria-label="Notifications"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white ring-2 ring-white dark:ring-slate-900 animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-12 z-40 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-black text-slate-900 dark:text-white">Notifications</h4>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 text-[10px] font-extrabold">
                    {unreadCount} new
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={async () => { await markAllAsRead(); refetch(); }}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1"
                >
                  <Check size={13} /> Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
              {notifications.length === 0 ? (
                <div className="py-10 text-center text-slate-400 px-4">
                  <Bell size={32} className="mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No notifications yet</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Real-time alerts will show up here.</p>
                </div>
              ) : (
                notifications.map((notif: any) => (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-3.5 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                      notif.isRead ? "bg-white dark:bg-slate-900" : "bg-indigo-50/40 dark:bg-indigo-950/20"
                    }`}
                  >
                    <div className="flex gap-3 items-start">
                      <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs ${notif.isRead ? "font-semibold text-slate-800 dark:text-slate-200" : "font-black text-slate-900 dark:text-white"}`}>
                          {notif.title}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5 line-clamp-2">
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1.5 block font-mono">
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      {!notif.isRead && (
                        <span className="h-2 w-2 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Browser Push Banner */}
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-500" /> Desktop Notifications
              </span>
              <button
                onClick={requestNotificationPermission}
                className="text-[11px] font-bold text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Enable
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

