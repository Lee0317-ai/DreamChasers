import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";
import { AccountSection, AccountStatusPill } from "@/components/account/AccountUi";
import { getAccountDashboard } from "@/lib/account/account-data";
import { buildAccountInitial } from "@/lib/account/account-view-model";
import { requireUser } from "@/lib/auth/session";

const plans = [
  { credits: "1,000", detail: "适合临时试用", price: "10 元" },
  { credits: "5,000", detail: "适合轻度 AI 工具使用", price: "45 元" },
  { credits: "10,000", detail: "适合常用 AI 处理", price: "80 元" },
  { credits: "50,000", detail: "适合批量任务和团队前期验证", price: "350 元" }
];

export default async function AccountAiRechargePage() {
  const sessionUser = await requireUser();
  const account = await getAccountDashboard(sessionUser.email);

  if (!account) {
    redirect("/login?returnUrl=/account/ai/recharge");
  }

  return (
    <AccountShell email={account.email} initial={buildAccountInitial(account.name, account.email)} name={account.name}>
      <header className="account-page-heading">
        <div>
          <p className="account-kicker">Recharge</p>
          <h1>充值中心</h1>
          <p className="account-muted">支付链路尚未开放，当前页面用于展示商业化结构。</p>
        </div>
        <AccountStatusPill>暂未开放</AccountStatusPill>
      </header>

      <AccountSection title="积分套餐">
        <div className="account-product-grid">
          {plans.map((plan) => (
            <div className="account-stat" key={plan.credits}>
              <h2>{plan.credits} 积分</h2>
              <p className="account-muted">{plan.detail}</p>
              <strong>{plan.price}</strong>
            </div>
          ))}
        </div>
      </AccountSection>

      <button className="account-button" disabled type="button">
        支付能力暂未开放
      </button>
    </AccountShell>
  );
}
