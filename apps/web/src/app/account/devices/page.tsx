import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";
import { AccountSection, AccountStatusPill } from "@/components/account/AccountUi";
import { getAccountDashboard } from "@/lib/account/account-data";
import { buildAccountInitial, formatAccountDate, toDeviceRows } from "@/lib/account/account-view-model";
import { requireUser } from "@/lib/auth/session";

export default async function AccountDevicesPage() {
  const sessionUser = await requireUser();
  const account = await getAccountDashboard(sessionUser.email);

  if (!account) {
    redirect("/login?returnUrl=/account/devices");
  }

  const deviceRows = toDeviceRows(account.auditLogs);

  return (
    <AccountShell email={account.email} initial={buildAccountInitial(account.name, account.email)} name={account.name}>
      <header className="account-page-heading">
        <div>
          <p className="account-kicker">Devices</p>
          <h1>登录设备</h1>
          <p className="account-muted">第一阶段根据安全审计记录展示近期会话，设备强制下线会在 session 管理 API 完成后开放。</p>
        </div>
      </header>

      <AccountSection title="当前设备">
        <div className="account-list-row">
          <div>
            <strong>当前网页登录</strong>
            <p className="account-muted">{account.email}</p>
          </div>
          <AccountStatusPill tone="success">当前会话</AccountStatusPill>
        </div>
      </AccountSection>

      <AccountSection title="近期记录">
        <div className="account-list">
          {deviceRows.length === 0 ? <p className="account-empty">暂无近期登录记录。</p> : null}
          {deviceRows.map((row) => (
            <div className="account-list-row" key={row.id}>
              <div>
                <strong>{row.name}</strong>
                <p className="account-muted">{row.location}</p>
              </div>
              <span>{formatAccountDate(row.time)}</span>
            </div>
          ))}
        </div>
      </AccountSection>
    </AccountShell>
  );
}
