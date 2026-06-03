import { NextResponse } from "next/server";
import {
  assertSupportedBeautyInput,
  naturalPortraitBeautyType
} from "@/lib/tools/photo/ai-image-provider";
import { createBeautyTask } from "@/lib/tools/photo/beauty-task-store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image");
    const beautyType = formData.get("beautyType");

    if (!(image instanceof File) || typeof beautyType !== "string") {
      return NextResponse.json(
        { error: "请上传图片并选择美颜类型。", supportedBeautyTypes: [naturalPortraitBeautyType] },
        { status: 400 }
      );
    }

    assertSupportedBeautyInput({ beautyType, image });

    const task = createBeautyTask(image);

    return NextResponse.json(task, {
      headers: {
        "Cache-Control": "no-store"
      },
      status: 202
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "AI 美颜生成失败，请稍后再试。" },
      { status: 500 }
    );
  }
}
