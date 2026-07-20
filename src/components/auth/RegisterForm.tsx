"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useRegisterMutation, useLoginMutation } from "@/redux/features/authApi";
import { ROUTES } from "@/constants/routes";
import { User, Mail, Lock, Eye, EyeOff, UserPlus, ArrowLeft } from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [registerApi, { isLoading: isRegistering }] = useRegisterMutation();
  const [loginApi, { isLoading: isLoggingIn }] = useLoginMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const isLoading = isRegistering || isLoggingIn;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      await registerApi({
        name: name.trim(),
        email: email.trim(),
        password,
      }).unwrap();

      const loginRes = await loginApi({
        email: email.trim(),
        password,
      }).unwrap();

      const { user, token } = loginRes.data;
      login(token, user);

      router.push(ROUTES.HOME);
    } catch (err: any) {
      setError(
        err?.data?.message || "Registration failed. Email might already be in use."
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
            <UserPlus size={30} />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "var(--foreground)", letterSpacing: "-0.02em" }}>
            Create Account
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 6 }}>
            Join now to order Google Pro offer links
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
            {/* Full Name */}
            <div>
              <label className="label">Full Name</label>
              <div style={{ position: "relative" }}>
                <User size={18} style={{
                  position: "absolute", left: 14, top: "50%",
                  transform: "translateY(-50%)", color: "var(--muted)"
                }} />
                <input
                  type="text"
                  className="input"
                  style={{ paddingLeft: 42 }}
                  placeholder="John Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            {/* Email Address */}
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

            {/* Password */}
            <div>
              <label className="label">Password (Min. 6 characters)</label>
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
              {isLoading ? <span className="spinner" /> : "Sign Up & Continue"}
            </button>
          </form>

          {/* Footer Link */}
          <div style={{ marginTop: 24, textAlign: "center", borderTop: "1px solid var(--card-border)", paddingTop: 20 }}>
            <p style={{ fontSize: 14, color: "var(--muted)" }}>
              Already have an account?{" "}
              <Link href={ROUTES.LOGIN} style={{ color: "var(--primary)", fontWeight: 700, textDecoration: "none" }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
