import { getModelsForCapability, listAiCapabilitiesWithModels, type AiModelCatalogEntry } from "./model-catalog";
import { getAiGatewayErrorDisplay } from "./error-display";
import { getProviderReadiness } from "./provider-readiness";

const capabilityLabels = {
  image_edit: "图像编辑",
  image_generation: "图像生成",
  image_understanding: "视觉理解",
  moderation: "内容审核",
  ocr: "OCR",
  structured_extraction: "结构化抽取",
  text_generation: "文本生成"
} satisfies Record<(typeof import("./capabilities").aiCapabilities)[number], string>;

const providerLabels = {
  mock: "Mock Provider",
  openai_compatible: "OpenAI-Compatible"
} as const;

export type AccountAiCapabilityCard = {
  capability: ReturnType<typeof listAiCapabilitiesWithModels>[number];
  label: string;
  models: AiModelCatalogEntry[];
};

export type AccountAiRuntimeProviderCard = {
  capabilities: string[];
  label: string;
  modelCount: number;
  providerId: AiModelCatalogEntry["providerId"];
  reason: string;
  status: "dry_run_only" | "enabled" | "misconfigured";
};

export type AccountAiRequestFilter = "all" | "failed" | "succeeded";
type AccountAiRuntimeEnv = Parameters<typeof getProviderReadiness>[1];

export function buildAccountAiCapabilityCards(): AccountAiCapabilityCard[] {
  return listAiCapabilitiesWithModels().map((capability) => ({
    capability,
    label: capabilityLabels[capability] ?? capability,
    models: getModelsForCapability(capability)
  }));
}

export function buildAccountAiRuntimeProviderCards(runtimeEnv?: AccountAiRuntimeEnv) {
  const providerMap = new Map<AiModelCatalogEntry["providerId"], AiModelCatalogEntry[]>();

  buildAccountAiCapabilityCards().forEach((card) => {
    card.models.forEach((model) => {
      const existing = providerMap.get(model.providerId) ?? [];
      providerMap.set(model.providerId, [...existing, model]);
    });
  });

  return Array.from(providerMap.entries()).map(([providerId, models]) => {
    const readiness = getProviderReadiness(providerId, runtimeEnv);
    return {
      capabilities: Array.from(new Set(models.flatMap((model) => model.capabilities))).map((capability) => capabilityLabels[capability]),
      label: providerLabels[providerId],
      modelCount: models.length,
      providerId,
      reason: readiness.reason,
      status: readiness.status
    };
  });
}

export function getAccountAiRequestFilterLabel(filter: AccountAiRequestFilter) {
  return (
    {
      all: "全部",
      failed: "失败",
      succeeded: "成功"
    } satisfies Record<AccountAiRequestFilter, string>
  )[filter];
}

export function getAccountAiRequestFailureReason(errorCode: string | null | undefined) {
  return getAiGatewayErrorDisplay(errorCode).label;
}

export function summarizeAccountAiGatewayStatus(input: {
  availableBalance: number;
  recentRequestCount: number;
}) {
  const runtimeProviders = buildAccountAiRuntimeProviderCards();

  return {
    activeCapabilityCount: buildAccountAiCapabilityCards().length,
    availableBalance: input.availableBalance,
    readyProviderCount: runtimeProviders.filter((provider) => provider.status === "enabled").length,
    recentRequestCount: input.recentRequestCount,
    runtimeProviderCount: runtimeProviders.length
  };
}
