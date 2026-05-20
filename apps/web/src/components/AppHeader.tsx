import Link from "next/link";

export function AppHeader() {
  return (
    <header className="site-header">
      <div className="brand">
        <strong>DreamChasers</strong>
        <span>免费工具和小游戏门户</span>
      </div>

      <nav className="nav" aria-label="主导航">
        <Link href="/">首页</Link>
        <Link href="#tools">工具</Link>
        <Link href="#games">游戏</Link>
      </nav>
    </header>
  );
}
