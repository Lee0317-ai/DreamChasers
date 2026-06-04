import Link from "next/link";
import { completePasswordReset } from "@/lib/auth/actions";

type ResetPasswordPageProps = {
  searchParams?: Promise<{
    email?: string;
    token?: string;
  }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;
  const email = params?.email || "";
  const token = params?.token || "";

  return (
    <main className="account-auth-page">
      <section className="account-auth-panel">
        <Link className="account-auth-logo" href="/tools">
          <span className="account-logo-mark">D</span>
          <span>统一中心</span>
        </Link>
        <p className="account-kicker">Reset Password</p>
        <h1>设置新密码</h1>
        <p className="account-auth-copy">重置链接只能使用一次。新密码至少 8 位，设置后请回到登录页重新登录。</p>

        <form action={completePasswordReset} className="account-auth-form">
          <input name="email" type="hidden" value={email} />
          <input name="token" type="hidden" value={token} />
          <label htmlFor="password">新密码</label>
          <input id="password" minLength={8} name="password" placeholder="至少 8 位" required type="password" />
          <label htmlFor="confirmPassword">确认新密码</label>
          <input id="confirmPassword" minLength={8} name="confirmPassword" placeholder="再次输入新密码" required type="password" />
          <button disabled={!email || !token} type="submit">
            更新密码
          </button>
        </form>

        <p className="account-auth-note">
          链接无效？{" "}
          <Link className="account-text-link" href="/forgot-password">
            重新发送重置邮件
          </Link>
        </p>
      </section>
    </main>
  );
}
