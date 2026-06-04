import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";
import { AccountSection, AccountStatusPill } from "@/components/account/AccountUi";
import { aiCredentialSources, getPhaseTwoCredentialSources } from "@/lib/account/account-ai-config";
import { getAccountDashboard } from "@/lib/account/account-data";
import { buildAccountInitial } from "@/lib/account/account-view-model";
import { requireUser } from "@/lib/auth/session";

export default async function AccountAiLlmConfigPage() {
  const sessionUser = await requireUser();
  const account = await getAccountDashboard(sessionUser.email);

  if (!account) {
    redirect("/login?returnUrl=/account/ai/llm-config");
  }

  const phaseTwoSources = getPhaseTwoCredentialSources();

  return (
    <AccountShell email={account.email} initial={buildAccountInitial(account.name, account.email)} name={account.name}>
      <header className="account-page-heading">
        <div>
          <p className="account-kicker">LLM Config</p>
          <h1>LLM 配置</h1>
          <p className="account-muted">这里管理模型来源和偏好；真实调用、扣费、日志和 provider 协议由 AI Gateway 承接。</p>
        </div>
      </header>

      <AccountSection title="第二阶段优先模型来源">
        <div className="account-list">
          {phaseTwoSources.map((source) => (
            <div className="account-list-row" key={source.id}>
              <div>
                <strong>{source.label}</strong>
                <p className="account-muted">{source.description}</p>
              </div>
              <AccountStatusPill tone="accent">第二阶段</AccountStatusPill>
            </div>
          ))}
        </div>
      </AccountSection>

      <AccountSection title="完整模型来源蓝图">
        <div className="account-list">
          {aiCredentialSources.map((source) => (
            <div className="account-list-row" key={source.id}>
              <div>
                <strong>{source.label}</strong>
                <p className="account-muted">{source.description}</p>
              </div>
              <AccountStatusPill tone={source.storesProviderKey ? "warning" : "success"}>
                {source.storesProviderKey ? "需要密钥治理" : "不保存明文 Key"}
              </AccountStatusPill>
            </div>
          ))}
        </div>
      </AccountSection>
    </AccountShell>
  );
}
