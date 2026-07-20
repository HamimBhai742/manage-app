"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLoginMutation } from "@/redux/features/authApi";
import { ROUTES } from "@/constants/routes";
import { Lock, Mail, Eye, EyeOff, LogIn, ArrowLeft } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [loginApi, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const res = await loginApi({ email: email.trim(), password }).unwrap();
      const { user, token } = res.data;

      login(token, user);

      if (user.role === "admin") {
        router.push(ROUTES.DASHBOARD.HOME);
      } else {
        router.push(ROUTES.HOME);
      }
    } catch (err: any) {
      setError(
        err?.data?.message || "Invalid credentials or server error. Please try again."
      );
    }
  };

  return (
    <div style={{
      minHeight: "100dvh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
      background: "var(--background)",
      position: "relative"
    }}>
      {/* Back to Home Button */}
      <Link href={ROUTES.HOME} style={{
        position: "absolute",
        top: 20,
        left: 20,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        color: "var(--muted)",
        fontSize: 14,
        fontWeight: 600,
        textDecoration: "none"
      }}>
        <ArrowLeft size={18} />
        Home
      </Link>

      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20,
            background: "linear-gradient(135deg, var(--primary), #7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px", color: "white", boxShadow: "0 10px 25px rgba(79, 70, 229, 0.3)"
          }}>
            <LogIn size={30} />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "var(--foreground)", letterSpacing: "-0.02em" }}>
            Welcome Back
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 6 }}>
            Sign in to access your account & orders
          </p>
        </div>

        {/* Form Card */}
        <div className="card" style={{ padding: "28px 24px" }}>
          {error && (
            <div style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "12px 14px",
              borderRadius: 12,
              fontSize: 13,
              marginBottom: 20,
              lineHeight: 1.4
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Email Field */}
            <div>
              <label className="label">Email Address</label>
              <div style={{ position: "relative" }}>
                <Mail size={18} style={{
                  position: "absolute", left: 14, top: "50%",
                  transform: "translateY(-50%)", color: "var(--muted)"
                }} />
                <input
                  type="email"
                  className="input"
                  style={{ paddingLeft: 42 }}
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="label">Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={18} style={{
                  position: "absolute", left: 14, top: "50%",
                  transform: "translateY(-50%)", color: "var(--muted)"
                }} />
                <input
                  type={showPassword ? "text" : "password"}
                  className="input"
                  style={{ paddingLeft: 42, paddingRight: 42 }}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute", right: 14, top: "50%",
                    transform: "translateY(-50%)", background: "none",
                    border: "none", cursor: "pointer", color: "var(--muted)",
                    padding: 0, display: "flex", alignItems: "center"
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={isLoading}
              style={{ marginTop: 8, height: 48 }}
            >
              {isLoading ? <span className="spinner" /> : "Sign In"}
            </button>
          </form>

          {/* Footer Link */}
          <div style={{ marginTop: 24, textAlign: "center", borderTop: "1px solid var(--card-border)", paddingTop: 20 }}>
            <p style={{ fontSize: 14, color: "var(--muted)" }}>
              Don&apos;t have an account?{" "}
              <Link href={ROUTES.REGISTER} style={{ color: "var(--primary)", fontWeight: 700, textDecoration: "none" }}>
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
