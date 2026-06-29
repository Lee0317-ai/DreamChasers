import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { runAiGatewayTask } from "@/lib/ai/ai-gateway";
import { assertSupportedBrandWatermarkInput } from "@/lib/tools/photo/ai-image-provider";
import { createBrandWatermarkTask } from "@/lib/tools/photo/brand-watermark-task-store";

export const runtime = "nodejs";

const localBrandWatermarkUserId = "photo-editor-brand-watermark-preview";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image");
    const logo = formData.get("logo");
    const logoSize = Number(formData.get("logoSize") || 18);

    if (!(image instanceof File)) {
      return NextResponse.json({ error: "请上传原图。" }, { status: 400 });
    }

    if (!(logo instanceof File)) {
      return NextResponse.json({ error: "请上传 Logo 图片。" }, { status: 400 });
    }

    assertSupportedBrandWatermarkInput({ image, logo, logoSize });

    const task = createBrandWatermarkTask(image, logo, {
      logoSize,
      runAiGatewayTask: (input) =>
        runAiGatewayTask(input, {
          chargeCredits: async () => {},
          createRequestLog: async () => ({ id: randomUUID() }),
          refundCredits: async () => {}
        }),
      userId: localBrandWatermarkUserId
    });

    return NextResponse.json(task, {
      headers: {
        "Cache-Control": "no-store"
      },
      status: 202
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "AI Logo 水印任务创建失败，请稍后再试。" },
      { status: 500 }
    );
  }
}
