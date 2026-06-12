import Link from "next/link";

export function HomeExperience() {
  return (
    <div className="portal portal-home portal-diagonal-home">
      <div className="portal-world" aria-hidden="true">
        <span className="portal-moon" />
        <span className="portal-forest portal-forest-back" />
        <span className="portal-forest portal-forest-front" />
      </div>
      <div className="portal-account-links" aria-label="账号入口">
        <Link href="/login">登录</Link>
        <Link className="primary" href="/register">
          注册
        </Link>
      </div>

      <Link className="portal-side tools" href="/tools">
        <video className="portal-video" autoPlay muted loop playsInline aria-hidden="true">
          <source src="/videos/home/ice-portal.mp4" type="video/mp4" />
        </video>
        <span className="portal-content">
          <span className="portal-kicker">ICE / TOOLS</span>
          <span className="portal-icon">T</span>
          <span className="portal-title">效率工具箱</span>
          <span className="portal-text">PDF 处理、AI 修图、格式转换，工作学习用工具，免费高效。</span>
          <span className="portal-cta">进入工具站</span>
        </span>
      </Link>

      <Link className="portal-side games" href="/games">
        <video className="portal-video" autoPlay muted loop playsInline aria-hidden="true">
          <source src="/videos/home/fire-portal.mp4" type="video/mp4" />
        </video>
        <span className="portal-content">
          <span className="portal-kicker">FIRE / GAMES</span>
          <span className="portal-icon">G</span>
          <span className="portal-title">休闲游戏馆</span>
          <span className="portal-text">益智解谜、策略挑战、休闲放松，碎片时间，打开即玩。</span>
          <span className="portal-cta">进入游戏馆</span>
        </span>
      </Link>
    </div>
  );
}
