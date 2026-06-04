import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";
import { AccountSection, AccountStatusPill } from "@/components/account/AccountUi";
import { getAccountDashboard } from "@/lib/account/account-data";
import { buildAccountInitial, buildSecuritySummary, formatAccountDate } from "@/lib/account/account-view-model";
import { signOutCurrentUser } from "@/lib/auth/actions";
import { requireUser } from "@/lib/auth/session";

export default async function AccountSecurityPage() {
  const sessionUser = await requireUser();
  const account = await getAccountDashboard(sessionUser.email);

  if (!account) {
    redirect("/login?returnUrl=/account/security");
  }

  const security = buildSecuritySummary({
    auditLogCount: account.auditLogs.length,
    emailVerified: Boolean(account.emailVerified)
  });

  return (
    <AccountShell email={account.email} initial={buildAccountInitial(account.name, account.email)} name={account.name}>
      <header className="account-page-heading">
        <div>
          <p className="account-kicker">Security</p>
          <h1>账号安全</h1>
          <p className="account-muted">{security.description}</p>
        </div>
        <form action={signOutCurrentUser}>
          <button className="account-button secondary" type="submit">
            退出登录
          </button>
        </form>
      </header>

      <AccountSection title="安全能力">
        <div className="account-list">
          <div className="account-list-row">
            <strong>邮箱验证</strong>
            <AccountStatusPill tone="success">已启用</AccountStatusPill>
          </div>
          <div className="account-list-row">
            <strong>密码登录</strong>
            <AccountStatusPill tone="success">已启用</AccountStatusPill>
          </div>
          <div className="account-list-row">
            <strong>注册验证邮件冷却</strong>
            <AccountStatusPill tone="success">已启用</AccountStatusPill>
          </div>
          <div className="account-list-row">
            <strong>手机号</strong>
            <AccountStatusPill>未绑定</AccountStatusPill>
          </div>
          <div className="account-list-row">
            <strong>二步验证</strong>
            <AccountStatusPill>未开放</AccountStatusPill>
          </div>
        </div>
      </AccountSection>

      <AccountSection title="审计记录">
        <div className="account-list">
          {account.auditLogs.length === 0 ? <p className="account-empty">暂无审计记录。</p> : null}
          {account.auditLogs.map((log) => (
            <div className="account-list-row" key={log.id}>
              <strong>{log.action}</strong>
              <span>{formatAccountDate(log.createdAt)}</span>
            </div>
          ))}
        </div>
      </AccountSection>
    </AccountShell>
  );
}
