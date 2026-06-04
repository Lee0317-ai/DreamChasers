import Link from "next/link";
import { sanitizeReturnUrl } from "@/lib/account/account-security";
import { requestEmailRegistration } from "@/lib/auth/actions";

type RegisterPageProps = {
  searchParams?: Promise<{
    returnUrl?: string;
  }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  const returnUrl = sanitizeReturnUrl(params?.returnUrl || "/account");

  return (
    <main className="account-auth-page">
      <section className="account-auth-panel">
        <Link className="account-auth-logo" href="/tools">
          <span className="account-logo-mark">D</span>
          <span>统一中心</span>
        </Link>
        <p className="account-kicker">Email Registration</p>
        <h1>创建账号</h1>
        <p className="account-auth-copy">邮箱将作为账号名。设置密码后，我们会发送验证邮件；完成验证后即可用邮箱和密码登录。</p>

        <form action={requestEmailRegistration} className="account-auth-form">
          <input name="returnUrl" type="hidden" value={returnUrl} />
          <label htmlFor="email">邮箱</label>
          <input id="email" name="email" placeholder="you@example.com" required type="email" />
          <label htmlFor="password">密码</label>
          <input id="password" minLength={8} name="password" placeholder="至少 8 位" required type="password" />
          <label htmlFor="confirmPassword">确认密码</label>
          <input id="confirmPassword" minLength={8} name="confirmPassword" placeholder="再次输入密码" required type="password" />
          <button type="submit">注册并发送验证邮件</button>
        </form>

        <p className="account-auth-note">
          已有账号？<Link className="account-text-link" href={`/login?returnUrl=${encodeURIComponent(returnUrl)}`}>返回登录</Link>
        </p>
      </section>
    </main>
  );
}
