import type { AiCapability } from "./capabilities";
import type { AiGatewayCredentialSource } from "./credential-source";
import type { AiModelCatalogEntry } from "./model-catalog";

export type AiGatewayProviderRequest = {
  capability: AiCapability;
  credentialSource: AiGatewayCredentialSource;
  input: Record<string, unknown>;
  model: AiModelCatalogEntry;
  productSlug: string;
  toolSlug?: string;
  userId: string;
};

export type AiGatewayProviderResponse = {
  outputSummary: string;
  result: Record<string, unknown>;
};

export interface AiProviderAdapter {
  execute(request: AiGatewayProviderRequest): Promise<AiGatewayProviderResponse>;
}
