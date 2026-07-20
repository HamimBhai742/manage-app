"use client";

import { ShoppingBag, Search } from "lucide-react";
import { useState } from "react";
import { useGetPublishedProductsQuery } from "@/redux/features/productApi";
import ProductCard from "@/components/product/ProductCard";

export default function ProductsPage() {
  const { data, isLoading } = useGetPublishedProductsQuery(undefined);
  const [search, setSearch] = useState("");

  const products = (data?.data || []).filter((p: any) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 16px" }}>
      {/* Header */}
      <div style={{
        position: "sticky", top: 0, background: "var(--background)",
        zIndex: 10, padding: "20px 0 16px"
      }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>🛒 Products</h1>

        {/* Search */}
        <div style={{ position: "relative" }}>
          <Search size={16} style={{
            position: "absolute", left: 14, top: "50%",
            transform: "translateY(-50%)", color: "var(--muted)"
          }} />
          <input
            className="input"
            style={{ paddingLeft: 40 }}
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Products grid */}
      {isLoading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton" style={{ height: 280, borderRadius: 20 }} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "60px 20px" }}>
          <ShoppingBag size={48} style={{ color: "var(--muted)", margin: "0 auto 16px" }} />
          <p style={{ color: "var(--muted)" }}>{search ? "No products match your search" : "No products available yet"}</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
