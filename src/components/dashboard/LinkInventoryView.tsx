"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Link as LinkIcon, Upload, Copy, Check } from "lucide-react";
import {
  useGetLinksByProductQuery,
  useBulkAddLinksMutation,
  useDeleteLinkMutation,
  useDeleteAllUnusedLinksMutation,
} from "@/redux/features/linkApi";

export default function LinkInventoryView() {
  const { id: productId } = useParams() as { id: string };
  const router = useRouter();

  const { data, isLoading, refetch } = useGetLinksByProductQuery(productId);
  const [bulkAdd, { isLoading: adding }] = useBulkAddLinksMutation();
  const [deleteLink] = useDeleteLinkMutation();
  const [deleteAll] = useDeleteAllUnusedLinksMutation();

  const [bulkText, setBulkText] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const links = data?.data || [];
  const usedCount = links.filter((l: any) => l.isUsed).length;
  const unusedCount = links.filter((l: any) => !l.isUsed).length;

  const handleBulkAdd = async () => {
    setError(""); setSuccess("");
    const urls = bulkText.split("\n").map((u: string) => u.trim()).filter((u: string) => u.length > 0);
    if (urls.length === 0) return setError("Please enter at least one URL");

    try {
      const result = await bulkAdd({ productId, urls }).unwrap();
      setSuccess(`✅ ${result.data.added} links added successfully!`);
      setBulkText("");
      setShowAdd(false);
      refetch();
    } catch (err: any) {
      setError(err?.data?.message || "Failed to add links");
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm(`Delete all ${unusedCount} unused links?`)) return;
    await deleteAll(productId);
    refetch();
  };

  const copyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl flex flex-col gap-6">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Products
      </button>

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <LinkIcon className="text-indigo-600" size={24} />
            Link Inventory Management
          </h2>
          <div className="flex items-center gap-3 mt-2 text-xs font-semibold">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              {unusedCount} Available
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              {usedCount} Used
            </span>
            <span className="text-slate-400 font-normal">({links.length} total URLs)</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {unusedCount > 0 && (
            <button
              onClick={handleDeleteAll}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 text-xs font-bold transition-colors"
            >
              <Trash2 size={14} /> Clear Unused
            </button>
          )}
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition-all"
          >
            <Plus size={16} /> Bulk Add Links
          </button>
        </div>
      </div>

      {/* Messages */}
      {success && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/60 dark:border-emerald-900/50 dark:text-emerald-300 p-3.5 text-xs font-bold">
          {success}
        </div>
      )}
      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/60 dark:border-rose-900/50 dark:text-rose-300 p-3.5 text-xs font-bold">
          {error}
        </div>
      )}

      {/* Bulk Add Form */}
      {showAdd && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-indigo-500/80 p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-base">
            <Upload size={18} className="text-indigo-600" />
            <h3>Bulk Import Inventory URLs</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Paste one redeem link per line. Each line creates a single redeemable link item.
          </p>
          <textarea
            rows={6}
            placeholder="https://one.google.com/offer/redeem?code=...\nhttps://one.google.com/offer/redeem?code=..."
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            className="w-full rounded-xl bg-slate-50 dark:bg-slate-950/80 p-3.5 text-xs font-mono border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
          />
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-bold text-slate-400">
              {bulkText.split("\n").filter((l) => l.trim()).length} link(s) ready to insert
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAdd(false)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkAdd}
                disabled={adding}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/25"
              >
                {adding && <span className="spinner" />}
                {adding ? "Inserting..." : "Upload Links"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Links List */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800/50 animate-pulse" />
          ))}
        </div>
      ) : links.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center text-slate-400">
          <LinkIcon size={40} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No links added yet</p>
          <p className="text-xs text-slate-400 mt-1">Click &quot;Bulk Add Links&quot; to import Google Pro offer links.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {links.map((link: any, idx: number) => (
            <div
              key={link.id}
              className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                link.isUsed
                  ? "bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 opacity-60"
                  : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1 pr-4">
                <span className="text-xs font-mono font-bold text-slate-400 shrink-0 w-8">
                  #{idx + 1}
                </span>
                <span className="text-xs font-mono truncate text-slate-800 dark:text-slate-200">
                  {link.url}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    link.isUsed
                      ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                  }`}
                >
                  {link.isUsed ? "Used" : "Available"}
                </span>

                <button
                  onClick={() => copyUrl(link.id, link.url)}
                  title="Copy URL"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {copiedId === link.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>

                {!link.isUsed && (
                  <button
                    onClick={async () => { await deleteLink(link.id); refetch(); }}
                    title="Delete link"
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

