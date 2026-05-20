"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppHeader() {
  const pathname = usePathname();

  return (
    <nav className="nav" id="nav">
      <div className="container nav-inner">
        <Link className="logo" href="/">
          <span className="logo-mark">T</span>
          <span>工具游戏站</span>
        </Link>

        <ul className="nav-links">
          <li>
            <Link className={pathname === "/" ? "active" : ""} href="/">
              首页
            </Link>
          </li>
          <li>
            <Link className={pathname.startsWith("/tools") ? "active" : ""} href="/tools">
              工具
            </Link>
          </li>
          <li>
            <Link className={pathname.startsWith("/games") ? "active" : ""} href="/games">
              游戏
            </Link>
          </li>
          <li>
            <Link href="/#ai-search" className="accent-btn">
              AI 搜索
            </Link>
          </li>
        </ul>

        <button aria-label="菜单" className="hamburger" type="button">
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}
