import Link from "next/link";
import { requestPasswordReset } from "@/lib/auth/actions";

export default function ForgotPasswordPage() {
  return (
    <main className="account-auth-page">
      <section className="account-auth-panel">
        <Link className="account-auth-logo" href="/tools">
          <span className="account-logo-mark">D</span>
          <span>统一中心</span>
        </Link>
        <p className="account-kicker">Password Recovery</p>
        <h1>找回密码</h1>
        <p className="account-auth-copy">输入注册邮箱。如果账号存在，我们会发送一封重置密码邮件。</p>

        <form action={requestPasswordReset} className="account-auth-form">
          <label htmlFor="email">邮箱</label>
          <input id="email" name="email" placeholder="you@example.com" required type="email" />
          <button type="submit">发送重置邮件</button>
        </form>

        <p className="account-auth-note">
          想起密码了？{" "}
          <Link className="account-text-link" href="/login">
            返回登录
          </Link>
        </p>
      </section>
    </main>
  );
}
