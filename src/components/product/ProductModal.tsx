"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Minus, Plus, ShoppingBag, ChevronRight, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useGetPaymentSettingsQuery } from "@/redux/features/paymentApi";
import { usePlaceOrderMutation } from "@/redux/features/orderApi";
import { ROUTES } from "@/constants/routes";

interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  thumbnail?: string;
  availableQty: number;
}

type Step = "product" | "payment" | "success";

export default function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("product");
  const [qty, setQty] = useState(1);
  const [form, setForm] = useState({
    transactionId: "",
    senderNumber: "",
    amountPaid: "",
    paymentMethod: "BKASH",
  });
  const [error, setError] = useState("");

  const { data: paymentData } = useGetPaymentSettingsQuery(undefined);
  const [placeOrder, { isLoading }] = usePlaceOrderMutation();

  const total = product.price * qty;
  const paymentSettings = paymentData?.data || [];

  const handleOrder = () => {
    if (!user) {
      onClose();
      router.push(ROUTES.LOGIN);
      return;
    }
    setStep("payment");
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.transactionId.trim()) return setError("Transaction ID is required");
    if (!form.senderNumber.trim()) return setError("Sender number is required");
    if (!form.amountPaid || parseFloat(form.amountPaid) <= 0) return setError("Valid amount is required");

    try {
      await placeOrder({
        productId: product.id,
        quantity: qty,
        transactionId: form.transactionId.trim(),
        senderNumber: form.senderNumber.trim(),
        amountPaid: parseFloat(form.amountPaid),
        paymentMethod: form.paymentMethod,
      }).unwrap();
      setStep("success");
    } catch (err: any) {
      setError(err?.data?.message || "Failed to place order. Please try again.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Handle bar */}
        <div style={{ width: 40, height: 4, background: "var(--card-border)", borderRadius: 4, margin: "0 auto 20px" }} />

        {/* Close button */}
        <button onClick={onClose} style={{
          position: "absolute", top: 20, right: 20, width: 36, height: 36,
          borderRadius: "50%", background: "var(--muted-bg)", border: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: "var(--muted)"
        }}>
          <X size={18} />
        </button>

        {/* ───── STEP 1: Product Detail ───── */}
        {step === "product" && (
          <div>
            {/* Product thumbnail */}
            <div style={{
              height: 180, borderRadius: 16, overflow: "hidden", marginBottom: 20,
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"
            }}>
              {product.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.thumbnail} alt={product.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ShoppingBag size={48} color="white" />
                </div>
              )}
            </div>

            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{product.title}</h2>
            {product.description && (
              <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 16, lineHeight: 1.6 }}>
                {product.description}
              </p>
            )}

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <span style={{ fontSize: 28, fontWeight: 900, color: "var(--primary)" }}>৳{product.price.toLocaleString()}</span>
                <span style={{ fontSize: 13, color: "var(--muted)", marginLeft: 4 }}>/link</span>
              </div>
              <div style={{
                background: "rgba(16,185,129,0.1)", color: "#059669",
                borderRadius: 999, padding: "4px 12px", fontSize: 12, fontWeight: 700
              }}>
                {product.availableQty} available
              </div>
            </div>

            {/* Quantity Selector */}
            <div style={{ marginBottom: 24 }}>
              <label className="label">Quantity</label>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
                <div className="qty-stepper">
                  <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1}>
                    <Minus size={16} />
                  </button>
                  <span className="qty-value">{qty}</span>
                  <button className="qty-btn" onClick={() => setQty(q => Math.min(product.availableQty, q + 1))} disabled={qty >= product.availableQty}>
                    <Plus size={16} />
                  </button>
                </div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>
                  Total: <strong style={{ color: "var(--foreground)", fontSize: 16 }}>৳{total.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            <button className="btn btn-primary btn-full" onClick={handleOrder}>
              {user ? "Proceed to Payment" : "Login to Order"}
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* ───── STEP 2: Payment ───── */}
        {step === "payment" && (
          <div>
            <button onClick={() => setStep("product")} style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--primary)", fontSize: 14, fontWeight: 600, marginBottom: 16,
              display: "flex", alignItems: "center", gap: 4
            }}>
              ← Back
            </button>

            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Complete Payment</h2>
            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>
              Send <strong style={{ color: "var(--foreground)" }}>৳{total.toLocaleString()}</strong> via any method below
            </p>

            {/* Payment options */}
            {paymentSettings.length > 0 && (
              <div style={{ background: "var(--muted-bg)", borderRadius: 16, padding: 16, marginBottom: 20 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Payment Numbers
                </p>
                {paymentSettings.map((ps: any) => (
                  <div key={ps.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--card-border)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: ps.method === "BKASH" ? "#e91e8c20" : ps.method === "NAGAD" ? "#ff630220" : "#8b4cf620",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14, fontWeight: 800,
                        color: ps.method === "BKASH" ? "#e91e8c" : ps.method === "NAGAD" ? "#ff6302" : "#8b4cf6"
                      }}>
                        {ps.method[0]}
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700 }}>{ps.method}</p>
                        <p style={{ fontSize: 13, color: "var(--muted)", fontFamily: "monospace" }}>{ps.number}</p>
                      </div>
                    </div>
                    {ps.qrImageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={ps.qrImageUrl} alt="QR" style={{ width: 48, height: 48, borderRadius: 8 }} />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Payment method select */}
            <div style={{ marginBottom: 16 }}>
              <label className="label">Payment Method</label>
              <select
                className="input"
                value={form.paymentMethod}
                onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))}
              >
                <option value="BKASH">bKash</option>
                <option value="NAGAD">Nagad</option>
                <option value="ROCKET">Rocket</option>
                <option value="BANK">Bank Transfer</option>
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label className="label">Transaction ID</label>
              <input className="input" placeholder="e.g. TXN1234567890" value={form.transactionId}
                onChange={e => setForm(f => ({ ...f, transactionId: e.target.value }))} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label className="label">Sender Number (যে নম্বর থেকে পাঠিয়েছেন)</label>
              <input className="input" placeholder="01XXXXXXXXX" value={form.senderNumber}
                onChange={e => setForm(f => ({ ...f, senderNumber: e.target.value }))} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label className="label">Amount Paid (৳)</label>
              <input className="input" type="number" placeholder={total.toString()} value={form.amountPaid}
                onChange={e => setForm(f => ({ ...f, amountPaid: e.target.value }))} />
            </div>

            {error && (
              <div style={{
                background: "#fee2e2", color: "#991b1b", padding: "10px 14px",
                borderRadius: 10, fontSize: 13, marginBottom: 16
              }}>
                {error}
              </div>
            )}

            <button className="btn btn-primary btn-full" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? <span className="spinner" /> : null}
              {isLoading ? "Submitting..." : "Submit Order"}
            </button>
          </div>
        )}

        {/* ───── STEP 3: Success ───── */}
        {step === "success" && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div className="pop-in" style={{
              width: 80, height: 80, background: "#d1fae5", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px"
            }}>
              <CheckCircle size={40} style={{ color: "#059669" }} />
            </div>

            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Order Placed! 🎉</h2>
            <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6, marginBottom: 28 }}>
              Your order has been submitted. Admin will review your payment and approve it shortly.
              You'll find your links in <strong>My Orders</strong>.
            </p>

            <div style={{ display: "flex", gap: 12, flexDirection: "column" }}>
              <button className="btn btn-primary btn-full" onClick={() => { onClose(); router.push(ROUTES.ORDERS); }}>
                View My Orders
              </button>
              <button className="btn btn-outline btn-full" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
