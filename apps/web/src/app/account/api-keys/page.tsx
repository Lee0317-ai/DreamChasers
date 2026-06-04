import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";
import { ApiKeyManager } from "@/components/account/ApiKeyManager";
import { getAccountDashboard } from "@/lib/account/account-data";
import { buildAccountInitial } from "@/lib/account/account-view-model";
import { requireUser } from "@/lib/auth/session";

export default async function AccountApiKeysPage() {
  const sessionUser = await requireUser();
  const account = await getAccountDashboard(sessionUser.email);

  if (!account) {
    redirect("/login?returnUrl=/account/api-keys");
  }

  return (
    <AccountShell email={account.email} initial={buildAccountInitial(account.name, account.email)} name={account.name}>
      <header className="account-page-heading">
        <div>
          <p className="account-kicker">Developer</p>
          <h1>API Key</h1>
          <p className="account-muted">平台 API Key 用于调用 DreamChasers API，不等同于用户自带模型 API Key。</p>
        </div>
      </header>
      <ApiKeyManager initialApiKeys={account.apiKeys} />
    </AccountShell>
  );
}
