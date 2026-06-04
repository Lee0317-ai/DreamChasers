import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";
import { AccountSection } from "@/components/account/AccountUi";
import { getAccountDashboard } from "@/lib/account/account-data";
import { buildAccountInitial, formatAccountDate } from "@/lib/account/account-view-model";
import { requireUser } from "@/lib/auth/session";

export default async function AccountAiCreditsPage() {
  const sessionUser = await requireUser();
  const account = await getAccountDashboard(sessionUser.email);

  if (!account) {
    redirect("/login?returnUrl=/account/ai/credits");
  }

  return (
    <AccountShell email={account.email} initial={buildAccountInitial(account.name, account.email)} name={account.name}>
      <header className="account-page-heading">
        <div>
          <p className="account-kicker">AI Credits</p>
          <h1>积分管理</h1>
          <p className="account-muted">平台 AI 能力统一从权益账本读取余额和使用记录。</p>
        </div>
        <Link className="account-button" href="/account/ai/recharge">
          充值中心
        </Link>
      </header>

      <AccountSection title="当前余额">
        <div className="account-stat">
          <p className="account-muted">Platform Credits</p>
          <h2>{account.creditBalance} 积分</h2>
          <p className="account-muted">第一阶段只展示账本，不接真实支付。</p>
        </div>
      </AccountSection>

      <AccountSection title="最近 AI 和账号记录">
        <div className="account-list">
          {account.auditLogs.length === 0 ? <p className="account-empty">暂无记录。</p> : null}
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
