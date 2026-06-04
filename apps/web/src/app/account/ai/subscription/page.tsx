import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";
import { AccountSection, AccountStatusPill } from "@/components/account/AccountUi";
import { getAccountDashboard } from "@/lib/account/account-data";
import { buildAccountInitial } from "@/lib/account/account-view-model";
import { requireUser } from "@/lib/auth/session";

const tiers = [
  { name: "Free", price: "0 / 月", summary: "基础免费工具和少量 AI 试用额度" },
  { name: "Pro", price: "29 / 月", summary: "更多 AI 积分、常用模型优先级和批量额度" },
  { name: "Team", price: "99 / 月", summary: "团队成员、共享额度和审计导出" }
];

export default async function AccountAiSubscriptionPage() {
  const sessionUser = await requireUser();
  const account = await getAccountDashboard(sessionUser.email);

  if (!account) {
    redirect("/login?returnUrl=/account/ai/subscription");
  }

  return (
    <AccountShell email={account.email} initial={buildAccountInitial(account.name, account.email)} name={account.name}>
      <header className="account-page-heading">
        <div>
          <p className="account-kicker">Subscription</p>
          <h1>订阅管理</h1>
          <p className="account-muted">第一阶段不接自动扣费，套餐用于说明后续权益结构。</p>
        </div>
        <AccountStatusPill tone="success">当前 Free</AccountStatusPill>
      </header>

      <AccountSection title="套餐对比">
        <div className="account-product-grid">
          {tiers.map((tier) => (
            <div className="account-stat" key={tier.name}>
              <h2>{tier.name}</h2>
              <strong>{tier.price}</strong>
              <p className="account-muted">{tier.summary}</p>
            </div>
          ))}
        </div>
      </AccountSection>
    </AccountShell>
  );
}
