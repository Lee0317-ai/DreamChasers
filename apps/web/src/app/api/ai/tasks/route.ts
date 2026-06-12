import { NextResponse } from "next/server";
import { AiGatewayError, runAiGatewayTask } from "@/lib/ai/ai-gateway";
import { isAiCapability } from "@/lib/ai/capabilities";
import { isAiGatewayCredentialSource } from "@/lib/ai/credential-source";
import { buildAiGatewayErrorPayload } from "@/lib/ai/route-error";
import { getCurrentUser } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user?.id) {
    return NextResponse.json({ error: "请先登录。" }, { status: 401 });
  }

  const payload = (await request.json()) as {
    capability?: string;
    credentialSource?: string;
    input?: Record<string, unknown>;
    modelId?: string;
    productSlug?: string;
    toolSlug?: string;
  };

  if (
    typeof payload.capability !== "string" ||
    typeof payload.credentialSource !== "string" ||
    typeof payload.modelId !== "string" ||
    typeof payload.productSlug !== "string" ||
    !payload.input ||
    typeof payload.input !== "object"
  ) {
    return NextResponse.json({ error: "AI 任务参数不完整。" }, { status: 400 });
  }

  if (!isAiCapability(payload.capability)) {
    return NextResponse.json({ error: "未知 AI 能力。" }, { status: 400 });
  }

  if (!isAiGatewayCredentialSource(payload.credentialSource)) {
    return NextResponse.json({ error: "凭据来源不合法。" }, { status: 400 });
  }

  try {
    const result = await runAiGatewayTask({
      capability: payload.capability,
      credentialSource: payload.credentialSource,
      input: payload.input,
      modelId: payload.modelId,
      productSlug: payload.productSlug,
      toolSlug: typeof payload.toolSlug === "string" ? payload.toolSlug : undefined,
      userId: user.id
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const response = buildAiGatewayErrorPayload(error, "AI Gateway 执行失败。");
    return NextResponse.json(response.body, { status: response.status });
  }
}
