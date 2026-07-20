"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Zap,
  Shield,
  Star,
  HardDrive,
  Sparkles,
  Users,
  Lock,
  ChevronDown,
  CheckCircle2,
  Clock,
  ThumbsUp,
  ArrowRight
} from "lucide-react";
import { useGetPublishedProductsQuery } from "@/redux/features/productApi";
import { ROUTES } from "@/constants/routes";
import ProductCard from "@/components/product/ProductCard";

export default function HomeView() {
  const { data, isLoading } = useGetPublishedProductsQuery(undefined);
  const products = data?.data || [];
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "কীভাবে লিঙ্ক রিডিম (Redeem) করব?",
      answer: "এডমিন অর্ডার এপ্রুভ করার পর আপনি আপনার My Orders পেজে অফার লিঙ্ক পেয়ে যাবেন। লিঙ্কে ক্লিক করে আপনার Google একাউন্টে সহজে সক্রিয় করে নিতে পারবেন।"
    },
    {
      question: "একটি অফার লিঙ্ক দিয়ে কি একাধিক একাউন্ট চালু করা যাবে?",
      answer: "না, প্রতিটি অফার লিঙ্ক একেবারেই ইউনিক এবং একবারই ব্যবহারযোগ্য। অর্ডার সফল হওয়ার সাথে সাথে সেটি ইনভেন্টরি থেকে রিমুভ হয়ে যায়।"
    },
    {
      question: "পেমেন্ট করার কতক্ষণ পর লিঙ্ক পাওয়া যায়?",
      answer: "ম্যানুয়াল পেমেন্ট ভেরিফাই করতে সাধারণত ৫-১৫ মিনিট সময় লাগে। এডমিন চেক করে এপ্রুভ করলেই সাথে সাথে লিঙ্ক আপনার অর্ডার ড্যাশবোর্ডে শো করবে।"
    },
    {
      question: "কোন কোন পেমেন্ট মেথড সাপোর্ট করে?",
      answer: "আমরা bKash, Nagad, এবং Rocket সাপোর্ট করি। পেমেন্ট করার পর ট্রান্সজেকশন আইডি এবং সেন্ডার নম্বর সাবমিট করতে হবে।"
    },
    {
      question: "যদি লিঙ্ক কাজ না করে তবে কি হবে?",
      answer: "আমাদের সব লিঙ্ক ১০০% টেস্টেড এবং ভেরিফাইড। কোনো কারণে সমস্যা হলে আমাদের সাপোর্ট প্যানেলে ট্রান্সজেকশন আইডি সহ জানালেই সাথে সাথে রিপ্লেসমেন্ট বা সল্যুশন পেয়ে যাবেন।"
    }
  ];

  const features = [
    {
      icon: <HardDrive size={24} style={{ color: "#6366f1" }} />,
      title: "Huge Cloud Storage",
      desc: "Google Drive, Gmail, & Photos এর জন্য অতিরিক্ত স্টোরেজ সুবিধা নিন।"
    },
    {
      icon: <Sparkles size={24} style={{ color: "#ec4899" }} />,
      title: "Gemini Advanced AI",
      desc: "গুগলের সবচেয়ে পাওয়ারফুল AI ফিচার ব্যবহারের সুযোগ পান।"
    },
    {
      icon: <Users size={24} style={{ color: "#10b981" }} />,
      title: "Family Sharing Support",
      desc: "একটি সাবস্ক্রিপশন আপনার পরিবারের ৫ জন সদস্যের সাথে শেয়ার করার সুবিধা।"
    },
    {
      icon: <Lock size={24} style={{ color: "#f59e0b" }} />,
      title: "Enhanced Security & VPN",
      desc: "আপনার ডাটা সুরক্ষিত রাখতে অ্যাডভান্সড গুগল সিকিউরিটি টুলস।"
    }
  ];

  const reviews = [
    {
      name: "Tanvir Hasan",
      role: "Verified Buyer",
      comment: "খুবই দ্রুত লিঙ্ক পেয়েছি! পেমেন্ট দেওয়ার ১০ মিনিটের মধ্যে এডমিন এপ্রুভ করে দিয়েছে। কাজ করেছে ১০০%!",
      rating: 5
    },
    {
      name: "Mehedi Rahim",
      role: "Verified Buyer",
      comment: "অবিশ্বাস্য কম দামে Google Pro পেলাম। কোনো ঝামেলা ছাড়া এক ক্লিকেই রিডিম হয়ে গেল। Highly recommended!",
      rating: 5
    },
    {
      name: "Sadia Afrin",
      role: "Verified Buyer",
      comment: "পেমেন্ট সিস্টেম খুব সহজ। Nagad এ টাকা পাঠিয়ে Transaction ID দিতেই লিঙ্ক চলে এসেছে। ধন্যবাদ!",
      rating: 5
    }
  ];

  return (
    <div>
      {/* ─── Hero Section ─── */}
      <section className="gradient-hero" style={{ padding: "48px 20px 64px", position: "relative", overflow: "hidden" }}>
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

          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>
            Genuine Google Pro offer links delivered instantly. Secure, fast, and 100% reliable.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href={ROUTES.PRODUCTS} className="btn" style={{
              background: "white", color: "var(--primary)", fontWeight: 700
            }}>
              <ShoppingBag size={18} />
              Browse Offers
            </Link>
            <Link href={ROUTES.REGISTER} className="btn" style={{
              background: "rgba(255,255,255,0.15)", color: "white",
              border: "1.5px solid rgba(255,255,255,0.4)"
            }}>
              Create Account
            </Link>
          </div>

          {/* Trust badges */}
          <div style={{ display: "flex", gap: 18, marginTop: 28, flexWrap: "wrap" }}>
            {[
              { icon: <Shield size={14} />, text: "Manual bKash/Nagad" },
              { icon: <Zap size={14} />, text: "Fast Approval" },
              { icon: <Star size={14} />, text: "100% Working Links" },
            ].map((badge) => (
              <div key={badge.text} style={{ display: "flex", alignItems: "center", gap: 5, color: "rgba(255,255,255,0.9)", fontSize: 12, fontWeight: 500 }}>
                {badge.icon}
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats Counter Bar ─── */}
      <section style={{ maxWidth: 960, margin: "-24px auto 0", padding: "0 16px", position: "relative", zIndex: 10 }}>
        <div className="glass" style={{
          borderRadius: 20, padding: "20px 16px",
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: 16, textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.06)"
        }}>
          <div>
            <p style={{ fontSize: 22, fontWeight: 900, color: "var(--primary)" }}>1,500+</p>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Links Sold</p>
          </div>
          <div>
            <p style={{ fontSize: 22, fontWeight: 900, color: "#10b981" }}>99.8%</p>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Success Rate</p>
          </div>
          <div>
            <p style={{ fontSize: 22, fontWeight: 900, color: "#f59e0b" }}>~10 Min</p>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Avg Approval Time</p>
          </div>
          <div>
            <p style={{ fontSize: 22, fontWeight: 900, color: "#ec4899" }}>24/7</p>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Instant Access</p>
          </div>
        </div>
      </section>

      {/* ─── Featured Products ─── */}
      <section style={{ padding: "40px 16px 0", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--foreground)" }}>
              🔥 Available Offers
            </h2>
            <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>
              Limited stock available — grab yours before it runs out
            </p>
          </div>
          <Link href={ROUTES.PRODUCTS} style={{
            fontSize: 13, fontWeight: 600, color: "var(--primary)",
            textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4
          }}>
            View all <ArrowRight size={14} />
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

      {/* ─── How it works ─── */}
      <section style={{ padding: "48px 16px", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--foreground)", marginBottom: 6 }}>
            ⚡ How It Works
          </h2>
          <p style={{ fontSize: 14, color: "var(--muted)" }}> Simple 4-step process to get your Google Pro offer </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {[
            { step: "1", title: "Select Package", desc: "Choose your preferred Google Pro offer & quantity", color: "#6366f1" },
            { step: "2", title: "Submit Order", desc: "Enter your contact details and proceed to checkout", color: "#8b5cf6" },
            { step: "3", title: "Manual Payment", desc: "Pay via bKash, Nagad or Rocket & provide Trx ID", color: "#ec4899" },
            { step: "4", title: "Get Your Links", desc: "Admin approves order & delivers unique links", color: "#f59e0b" },
          ].map((item) => (
            <div key={item.step} className="card" style={{ textAlign: "center", padding: "24px 16px" }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: item.color + "20", display: "flex",
                alignItems: "center", justifyContent: "center",
                margin: "0 auto 14px", fontSize: 20, fontWeight: 800, color: item.color
              }}>
                {item.step}
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{item.title}</h3>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Why Choose Google One Pro Features ─── */}
      <section style={{ padding: "16px 16px 48px", maxWidth: 960, margin: "0 auto" }}>
        <div className="card" style={{ padding: "32px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Key Benefits
            </span>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--foreground)", marginTop: 4 }}>
              Why Choose Google One Pro?
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 20 }}>
            {features.map((feat, idx) => (
              <div key={idx} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{
                  padding: 10, borderRadius: 12, background: "var(--muted-bg)", flexShrink: 0
                }}>
                  {feat.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{feat.title}</h3>
                  <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Reviews / Testimonials Section ─── */}
      <section style={{ padding: "0 16px 48px", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Real Feedback
          </span>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--foreground)", marginTop: 4 }}>
            What Our Customers Say ⭐
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {reviews.map((rev, idx) => (
            <div key={idx} className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", gap: 4, marginBottom: 12, color: "#f59e0b" }}>
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={15} fill="#f59e0b" />
                  ))}
                </div>
                <p style={{ fontSize: 13, color: "var(--foreground)", lineHeight: 1.6, marginBottom: 16 }}>
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, borderTop: "1px solid var(--card-border)", paddingTop: 12 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%", background: "var(--primary-light)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "white", fontSize: 14, fontWeight: 700
                }}>
                  {rev.name[0]}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700 }}>{rev.name}</p>
                  <p style={{ fontSize: 11, color: "#10b981", fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>
                    <CheckCircle2 size={11} /> {rev.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Accordion FAQ Section ─── */}
      <section style={{ padding: "0 16px 48px", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--foreground)" }}>
            ❓ Frequently Asked Questions
          </h2>
          <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 4 }}>
            Got questions? We have answers.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="card"
                onClick={() => toggleFaq(idx)}
                style={{ padding: "16px 20px", cursor: "pointer", transition: "all 0.2s" }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)" }}>
                    {faq.question}
                  </h3>
                  <ChevronDown
                    size={18}
                    style={{
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                      color: "var(--muted)",
                      flexShrink: 0
                    }}
                  />
                </div>
                {isOpen && (
                  <p style={{
                    fontSize: 14, color: "var(--muted)", lineHeight: 1.6,
                    marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--card-border)"
                  }}>
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Bottom CTA Banner ─── */}
      <section style={{ padding: "0 16px 32px", maxWidth: 960, margin: "0 auto" }}>
        <div className="gradient-hero" style={{
          borderRadius: 24, padding: "36px 24px", textAlign: "center", color: "white"
        }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>
            Ready to Upgrade Your Storage? 🚀
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", marginBottom: 20, maxWidth: 440, margin: "0 auto 20px" }}>
            Get your instant Google One Pro offer link now and enjoy premium storage & AI features.
          </p>
          <Link href={ROUTES.PRODUCTS} className="btn" style={{
            background: "white", color: "var(--primary)", fontWeight: 700, padding: "12px 28px"
          }}>
            Explore Offers Now
          </Link>
        </div>
      </section>
    </div>
  );
}
