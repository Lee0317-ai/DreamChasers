import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { runAiGatewayTask } from "@/lib/ai/ai-gateway";
import { assertSupportedPhotoEditInput } from "@/lib/tools/photo/ai-image-provider";
import { createPhotoEditTask } from "@/lib/tools/photo/photo-edit-task-store";

export const runtime = "nodejs";

const localPromptEditUserId = "photo-editor-prompt-edit-preview";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image");
    const prompt = formData.get("prompt");

    if (!(image instanceof File) || typeof prompt !== "string") {
      return NextResponse.json({ error: "请上传图片并填写 AI 修图指令。" }, { status: 400 });
    }

    assertSupportedPhotoEditInput({ image, mode: "prompt_edit", prompt });

    const task = createPhotoEditTask(image, {
      mode: "prompt_edit",
      prompt,
      runAiGatewayTask: (input) =>
        runAiGatewayTask(input, {
          chargeCredits: async () => {},
          createRequestLog: async () => ({ id: randomUUID() }),
          refundCredits: async () => {}
        }),
      userId: localPromptEditUserId
    });

    return NextResponse.json(task, {
      headers: {
        "Cache-Control": "no-store"
      },
      status: 202
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "AI 对话修图任务创建失败，请稍后再试。" },
      { status: 500 }
    );
  }
}
