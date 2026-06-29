import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { runAiGatewayTask } from "@/lib/ai/ai-gateway";
import { assertSupportedSceneBlendInput } from "@/lib/tools/photo/ai-image-provider";
import { createSceneBlendTask } from "@/lib/tools/photo/scene-blend-task-store";

export const runtime = "nodejs";

const localSceneBlendUserId = "photo-editor-scene-blend-preview";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const productImage = formData.get("productImage");
    const backgroundImage = formData.get("backgroundImage");
    const prompt = formData.get("prompt");

    if (!(productImage instanceof File) || !(backgroundImage instanceof File) || typeof prompt !== "string") {
      return NextResponse.json({ error: "请上传产品图、背景图并填写场景描述。" }, { status: 400 });
    }

    assertSupportedSceneBlendInput({ backgroundImage, productImage, prompt });

    const task = createSceneBlendTask(productImage, backgroundImage, prompt, {
      runAiGatewayTask: (input) =>
        runAiGatewayTask(input, {
          chargeCredits: async () => {},
          createRequestLog: async () => ({ id: randomUUID() }),
          refundCredits: async () => {}
        }),
      userId: localSceneBlendUserId
    });

    return NextResponse.json(task, {
      headers: {
        "Cache-Control": "no-store"
      },
      status: 202
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "AI 溶图任务创建失败，请稍后再试。" },
      { status: 500 }
    );
  }
}
