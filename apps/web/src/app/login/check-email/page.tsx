import Link from "next/link";

export default function CheckEmailPage() {
  return (
    <main className="account-auth-page">
      <section className="account-auth-panel">
        <p className="account-eyebrow">验证邮件已发送</p>
        <h1>打开邮箱完成登录</h1>
        <p className="account-auth-copy">
          登录链接会在短时间后失效，且只能使用一次。开发环境如果没有配置 SMTP，请在服务端终端查看登录链接。
        </p>
        <Link className="account-secondary-link" href="/login">
          重新输入邮箱
        </Link>
      </section>
    </main>
  );
}
