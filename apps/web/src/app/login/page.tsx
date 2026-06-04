import Link from "next/link";
import { sanitizeReturnUrl } from "@/lib/account/account-security";
import { requestEmailLogin } from "@/lib/auth/actions";

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
        <p className="account-kicker">Email Sign-In</p>
        <h1>欢迎回来</h1>
        <p className="account-auth-copy">输入邮箱后，我们会发送一次性登录链接。第一阶段使用邮箱验证统一 DreamChasers 和产品型工具身份。</p>

        <form action={requestEmailLogin} className="account-auth-form">
          <input name="returnUrl" type="hidden" value={returnUrl} />
          <label htmlFor="email">邮箱</label>
          <input id="email" name="email" placeholder="you@example.com" required type="email" />
          <button type="submit">发送登录邮件</button>
        </form>

        <p className="account-auth-note">密码、短信和社交登录会在对应安全能力上线后加入。</p>
      </section>
    </main>
  );
}
