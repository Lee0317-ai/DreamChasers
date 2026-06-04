import Link from "next/link";
import { redirect } from "next/navigation";
import { ProductSessionManager } from "@/components/account/ProductSessionManager";
import { ensureDefaultProducts, getAccountDashboard } from "@/lib/account/account-data";
import { signOutCurrentUser } from "@/lib/auth/actions";
import { requireUser } from "@/lib/auth/session";

export default async function AccountPage() {
  const sessionUser = await requireUser();
  const [account, products] = await Promise.all([getAccountDashboard(sessionUser.email), ensureDefaultProducts()]);

  if (!account) {
    redirect("/login?returnUrl=/account");
  }

  return (
    <main className="account-page">
      <section className="account-hero">
        <p className="account-eyebrow">Account Center</p>
        <h1>账号中心</h1>
        <p>统一管理 DreamChasers 主站、站内工具和后续独立产品型工具的身份与权益。</p>
      </section>

      <section className="account-grid">
        <div className="account-panel account-profile-panel">
          <div>
            <p className="account-eyebrow">Profile</p>
            <h2>{account.name}</h2>
            <p className="account-muted">{account.email}</p>
          </div>
          <span className="account-badge">{account.emailVerified ? "邮箱已验证" : "等待验证"}</span>
        </div>

        <div className="account-panel">
          <p className="account-eyebrow">Credits</p>
          <h2>{account.creditBalance}</h2>
          <p className="account-muted">平台权益账本余额。第一版不接真实支付。</p>
          <Link className="account-secondary-link" href="/account/billing">
            查看权益
          </Link>
        </div>

        <div className="account-panel">
          <p className="account-eyebrow">Security</p>
          <h2>安全记录</h2>
          <p className="account-muted">查看登录、退出、API Key 和产品会话记录。</p>
          <Link className="account-secondary-link" href="/account/security">
            查看安全
          </Link>
        </div>
      </section>

      <ProductSessionManager products={products.map((product) => ({ name: product.name, slug: product.slug }))} />

      <section className="account-panel">
        <div className="account-panel-heading">
          <div>
            <p className="account-eyebrow">Recent Activity</p>
            <h2>最近审计记录</h2>
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
