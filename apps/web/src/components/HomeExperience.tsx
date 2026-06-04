import Link from "next/link";

export function HomeExperience() {
  return (
    <div className="portal">
      <div className="portal-account-links" aria-label="账号入口">
        <Link href="/login">登录</Link>
        <Link className="primary" href="/register">
          注册
        </Link>
      </div>

      <Link className="portal-side tools" href="/tools">
        <span className="portal-content">
          <span className="portal-icon">T</span>
          <span className="portal-title">效率工具箱</span>
          <span className="portal-text">PDF 处理、AI 修图、格式转换……工作学习用工具，免费高效。</span>
          <span className="portal-cta">进入工具站</span>
        </span>
      </Link>

      <span className="portal-divider">OR</span>

      <Link className="portal-side games" href="/games">
        <span className="portal-content">
          <span className="portal-icon">G</span>
          <span className="portal-title">休闲游戏馆</span>
          <span className="portal-text">益智解谜、策略挑战、休闲放松……碎片时间，打开即玩。</span>
          <span className="portal-cta">进入游戏馆</span>
        </span>
      </Link>
    </div>
  );
}
