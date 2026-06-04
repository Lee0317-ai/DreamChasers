import Link from "next/link";
import { requestEmailLogin } from "@/lib/auth/actions";
import { sanitizeReturnUrl } from "@/lib/account/account-security";

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
          DreamChasers
        </Link>
        <p className="account-eyebrow">统一账号中心</p>
        <h1>邮箱验证登录</h1>
        <p className="account-auth-copy">输入邮箱后，我们会发送一次性登录链接。新邮箱验证成功后会自动创建平台账号。</p>

        <form action={requestEmailLogin} className="account-auth-form">
          <input name="returnUrl" type="hidden" value={returnUrl} />
          <label htmlFor="email">邮箱</label>
          <input id="email" name="email" placeholder="you@example.com" required type="email" />
          <button type="submit">发送登录邮件</button>
        </form>

        <p className="account-auth-note">登录即表示你同意平台只使用该邮箱识别账号和同步工具权益。</p>
      </section>
    </main>
  );
}
