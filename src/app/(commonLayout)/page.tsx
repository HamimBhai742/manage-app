"use client";

import Link from "next/link";
import { ShoppingBag, Zap, Shield, Star } from "lucide-react";
import { useGetPublishedProductsQuery } from "@/redux/features/productApi";
import { ROUTES } from "@/constants/routes";
import ProductCard from "@/components/product/ProductCard";

export default function HomePage() {
  const { data, isLoading } = useGetPublishedProductsQuery(undefined);
  const products = data?.data || [];

  return (
    <div>
      {/* Hero Section */}
      <section className="gradient-hero" style={{ padding: "48px 20px 64px", position: "relative", overflow: "hidden" }}>
        {/* Decorative circles */}
        <div style={{
          position: "absolute", top: -60, right: -60, width: 200, height: 200,
          borderRadius: "50%", background: "rgba(255,255,255,0.08)"
        }} />
        <div style={{
          position: "absolute", bottom: -40, left: -40, width: 160, height: 160,
          borderRadius: "50%", background: "rgba(255,255,255,0.05)"
        }} />

        <div style={{ maxWidth: 480, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(255,255,255,0.15)", borderRadius: 999,
            padding: "4px 14px", marginBottom: 16
          }}>
            <Zap size={13} style={{ color: "#fbbf24" }} />
            <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 12, fontWeight: 600 }}>
              Official Google Pro Deals
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(26px, 8vw, 38px)", fontWeight: 900,
            color: "white", lineHeight: 1.15, marginBottom: 14
          }}>
            Get Google One Pro at Unbeatable Prices 🚀
          </h1>

          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>
            Genuine Google Pro offer links delivered instantly. Secure, fast, and affordable.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href={ROUTES.PRODUCTS} className="btn" style={{
              background: "white", color: "var(--primary)", fontWeight: 700
            }}>
              <ShoppingBag size={18} />
              Browse Products
            </Link>
            <Link href={ROUTES.REGISTER} className="btn" style={{
              background: "rgba(255,255,255,0.15)", color: "white",
              border: "1.5px solid rgba(255,255,255,0.4)"
            }}>
              Sign Up Free
            </Link>
          </div>

          {/* Trust badges */}
          <div style={{ display: "flex", gap: 20, marginTop: 28, flexWrap: "wrap" }}>
            {[
              { icon: <Shield size={14} />, text: "Secure Payment" },
              { icon: <Zap size={14} />, text: "Instant Delivery" },
              { icon: <Star size={14} />, text: "Verified Links" },
            ].map((badge) => (
              <div key={badge.text} style={{ display: "flex", alignItems: "center", gap: 5, color: "rgba(255,255,255,0.85)", fontSize: 12 }}>
                {badge.icon}
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: "32px 16px 0", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--foreground)" }}>
              🔥 Available Offers
            </h2>
            <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>
              Limited quantity — grab yours now
            </p>
          </div>
          <Link href={ROUTES.PRODUCTS} style={{
            fontSize: 13, fontWeight: 600, color: "var(--primary)",
            textDecoration: "none"
          }}>
            View all →
          </Link>
        </div>

        {isLoading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ height: 280, borderRadius: 20 }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "60px 20px" }}>
            <ShoppingBag size={48} style={{ color: "var(--muted)", margin: "0 auto 16px" }} />
            <p style={{ color: "var(--muted)", fontSize: 15 }}>No products available yet. Check back soon!</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {products.slice(0, 6).map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section style={{ padding: "40px 16px", maxWidth: 960, margin: "0 auto" }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--foreground)", marginBottom: 24, textAlign: "center" }}>
          How It Works
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
          {[
            { step: "1", title: "Browse Products", desc: "Find the Google Pro offer that fits you", color: "#6366f1" },
            { step: "2", title: "Place Order", desc: "Select quantity and submit your order", color: "#8b5cf6" },
            { step: "3", title: "Pay Manually", desc: "Send via bKash/Nagad with transaction ID", color: "#ec4899" },
            { step: "4", title: "Get Your Links", desc: "Admin confirms and sends your links", color: "#f59e0b" },
          ].map((item) => (
            <div key={item.step} className="card" style={{ textAlign: "center" }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: item.color + "20", display: "flex",
                alignItems: "center", justifyContent: "center",
                margin: "0 auto 12px", fontSize: 20, fontWeight: 800, color: item.color
              }}>
                {item.step}
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{item.title}</h3>
              <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
