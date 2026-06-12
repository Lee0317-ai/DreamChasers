"use client";

import type { ComponentType, ReactNode } from "react";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, Coins, KeyRound, LayoutDashboard, Shield, User } from "lucide-react";
import { accountNavGroups, findActiveAccountNavItem, type AccountNavItem } from "@/lib/account/account-navigation";

const iconMap = {
  boxes: Boxes,
  coins: Coins,
  key: KeyRound,
  "layout-dashboard": LayoutDashboard,
  shield: Shield,
  user: User
} satisfies Record<AccountNavItem["icon"], ComponentType<{ size?: number }>>;

export function AccountShell({
  children,
  email,
  initial,
  name
}: {
  children: ReactNode;
  email: string;
  initial: string;
  name: string;
}) {
  const pathname = usePathname();
  const active = findActiveAccountNavItem(pathname || "/account");
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shell = shellRef.current;

    if (!shell) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const rect = shell.getBoundingClientRect();
      shell.style.setProperty("--account-mouse-x", `${event.clientX - rect.left}px`);
      shell.style.setProperty("--account-mouse-y", `${event.clientY - rect.top}px`);

      const activeSurface = (event.target as Element | null)?.closest<HTMLElement>(
        ".account-card, .account-stat, .account-action, .account-list-row"
      );

      if (!activeSurface) {
        return;
      }

      const surfaceRect = activeSurface.getBoundingClientRect();
      activeSurface.style.setProperty("--surface-mouse-x", `${event.clientX - surfaceRect.left}px`);
      activeSurface.style.setProperty("--surface-mouse-y", `${event.clientY - surfaceRect.top}px`);
    };

    shell.addEventListener("pointermove", handlePointerMove);

    return () => shell.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return (
    <div className="account-shell" ref={shellRef}>
      <div aria-hidden="true" className="account-ambient" />
      <aside aria-label="账号中心导航" className="account-sidebar">
        <Link className="account-sidebar-logo" href="/account">
          <span className="account-logo-mark">D</span>
          <span>统一中心</span>
        </Link>
        <nav className="account-sidebar-nav">
          {accountNavGroups.map((group) => (
            <div className="account-nav-group" key={group.label}>
              <p>{group.label}</p>
              {group.items.map((item) => {
                const Icon = iconMap[item.icon];

                return (
                  <Link className={active?.href === item.href ? "active" : ""} href={item.href} key={item.href}>
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="account-sidebar-user">
          <span className="account-avatar">{initial}</span>
          <span>
            <strong>{name}</strong>
            <small>{email}</small>
          </span>
        </div>
      </aside>
      <main className="account-main">{children}</main>
      <nav aria-label="账号中心移动导航" className="account-mobile-tabs">
        {accountNavGroups
          .slice(0, 2)
          .flatMap((group) => group.items)
          .slice(0, 5)
          .map((item) => {
            const Icon = iconMap[item.icon];

            return (
              <Link className={active?.href === item.href ? "active" : ""} href={item.href} key={item.href}>
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
      </nav>
    </div>
  );
}
