import { redirect } from "next/navigation";
import { getAccountDashboard } from "@/lib/account/account-data";
import { requireUser } from "@/lib/auth/session";

export default async function AccountBillingPage() {
  const sessionUser = await requireUser();
  const account = await getAccountDashboard(sessionUser.email);

  if (!account) {
    redirect("/login?returnUrl=/account/billing");
  }

  return (
    <main className="account-page">
      <section className="account-hero compact">
        <p className="account-eyebrow">Entitlements</p>
        <h1>权益账本</h1>
        <p>第一版只记录额度和订阅状态，不接真实支付。</p>
      </section>
      <section className="account-panel">
        <p className="account-eyebrow">Platform Credits</p>
        <h2>{account.creditBalance}</h2>
        <p className="account-muted">后续 AI 修图、AI 面试助手和产品型工具会从这里读取权益状态。</p>
      </section>
    </main>
  );
}
