import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { runAiGatewayTask } from "@/lib/ai/ai-gateway";
import { assertSupportedPhotoEditInput } from "@/lib/tools/photo/ai-image-provider";
import { createPhotoEditTask } from "@/lib/tools/photo/photo-edit-task-store";

export const runtime = "nodejs";

const localEnhanceUserId = "photo-editor-enhance-preview";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json({ error: "请上传需要增强的图片。" }, { status: 400 });
    }

    assertSupportedPhotoEditInput({ image, mode: "enhance" });

    const task = createPhotoEditTask(image, {
      mode: "enhance",
      runAiGatewayTask: (input) =>
        runAiGatewayTask(input, {
          chargeCredits: async () => {},
          createRequestLog: async () => ({ id: randomUUID() }),
          refundCredits: async () => {}
        }),
      userId: localEnhanceUserId
    });

    return NextResponse.json(task, {
      headers: {
        "Cache-Control": "no-store"
      },
      status: 202
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "高清增强任务创建失败，请稍后再试。" },
      { status: 500 }
    );
  }
}
