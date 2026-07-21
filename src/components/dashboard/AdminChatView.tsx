"use client";

import { useEffect, useRef, useState } from "react";
import { MessageSquare, Send, User, Search, Clock, Sparkles } from "lucide-react";
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
    <div className="max-w-6xl space-y-4 h-[calc(100vh-140px)] flex flex-col">
      <div className="shrink-0">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="text-indigo-600" size={24} />
          Live Customer Support
        </h2>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
          Real-time messaging with store buyers and visitors
        </p>
      </div>

      <div className="flex-1 min-h-0 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex overflow-hidden">
        {/* Left Column: Customer Conversations */}
        <div className="w-80 border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col shrink-0">
          <div className="p-3.5 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white rounded-xl pl-9 pr-3.5 py-2 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
            {filteredConversations.length === 0 ? (
              <div className="py-12 text-center text-slate-400 px-4">
                <MessageSquare size={36} className="mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No active chats</p>
                <p className="text-[11px] text-slate-400 mt-0.5">When customers message you, they appear here.</p>
              </div>
            ) : (
              filteredConversations.map((item: any) => {
                const isSelected = item.customer.id === selectedCustomerId;
                return (
                  <div
                    key={item.customer.id}
                    onClick={() => { setSelectedCustomerId(item.customer.id); refetchMessages(); }}
                    className={`p-3.5 cursor-pointer transition-all ${
                      isSelected
                        ? "bg-indigo-50/80 dark:bg-indigo-950/40 border-l-4 border-l-indigo-600"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/40 border-l-4 border-l-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.customer.name}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {new Date(item.lastMessageAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[190px]">
                        {item.lastMessage}
                      </p>
                      {item.unreadCount > 0 && (
                        <span className="bg-rose-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0">
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

        {/* Right Column: Chat Viewport */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50/40 dark:bg-slate-950/20">
          {selectedCustomerId && activeCustomer ? (
            <>
              {/* Active Header */}
              <div className="px-5 py-3.5 border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-sm shadow-indigo-600/30">
                    {activeCustomer.name[0]?.toUpperCase()}
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">{activeCustomer.name}</h4>
                    <p className="text-[11px] text-slate-400">{activeCustomer.email}</p>
                  </div>
                </div>
              </div>

              {/* Messages Viewport */}
              <div className="flex-1 p-5 overflow-y-auto space-y-3">
                {messages.map((msg, idx) => {
                  const isMine = msg.senderId === user?.id;
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                          isMine
                            ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-br-none shadow-md shadow-indigo-600/20"
                            : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200/80 dark:border-slate-700/60 shadow-xs"
                        }`}
                      >
                        {msg.message}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 px-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Toolbar */}
              <div className="p-3.5 border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder="Type a message to customer..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white rounded-xl px-4 py-2.5 border border-slate-200 dark:border-slate-700/60 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={!messageText.trim()}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all"
                  >
                    <Send size={15} />
                    Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <MessageSquare size={48} className="mb-3 text-slate-300 dark:text-slate-700" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Select a customer to view conversation</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Pick a buyer from the left list to respond to support inquiries.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

