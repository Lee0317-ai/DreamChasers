import { type AiCapability, isAiCapability } from "./capabilities";
import { type AiGatewayCredentialSource, isAiGatewayCredentialSource } from "./credential-source";
import { getModelForCapability } from "./model-catalog";
import { getOpenAiCompatibleProviderConfig } from "./openai-compatible-config";
import { getProviderReadiness } from "./provider-readiness";
import { mockAiProvider } from "./providers/mock-provider";
import { createOpenAiCompatibleProvider } from "./providers/openai-compatible-provider";
import type { AiGatewayProviderResponse } from "./provider-adapter";

export class AiGatewayError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly status: number
  ) {
    super(message);
  }
}

export type AiGatewayTaskInput = {
  capability: AiCapability;
  credentialSource: AiGatewayCredentialSource;
  input: Record<string, unknown>;
  modelId: string;
  productSlug: string;
  toolSlug?: string;
  userId: string;
};

type AiGatewayTaskDependencies = {
  chargeCredits: (input: { amount: number; note: string; scope: string; userId: string }) => Promise<void>;
  createRequestLog: (input: {
    capability: AiCapability;
    creditCost: number;
    credentialSource: AiGatewayCredentialSource;
    errorCode?: string;
    input: Record<string, unknown>;
    modelId: string;
    outputSummary?: string;
    productSlug: string;
    providerId: string;
    status: "failed" | "succeeded";
    toolSlug?: string;
    userId: string | null;
  }) => Promise<{ id: string }>;
  executeProvider: (input: Parameters<typeof mockAiProvider.execute>[0]) => Promise<AiGatewayProviderResponse>;
  refundCredits: (input: { amount: number; note: string; scope: string; userId: string }) => Promise<void>;
};

const supportedGatewayImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function getDefaultProviderExecutor() {
  return async (input: Parameters<typeof mockAiProvider.execute>[0]) => {
    if (input.model.providerId === "mock") {
      return mockAiProvider.execute(input);
    }

    const config = getOpenAiCompatibleProviderConfig();

    if (!config) {
      throw new AiGatewayError("缺少 `AI_GATEWAY_OPENAI_COMPATIBLE_API_KEY`，暂时不能发真实调用。", "provider_misconfigured", 503);
    }

    const provider = createOpenAiCompatibleProvider(config);

    return provider.execute(input);
  };
}

async function defaultChargeCredits(input: { amount: number; note: string; scope: string; userId: string }) {
  const { chargePlatformCreditsForUser } = await import("../account/account-data");
  return chargePlatformCreditsForUser(input);
}

async function defaultRefundCredits(input: { amount: number; note: string; scope: string; userId: string }) {
  const { refundPlatformCreditsForUser } = await import("../account/account-data");
  return refundPlatformCreditsForUser(input);
}

async function defaultCreateRequestLog(input: Parameters<NonNullable<AiGatewayTaskDependencies["createRequestLog"]>>[0]) {
  const { createAiGatewayRequestLog } = await import("./ai-request-log");
  return createAiGatewayRequestLog(input);
}

function validateAiGatewayInput(capability: AiCapability, input: Record<string, unknown>) {
  if (capability === "image_edit") {
    if (typeof input.imageBase64 !== "string" || !input.imageBase64.trim()) {
      throw new AiGatewayError("图片编辑任务缺少图片内容。", "input_invalid", 400);
    }

    if (typeof input.contentType !== "string" || !supportedGatewayImageTypes.has(input.contentType)) {
      throw new AiGatewayError("图片编辑任务的图片格式不受支持。", "input_invalid", 400);
    }

    if (typeof input.prompt !== "string" || !input.prompt.trim()) {
      throw new AiGatewayError("图片编辑任务缺少编辑提示词。", "input_invalid", 400);
    }

    return;
  }

  if (capability === "image_generation") {
    if (typeof input.prompt !== "string" || !input.prompt.trim()) {
      throw new AiGatewayError("图像生成任务缺少提示词。", "input_invalid", 400);
    }

    return;
  }

  if (capability === "image_understanding") {
    const hasUrl = typeof input.url === "string" && !!input.url.trim();
    const hasImageBase64 = typeof input.imageBase64 === "string" && !!input.imageBase64.trim();

    if (!hasUrl && !hasImageBase64) {
      throw new AiGatewayError("视觉理解任务至少需要图片链接或图片内容。", "input_invalid", 400);
    }
  }
}

