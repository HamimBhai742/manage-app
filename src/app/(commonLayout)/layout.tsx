import BottomNavBar from "@/components/shared/BottomNavBar";
import React from "react";

export default function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div style={{ minHeight: "100dvh", background: "var(--background)" }}>
      <main className="page-content">{children}</main>
      <BottomNavBar />
    </div>
  );
}
