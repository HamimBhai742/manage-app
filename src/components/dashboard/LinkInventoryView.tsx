/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Link as LinkIcon,
  UploadCloud,
  Copy,
  Check,
  CheckCircle2,
  CheckSquare,
  Square,
  ExternalLink,
  AlertCircle,
  FileCode,
} from "lucide-react";
import {
  useGetLinksByProductQuery,
  useBulkAddLinksMutation,
  useDeleteLinkMutation,
  useDeleteAllUnusedLinksMutation,
  useDeleteSelectedLinksMutation,
} from "@/redux/features/linkApi";
import { ROUTES } from "@/constants/routes";

export default function LinkInventoryView() {
  const { id: productId } = useParams() as { id: string };
  const router = useRouter();

  const { data, isLoading, refetch } = useGetLinksByProductQuery(productId);
  const [bulkAdd, { isLoading: adding }] = useBulkAddLinksMutation();
  const [deleteLink] = useDeleteLinkMutation();
  const [deleteAll] = useDeleteAllUnusedLinksMutation();
  const [deleteSelected, { isLoading: deletingSelected }] = useDeleteSelectedLinksMutation();

  const [bulkText, setBulkText] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const links = data?.data || [];
  const unusedLinks = links.filter((l: any) => !l.isUsed);
  const usedCount = links.filter((l: any) => l.isUsed).length;
  const unusedCount = unusedLinks.length;

  const toggleSelect = (id: string, isUsed: boolean) => {
    if (isUsed) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAllUnused = () => {
    if (selectedIds.length === unusedCount) {
      setSelectedIds([]);
    } else {
      setSelectedIds(unusedLinks.map((l: any) => l.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} selected links?`)) return;

    setError("");
    setSuccess("");
    try {
      const res = await deleteSelected(selectedIds).unwrap();
      setSuccess(`✅ ${res.data?.deleted || selectedIds.length} selected links deleted!`);
      setSelectedIds([]);
      refetch();
    } catch (err: any) {
      setError(err?.data?.message || "Failed to delete selected links");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setSuccess("");

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        let parsedUrls: string[] = [];

        if (file.name.endsWith(".json") || content.trim().startsWith("[") || content.trim().startsWith("{")) {
          try {
            const json = JSON.parse(content);
            if (Array.isArray(json)) {
              parsedUrls = json
                .map((item: any) => {
                  if (typeof item === "string") return item.trim();
                  if (typeof item === "object" && item !== null) {
                    return (item.url || item.link || item.code || item.offer || Object.values(item)[0] || "")
                      .toString()
                      .trim();
                  }
                  return "";
                })
                .filter((u: string) => u.length > 0);
            } else if (typeof json === "object" && json !== null) {
              const list = json.links || json.urls || json.data || json.items || Object.values(json).find(Array.isArray);
              if (Array.isArray(list)) {
                parsedUrls = list
                  .map((item: any) => {
                    if (typeof item === "string") return item.trim();
                    if (typeof item === "object" && item !== null) {
                      return (item.url || item.link || item.code || item.offer || Object.values(item)[0] || "")
                        .toString()
                        .trim();
                    }
                    return "";
                  })
                  .filter((u: string) => u.length > 0);
              }
            }
          } catch (jsonErr) {
            console.warn("JSON parsing failed, falling back to line parsing", jsonErr);
          }
        }

        if (parsedUrls.length === 0) {
          parsedUrls = content
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter((line) => line.length > 0);
        }

        if (parsedUrls.length === 0) {
          setError("No valid links found in the uploaded file.");
          return;
        }

        setBulkText(parsedUrls.join("\n"));
        setSuccess(`📄 Extracted ${parsedUrls.length} offer links from ${file.name}`);
      }
    };

    reader.onerror = () => {
      setError("Failed to read the uploaded file.");
    };

    reader.readAsText(file);
  };

  const handleBulkAdd = async () => {
    setError("");
    setSuccess("");
    const urls = bulkText
      .split(/\r?\n/)
      .map((u: string) => u.trim())
      .filter((u: string) => u.length > 0);

    if (urls.length === 0) return setError("Please enter or upload at least one URL");

    try {
      const result = await bulkAdd({ productId, urls }).unwrap();
      setSuccess(`✅ ${result.data?.added || urls.length} links added successfully!`);
      setBulkText("");
      setShowAdd(false);
      refetch();
    } catch (err: any) {
      setError(err?.data?.message || "Failed to add links");
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm(`Are you sure you want to delete all ${unusedCount} unused links?`)) return;
    try {
      await deleteAll(productId).unwrap();
      setSelectedIds([]);
      refetch();
    } catch (err: any) {
      setError(err?.data?.message || "Failed to delete unused links");
    }
  };

  const copyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ maxWidth: 1140, display: "flex", flexDirection: "column", gap: 24 }}>
      {/* ── Back Navigation ── */}
      <div>
        <button
          onClick={() => router.push(ROUTES.DASHBOARD.PRODUCTS)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "none",
            color: "var(--primary)",
            fontSize: 13,
            fontWeight: 800,
            cursor: "pointer",
            padding: 0,
            fontFamily: "inherit",
          }}
        >
          <ArrowLeft size={16} /> Back to Products
        </button>
      </div>

      {/* ── Page Header & Stats ── */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "22px 24px",
        background: "var(--card)",
        border: "1.5px solid var(--card-border)",
        borderRadius: 22,
        boxShadow: "var(--shadow-sm)",
        gap: 16,
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: "linear-gradient(135deg, #5a5fef, #7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 16px rgba(90,95,239,0.3)",
              color: "white",
            }}>
              <LinkIcon size={20} />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: "var(--foreground)", letterSpacing: "-0.03em", margin: 0 }}>
              Link Inventory Management
            </h2>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, fontSize: 12 }}>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "3px 10px",
              borderRadius: 999,
              fontWeight: 800,
              background: "rgba(16,185,129,0.1)",
              color: "#059669",
              border: "1px solid rgba(16,185,129,0.2)",
            }}>
              {unusedCount} Available
            </span>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "3px 10px",
              borderRadius: 999,
              fontWeight: 800,
              background: "var(--muted-bg)",
              color: "var(--muted)",
              border: "1px solid var(--card-border)",
            }}>
              {usedCount} Used
            </span>
            <span style={{ color: "var(--muted)", fontWeight: 600 }}>
              ({links.length} total URLs in stock)
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          {unusedCount > 0 && (
            <button
              onClick={handleDeleteAll}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 16px",
                borderRadius: 12,
                background: "rgba(239,68,68,0.08)",
                color: "#ef4444",
                border: "1px solid rgba(239,68,68,0.2)",
                fontSize: 12.5,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.18s",
              }}
            >
              <Trash2 size={14} /> Clear All Unused
            </button>
          )}

          <button
            className="btn btn-primary"
            onClick={() => setShowAdd(!showAdd)}
            style={{ padding: "10px 20px", borderRadius: 12 }}
          >
            <Plus size={16} /> Bulk Add Links
          </button>
        </div>
      </div>

      {/* ── Multi-Select Batch Action Toolbar ── */}
      {unusedCount > 0 && (
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 18px",
          borderRadius: 16,
          background: selectedIds.length > 0 ? "rgba(90,95,239,0.08)" : "var(--card)",
          border: selectedIds.length > 0 ? "1.5px solid var(--primary)" : "1.5px solid var(--card-border)",
          boxShadow: "var(--shadow-xs)",
          gap: 12,
          transition: "all 0.2s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={selectAllUnused}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 800,
                color: "var(--foreground)",
                padding: 0,
                fontFamily: "inherit",
              }}
            >
              {selectedIds.length === unusedCount ? (
                <CheckSquare size={18} style={{ color: "var(--primary)" }} />
              ) : (
                <Square size={18} style={{ color: "var(--muted)" }} />
              )}
              <span>
                {selectedIds.length === unusedCount
                  ? "Deselect All"
                  : `Select All Available (${unusedCount})`}
              </span>
            </button>

            {selectedIds.length > 0 && (
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)" }}>
                • {selectedIds.length} item(s) selected
              </span>
            )}
          </div>

          {selectedIds.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              disabled={deletingSelected}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                borderRadius: 12,
                background: "#ef4444",
                color: "#ffffff",
                border: "none",
                fontSize: 12.5,
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(239,68,68,0.3)",
                fontFamily: "inherit",
                transition: "all 0.18s",
              }}
            >
              {deletingSelected ? <span className="spinner" /> : <Trash2 size={14} />}
              Delete Selected ({selectedIds.length})
            </button>
          )}
        </div>
      )}

      {/* ── Success / Error Banners ── */}
      {success && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 16px",
          borderRadius: 14,
          background: "rgba(16,185,129,0.1)",
          border: "1px solid rgba(16,185,129,0.25)",
          color: "#059669",
          fontSize: 13,
          fontWeight: 700,
        }}>
          <CheckCircle2 size={16} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 16px",
          borderRadius: 14,
          background: "var(--danger-bg)",
          border: "1px solid rgba(239,68,68,0.25)",
          color: "var(--danger)",
          fontSize: 13,
          fontWeight: 700,
        }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* ── Bulk Import Form Box ── */}
      {showAdd && (
        <div style={{
          padding: 24,
          borderRadius: 22,
          background: "var(--card)",
          border: "2px solid var(--primary)",
          boxShadow: "var(--shadow-lg)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          animation: "animate-fade-in 0.2s ease",
        }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "rgba(90,95,239,0.12)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <UploadCloud size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--foreground)", margin: 0 }}>
                  Bulk Import Inventory URLs
                </h3>
                <p style={{ fontSize: 12, color: "var(--muted)", margin: "2px 0 0" }}>
                  Upload a `.json` / `.txt` file or paste offer links below.
                </p>
              </div>
            </div>

            {/* File Upload Button */}
            <div style={{ position: "relative" }}>
              <input
                type="file"
                accept=".json,.txt,.csv,text/plain,application/json"
                onChange={handleFileUpload}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0,
                  width: "100%",
                  height: "100%",
                  cursor: "pointer",
                }}
              />
              <button
                type="button"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  borderRadius: 11,
                  background: "rgba(90,95,239,0.08)",
                  color: "var(--primary)",
                  border: "1px solid rgba(90,95,239,0.2)",
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                <FileCode size={14} />
                <span>Choose .json / .txt File</span>
              </button>
            </div>
          </div>

          <textarea
            rows={6}
            placeholder={`https://one.google.com/offer/redeem?code=XYZ...==\nhttps://one.google.com/offer/redeem?code=ABC...==`}
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            className="input"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12.5,
              padding: 14,
              borderRadius: 14,
              resize: "vertical",
              minHeight: 130,
            }}
          />

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, paddingTop: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)" }}>
              ⚡ {bulkText.split(/\r?\n/).filter((l) => l.trim()).length} link(s) ready to import
            </span>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                onClick={() => setShowAdd(false)}
                style={{
                  padding: "9px 16px",
                  borderRadius: 12,
                  background: "var(--muted-bg)",
                  border: "1px solid var(--card-border)",
                  color: "var(--foreground)",
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleBulkAdd}
                disabled={adding}
                style={{ padding: "9px 20px", borderRadius: 12 }}
              >
                {adding && <span className="spinner" />}
                {adding ? "Importing..." : "Upload Links"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Links Inventory Items List ── */}
      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton" style={{ height: 52, borderRadius: 14 }} />
          ))}
        </div>
      ) : links.length === 0 ? (
        <div className="card" style={{ padding: "56px 24px", textAlign: "center" }}>
          <LinkIcon size={46} style={{ color: "var(--muted-light)", margin: "0 auto 14px" }} />
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--foreground)", marginBottom: 4 }}>
            No links added yet
          </h3>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 18 }}>
            Click &quot;Bulk Add Links&quot; above or upload a `.json` / `.txt` file containing your offer links.
          </p>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>
            <Plus size={14} /> Bulk Add Links
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {links.map((link: any, idx: number) => {
            const isSelected = selectedIds.includes(link.id);
            return (
              <div
                key={link.id}
                onClick={() => toggleSelect(link.id, link.isUsed)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 18px",
                  borderRadius: 14,
                  background: isSelected ? "rgba(90,95,239,0.06)" : "var(--card)",
                  border: isSelected ? "1.5px solid var(--primary)" : "1.5px solid var(--card-border)",
                  boxShadow: "var(--shadow-xs)",
                  opacity: link.isUsed ? 0.6 : 1,
                  gap: 12,
                  transition: "all 0.18s",
                  cursor: link.isUsed ? "default" : "pointer",
                }}
                className="stat-card-hover"
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>
                  {/* Select Checkbox */}
                  {!link.isUsed ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelect(link.id, link.isUsed);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        color: isSelected ? "var(--primary)" : "var(--muted)",
                      }}
                    >
                      {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                    </button>
                  ) : (
                    <div style={{ width: 18 }} />
                  )}

                  <span style={{
                    fontSize: 12,
                    fontFamily: "var(--font-mono)",
                    fontWeight: 800,
                    color: "var(--muted)",
                    width: 36,
                    flexShrink: 0,
                  }}>
                    #{idx + 1}
                  </span>

                  <span style={{
                    fontSize: 12.5,
                    fontFamily: "var(--font-mono)",
                    color: "var(--foreground)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontWeight: 600,
                  }}>
                    {link.url}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "3px 9px",
                    borderRadius: 999,
                    fontSize: 10.5,
                    fontWeight: 800,
                    background: link.isUsed ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
                    color: link.isUsed ? "#ef4444" : "#059669",
                    border: link.isUsed ? "1px solid rgba(239,68,68,0.2)" : "1px solid rgba(16,185,129,0.2)",
                  }}>
                    {link.isUsed ? "Used" : "Available"}
                  </span>

                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      background: "rgba(90,95,239,0.08)",
                      border: "1px solid rgba(90,95,239,0.2)",
                      borderRadius: 9,
                      width: 32,
                      height: 32,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "var(--primary)",
                      transition: "all 0.18s",
                      textDecoration: "none",
                    }}
                    title="Open link in new tab"
                  >
                    <ExternalLink size={14} />
                  </a>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyUrl(link.id, link.url);
                    }}

                    style={{
                      background: "var(--muted-bg)",
                      border: "1px solid var(--card-border)",
                      borderRadius: 9,
                      width: 32,
                      height: 32,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "var(--muted)",
                      transition: "all 0.18s",
                    }}
                    title="Copy URL to Clipboard"
                  >
                    {copiedId === link.id ? (
                      <Check size={14} style={{ color: "#10b981" }} />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>

                  {!link.isUsed && (
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        await deleteLink(link.id);
                        refetch();
                      }}
                      style={{
                        background: "rgba(239,68,68,0.08)",
                        border: "1px solid rgba(239,68,68,0.2)",
                        borderRadius: 9,
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "#ef4444",
                        transition: "all 0.18s",
                      }}
                      title="Delete link"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
