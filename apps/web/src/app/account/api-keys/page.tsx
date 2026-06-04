import { redirect } from "next/navigation";
import { ApiKeyManager } from "@/components/account/ApiKeyManager";
import { getAccountDashboard } from "@/lib/account/account-data";
import { requireUser } from "@/lib/auth/session";

export default async function AccountApiKeysPage() {
  const sessionUser = await requireUser();
  const account = await getAccountDashboard(sessionUser.email);

  if (!account) {
    redirect("/login?returnUrl=/account/api-keys");
  }

  return (
    <main className="account-page">
      <section className="account-hero compact">
        <p className="account-eyebrow">Developer</p>
        <h1>API Key</h1>
        <p>用于后续产品和自动化脚本调用 DreamChasers 平台接口。明文只展示一次。</p>
      </section>
      <ApiKeyManager initialApiKeys={account.apiKeys} />
    </main>
  );
}
