import type { AiModelCatalogEntry } from "./model-catalog";
import { getOpenAiCompatibleProviderConfig } from "./openai-compatible-config";

export type AiProviderRuntimeStatus = "disabled" | "dry_run_only" | "enabled" | "misconfigured";

export type AiProviderReadiness = {
  providerId: AiModelCatalogEntry["providerId"];
  reason: string;
  status: AiProviderRuntimeStatus;
};

type AccountAiRuntimeEnv = {
  AI_GATEWAY_OPENAI_COMPATIBLE_API_KEY?: string;
  AI_GATEWAY_OPENAI_COMPATIBLE_BASE_URL?: string;
  AI_GATEWAY_OPENAI_COMPATIBLE_ENABLED?: string;
  AI_IMAGE_ACTIVE_PROVIDER?: string;
  AI_IMAGE_PROVIDER_PPTOKEN_API_KEY?: string;
  AI_IMAGE_PROVIDER_PPTOKEN_BASE_URL?: string;
  AI_IMAGE_PROVIDER_PPTOKEN_PROTOCOL?: string;
  [key: string]: string | undefined;
};

function getRuntimeEnv(runtimeEnv?: AccountAiRuntimeEnv): AccountAiRuntimeEnv {
  if (runtimeEnv) {
    return runtimeEnv;
  }

  return {
    AI_GATEWAY_OPENAI_COMPATIBLE_API_KEY: process.env.AI_GATEWAY_OPENAI_COMPATIBLE_API_KEY,
    AI_GATEWAY_OPENAI_COMPATIBLE_BASE_URL: process.env.AI_GATEWAY_OPENAI_COMPATIBLE_BASE_URL,
    AI_GATEWAY_OPENAI_COMPATIBLE_ENABLED: process.env.AI_GATEWAY_OPENAI_COMPATIBLE_ENABLED,
    AI_IMAGE_ACTIVE_PROVIDER: process.env.AI_IMAGE_ACTIVE_PROVIDER,
    AI_IMAGE_PROVIDER_PPTOKEN_API_KEY: process.env.AI_IMAGE_PROVIDER_PPTOKEN_API_KEY,
    AI_IMAGE_PROVIDER_PPTOKEN_BASE_URL: process.env.AI_IMAGE_PROVIDER_PPTOKEN_BASE_URL,
    AI_IMAGE_PROVIDER_PPTOKEN_PROTOCOL: process.env.AI_IMAGE_PROVIDER_PPTOKEN_PROTOCOL
  };
}

export function getProviderReadiness(
  providerId: AiModelCatalogEntry["providerId"],
  runtimeEnv?: AccountAiRuntimeEnv
): AiProviderReadiness {
  const env = getRuntimeEnv(runtimeEnv);

  if (providerId === "mock") {
    return {
      providerId,
      reason: "当前仅用于本地 dry run 和稳定测试，不发真实第三方请求。",
      status: "dry_run_only"
    };
  }

  if (env.AI_GATEWAY_OPENAI_COMPATIBLE_ENABLED === "0") {
    return {
      providerId,
      reason: "当前已被环境配置显式关闭。",
      status: "disabled"
    };
  }

  if (!getOpenAiCompatibleProviderConfig(env)) {
    return {
      providerId,
      reason: "缺少 `AI_GATEWAY_OPENAI_COMPATIBLE_API_KEY`，暂时不能发真实调用。",
      status: "misconfigured"
    };
  }

  return {
    providerId,
    reason: "环境变量已就绪，可作为真实 provider 候选入口。",
    status: "enabled"
  };
}
