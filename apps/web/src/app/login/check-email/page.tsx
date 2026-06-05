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
        <p className="account-eyebrow">{isPasswordReset ? "重置邮件已发送" : "账号邮件"}</p>
        <h1>{isPasswordReset ? "打开邮箱重置密码" : "邮箱验证已关闭"}</h1>
        <p className="account-auth-copy">
          {isPasswordReset
            ? "如果账号存在，你会收到一封重置密码邮件。链接会在 1 小时后失效，且只能使用一次。"
            : "当前注册流程不再要求邮箱验证，请直接使用邮箱和密码登录。"}
          {isPasswordReset ? "开发环境如果没有配置 SMTP，请在服务端终端查看链接。" : null}
        </p>
        <Link className="account-secondary-link" href="/login">
          返回登录
        </Link>
      </section>
    </main>
  );
}
