import { type AiCapability, listAiCapabilities } from "./capabilities";
import { type AiGatewayCredentialSource } from "./credential-source";

export type AiModelCatalogEntry = {
  capabilities: AiCapability[];
  creditCost: number;
  credentialSources: AiGatewayCredentialSource[];
  displayName: string;
  modelId: string;
  providerId: "mock" | "openai_compatible";
  qualityTier: "standard" | "high";
  recommended: boolean;
  speedTier: "fast" | "balanced";
};

const aiModelCatalog: AiModelCatalogEntry[] = [
  {
    capabilities: ["structured_extraction", "text_generation", "ocr"],
    creditCost: 1,
    credentialSources: ["platform_pool", "user_ephemeral_key"],
    displayName: "快速结构化识别",
    modelId: "mock-structured-fast",
    providerId: "mock",
    qualityTier: "standard",
    recommended: true,
    speedTier: "fast"
  },
  {
    capabilities: ["image_understanding", "ocr"],
    creditCost: 2,
    credentialSources: ["platform_pool", "user_ephemeral_key"],
    displayName: "视觉理解标准版",
    modelId: "mock-vision-balanced",
    providerId: "mock",
    qualityTier: "standard",
    recommended: true,
    speedTier: "balanced"
  },
  {
    capabilities: ["image_edit", "image_generation"],
    creditCost: 3,
    credentialSources: ["platform_pool", "user_ephemeral_key"],
    displayName: "图像编辑试运行",
    modelId: "mock-image-edit",
    providerId: "mock",
    qualityTier: "standard",
    recommended: true,
    speedTier: "balanced"
  },
  {
    capabilities: ["image_edit"],
    creditCost: 3,
    credentialSources: ["platform_pool", "user_ephemeral_key"],
    displayName: "OpenAI-Compatible 图像编辑",
    modelId: "openai-compatible-image-edit",
    providerId: "openai_compatible",
    qualityTier: "high",
    recommended: false,
    speedTier: "balanced"
  },
  {
    capabilities: ["text_generation", "structured_extraction"],
    creditCost: 4,
    credentialSources: ["external_gateway_byok", "user_ephemeral_key"],
    displayName: "OpenAI-Compatible 通用模型",
    modelId: "openai-compatible-general",
    providerId: "openai_compatible",
    qualityTier: "high",
    recommended: false,
    speedTier: "balanced"
  }
];

export function getModelsForCapability(capability: AiCapability) {
  return aiModelCatalog.filter((model) => model.capabilities.includes(capability));
}

export function getModelForCapability(capability: AiCapability, modelId: string) {
  return getModelsForCapability(capability).find((model) => model.modelId === modelId) ?? null;
}

export function listAiCapabilitiesWithModels() {
  return listAiCapabilities().filter((capability) => getModelsForCapability(capability).length > 0);
}

export { listAiCapabilities };
