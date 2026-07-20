"use client";

import { useState } from "react";
import {
  HelpCircle,
  MessageSquare,
  Mail,
  Send,
  CheckCircle2,
  Clock,
  ShieldAlert,
  PhoneCall,
  ExternalLink
} from "lucide-react";

export default function SupportView() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    orderId: "",
    subject: "Payment Verification",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
  };

  const contactChannels = [
    {
      title: "WhatsApp Support",
      sub: "+880 1700-000000",
      action: "Chat on WhatsApp",
      link: "https://wa.me/8801700000000",
      color: "#25D366",
      bg: "#25D36615",
      icon: <PhoneCall size={22} style={{ color: "#25D366" }} />,
    },
    {
      title: "Telegram Community",
      sub: "@GoogleProSupport",
      action: "Join Telegram Channel",
      link: "https://t.me/GoogleProSupport",
      color: "#0088cc",
      bg: "#0088cc15",
      icon: <Send size={22} style={{ color: "#0088cc" }} />,
    },
    {
      title: "Email Support",
      sub: "support@googleprolinks.com",
      action: "Send Email",
      link: "mailto:support@googleprolinks.com",
      color: "#6366f1",
      bg: "#6366f115",
      icon: <Mail size={22} style={{ color: "#6366f1" }} />,
    },
  ];

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "20px 16px" }}>
      {/* Page Header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{
          width: 64, height: 64, borderRadius: 20,
          background: "linear-gradient(135deg, var(--primary), #7c3aed)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px", color: "white", boxShadow: "0 10px 25px rgba(79, 70, 229, 0.3)"
        }}>
          <HelpCircle size={32} />
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: "var(--foreground)" }}>
          Customer Support
        </h1>
        <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 6, maxWidth: 440, margin: "6px auto 0" }}>
          We are here to help you with your Google Pro offer links, orders, and payment verifications.
        </p>
      </div>

      {/* Support Hours Banner */}
      <div className="card" style={{
        padding: "16px 20px", marginBottom: 24,
        background: "linear-gradient(135deg, rgba(79,70,229,0.08) 0%, rgba(124,58,237,0.08) 100%)",
        borderColor: "rgba(79,70,229,0.2)", display: "flex", alignItems: "center", gap: 14
      }}>
        <div style={{
          padding: 10, borderRadius: 12, background: "var(--primary)", color: "white", flexShrink: 0
        }}>
          <Clock size={20} />
        </div>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700 }}>Active Support Hours</h3>
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
            Everyday: <strong>10:00 AM – 11:00 PM (BD Time)</strong>. Response time: ~15 mins.
          </p>
        </div>
      </div>

      {/* Instant Contact Channels */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 32 }}>
        {contactChannels.map((channel, idx) => (
          <div key={idx} className="card" style={{ padding: "20px 16px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{
                width: 44, height: 44, borderRadius: 14, background: channel.bg,
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14
              }}>
                {channel.icon}
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{channel.title}</h3>
              <p style={{ fontSize: 13, color: "var(--muted)", fontFamily: "monospace", marginBottom: 16 }}>
                {channel.sub}
              </p>
            </div>
            <a
              href={channel.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
              style={{
                borderColor: channel.color, color: channel.color, width: "100%", justifyContent: "center"
              }}
            >
              {channel.action}
              <ExternalLink size={14} />
            </a>
          </div>
        ))}
      </div>

      {/* Support Request Form */}
      <div className="card" style={{ padding: "28px 24px", marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <MessageSquare size={22} style={{ color: "var(--primary)" }} />
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800 }}>Submit a Support Ticket</h2>
            <p style={{ fontSize: 13, color: "var(--muted)" }}>Fill in the details below and we will contact you</p>
          </div>
        </div>

        {submitted ? (
          <div style={{ textAlign: "center", padding: "32px 16px" }}>
            <div style={{
              width: 64, height: 64, background: "#d1fae5", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px", color: "#059669"
            }}>
              <CheckCircle2 size={36} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Ticket Submitted!</h3>
            <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6, marginBottom: 20 }}>
              Thank you! Our team has received your ticket and will process your request shortly.
            </p>
            <button className="btn btn-primary" onClick={() => { setSubmitted(false); setForm({ name: "", email: "", orderId: "", subject: "Payment Verification", message: "" }); }}>
              Submit Another Request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
              <div>
                <label className="label">Your Name *</label>
                <input
                  className="input"
                  placeholder="John Doe"
                  required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="label">Your Email *</label>
                <input
                  type="email"
                  className="input"
                  placeholder="name@example.com"
                  required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
              <div>
                <label className="label">Order / Transaction ID (Optional)</label>
                <input
                  className="input"
                  placeholder="e.g. TXN12345678"
                  value={form.orderId}
                  onChange={e => setForm(f => ({ ...f, orderId: e.target.value }))}
                />
              </div>
              <div>
                <label className="label">Issue Category</label>
                <select
                  className="input"
                  value={form.subject}
                  onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                >
                  <option value="Payment Verification">Payment Verification Delay</option>
                  <option value="Link Problem">Link Redeem Problem</option>
                  <option value="Account Issue">Account / Login Issue</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label">Describe Your Problem *</label>
              <textarea
                className="input"
                rows={4}
                placeholder="Write your message here..."
                required
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                style={{ resize: "vertical", fontFamily: "inherit" }}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full" style={{ height: 46 }}>
              <Send size={16} />
              Submit Support Request
            </button>
          </form>
        )}
      </div>

      {/* Security Notice */}
      <div style={{
        background: "var(--muted-bg)", borderRadius: 16, padding: "16px 20px",
        display: "flex", alignItems: "center", gap: 12
      }}>
        <ShieldAlert size={20} style={{ color: "var(--muted)", flexShrink: 0 }} />
        <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>
          <strong>Safety Note:</strong> Our support staff will never ask for your email password or OTP. Always verify you are communicating through our official channels above.
        </p>
      </div>
    </div>
  );
}
