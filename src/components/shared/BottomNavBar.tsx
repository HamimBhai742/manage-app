"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Package, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/constants/routes";

const navItems = [
  { label: "Home", href: ROUTES.HOME, icon: Home },
  { label: "Products", href: ROUTES.PRODUCTS, icon: ShoppingBag },
  { label: "Orders", href: ROUTES.ORDERS, icon: Package, authRequired: true },
  { label: "Profile", href: ROUTES.PROFILE, icon: User, authRequired: true },
];

export default function BottomNavBar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const href = item.authRequired && !user ? ROUTES.LOGIN : item.href;
        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.label}
            href={href}
            className={`bottom-nav-item${isActive ? " active" : ""}`}
          >
            <Icon
              size={22}
              strokeWidth={isActive ? 2.5 : 1.8}
              style={{ color: isActive ? "var(--primary)" : "var(--muted)" }}
            />
            <span style={{ color: isActive ? "var(--primary)" : "var(--muted)" }}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
