import { NextResponse } from "next/server";
import { isAiCapability } from "@/lib/ai/capabilities";
import { getModelsForCapability } from "@/lib/ai/model-catalog";

export async function GET(_request: Request, context: { params: Promise<{ capability: string }> }) {
  const { capability } = await context.params;

  if (!isAiCapability(capability)) {
    return NextResponse.json({ error: "未知 AI 能力。" }, { status: 404 });
  }

  return NextResponse.json({
    capability,
    models: getModelsForCapability(capability).map((model) => ({
      credentialSources: model.credentialSources,
      creditCost: model.creditCost,
      displayName: model.displayName,
      modelId: model.modelId,
      providerId: model.providerId,
      qualityTier: model.qualityTier,
      recommended: model.recommended,
      speedTier: model.speedTier
    }))
  });
}
