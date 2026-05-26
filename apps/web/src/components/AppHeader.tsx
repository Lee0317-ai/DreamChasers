"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppHeader() {
  const pathname = usePathname();
  const isTools = pathname.startsWith("/tools");
  const isGames = pathname.startsWith("/games");

  if (pathname === "/") {
    return null;
  }

  if (pathname === "/tools/ai-photo-editor") {
    return null;
  }

  if (isTools) {
    return (
      <nav className="nav tools-nav" id="nav">
        <div className="container nav-inner">
          <Link className="logo" href="/tools">
            <span className="logo-mark">T</span>
            <span>效率工具箱</span>
          </Link>

          <ul className="nav-links">
            <li>
              <Link className="active" href="/tools">
                全部工具
              </Link>
            </li>
            <li>
              <Link href="/tools#docs">文档</Link>
            </li>
            <li>
              <Link href="/tools#image">图像</Link>
            </li>
            <li>
              <Link href="/tools#ai">AI</Link>
            </li>
            <li>
              <Link className="portal-btn" href="/games">
                去游戏馆
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }

  return (
    <nav className="nav games-nav" id="nav">
      <div className="container nav-inner">
        <Link className="logo" href="/games">
          <span className="logo-mark">G</span>
          <span>休闲游戏馆</span>
        </Link>

        <ul className="nav-links">
          <li>
            <Link className={isGames ? "active" : ""} href="/games">
              全部游戏
            </Link>
          </li>
          <li>
            <Link href="/games#puzzle">益智</Link>
          </li>
          <li>
            <Link href="/games#casual">休闲</Link>
          </li>
          <li>
            <Link href="/games#strategy">策略</Link>
          </li>
          <li>
            <Link className="portal-btn" href="/tools">
              去工具箱
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
