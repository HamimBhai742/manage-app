"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Link as LinkIcon, Upload } from "lucide-react";
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

  return (
    <div style={{ maxWidth: 800 }}>
      <button onClick={() => router.back()} style={{
        background: "none", border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", gap: 6,
        color: "var(--primary)", fontWeight: 600, fontSize: 14, marginBottom: 20
      }}>
        <ArrowLeft size={16} /> Back to Products
      </button>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800 }}>🔗 Link Inventory</h2>
          <div style={{ display: "flex", gap: 16, marginTop: 6 }}>
            <span style={{ fontSize: 13, color: "#10b981", fontWeight: 600 }}>{unusedCount} available</span>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>{usedCount} used</span>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>{links.length} total</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {unusedCount > 0 && (
            <button className="btn btn-sm" style={{ background: "#fee2e2", color: "#ef4444", border: "none" }} onClick={handleDeleteAll}>
              <Trash2 size={13} /> Clear Unused
            </button>
          )}
          <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(!showAdd)}>
            <Plus size={14} /> Add Links
          </button>
        </div>
      </div>

      {/* Success/Error messages */}
      {success && (
        <div style={{ background: "#d1fae5", color: "#065f46", padding: "10px 14px", borderRadius: 12, fontSize: 13, marginBottom: 16 }}>
          {success}
        </div>
      )}
      {error && (
        <div style={{ background: "#fee2e2", color: "#991b1b", padding: "10px 14px", borderRadius: 12, fontSize: 13, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Bulk Add Form */}
      {showAdd && (
        <div className="card" style={{ marginBottom: 20, borderColor: "var(--primary)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Upload size={16} style={{ color: "var(--primary)" }} />
            <h3 style={{ fontWeight: 700, fontSize: 15 }}>Bulk Add Links</h3>
          </div>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>
            Paste one Google Pro offer link per line. Each line = one inventory item.
          </p>
          <textarea
            className="input"
            rows={8}
            placeholder={"https://one.google.com/offer/redeem?...&#10;https://one.google.com/offer/redeem?...&#10;https://one.google.com/offer/redeem?..."}
            value={bulkText}
            onChange={e => setBulkText(e.target.value)}
            style={{ resize: "vertical", fontFamily: "monospace", fontSize: 12 }}
          />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>
              {bulkText.split("\n").filter(l => l.trim()).length} link(s) detected
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-sm btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={handleBulkAdd} disabled={adding}>
                {adding && <span className="spinner" />}
                {adding ? "Adding..." : "Add Links"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Links list */}
      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ height: 52, borderRadius: 10 }} />)}
        </div>
      ) : links.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "48px 20px" }}>
          <LinkIcon size={40} style={{ color: "var(--muted)", margin: "0 auto 12px" }} />
          <p style={{ fontWeight: 600, marginBottom: 4 }}>No links added yet</p>
          <p style={{ fontSize: 13, color: "var(--muted)" }}>Click &quot;Add Links&quot; to add Google Pro offer links</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {links.map((link: any, idx: number) => (
            <div key={link.id} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 14px", borderRadius: 12,
              background: link.isUsed ? "var(--muted-bg)" : "var(--card)",
              border: "1px solid var(--card-border)",
              opacity: link.isUsed ? 0.65 : 1
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700, flexShrink: 0 }}>
                  #{idx + 1}
                </span>
                <span style={{
                  fontSize: 12, fontFamily: "monospace", color: link.isUsed ? "var(--muted)" : "var(--foreground)",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                }}>
                  {link.url}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999,
                  background: link.isUsed ? "#fee2e2" : "#d1fae5",
                  color: link.isUsed ? "#991b1b" : "#065f46"
                }}>
                  {link.isUsed ? "Used" : "Available"}
                </span>
                {!link.isUsed && (
                  <button
                    onClick={async () => { await deleteLink(link.id); refetch(); }}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: 4 }}
                  >
                    <Trash2 size={13} />
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
