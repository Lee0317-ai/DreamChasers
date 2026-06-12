import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";
import { AccountEmptyState, AccountSection, AccountStatusPill } from "@/components/account/AccountUi";
import { getAccountDashboard } from "@/lib/account/account-data";
import { getPhaseTwoCredentialSources, aiCredentialSources } from "@/lib/account/account-ai-config";
import {
  buildAccountAiCapabilityCards,
  buildAccountAiRuntimeProviderCards,
  getAccountAiRequestFailureReason,
  getAccountAiRequestFilterLabel,
  summarizeAccountAiGatewayStatus,
  type AccountAiRequestFilter
} from "@/lib/ai/account-ai-overview";
import { buildAccountInitial, formatAccountDate } from "@/lib/account/account-view-model";
import { requireUser } from "@/lib/auth/session";

type AccountAiCreditsPageProps = {
  searchParams?: Promise<{
    status?: string;
  }>;
};

export default async function AccountAiCreditsPage({ searchParams }: AccountAiCreditsPageProps) {
  const sessionUser = await requireUser();
  const account = await getAccountDashboard(sessionUser.email);
  const params = await searchParams;

  if (!account) {
    redirect("/login?returnUrl=/account/ai/credits");
  }

  const selectedFilter = (params?.status === "failed" || params?.status === "succeeded"
    ? params.status
    : "all") as AccountAiRequestFilter;
  const capabilityCards = buildAccountAiCapabilityCards();
  const runtimeProviders = buildAccountAiRuntimeProviderCards();
  const filteredLogs =
    selectedFilter === "all"
      ? account.aiGatewayRequestLogs
      : account.aiGatewayRequestLogs.filter((log) => log.status === selectedFilter);
  const gatewayStatus = summarizeAccountAiGatewayStatus({
    availableBalance: account.creditBalance,
    recentRequestCount: account.aiGatewayRequestLogs.length
  });
  const phaseTwoSources = getPhaseTwoCredentialSources();
  const futureSources = aiCredentialSources.filter((source) => source.phase === 3);

  return (
    <AccountShell email={account.email} initial={buildAccountInitial(account.name, account.email)} name={account.name}>
      <header className="account-page-heading">
        <div>
          <p className="account-kicker">AI Gateway</p>
          <h1>积分管理</h1>
          <p className="account-muted">统一查看平台积分、当前可用模型能力、凭据模式和最近 AI 请求记录。</p>
        </div>
      </header>

      <div className="account-stats-grid">
        <div className="account-stat">
          <p className="account-muted">Platform Credits</p>
          <h2>{account.creditBalance} 积分</h2>
          <p className="account-muted">当前从平台权益账本读取余额。</p>
        </div>
        <div className="account-stat">
          <p className="account-muted">Active Capabilities</p>
          <h2>{gatewayStatus.activeCapabilityCount}</h2>
          <p className="account-muted">当前模型目录里已有可用模型的能力数。</p>
        </div>
        <div className="account-stat">
          <p className="account-muted">Ready Providers</p>
          <h2>
            {gatewayStatus.readyProviderCount} / {gatewayStatus.runtimeProviderCount}
          </h2>
          <p className="account-muted">当前已配置就绪的 provider 数量。</p>
        </div>
      </div>

      <AccountSection eyebrow="Catalog" title="当前可用模型能力">
        <div className="account-stats-grid account-capability-grid">
          {capabilityCards.map((card) => (
            <div className="account-stat account-capability-card" key={card.capability}>
              <div className="account-list-row">
                <strong>{card.label}</strong>
                <AccountStatusPill tone="success">{card.models.length} 个模型</AccountStatusPill>
              </div>
              <div className="account-list">
                {card.models.map((model) => (
                  <div className="account-list-row" key={`${card.capability}-${model.modelId}`}>
                    <div>
                      <strong>{model.displayName}</strong>
                      <span>
                        {model.modelId} · {model.providerId} · {model.creditCost} 积分/次
                      </span>
                    </div>
                    <AccountStatusPill tone={model.recommended ? "accent" : "neutral"}>
                      {model.recommended ? "推荐" : "可选"}
                    </AccountStatusPill>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </AccountSection>

      <AccountSection eyebrow="Credential Modes" title="模型来源策略">
        <div className="account-list">
          {phaseTwoSources.map((source) => (
            <div className="account-list-row" key={source.id}>
              <div>
                <strong>{source.label}</strong>
                <span>{source.description}</span>
              </div>
              <AccountStatusPill tone="success">第二阶段可用</AccountStatusPill>
            </div>
          ))}
          {futureSources.map((source) => (
            <div className="account-list-row" key={source.id}>
              <div>
                <strong>{source.label}</strong>
                <span>{source.description}</span>
              </div>
              <AccountStatusPill tone="warning">后续阶段</AccountStatusPill>
            </div>
          ))}
        </div>
      </AccountSection>

      <AccountSection eyebrow="Runtime" title="运行时状态">
        <div className="account-list">
          {runtimeProviders.map((provider) => (
            <div className="account-list-row" key={provider.providerId}>
              <div>
                <strong>{provider.label}</strong>
                <span>
                  {provider.modelCount} 个模型 · {provider.capabilities.join(" / ")}
                </span>
                <span>{provider.reason}</span>
              </div>
              <AccountStatusPill
                tone={
                  provider.status === "enabled"
                    ? "success"
                    : provider.status === "dry_run_only"
                      ? "warning"
                      : "danger"
                }
              >
                {provider.status === "enabled"
                  ? "已就绪"
                  : provider.status === "dry_run_only"
                    ? "仅 Dry Run"
                    : "配置不完整"}
              </AccountStatusPill>
            </div>
          ))}
        </div>
      </AccountSection>

      <AccountSection
        eyebrow="Recent Requests"
        title="最近 AI Gateway 请求"
        actions={
          <div className="account-card-actions">
            {(["all", "succeeded", "failed"] as const).map((filter) => (
              <a
                className="account-secondary-link"
                href={filter === "all" ? "/account/ai/credits" : `/account/ai/credits?status=${filter}`}
                key={filter}
              >
                {getAccountAiRequestFilterLabel(filter)}
              </a>
            ))}
          </div>
        }
      >
        <div className="account-list">
          {filteredLogs.length === 0 ? <AccountEmptyState>当前筛选条件下还没有 AI Gateway 调用记录。</AccountEmptyState> : null}
          {filteredLogs.map((log) => (
            <div className="account-list-row" key={log.id}>
              <div>
                <strong>
                  {log.capability} · {log.modelId}
                </strong>
                <span>
                  {log.productSlug}
                  {log.toolSlug ? ` / ${log.toolSlug}` : ""} · {log.providerId} · {log.creditCost} 积分
                  {log.outputSummary ? ` · ${log.outputSummary}` : ""}
                </span>
                {log.status === "failed" ? <span>失败原因：{getAccountAiRequestFailureReason(log.errorCode)}</span> : null}
              </div>
              <div>
                <AccountStatusPill tone={log.status === "succeeded" ? "success" : "danger"}>
                  {log.status === "succeeded" ? "成功" : "失败"}
                </AccountStatusPill>
                <span>{formatAccountDate(log.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </AccountSection>

      <AccountSection eyebrow="Ledger" title="最近积分账本">
        <div className="account-list">
          {account.platformLedger.length === 0 ? <AccountEmptyState>平台积分账本还没有记录。</AccountEmptyState> : null}
          {account.platformLedger.map((entry) => (
            <div className="account-list-row" key={entry.id}>
              <div>
                <strong>{entry.amount > 0 ? `+${entry.amount}` : entry.amount} 积分</strong>
                <span>{entry.note || "平台账本记录"}</span>
              </div>
              <div>
                <AccountStatusPill tone={entry.amount >= 0 ? "success" : "warning"}>{entry.type}</AccountStatusPill>
                <span>{formatAccountDate(entry.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </AccountSection>
    </AccountShell>
  );
}
