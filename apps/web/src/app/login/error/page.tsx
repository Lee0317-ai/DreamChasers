import Link from "next/link";

type LoginErrorPageProps = {
  searchParams?: Promise<{
    error?: string;
    reason?: string;
    retryAfter?: string;
  }>;
};

const errorCopy: Record<string, string> = {
  "account-exists": "这个邮箱已经注册，请直接使用邮箱和密码登录。",
  AccessDenied: "登录请求被拒绝，请重新登录。",
  Configuration: "登录服务配置不完整，请稍后再试。",
  "current-password-invalid": "当前密码不正确，请重新输入。",
  "invalid-credentials": "邮箱或密码不正确，请检查后重试。",
  "invalid-email": "请输入有效邮箱地址。",
  "password-mismatch": "两次输入的密码不一致，请重新注册。",
  "password-updated": "密码已经更新，请使用新密码登录。",
  "password-too-short": "密码至少需要 8 位。",
  "reset-token-invalid": "重置密码链接无效或已过期，请重新发送重置邮件。",
  Verification: "登录链接无效或已过期，请重新登录。",
  "rate-limited": "请求过于频繁，请稍后再试。"
};

export default async function LoginErrorPage({ searchParams }: LoginErrorPageProps) {
  const params = await searchParams;
  const reason = params?.error || params?.reason || "Verification";
  const retryAfter = Number(params?.retryAfter || "0");
  const message =
    reason === "rate-limited" && retryAfter > 0
      ? `请求过于频繁，请 ${retryAfter} 秒后再试。`
      : errorCopy[reason] || errorCopy.Verification;

  return (
    <main className="account-auth-page">
      <section className="account-auth-panel">
        <p className="account-eyebrow">登录失败</p>
        <h1>无法继续账号操作</h1>
        <p className="account-auth-copy">{message}</p>
        <Link className="account-secondary-link" href="/login">
          返回登录
        </Link>
      </section>
    </main>
  );
}
