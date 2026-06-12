import { db } from "@/lib/db";
import type { AiCapability } from "./capabilities";
import type { AiGatewayCredentialSource } from "./credential-source";

export type AiGatewayRequestLogInput = {
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
};

function buildInputSummary(input: Record<string, unknown>) {
  const serialized = JSON.stringify(input);
  return serialized.length > 280 ? `${serialized.slice(0, 277)}...` : serialized;
}

export async function createAiGatewayRequestLog(input: AiGatewayRequestLogInput) {
  return db.aiGatewayRequestLog.create({
    data: {
      capability: input.capability,
      creditCost: input.creditCost,
      credentialSource: input.credentialSource,
      errorCode: input.errorCode,
      inputSummary: buildInputSummary(input.input),
      modelId: input.modelId,
      outputSummary: input.outputSummary,
      productSlug: input.productSlug,
      providerId: input.providerId,
      status: input.status,
      toolSlug: input.toolSlug,
      userId: input.userId
    }
  });
}
