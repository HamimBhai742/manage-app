import type { Metadata } from "next";
import AppProviders from "@/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Basione | Google One Pro Offers",
  description: "Get genuine Google One Pro offer links at unbeatable prices. Fast delivery, manual bKash/Nagad payment, 100% working links.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
