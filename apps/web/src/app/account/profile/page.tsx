import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";
import { AccountSection } from "@/components/account/AccountUi";
import { getAccountDashboard } from "@/lib/account/account-data";
import { buildAccountInitial } from "@/lib/account/account-view-model";
import { requireUser } from "@/lib/auth/session";

export default async function AccountProfilePage() {
  const sessionUser = await requireUser();
  const account = await getAccountDashboard(sessionUser.email);

  if (!account) {
    redirect("/login?returnUrl=/account/profile");
  }

  const initial = buildAccountInitial(account.name, account.email);

  return (
    <AccountShell email={account.email} initial={initial} name={account.name}>
      <header className="account-page-heading">
        <div>
          <p className="account-kicker">Profile</p>
          <h1>个人信息</h1>
          <p className="account-muted">展示当前统一账号资料。更多资料编辑能力后续独立接入。</p>
        </div>
      </header>

      <AccountSection title="头像与昵称">
        <div className="account-list-row">
          <span className="account-avatar">{initial}</span>
          <div>
            <strong>{account.name}</strong>
            <p className="account-muted">当前登录账号资料。</p>
          </div>
        </div>
      </AccountSection>

      <AccountSection title="联系方式">
        <div className="account-list">
          <div className="account-list-row">
            <strong>邮箱</strong>
            <span>{account.email}</span>
          </div>
        </div>
      </AccountSection>
    </AccountShell>
  );
}
