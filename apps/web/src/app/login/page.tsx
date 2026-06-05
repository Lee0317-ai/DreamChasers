import Link from "next/link";
import { sanitizeReturnUrl } from "@/lib/account/account-security";
import { loginWithPassword } from "@/lib/auth/actions";

type LoginPageProps = {
  searchParams?: Promise<{
    returnUrl?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const returnUrl = sanitizeReturnUrl(params?.returnUrl);

  return (
    <main className="account-auth-page">
      <section className="account-auth-panel">
        <Link className="account-auth-logo" href="/tools">
          <span className="account-logo-mark">D</span>
          <span>统一中心</span>
        </Link>
        <p className="account-kicker">Email Password Sign-In</p>
        <h1>欢迎回来</h1>
        <p className="account-auth-copy">使用注册邮箱和密码登录。新账号填写邮箱和密码后即可进入。</p>

        <form action={loginWithPassword} className="account-auth-form">
          <input name="returnUrl" type="hidden" value={returnUrl} />
          <label htmlFor="email">邮箱</label>
          <input id="email" name="email" placeholder="you@example.com" required type="email" />
          <label htmlFor="password">密码</label>
          <input id="password" minLength={8} name="password" placeholder="输入密码" required type="password" />
          <button type="submit">登录账号</button>
        </form>

        <p className="account-auth-note">
          还没有账号？<Link className="account-text-link" href={`/register?returnUrl=${encodeURIComponent(returnUrl)}`}>用邮箱注册</Link>
        </p>
        <p className="account-auth-note">
          忘记密码？<Link className="account-text-link" href="/forgot-password">发送重置邮件</Link>
        </p>
      </section>
    </main>
  );
}
