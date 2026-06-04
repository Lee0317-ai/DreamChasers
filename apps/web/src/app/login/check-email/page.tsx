import Link from "next/link";

type CheckEmailPageProps = {
  searchParams?: Promise<{
    mode?: string;
  }>;
};

export default async function CheckEmailPage({ searchParams }: CheckEmailPageProps) {
  const params = await searchParams;
  const mode = params?.mode || "verification";
  const isPasswordReset = mode === "password-reset";

  return (
    <main className="account-auth-page">
      <section className="account-auth-panel">
        <p className="account-eyebrow">验证邮件已发送</p>
        <h1>{isPasswordReset ? "打开邮箱重置密码" : "打开邮箱完成注册验证"}</h1>
        <p className="account-auth-copy">
          {isPasswordReset
            ? "如果账号存在，你会收到一封重置密码邮件。链接会在 1 小时后失效，且只能使用一次。"
            : "验证链接会在短时间后失效，且只能使用一次。"}
          开发环境如果没有配置 SMTP，请在服务端终端查看链接。
        </p>
        <Link className="account-secondary-link" href="/login">
          返回登录
        </Link>
      </section>
    </main>
  );
}
