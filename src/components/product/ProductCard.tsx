"use client";

import { useState } from "react";
import { ShoppingBag, Package } from "lucide-react";
import ProductModal from "./ProductModal";

interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  thumbnail?: string;
  availableQty: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const [modalOpen, setModalOpen] = useState(false);
  const outOfStock = product.availableQty === 0;

  return (
    <>
      <div
        className="product-card"
        onClick={() => !outOfStock && setModalOpen(true)}
        style={{ opacity: outOfStock ? 0.65 : 1, cursor: outOfStock ? "not-allowed" : "pointer" }}
      >
        {/* Thumbnail */}
        <div style={{
          position: "relative", height: 180,
          background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
          overflow: "hidden"
        }}>
          {product.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.thumbnail}
              alt={product.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div style={{
              width: "100%", height: "100%", display: "flex",
              alignItems: "center", justifyContent: "center"
            }}>
              <div style={{
                width: 64, height: 64, background: "rgba(255,255,255,0.15)",
                borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <ShoppingBag size={28} color="white" />
              </div>
            </div>
          )}

          {/* Stock badge */}
          <div style={{
            position: "absolute", top: 12, right: 12,
            background: outOfStock ? "rgba(239,68,68,0.9)" : "rgba(16,185,129,0.9)",
            borderRadius: 999, padding: "4px 10px",
            fontSize: 11, fontWeight: 700, color: "white",
            backdropFilter: "blur(4px)"
          }}>
            {outOfStock ? "Out of Stock" : `${product.availableQty} left`}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "16px" }}>
          <h3 style={{
            fontWeight: 700, fontSize: 16, color: "var(--foreground)",
            marginBottom: 6, lineHeight: 1.3
          }}>
            {product.title}
          </h3>

          {product.description && (
            <p style={{
              fontSize: 13, color: "var(--muted)", lineHeight: 1.5,
              marginBottom: 12,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden"
            } as React.CSSProperties}>
              {product.description}
            </p>
          )}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <span style={{ fontSize: 22, fontWeight: 800, color: "var(--primary)" }}>
                ৳{product.price.toLocaleString()}
              </span>
              <span style={{ fontSize: 12, color: "var(--muted)", marginLeft: 4 }}>/link</span>
            </div>

            <button
              className="btn btn-primary btn-sm"
              disabled={outOfStock}
              style={{ borderRadius: 10 }}
              onClick={(e) => { e.stopPropagation(); setModalOpen(true); }}
            >
              <Package size={14} />
              Order
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <ProductModal product={product} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
