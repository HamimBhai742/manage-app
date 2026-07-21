"use client";

import React from "react";
import { Users, Mail, UserCheck } from "lucide-react";
import { useGetAdminConversationsQuery } from "@/redux/features/chatApi";

export default function AdminUsersView() {
  const { data: convData, isLoading } = useGetAdminConversationsQuery(undefined);
  const conversations = convData?.data || [];

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="text-indigo-600" size={24} />
          Customer & User Accounts
        </h2>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
          Registered buyers and active customer chat profiles
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-slate-100 dark:bg-slate-800/50 animate-pulse" />
          ))}
        </div>
      ) : conversations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center text-slate-400">
          <Users size={40} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No active customer accounts</p>
          <p className="text-xs text-slate-400 mt-1">Registered customer records will appear here as orders and chats are placed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {conversations.map((item: any) => (
            <div
              key={item.customer.id}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 font-extrabold text-base border border-indigo-100 dark:border-indigo-900/50">
                {item.customer.name[0]?.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {item.customer.name}
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                    <UserCheck size={10} /> Customer
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 flex items-center gap-1">
                  <Mail size={12} className="text-slate-400 shrink-0" />
                  {item.customer.email}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
