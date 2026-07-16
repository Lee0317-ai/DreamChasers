type OpenAiCompatibleProviderRuntimeEnv = {
  AI_GATEWAY_OPENAI_COMPATIBLE_API_KEY?: string;
  AI_GATEWAY_OPENAI_COMPATIBLE_BASE_URL?: string;
  AI_GATEWAY_OPENAI_COMPATIBLE_ENABLED?: string;
  AI_GATEWAY_OPENAI_COMPATIBLE_IMAGE_MODEL?: string;
  AI_IMAGE_ACTIVE_PROVIDER?: string;
  [key: string]: string | undefined;
};

export type OpenAiCompatibleProviderConfig = {
  apiKey: string;
  baseUrl: string;
  imageModelId?: string;
};

const fallbackBaseUrl = "http://localhost:9999/v1";

function toProviderEnvPrefix(providerId: string) {
  return providerId
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toUpperCase();
}

function getRuntimeEnv(runtimeEnv?: OpenAiCompatibleProviderRuntimeEnv): OpenAiCompatibleProviderRuntimeEnv {
  if (runtimeEnv) {
    return runtimeEnv;
  }

  return process.env as OpenAiCompatibleProviderRuntimeEnv;
}

export function getOpenAiCompatibleProviderConfig(
  runtimeEnv?: OpenAiCompatibleProviderRuntimeEnv
): OpenAiCompatibleProviderConfig | null {
  const env = getRuntimeEnv(runtimeEnv);
  const gatewayApiKey = env.AI_GATEWAY_OPENAI_COMPATIBLE_API_KEY?.trim();

  if (gatewayApiKey) {
    return {
      apiKey: gatewayApiKey,
      baseUrl: env.AI_GATEWAY_OPENAI_COMPATIBLE_BASE_URL?.trim() || fallbackBaseUrl,
      imageModelId: env.AI_GATEWAY_OPENAI_COMPATIBLE_IMAGE_MODEL?.trim() || undefined
    };
  }

  const activeProvider = env.AI_IMAGE_ACTIVE_PROVIDER?.trim();

  if (!activeProvider) {
    return null;
  }

  const prefix = toProviderEnvPrefix(activeProvider);
  const protocol = env[`AI_IMAGE_PROVIDER_${prefix}_PROTOCOL`]?.trim();
  const apiKey = env[`AI_IMAGE_PROVIDER_${prefix}_API_KEY`]?.trim();
  const baseUrl = env[`AI_IMAGE_PROVIDER_${prefix}_BASE_URL`]?.trim();
  const imageModelId = env[`AI_IMAGE_PROVIDER_${prefix}_MODEL`]?.trim();

  if (protocol !== "openai-compatible" || !apiKey || !baseUrl) {
    return null;
  }

  return {
    apiKey,
    baseUrl,
    imageModelId: imageModelId || undefined
  };
}
