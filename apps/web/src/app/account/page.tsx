import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";
import { AccountSection } from "@/components/account/AccountUi";
import { ensureDefaultProducts, getAccountDashboard } from "@/lib/account/account-data";
import { buildAccountInitial, buildSecuritySummary, formatAccountDate } from "@/lib/account/account-view-model";
import { requireUser } from "@/lib/auth/session";

export default async function AccountPage() {
  const sessionUser = await requireUser();
  const [account, products] = await Promise.all([getAccountDashboard(sessionUser.email), ensureDefaultProducts()]);

  if (!account) {
    redirect("/login?returnUrl=/account");
  }

  const initial = buildAccountInitial(account.name, account.email);
  const security = buildSecuritySummary({
    auditLogCount: account.auditLogs.length,
    emailVerified: Boolean(account.emailVerified)
  });

  return (
    <AccountShell email={account.email} initial={initial} name={account.name}>
      <header className="account-page-heading">
        <div>
          <p className="account-kicker">Account Center</p>
          <h1>下午好，{account.name}</h1>
          <p className="account-muted">统一管理 DreamChasers 主站、AI 能力和产品型工具入口。</p>
        </div>
        <Link className="account-button secondary" href="/account/profile">
          编辑资料
        </Link>
      </header>

      <div className="account-stats-grid">
        <div className="account-stat">
          <p className="account-muted">安全等级</p>
          <h2>{security.level}</h2>
          <p className="account-muted">{security.description}</p>
        </div>
        <div className="account-stat">
          <p className="account-muted">AI 积分</p>
          <h2>{account.creditBalance}</h2>
          <p className="account-muted">来自平台权益账本。</p>
        </div>
        <div className="account-stat">
          <p className="account-muted">产品接入</p>
          <h2>{products.length}</h2>
          <p className="account-muted">可生成一次性产品 token。</p>
        </div>
      </div>

      <AccountSection eyebrow="Quick Actions" title="快捷操作">
        <div className="account-action-grid">
          <Link className="account-action" href="/account/security">
            <strong>账号安全</strong>
          <p className="account-muted">修改密码、查看审计记录和退出登录。</p>
          </Link>
          <Link className="account-action" href="/account/ai/credits">
            <strong>积分管理</strong>
            <p className="account-muted">查看余额、模型目录、凭据模式和 AI 使用账本。</p>
          </Link>
          <Link className="account-action" href="/account/products">
            <strong>产品接入</strong>
            <p className="account-muted">为 TimePick 等产品生成短时 token。</p>
          </Link>
        </div>
      </AccountSection>

      <AccountSection eyebrow="Recent Activity" title="最近审计记录">
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

      <AccountSection eyebrow="Status" title="账号状态">
        <div className="account-list-row">
          <strong>邮箱密码账号</strong>
          <span>{account.email}</span>
        </div>
      </AccountSection>
    </AccountShell>
  );
}
