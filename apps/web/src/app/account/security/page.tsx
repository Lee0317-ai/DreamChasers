import { redirect } from "next/navigation";
import { getAccountDashboard } from "@/lib/account/account-data";
import { signOutCurrentUser } from "@/lib/auth/actions";
import { requireUser } from "@/lib/auth/session";

export default async function AccountSecurityPage() {
  const sessionUser = await requireUser();
  const account = await getAccountDashboard(sessionUser.email);

  if (!account) {
    redirect("/login?returnUrl=/account/security");
  }

  return (
    <main className="account-page">
      <section className="account-hero compact">
        <p className="account-eyebrow">Security</p>
        <h1>安全设置</h1>
        <p>查看账号安全事件，并退出当前会话。</p>
      </section>
      <section className="account-panel">
        <div className="account-panel-heading">
          <div>
            <p className="account-eyebrow">Audit Log</p>
            <h2>审计记录</h2>
          </div>
          <form action={signOutCurrentUser}>
            <button type="submit">退出登录</button>
          </form>
        </div>
        <div className="account-list">
          {account.auditLogs.length === 0 ? <p className="account-muted">暂无审计记录。</p> : null}
          {account.auditLogs.map((log) => (
            <div className="account-list-row" key={log.id}>
              <strong>{log.action}</strong>
              <span>{log.createdAt.toLocaleString("zh-CN")}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
