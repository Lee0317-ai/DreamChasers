import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";
import { AccountSection, AccountStatusPill } from "@/components/account/AccountUi";
import { getAccountDashboard } from "@/lib/account/account-data";
import { buildAccountInitial, buildSecuritySummary, formatAccountDate } from "@/lib/account/account-view-model";
import { changeCurrentPassword, resendVerificationEmail, signOutCurrentUser } from "@/lib/auth/actions";
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

      <AccountSection title="修改密码">
        <form action={changeCurrentPassword} className="account-inline-form">
          <label htmlFor="currentPassword">当前密码</label>
          <input id="currentPassword" name="currentPassword" placeholder="输入当前密码" required type="password" />
          <label htmlFor="password">新密码</label>
          <input id="password" minLength={8} name="password" placeholder="至少 8 位" required type="password" />
          <label htmlFor="confirmPassword">确认新密码</label>
          <input id="confirmPassword" minLength={8} name="confirmPassword" placeholder="再次输入新密码" required type="password" />
          <button type="submit">更新密码</button>
        </form>
      </AccountSection>

      {!account.emailVerified ? (
        <AccountSection title="重发验证邮件">
          <form action={resendVerificationEmail} className="account-inline-form">
            <input name="email" type="hidden" value={account.email} />
            <input name="returnUrl" type="hidden" value="/account/security" />
            <button type="submit">发送验证邮件</button>
          </form>
        </AccountSection>
      ) : null}

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
