import Link from "next/link";

type LoginErrorPageProps = {
  searchParams?: Promise<{
    error?: string;
    reason?: string;
    retryAfter?: string;
  }>;
};

const errorCopy: Record<string, string> = {
  AccessDenied: "登录请求被拒绝，请重新发送验证邮件。",
  Configuration: "登录服务配置不完整，请稍后再试。",
  Verification: "登录链接无效或已过期，请重新发送验证邮件。",
  "rate-limited": "登录邮件发送过于频繁，请稍后再试。"
};

export default async function LoginErrorPage({ searchParams }: LoginErrorPageProps) {
  const params = await searchParams;
  const reason = params?.error || params?.reason || "Verification";
  const retryAfter = Number(params?.retryAfter || "0");
  const message =
    reason === "rate-limited" && retryAfter > 0
      ? `登录邮件发送过于频繁，请 ${retryAfter} 秒后再试。`
      : errorCopy[reason] || errorCopy.Verification;

  return (
    <main className="account-auth-page">
      <section className="account-auth-panel">
        <p className="account-eyebrow">登录失败</p>
        <h1>需要重新验证邮箱</h1>
        <p className="account-auth-copy">{message}</p>
        <Link className="account-secondary-link" href="/login">
          重新发送登录邮件
        </Link>
      </section>
    </main>
  );
}
