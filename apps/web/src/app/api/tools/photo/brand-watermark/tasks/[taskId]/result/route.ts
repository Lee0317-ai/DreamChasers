import { NextResponse } from "next/server";
import { getBrandWatermarkTaskResult } from "@/lib/tools/photo/brand-watermark-task-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params;
  const result = getBrandWatermarkTaskResult(taskId);

  if (!result) {
    return NextResponse.json({ error: "AI Logo 水印结果不存在或尚未生成。" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(result.data), {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": result.contentType
    }
  });
}