export async function runAiGatewayTask(
  input: AiGatewayTaskInput,
  dependencies: Partial<AiGatewayTaskDependencies> = {}
) {
  if (!isAiCapability(input.capability)) {
    throw new AiGatewayError("未知 AI 能力。", "capability_not_supported", 400);
  }

  if (!isAiGatewayCredentialSource(input.credentialSource)) {
    throw new AiGatewayError("凭据来源不合法。", "credential_source_invalid", 400);
  }

  const model = getModelForCapability(input.capability, input.modelId);

  if (!model) {
    throw new AiGatewayError("所选模型不支持当前能力。", "model_not_allowed", 400);
  }

  if (!model.credentialSources.includes(input.credentialSource)) {
    throw new AiGatewayError("当前模型不支持所选凭据来源。", "credential_source_not_supported", 400);
  }

  validateAiGatewayInput(input.capability, input.input);

  const providerReadiness = getProviderReadiness(model.providerId);

  if (providerReadiness.status === "disabled") {
    throw new AiGatewayError(providerReadiness.reason, "provider_unavailable", 503);
  }

  if (providerReadiness.status === "misconfigured") {
    throw new AiGatewayError(providerReadiness.reason, "provider_misconfigured", 503);
  }

  const chargeCredits = dependencies.chargeCredits ?? defaultChargeCredits;
  const createRequestLog = dependencies.createRequestLog ?? defaultCreateRequestLog;
  const executeProvider = dependencies.executeProvider ?? getDefaultProviderExecutor();
  const refundCredits = dependencies.refundCredits ?? defaultRefundCredits;

  try {
    await chargeCredits({
      amount: model.creditCost,
      note: `AI Gateway ${input.capability} via ${model.modelId}`,
      scope: "platform",
      userId: input.userId
    });
  } catch (error) {
    if (error instanceof Error && error.message === "平台积分不足。") {
      throw new AiGatewayError("平台积分不足。", "insufficient_credits", 402);
    }

    throw error;
  }

  try {
    const providerResponse = await executeProvider({
      capability: input.capability,
      credentialSource: input.credentialSource,
      input: input.input,
      model,
      productSlug: input.productSlug,
      toolSlug: input.toolSlug,
      userId: input.userId
    });

    const requestLog = await createRequestLog({
      capability: input.capability,
      creditCost: model.creditCost,
      credentialSource: input.credentialSource,
      input: input.input,
      modelId: model.modelId,
      outputSummary: providerResponse.outputSummary,
      productSlug: input.productSlug,
      providerId: model.providerId,
      status: "succeeded",
      toolSlug: input.toolSlug,
      userId: input.userId
    });

    return {
      creditCost: model.creditCost,
      result: providerResponse.result,
      status: "succeeded" as const,
      taskId: requestLog.id
    };
  } catch (error) {
    await refundCredits({
      amount: model.creditCost,
      note: `AI Gateway refund ${input.capability} via ${model.modelId}`,
      scope: "platform",
      userId: input.userId
    });

    await createRequestLog({
      capability: input.capability,
      creditCost: model.creditCost,
      credentialSource: input.credentialSource,
      errorCode: error instanceof AiGatewayError ? error.code : "execution_failed",
      input: input.input,
      modelId: model.modelId,
      outputSummary: error instanceof Error ? error.message : "AI Gateway execution failed.",
      productSlug: input.productSlug,
      providerId: model.providerId,
      status: "failed",
      toolSlug: input.toolSlug,
      userId: input.userId
    });

    throw error;
  }
}
